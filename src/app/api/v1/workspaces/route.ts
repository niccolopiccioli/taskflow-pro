import { NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

function hashKey(key: string) {
  return createHash('sha256').update(key).digest('hex');
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'API key mancante' }, { status: 401 });
    }

    const apiKey = authHeader.slice(7);
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: keyRows, error: keyError } = await supabase.rpc('validate_api_key', {
      p_key_hash: hashKey(apiKey),
    });

    if (keyError || !keyRows?.length) {
      return NextResponse.json({ error: 'API key non valida' }, { status: 401 });
    }

    const { workspace_id } = keyRows[0] as { user_id: string; workspace_id: string | null };
    if (!workspace_id) {
      return NextResponse.json({ error: 'Workspace non associato' }, { status: 400 });
    }

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('id, name, description, created_at')
      .eq('id', workspace_id)
      .single();

    return NextResponse.json({ workspace });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore' },
      { status: 500 }
    );
  }
}
