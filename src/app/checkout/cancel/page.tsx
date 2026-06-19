'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';

export default function CheckoutCancelPage() {
  return (
    <div className="min-h-screen bg-background noise-bg">
      <SiteHeader />
      <main className="container mx-auto px-4 pt-32 pb-20 text-center max-w-lg">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-display font-bold mb-4">Pagamento annullato</h1>
        <p className="text-muted-foreground mb-8">
          Nessun addebito è stato effettuato. Puoi riprovare quando vuoi.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/pricing">
            <Button variant="outline">Torna ai prezzi</Button>
          </Link>
          <Link href="/dashboard">
            <Button className="bg-teal-500 hover:bg-teal-400 text-zinc-950">Dashboard</Button>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
