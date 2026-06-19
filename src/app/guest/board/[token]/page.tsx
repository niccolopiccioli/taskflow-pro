'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Brand } from '@/components/layout/brand';

interface GuestBoardData {
  board: { id: string; name: string; description: string };
  columns: Array<{
    id: string;
    name: string;
    tasks: Array<{ id: string; title: string; priority: string }>;
  }>;
}

export default function GuestBoardPage() {
  const params = useParams();
  const token = params.token as string;
  const [data, setData] = useState<GuestBoardData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/boards/guest/${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) setError(d.error);
        else setData(d);
      })
      .catch(() => setError('Errore di caricamento'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">{error || 'Board non trovata'}</p>
        <Link href="/" className="text-primary text-sm hover:underline">
          Torna alla home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border/60 bg-card/50 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <Brand href="/" size="sm" />
          <Badge variant="outline" className="text-xs">
            Vista guest · sola lettura
          </Badge>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 overflow-x-auto">
        <h1 className="text-2xl font-display font-bold mb-6">{data.board.name}</h1>
        <div className="flex gap-4 min-w-max pb-4">
          {data.columns.map((column) => (
            <div key={column.id} className="w-72 flex-shrink-0">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-semibold">{column.name}</h3>
                <Badge variant="secondary" className="text-xs">
                  {column.tasks.length}
                </Badge>
              </div>
              <div className="space-y-2">
                {column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="rounded-xl border border-border/60 bg-card/50 p-3 text-sm"
                  >
                    {task.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
