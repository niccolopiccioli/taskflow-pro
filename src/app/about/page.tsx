'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Users, Zap, Shield, Heart } from "lucide-react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: "Team-first",
      description: "Crediamo che i migliori risultati si ottengano quando le persone lavorano bene insieme.",
    },
    {
      icon: Zap,
      title: "Semplicità",
      description: "La potenza non deve essere complessa. Ogni funzionalità è progettata per essere intuitiva.",
    },
    {
      icon: Shield,
      title: "Affidabilità",
      description: "I tuoi dati sono al sicuro con noi. Crittografia end-to-end e backup automatici.",
    },
    {
      icon: Heart,
      title: "Passione",
      description: "Amiamo ciò che facciamo e questo si vede in ogni dettaglio del prodotto.",
    },
  ];

  const team = [
    { name: "Marco Rossi", role: "CEO & Co-founder", image: "MR" },
    { name: "Laura Bianchi", role: "CTO & Co-founder", image: "LB" },
    { name: "Alessandro Verdi", role: "Head of Design", image: "AV" },
    { name: "Giulia Neri", role: "Head of Engineering", image: "GN" },
  ];

  return (
    <div className="min-h-screen bg-background noise-bg">
      <SiteHeader activePath="/about" />

      <section className="pt-32 pb-20 px-4 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            La storia di TaskFlow Pro
          </h1>
          <p className="text-xl text-muted-foreground">
            Siamo un team di sviluppatori e designer italiani che credono nel potere 
            degli strumenti semplici per team straordinari.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <div className="bg-card/50 rounded-2xl p-8 md:p-12 border border-border/60">
            <h2 className="text-2xl font-bold mb-4">La nostra missione</h2>
            <p className="text-muted-foreground mb-4">
              Nel 2024 abbiamo iniziato a costruire TaskFlow Pro perché eravamo stanchi 
              dei tool di project management che promettevano troppo e entregavano poco.
            </p>
            <p className="text-muted-foreground mb-4">
              Volevamo uno strumento che fosse <strong>veloce</strong>, <strong>intuitivo</strong> 
              e che davvero aiutasse i team a consegnare valore più velocemente.
            </p>
            <p className="text-muted-foreground">
              Oggi migliaia di team in tutta Europa usano TaskFlow Pro ogni giorno, 
              e non vediamo l&apos;ora di continuare questo viaggio con te.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 px-4 border-t border-border/40">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-2xl font-display font-bold text-center mb-12">I nostri valori</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div key={value.title} className="rounded-xl p-6 border border-border/60 bg-card/30">
                <div className="w-12 h-12 bg-teal-500/10 rounded-lg flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-teal-400" />
                </div>
                <h3 className="font-semibold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-center mb-12">Il nostro team</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 bg-teal-500/20 rounded-full flex items-center justify-center mx-auto mb-4 ring-1 ring-teal-500/30">
                  <span className="text-teal-400 text-xl font-bold">{member.image}</span>
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4">Unisciti a noi</h2>
          <p className="text-muted-foreground mb-6">
            Siamo sempre alla ricerca di persone talentuose che condividano la nostra visione.
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-teal-500 hover:bg-teal-400 text-zinc-950">Inizia gratis</Button>
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
