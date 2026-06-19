'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Check, Loader2, Sparkles } from 'lucide-react';
import type { PlanTier } from '@/lib/database.types';
import { PLAN_CONFIG, PLAN_ORDER, planLabel } from '@/lib/plans';
import { cn } from '@/lib/utils';

interface PricingCardsProps {
  highlightedPlan: PlanTier;
  currentPlan?: PlanTier | null;
  loadingPlan: string | null;
  onSelectPlan: (plan: PlanTier) => void;
}

export function PricingCards({
  highlightedPlan,
  currentPlan,
  loadingPlan,
  onSelectPlan,
}: PricingCardsProps) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
      {PLAN_ORDER.map((tier, index) => {
        const config = PLAN_CONFIG[tier];
        const isPopular = tier === 'pro';
        const isHighlighted = tier === highlightedPlan;
        const isCurrent = currentPlan === tier;

        return (
          <motion.div
            key={tier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              'relative rounded-2xl p-6 sm:p-8 border transition-all duration-300',
              isHighlighted && 'scale-[1.02] shadow-xl shadow-primary/10',
              isPopular || isHighlighted
                ? 'border-primary/50 bg-card/80 glow-teal backdrop-blur'
                : 'border-border/60 bg-card/50',
              isCurrent && 'ring-2 ring-primary/40'
            )}
          >
            {isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-full">
                  Più popolare
                </span>
              </div>
            )}
            {isCurrent && (
              <div className="absolute -top-3 right-4">
                <span className="bg-muted text-foreground text-xs font-medium px-2.5 py-1 rounded-full border border-border">
                  Piano attuale
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold mb-2">{planLabel(tier)}</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-display font-bold">{config.price}</span>
                <span className="text-muted-foreground">/mese</span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">{config.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {config.marketingFeatures.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button
              className={cn(
                'w-full gap-2',
                (isPopular || isHighlighted) && tier !== 'free' && 'bg-primary hover:opacity-90 text-primary-foreground'
              )}
              variant={tier === 'free' ? 'outline' : 'default'}
              onClick={() => onSelectPlan(tier)}
              disabled={loadingPlan === tier || isCurrent}
            >
              {loadingPlan === tier ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Reindirizzamento...
                </>
              ) : isCurrent ? (
                'Piano attivo'
              ) : tier === 'free' ? (
                'Inizia gratis'
              ) : currentPlan && PLAN_ORDER.indexOf(tier) > PLAN_ORDER.indexOf(currentPlan) ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Fai upgrade
                </>
              ) : (
                'Abbonati'
              )}
            </Button>
          </motion.div>
        );
      })}
    </div>
  );
}

export function UpgradeCtaBanner({ plan }: { plan: PlanTier }) {
  if (plan !== 'free') return null;

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
      <p className="text-sm">
        Stai usando il piano <strong>Gratuito</strong>. Sblocca inviti email, analytics e molto altro.
      </p>
      <Button asChild size="sm" className="rounded-full shrink-0">
        <Link href="/pricing">Scopri Pro</Link>
      </Button>
    </div>
  );
}
