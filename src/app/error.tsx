'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center">
        <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-4xl font-bold text-destructive">!</span>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Qualcosa è andato storto</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Si è verificato un errore imprevisto. Riprova o torna alla dashboard.
        </p>
        
        {error.digest && (
          <p className="text-xs text-muted-foreground mb-4">
            Error ID: {error.digest}
          </p>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={reset} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Riprova
          </Button>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <Home className="w-4 h-4" />
              Torna alla dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
