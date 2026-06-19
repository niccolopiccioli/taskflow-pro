import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface SiteHeaderProps {
  activePath?: string;
}

const navLinks = [
  { href: '/#features', label: 'Funzionalità' },
  { href: '/pricing', label: 'Prezzi' },
  { href: '/docs', label: 'API' },
  { href: '/about', label: 'About' },
];

export function SiteHeader({ activePath }: SiteHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/70 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl group">
          <div className="w-9 h-9 bg-teal-500 rounded-lg flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:shadow-teal-500/40 transition-shadow">
            <span className="text-zinc-950 text-sm font-bold">TF</span>
          </div>
          <span className="font-display">TaskFlow Pro</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm transition-colors ${
                activePath === link.href
                  ? 'text-teal-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              Accedi
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="bg-teal-500 hover:bg-teal-400 text-zinc-950 shadow-lg shadow-teal-500/20">
              Inizia gratis
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
