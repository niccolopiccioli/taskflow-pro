import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  getSupabaseAnonKey,
  getSupabaseUrl,
} from '@/lib/supabase/env';

export async function GET() {
  const url = getSupabaseUrl();
  const anonKey = getSupabaseAnonKey();
  const urlSource = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? 'NEXT_PUBLIC_SUPABASE_URL'
    : process.env.SUPABASE_URL
      ? 'SUPABASE_URL'
      : 'missing';
  const keySource = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? 'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    : process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
      ? 'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY'
      : process.env.SUPABASE_ANON_KEY
        ? 'SUPABASE_ANON_KEY'
        : process.env.SUPABASE_PUBLISHABLE_KEY
          ? 'SUPABASE_PUBLISHABLE_KEY'
          : 'missing';

  const projectRef = url.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? null;

  // #region agent log
  fetch('http://127.0.0.1:7830/ingest/287043ce-c603-431d-889d-2f262003b458', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '7e0774',
    },
    body: JSON.stringify({
      sessionId: '7e0774',
      runId: 'health-check',
      hypothesisId: 'H1-H3',
      location: 'api/health/supabase/route.ts:entry',
      message: 'Supabase health check env resolution',
      data: {
        hasUrl: Boolean(url),
        hasAnonKey: Boolean(anonKey),
        urlSource,
        keySource,
        projectRef,
        expectedProjectRef: 'lcubcugivegahjsbmepy',
        projectRefMatch: projectRef === 'lcubcugivegahjsbmepy',
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!url || !anonKey) {
    return NextResponse.json(
      { ok: false, error: 'missing_env', urlSource, keySource },
      { status: 500 }
    );
  }

  const supabase = createClient(url, anonKey);
  const { data, error } = await supabase.from('profiles').select('id').limit(1);

  // #region agent log
  fetch('http://127.0.0.1:7830/ingest/287043ce-c603-431d-889d-2f262003b458', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Debug-Session-Id': '7e0774',
    },
    body: JSON.stringify({
      sessionId: '7e0774',
      runId: 'health-check',
      hypothesisId: 'H4',
      location: 'api/health/supabase/route.ts:query',
      message: 'Supabase profiles query result',
      data: {
        ok: !error,
        errorCode: error?.code ?? null,
        errorMessage: error?.message ?? null,
        rowCount: data?.length ?? 0,
        projectRef,
      },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  return NextResponse.json({
    ok: !error,
    urlSource,
    keySource,
    projectRef,
    expectedProjectRef: 'lcubcugivegahjsbmepy',
    projectRefMatch: projectRef === 'lcubcugivegahjsbmepy',
    dbError: error?.message ?? null,
  });
}
