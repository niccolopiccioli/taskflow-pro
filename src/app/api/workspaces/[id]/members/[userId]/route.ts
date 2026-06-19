import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { MemberRole } from '@/lib/database.types';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const { role } = (await request.json()) as { role?: MemberRole };

    if (role !== 'admin' && role !== 'member') {
      return NextResponse.json({ error: 'Ruolo non valido' }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    const { error } = await supabase.rpc('update_workspace_member_role', {
      p_workspace_id: params.id,
      p_user_id: params.userId,
      p_role: role,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error('Update member role error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore aggiornamento ruolo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    const { error } = await supabase.rpc('remove_workspace_member', {
      p_workspace_id: params.id,
      p_user_id: params.userId,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Remove member error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore rimozione membro' },
      { status: 500 }
    );
  }
}
