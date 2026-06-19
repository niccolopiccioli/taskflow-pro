'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';

const endpoints = [
  {
    method: 'POST',
    path: '/api/stripe/checkout',
    description: 'Crea sessione Stripe Checkout per piano Pro o Business',
    body: { plan: 'pro' },
    auth: true,
  },
  {
    method: 'POST',
    path: '/api/stripe/portal',
    description: 'Apre il portale di fatturazione Stripe',
    auth: true,
  },
  {
    method: 'POST',
    path: '/api/stripe/webhook',
    description: 'Webhook Stripe per aggiornare il piano utente',
  },
];

const supabaseTables = [
  { name: 'profiles', description: 'Profilo utente, piano e dati Stripe' },
  { name: 'workspaces', description: 'Workspace e team' },
  { name: 'boards', description: 'Board Kanban' },
  { name: 'columns', description: 'Colonne Kanban' },
  { name: 'tasks', description: 'Task con priorità e assegnatario' },
  { name: 'notifications', description: 'Notifiche utente' },
];

const methodColors: Record<string, string> = {
  GET: 'bg-blue-500',
  POST: 'bg-green-500',
  PUT: 'bg-amber-500',
  DELETE: 'bg-red-500',
};

export default function DocsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <span className="text-zinc-950 text-sm font-bold">TF</span>
            </div>
            TaskFlow Pro — Docs
          </Link>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">Dashboard</Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-3xl font-display font-bold mb-2">Documentazione API</h1>
        <p className="text-muted-foreground mb-8">
          TaskFlow Pro usa Supabase per auth e dati, Stripe per i pagamenti (test mode).
        </p>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Autenticazione</h2>
          <Card className="border-border/60 bg-card/50">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                L&apos;autenticazione è gestita da Supabase Auth. Le sessioni sono cookie HTTP-only.
                Le route API protette verificano la sessione server-side.
              </p>
              <code className="text-xs bg-zinc-900 px-3 py-2 rounded block">
                supabase.auth.signInWithPassword({'{ email, password }'})
              </code>
            </CardContent>
          </Card>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Tabelle Supabase</h2>
          <div className="space-y-3">
            {supabaseTables.map((table) => (
              <Card key={table.name} className="border-border/60 bg-card/50">
                <CardHeader className="py-4">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="font-mono">{table.name}</Badge>
                    <CardDescription>{table.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">API Routes (Next.js)</h2>
          <div className="space-y-4">
            {endpoints.map((endpoint) => (
              <Card key={endpoint.path + endpoint.method} className="border-border/60 bg-card/50">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Badge className={`${methodColors[endpoint.method]} text-white`}>
                      {endpoint.method}
                    </Badge>
                    <code className="text-sm font-mono">{endpoint.path}</code>
                    {endpoint.auth && (
                      <Badge variant="outline" className="text-xs">Auth required</Badge>
                    )}
                  </div>
                  <CardDescription>{endpoint.description}</CardDescription>
                </CardHeader>
                {endpoint.body && (
                  <CardContent>
                    <div className="relative">
                      <pre className="text-xs bg-zinc-900 p-4 rounded-lg overflow-x-auto">
                        {JSON.stringify(endpoint.body, null, 2)}
                      </pre>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={() =>
                          copyToClipboard(JSON.stringify(endpoint.body, null, 2), endpoint.path)
                        }
                      >
                        {copied === endpoint.path ? (
                          <Check className="h-4 w-4 text-teal-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
