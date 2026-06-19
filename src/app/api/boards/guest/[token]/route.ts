import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/lib/database.types';

export async function GET(
  _request: Request,
  { params }: { params: { token: string } }
) {
  try {
    const supabase = createClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: link, error: linkError } = await supabase
      .from('board_guest_links')
      .select('board_id, expires_at')
      .eq('token', params.token)
      .single();

    if (linkError || !link) {
      return NextResponse.json({ error: 'Link non valido' }, { status: 404 });
    }

    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return NextResponse.json({ error: 'Link scaduto' }, { status: 410 });
    }

    const { data: board } = await supabase
      .from('boards')
      .select('*')
      .eq('id', link.board_id)
      .single();

    if (!board) {
      return NextResponse.json({ error: 'Board non trovata' }, { status: 404 });
    }

    const { data: columns } = await supabase
      .from('columns')
      .select('*')
      .eq('board_id', board.id)
      .order('position');

    const columnsWithTasks = await Promise.all(
      (columns || []).map(async (column) => {
        const { data: tasks } = await supabase
          .from('tasks')
          .select('id, title, priority, position, due_date')
          .eq('column_id', column.id)
          .order('position');
        return { ...column, tasks: tasks || [] };
      })
    );

    return NextResponse.json({ board, columns: columnsWithTasks });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Errore' },
      { status: 500 }
    );
  }
}
