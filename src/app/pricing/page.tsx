'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Check, Loader2, CreditCard } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { createClient } from '@/lib/supabase/client';

export default function PricingPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const supabase = createClient();

  const plans = [
    {
      name: 'Gratuito',
      price: '€0',
      period: '/mese',
      description: 'Perfetto per progetti personali',
      features: [
        'Fino a 3 workspace',
        '5 membri per workspace',
        'Board illimitati',
        'Task illimitati',
        'Supporto via email',
      ],
      cta: 'Inizia gratis',
      popular: false,
      action: 'free' as const,
    },
    {
      name: 'Pro',
      price: '€12',
      period: '/mese',
      description: 'Per team in crescita',
      features: [
        'Workspace illimitati',
        '20 membri per workspace',
        'Board illimitati',
        'Task illimitati',
        'Priorità supporto',
        'Analytics avanzate',
        'Backup automatici',
      ],
      cta: 'Inizia trial',
      popular: true,
      action: 'pro' as const,
    },
    {
      name: 'Business',
      price: '€29',
      period: '/mese',
      description: 'Per team professionisti',
      features: [
        'Tutto in Pro',
        'Membri illimitati',
        'Workspace privati',
        'SSO / SAML',
        'Audit log',
        'API access',
        'Dedicated support',
        'SLA garantito',
      ],
      cta: 'Abbonati',
      popular: false,
      action: 'business' as const,
    },
  ];

  const handleCheckout = async (plan: 'pro' | 'business') => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/register?plan=${plan}`);
      return;
    }

    setLoadingPlan(plan);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      window.location.href = data.url;
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Errore checkout');
      setLoadingPlan(null);
    }
  };

  const handlePlanAction = (action: 'free' | 'pro' | 'business') => {
    if (action === 'free') {
      router.push('/register');
      return;
    }
    handleCheckout(action);
  };

  return (
    <div className="min-h-screen bg-background noise-bg">
      <SiteHeader activePath="/pricing" />

      <div className="absolute inset-0 bg-gradient-to-b from-teal-500/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative bg-amber-500/10 border-b border-amber-500/20 mt-16">
        <div className="container mx-auto px-4 py-3 flex items-center justify-center gap-2 text-sm text-amber-200/90">
          <CreditCard className="w-4 h-4" />
          <span>
            Modalità test Stripe — usa la carta <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">4242 4242 4242 4242</code>
          </span>
        </div>
      </div>

      <section className="py-20 px-4 relative">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Scegli il piano giusto per il tuo team
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Tariffhe semplici e trasparenti. Nessun costo nascosto.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 pb-20 relative">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-8 border ${
                  plan.popular
                    ? 'border-teal-500/50 bg-card/80 glow-teal backdrop-blur'
                    : 'border-border/60 bg-card/50'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-teal-500 text-zinc-950 text-xs font-medium px-3 py-1 rounded-full">
                      Più popolare
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-display font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-teal-400 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular ? 'bg-teal-500 hover:bg-teal-400 text-zinc-950' : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                  onClick={() => handlePlanAction(plan.action)}
                  disabled={loadingPlan === plan.action}
                >
                  {loadingPlan === plan.action ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Reindirizzamento...
                    </>
                  ) : (
                    plan.cta
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-t border-border/40 relative">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-display font-bold text-center mb-10">Domande frequenti</h2>
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-border/60 bg-card/30">
              <h3 className="font-semibold mb-2">Posso cambiare piano in seguito?</h3>
              <p className="text-muted-foreground text-sm">
                Certamente! Puoi upgrade o downgrade dal portale di fatturazione in qualsiasi momento.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border/60 bg-card/30">
              <h3 className="font-semibold mb-2">Come testo i pagamenti?</h3>
              <p className="text-muted-foreground text-sm">
                Usa la carta 4242 4242 4242 4242 con qualsiasi data futura e CVC. Stripe è in modalità test.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
