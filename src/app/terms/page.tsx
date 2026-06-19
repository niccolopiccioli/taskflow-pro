'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
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
            Termini di Servizio
          </h1>
          
          <div className="prose prose-slate max-w-none space-y-6">
            <p className="text-muted-foreground">
              Ultimo aggiornamento: 5 Marzo 2026
            </p>

            <h2 className="text-xl font-semibold">1. Accettazione dei termini</h2>
            <p className="text-muted-foreground">
              Accedendo o utilizzando TaskFlow Pro, accetti di essere vincolato da 
              questi Termini di Servizio. Se non accetti questi termini, non utilizzare 
              il servizio.
            </p>

            <h2 className="text-xl font-semibold">2. Descrizione del servizio</h2>
            <p className="text-muted-foreground">
              TaskFlow Pro è una piattaforma di project management che permette ai team 
              di gestire progetti, task e collaborare in modo efficiente. Il servizio 
              include funzionalità di board Kanban, gestione workspace, e integrazioni.
            </p>

            <h2 className="text-xl font-semibold">3. Account utente</h2>
            <p className="text-muted-foreground">
              Per utilizzare il servizio devi creare un account. Ti impegni a:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Fornire informazioni accurate e complete</li>
              <li>Mantieni sicure le tue credenziali di accesso</li>
              <li>Sei responsabile di tutte le attività sotto il tuo account</li>
              <li>Notificarci immediatamente qualsiasi uso non autorizzato</li>
            </ul>

            <h2 className="text-xl font-semibold">4. Utilizzo accettabile</h2>
            <p className="text-muted-foreground">
              Accetti di NON utilizzare il servizio per:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Attività illegali o non autorizzate</li>
              <li>Violare diritti di terzi</li>
              <li>Trasmettere malware o virus</li>
              <li>Interferire con il funzionamento del servizio</li>
              <li>Raccogliere dati di altri utenti senza consenso</li>
            </ul>

            <h2 className="text-xl font-semibold">5. Contenuti degli utenti</h2>
            <p className="text-muted-foreground">
              Sei proprietario dei contenuti che crei su TaskFlow Pro. Con la creazione 
              di contenuti, ci concedi una licenza per utilizzarli al fine di fornirti 
              il servizio.
            </p>

            <h2 className="text-xl font-semibold">6. Piani e pagamenti</h2>
            <p className="text-muted-foreground">
              Alcune funzionalità richiedono un abbonamento. I pagamenti sono non 
              rimborsabili salvo diversa indicazione. Puoi annullare l&apos;abbonamento 
              in qualsiasi momento dalle impostazioni del tuo account.
            </p>

            <h2 className="text-xl font-semibold">7. Proprietà intellettuale</h2>
            <p className="text-muted-foreground">
              TaskFlow Pro e tutti i suoi componenti sono protetti da copyright e altri 
              diritti di proprietà intellettuale. Non puoi copiare, modificare o 
              distribuire il servizio senza autorizzazione scritta.
            </p>

            <h2 className="text-xl font-semibold">8. Disclaimer</h2>
            <p className="text-muted-foreground">
              IL SERVIZIO È FORNITO &quot;COSÌ COM&apos;È&quot; SENZA GARANZIE DI ALCUN TIPO. 
              NON GARANTIAMO CHE IL SERVIZIO SIA PRIVO DI ERRORI O VIRUS.
            </p>

            <h2 className="text-xl font-semibold">9. Limitazione di responsabilità</h2>
            <p className="text-muted-foreground">
              NON SAREMO RESPONSABILI PER DANNI INDIRETTI, INCIDENTALI, SPECIALI 
              O CONSEQUENZIALI DERIVANTI DALL&apos;UTILIZZO DEL SERVIZIO.
            </p>

            <h2 className="text-xl font-semibold">10. Indennizzo</h2>
            <p className="text-muted-foreground">
              Accetti di indennizzare e tenere indenne TaskFlow Pro da qualsiasi 
              rivendicazione derivante dalla tua violazione di questi termini.
            </p>

            <h2 className="text-xl font-semibold">11. Risoluzione</h2>
            <p className="text-muted-foreground">
              Possiamo sospendere o terminare il tuo account in caso di violazione 
              di questi termini. Puoi eliminare il tuo account in qualsiasi momento.
            </p>

            <h2 className="text-xl font-semibold">12. Legge applicabile</h2>
            <p className="text-muted-foreground">
              Questi termini sono regolati dalla legge italiana. Per qualsiasi 
              controversia sarà competente il Foro di Milano.
            </p>

            <h2 className="text-xl font-semibold">13. Modifiche</h2>
            <p className="text-muted-foreground">
              Possiamo modificare questi termini in qualsiasi momento. L&apos;uso 
              continuato del servizio dopo le modifiche costituisce accettazione 
              dei nuovi termini.
            </p>

            <h2 className="text-xl font-semibold">14. Contatti</h2>
            <p className="text-muted-foreground">
              Per domande su questi termini, contattaci a: 
              <strong> legal@taskflowpro.it</strong>
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
