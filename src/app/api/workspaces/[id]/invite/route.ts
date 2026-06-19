import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sendResendEmail, workspaceInviteEmailHtml } from '@/lib/email/resend';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const workspaceId = params.id;
    const { email } = (await request.json()) as { email?: string };

    if (!email?.trim()) {
      return NextResponse.json({ error: 'Email obbligatoria' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    if (profile?.plan === 'free') {
      return NextResponse.json(
        {
          error: 'Gli inviti email richiedono il piano Pro o Business. Passa a /pricing per fare upgrade.',
        },
        { status: 403 }
      );
    }

    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .select('name')
      .eq('id', workspaceId)
      .single();

    if (wsError || !workspace) {
      return NextResponse.json({ error: 'Workspace non trovato' }, { status: 404 });
    }

    const { data: inviterProfile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single();

    const inviterName = inviterProfile?.full_name || inviterProfile?.email || 'Un membro del team';

    let memberAdded = false;
    const { error: rpcError } = await supabase.rpc('invite_member_by_email', {
      p_workspace_id: workspaceId,
      p_email: normalizedEmail,
    });

    if (!rpcError) {
      memberAdded = true;
    } else if (rpcError.message.includes('già membro')) {
      return NextResponse.json(
        { error: 'Utente già membro del workspace.' },
        { status: 400 }
      );
    } else if (
      !rpcError.message.includes('non trovato') &&
      !rpcError.message.includes('registrarsi')
    ) {
      return NextResponse.json({ error: rpcError.message }, { status: 400 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const actionUrl = memberAdded
      ? `${appUrl}/dashboard`
      : `${appUrl}/register?email=${encodeURIComponent(normalizedEmail)}`;

    await sendResendEmail({
      to: normalizedEmail,
      subject: memberAdded
        ? `Sei stato aggiunto a ${workspace.name} su TaskFlow Pro`
        : `Invito al workspace ${workspace.name} su TaskFlow Pro`,
      html: workspaceInviteEmailHtml({
        workspaceName: workspace.name,
        inviterName,
        memberAdded,
        actionUrl,
      }),
    });

    return NextResponse.json({
      memberAdded,
      emailSent: true,
      message: memberAdded
        ? 'Membro aggiunto e email di notifica inviata.'
        : 'Invito inviato via email. L\'utente dovrà registrarsi per unirsi.',
    });
  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Errore durante l\'invio dell\'invito',
      },
      { status: 500 }
    );
  }
}
