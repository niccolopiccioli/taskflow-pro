'use client';

import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function BlogPage() {
  const posts = [
    {
      id: 1,
      title: "Come gestire progetti agili con TaskFlow Pro",
      excerpt: "Una guida completa su come implementare le metodologie agile nel tuo team utilizzando le nostre funzionalità.",
      date: "15 Feb 2026",
      category: "Guide",
      readTime: "5 min",
    },
    {
      id: 2,
      title: "5 errori da evitare nel project management",
      excerpt: "Scopri i mistake più comuni che i team commettono e come evitarli per migliorare la produttività.",
      date: "8 Feb 2026",
      category: "Best Practices",
      readTime: "4 min",
    },
    {
      id: 3,
      title: "Novità: Integrazione con Slack e Teams",
      excerpt: "Annunciamo le nuove integrazioni che rendono TaskFlow Pro ancora più connesso al tuo workflow.",
      date: "1 Feb 2026",
      category: "Product",
      readTime: "3 min",
    },
    {
      id: 4,
      title: "Remote work: best practices per team distribuiti",
      excerpt: "Consigli e strategie per mantenere alta la produttività quando il team lavora da remoto.",
      date: "25 Gen 2026",
      category: "Remote Work",
      readTime: "6 min",
    },
    {
      id: 5,
      title: "Come abbiamo scalato TaskFlow Pro a 100k utenti",
      excerpt: "Un caso studio tecnico su come abbiamo gestito la crescita esponenziale della nostra piattaforma.",
      date: "18 Gen 2026",
      category: "Engineering",
      readTime: "8 min",
    },
    {
      id: 6,
      title: "Kanban vs Scrum: quale metodologia scegliere",
      excerpt: "Confronto dettagliato tra le due metodologie più diffuse per aiutarti a scegliere quella giusta.",
      date: "10 Gen 2026",
      category: "Guide",
      readTime: "5 min",
    },
  ];

  const categories = ["Tutti", "Guide", "Best Practices", "Product", "Remote Work", "Engineering"];

  return (
    <div className="min-h-screen bg-background noise-bg">
      <SiteHeader />

      <section className="pt-32 pb-12 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Blog
          </h1>
          <p className="text-xl text-muted-foreground">
            Notizie, guide e approfondimenti sul project management
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 pb-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "Tutti" ? "default" : "outline"}
                size="sm"
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="bg-primary/10 text-primary px-2 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime} lettura</span>
                  </div>
                  <h2 className="text-lg font-semibold mb-2 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="px-6 pb-6">
                  <span className="text-primary text-sm font-medium hover:underline">
                    Leggi tutto →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 bg-slate-900 text-white">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-bold mb-4">
            Non perdere nessun articolo
          </h2>
          <p className="text-slate-400 mb-6">
            Iscriviti alla nostra newsletter per ricevere i nuovi articoli direttamente nella tua inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="La tua email"
              className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button>Iscriviti</Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
