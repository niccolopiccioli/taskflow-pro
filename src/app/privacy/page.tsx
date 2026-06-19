'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">TF</span>
              </div>
              <span className="font-bold text-lg">TaskFlow Pro</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#features" className="text-sm hover:text-primary">Funzionalità</Link>
              <Link href="/pricing" className="text-sm hover:text-primary">Prezzi</Link>
              <Link href="/docs" className="text-sm hover:text-primary">API</Link>
              <Link href="/about" className="text-sm hover:text-primary">About</Link>
              <Link href="/blog" className="text-sm hover:text-primary">Blog</Link>
            </nav>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Accedi</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Inizia gratis</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">
            Privacy Policy
          </h1>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <p className="text-muted-foreground">
              Ultimo aggiornamento: 5 Marzo 2026
            </p>

            <h2 className="text-xl font-semibold">1. Introduzione</h2>
            <p className="text-muted-foreground">
              Benvenuti in TaskFlow Pro. La tua privacy è importante per noi. 
              Questa Privacy Policy spiega come raccogliamo, utilizziamo, divulghiamo 
              e salviamo le tue informazioni quando utilizzi il nostro servizio.
            </p>

            <h2 className="text-xl font-semibold">2. Dati che raccogliamo</h2>
            <p className="text-muted-foreground">
              Raccogliamo i seguenti dati:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Dati account:</strong> email, nome, cognome quando ti registri</li>
              <li><strong>Dati Workspace:</strong> nomi dei workspace, board, colonne e task che crei</li>
              <li><strong>Dati di utilizzo:</strong> informazioni su come interagisci con il servizio</li>
              <li><strong>Dati tecnici:</strong> indirizzo IP, browser, dispositivo</li>
            </ul>

            <h2 className="text-xl font-semibold">3. Come utilizziamo i dati</h2>
            <p className="text-muted-foreground">
              Utilizziamo i tuoi dati per:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Fornire e migliorare il nostro servizio</li>
              <li>Gestire il tuo account e l&apos;autenticazione</li>
              <li>Comunicare con te riguardo al servizio</li>
              <li>Prevenire frodi e garantire la sicurezza</li>
              <li>Rispettare gli obblighi legali</li>
            </ul>

            <h2 className="text-xl font-semibold">4. Protezione dei dati</h2>
            <p className="text-muted-foreground">
              Implementiamo misure di sicurezza appropriate per proteggere i tuoi dati, 
              inclusa la crittografia end-to-end, l&apos;uso di server sicuri e l&apos;accesso 
              limitato alle informazioni personali.
            </p>

            <h2 className="text-xl font-semibold">5. Condivisione dei dati</h2>
            <p className="text-muted-foreground">
              Non vendiamo i tuoi dati personali. Possiamo condividere i tuoi dati solo con:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Fornitori di servizi che ci aiutano a gestire il servizio</li>
              <li>Autorità legali quando richiesto dalla legge</li>
              <li>Con il tuo consenso esplicito</li>
            </ul>

            <h2 className="text-xl font-semibold">6. I tuoi diritti</h2>
            <p className="text-muted-foreground">
              Hai il diritto di:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Accedere ai tuoi dati personali</li>
              <li>Correggere dati inesatti</li>
              <li>Richiedere la cancellazione dei tuoi dati</li>
              <li>Esportare i tuoi dati in formato leggibile</li>
              <li>Opporti al trattamento dei tuoi dati</li>
            </ul>

            <h2 className="text-xl font-semibold">7. Conservazione dei dati</h2>
            <p className="text-muted-foreground">
              Conserviamo i tuoi dati per tutto il tempo necessario a fornirti il servizio 
              e per adempiere agli obblighi legali. Puoi richiedere la cancellazione del 
              tuo account in qualsiasi momento.
            </p>

            <h2 className="text-xl font-semibold">8. Cookies</h2>
            <p className="text-muted-foreground">
              Utilizziamo cookie e tecnologie simili per migliorare la tua esperienza. 
              Puoi gestire le preferenze dei cookie attraverso le impostazioni del tuo browser.
            </p>

            <h2 className="text-xl font-semibold">9. Modifiche</h2>
            <p className="text-muted-foreground">
              Possiamo modificare questa Privacy Policy in qualsiasi momento. 
              Ti notificheremo di eventuali modifiche significative tramite email 
              o tramite un avviso sul nostro servizio.
            </p>

            <h2 className="text-xl font-semibold">10. Contatti</h2>
            <p className="text-muted-foreground">
              Per qualsiasi domanda riguardo questa Privacy Policy, contattaci a: 
              <strong> privacy@taskflowpro.it</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-primary-foreground font-bold text-sm">TF</span>
              </div>
              <span className="font-bold text-white text-lg">TaskFlow Pro</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm">
              <Link href="#features" className="text-slate-400 hover:text-white transition-colors duration-200">Funzionalità</Link>
              <Link href="/pricing" className="text-slate-400 hover:text-white transition-colors duration-200">Prezzi</Link>
              <Link href="/docs" className="text-slate-400 hover:text-white transition-colors duration-200">API</Link>
              <Link href="/about" className="text-slate-400 hover:text-white transition-colors duration-200">About</Link>
              <Link href="/blog" className="text-slate-400 hover:text-white transition-colors duration-200">Blog</Link>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-slate-400 hover:text-white transition-colors duration-200">Privacy</Link>
              <Link href="/terms" className="text-slate-400 hover:text-white transition-colors duration-200">Terms</Link>
            </div>
          </div>
          
          <div className="mt-10 pt-8 border-t border-slate-800 text-center">
            <p className="text-sm text-slate-500">
              © 2026 TaskFlow Pro. Tutti i diritti riservati.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
