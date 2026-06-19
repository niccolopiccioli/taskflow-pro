import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="border-t border-border/40 bg-background/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <span className="text-zinc-950 text-xs font-bold">TF</span>
              </div>
              <span className="font-display font-bold">TaskFlow Pro</span>
            </div>
            <p className="text-sm text-muted-foreground max-w-sm">
              Gestisci il tuo team alla velocità del pensiero. Kanban fluido per startup e team tecnici.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm">Prodotto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/#features" className="hover:text-teal-400 transition-colors">Funzionalità</Link></li>
              <li><Link href="/pricing" className="hover:text-teal-400 transition-colors">Prezzi</Link></li>
              <li><Link href="/docs" className="hover:text-teal-400 transition-colors">API</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-3 text-sm">Legale</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/privacy" className="hover:text-teal-400 transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-teal-400 transition-colors">Termini</Link></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TaskFlow Pro. Tutti i diritti riservati.
        </div>
      </div>
    </footer>
  );
}
