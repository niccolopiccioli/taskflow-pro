'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-display font-bold text-teal-400">404</span>
        </div>

        <h1 className="text-2xl font-bold mb-2">Pagina non trovata</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          La pagina che stai cercando non esiste o è stata spostata.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/dashboard">
            <Button className="gap-2 bg-teal-500 hover:bg-teal-400 text-zinc-950">
              <Home className="w-4 h-4" />
              Torna alla dashboard
            </Button>
          </Link>
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Torna indietro
          </Button>
        </div>
      </div>
    </div>
  );
}
