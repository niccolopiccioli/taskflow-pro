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

  if (!url || !anonKey) {
    return NextResponse.json(
      { ok: false, error: 'missing_env', urlSource, keySource },
      { status: 500 }
    );
  }

  const supabase = createClient(url, anonKey);
  const { error } = await supabase.from('profiles').select('id').limit(1);

  return NextResponse.json({
    ok: !error,
    urlSource,
    keySource,
    projectRef,
    dbError: error?.message ?? null,
  });
}
