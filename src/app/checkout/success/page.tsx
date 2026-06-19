'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { planLabel } from '@/lib/plans';
import type { PlanTier } from '@/lib/database.types';

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [plan, setPlan] = useState<PlanTier | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      setError('Sessione di pagamento non trovata.');
      return;
    }

    fetch('/api/stripe/sync-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Sincronizzazione fallita');
        setPlan(data.plan);
        setStatus('success');
        setTimeout(() => router.replace('/dashboard?checkout=success'), 2500);
      })
      .catch((e) => {
        setStatus('error');
        setError(e instanceof Error ? e.message : 'Errore sconosciuto');
      });
  }, [sessionId, router]);

  return (
    <main className="container mx-auto px-4 pt-32 pb-20 text-center max-w-lg">
      {status === 'loading' && (
        <>
          <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-6" />
          <h1 className="text-2xl font-display font-bold mb-2">Attivazione in corso...</h1>
          <p className="text-muted-foreground">Stiamo aggiornando il tuo piano.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-primary/30">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-4">Pagamento completato!</h1>
          <p className="text-muted-foreground mb-2">
            Il tuo piano è ora <strong className="text-foreground">{plan ? planLabel(plan) : 'attivo'}</strong>.
          </p>
          <p className="text-sm text-muted-foreground mb-8">Reindirizzamento alla dashboard...</p>
          <Link href="/dashboard">
            <Button className="bg-primary text-primary-foreground">Vai alla dashboard</Button>
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-display font-bold mb-4">Quasi fatto</h1>
          <p className="text-muted-foreground mb-8">
            {error || 'Il pagamento potrebbe essere andato a buon fine, ma non siamo riusciti ad aggiornare il piano automaticamente.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard">
              <Button variant="outline">Vai alla dashboard</Button>
            </Link>
            <Link href="/pricing">
              <Button>Riprova</Button>
            </Link>
          </div>
        </>
      )}
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background noise-bg">
      <SiteHeader />
      <Suspense
        fallback={
          <main className="container mx-auto px-4 pt-32 pb-20 text-center">
            <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto" />
          </main>
        }
      >
        <CheckoutSuccessContent />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
