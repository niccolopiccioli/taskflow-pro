'use client';

import { motion } from 'framer-motion';
import { Users, Sparkles } from 'lucide-react';
import type { PlanTier } from '@/lib/database.types';
import { recommendPlan, planLabel, PLAN_CONFIG } from '@/lib/plans';

interface PlanRecommenderProps {
  teamSize: number;
  onTeamSizeChange: (size: number) => void;
  highlightedPlan: PlanTier;
  currentPlan?: PlanTier | null;
}

export function PlanRecommender({
  teamSize,
  onTeamSizeChange,
  highlightedPlan,
  currentPlan,
}: PlanRecommenderProps) {
  const recommended = recommendPlan(teamSize);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card/50 to-amber-500/5 p-6 sm:p-8"
    >
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Trova il piano giusto</h2>
        </div>

        <p className="text-sm text-muted-foreground mb-6">
          Quanti siete nel team? Muovi lo slider e ti suggeriamo il piano ideale.
        </p>

        <div className="space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Dimensione team</span>
            <span className="font-bold text-2xl tabular-nums text-primary">{teamSize}</span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={teamSize}
            onChange={(e) => onTeamSizeChange(Number(e.target.value))}
            className="w-full h-2 rounded-full appearance-none bg-muted accent-primary cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>15</span>
            <span>30+</span>
          </div>
        </div>

        <motion.div
          key={recommended}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/10 p-4"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Consigliato per te</p>
            <p className="font-semibold text-lg">
              Piano {planLabel(recommended)}{' '}
              <span className="text-sm font-normal text-muted-foreground">
                — {PLAN_CONFIG[recommended].price}/mese
              </span>
            </p>
          </div>
        </motion.div>

        {currentPlan && (
          <p className="mt-4 text-xs text-muted-foreground">
            Piano attuale: <strong className="text-foreground">{planLabel(currentPlan)}</strong>
            {currentPlan !== highlightedPlan && highlightedPlan !== currentPlan && (
              <> · Il piano {planLabel(highlightedPlan)} è evidenziato sotto</>
            )}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export function getHighlightedPlan(teamSize: number): PlanTier {
  return recommendPlan(teamSize);
}
