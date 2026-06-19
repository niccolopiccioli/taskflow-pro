'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { SiteHeader } from '@/components/layout/site-header';
import { SiteFooter } from '@/components/layout/site-footer';
import { PlanRecommender, getHighlightedPlan } from '@/components/pricing/plan-recommender';
import { PricingCards } from '@/components/pricing/pricing-cards';
import { PlanComparisonMatrix } from '@/components/pricing/plan-comparison-matrix';
import { createClient } from '@/lib/supabase/client';
import type { PlanTier } from '@/lib/database.types';
import { nextPlan, planLabel } from '@/lib/plans';

export default function PricingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [teamSize, setTeamSize] = useState(5);
  const [currentPlan, setCurrentPlan] = useState<PlanTier | null>(null);
  const highlightedPlan = getHighlightedPlan(teamSize);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data?.plan) setCurrentPlan(data.plan);
        });
    });
  }, [supabase]);

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

  const handlePlanAction = (tier: PlanTier) => {
    if (tier === 'free') {
      router.push('/register');
      return;
    }
    if (currentPlan === tier) return;
    handleCheckout(tier);
  };

  const upgradeTarget = currentPlan ? nextPlan(currentPlan) : null;

  return (
    <div className="min-h-screen bg-background noise-bg">
      <SiteHeader activePath="/pricing" />

      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="relative bg-amber-500/10 border-b border-amber-500/20 pt-14 sm:pt-16">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-center gap-2 text-xs sm:text-sm text-amber-200/90 text-center">
          <CreditCard className="w-4 h-4" />
          <span>
            Modalità test Stripe — carta{' '}
            <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-xs">4242 4242 4242 4242</code>
          </span>
        </div>
      </div>

      <section className="py-12 sm:py-16 px-4 sm:px-6 relative">
        <div className="container mx-auto max-w-4xl text-center mb-10">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl sm:text-4xl md:text-5xl font-display font-bold mb-4"
          >
            Scegli il piano giusto per il tuo team
          </motion.h1>
          <p className="text-lg text-muted-foreground">
            Tariffe trasparenti. Ogni piano sblocca funzioni reali nel prodotto.
          </p>
          {currentPlan && upgradeTarget && (
            <p className="mt-4 text-sm text-primary">
              Sei su <strong>{planLabel(currentPlan)}</strong> — il prossimo step è{' '}
              <strong>{planLabel(upgradeTarget)}</strong>
            </p>
          )}
        </div>

        <div className="container mx-auto max-w-6xl grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <PlanRecommender
              teamSize={teamSize}
              onTeamSizeChange={setTeamSize}
              highlightedPlan={highlightedPlan}
              currentPlan={currentPlan}
            />
          </div>
          <div className="lg:col-span-3">
            <PricingCards
              highlightedPlan={highlightedPlan}
              currentPlan={currentPlan}
              loadingPlan={loadingPlan}
              onSelectPlan={handlePlanAction}
            />
          </div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 border-t border-border/40">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-2xl font-display font-bold text-center mb-8">
            Confronto completo
          </h2>
          <PlanComparisonMatrix />
        </div>
      </section>

      <section className="py-16 px-4 border-t border-border/40 relative">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-2xl font-display font-bold text-center mb-10">Domande frequenti</h2>
          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-border/60 bg-card/30">
              <h3 className="font-semibold mb-2">Posso cambiare piano in seguito?</h3>
              <p className="text-muted-foreground text-sm">
                Certamente! Upgrade o downgrade dal portale di fatturazione in qualsiasi momento.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-border/60 bg-card/30">
              <h3 className="font-semibold mb-2">Cosa cambia tra Free e Pro?</h3>
              <p className="text-muted-foreground text-sm">
                Pro sblocca inviti email, scadenze, commenti, allegati, analytics, export CSV e colonne
                personalizzate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
