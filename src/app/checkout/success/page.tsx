'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-background noise-bg">
      <SiteHeader />
      <main className="container mx-auto px-4 pt-32 pb-20 text-center max-w-lg">
        <div className="w-16 h-16 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-teal-500/30">
          <CheckCircle className="w-8 h-8 text-teal-400" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-4">Pagamento completato!</h1>
        <p className="text-muted-foreground mb-8">
          Il tuo abbonamento è stato attivato. Puoi iniziare subito a usare tutte le funzionalità del piano.
        </p>
        <Link href="/dashboard">
          <Button className="bg-teal-500 hover:bg-teal-400 text-zinc-950">
            Vai alla dashboard
          </Button>
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
