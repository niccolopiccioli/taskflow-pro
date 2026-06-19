'use client';

import Link from 'next/link';
import { Sparkles, ChevronRight, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { PlanTier } from '@/lib/database.types';
import { planLabel } from '@/lib/plans';
import { cn } from '@/lib/utils';

interface PlanBadgeProps {
  plan: PlanTier;
  className?: string;
  showUpgradeHint?: boolean;
}

const PLAN_STYLES: Record<PlanTier, string> = {
  free: 'border-primary/30 text-primary hover:border-primary/50 hover:bg-primary/10',
  pro: 'border-violet-500/30 text-violet-400 hover:border-violet-500/50 hover:bg-violet-500/10',
  business: 'border-amber-500/30 text-amber-400 hover:border-amber-500/50 hover:bg-amber-500/10',
};

export function PlanBadge({ plan, className, showUpgradeHint = true }: PlanBadgeProps) {
  const isFree = plan === 'free';

  return (
    <Link href="/pricing" className={cn('group/plan inline-flex shrink-0', className)}>
      <Badge
        variant="outline"
        className={cn(
          'gap-1 rounded-full px-2.5 py-1 text-xs font-semibold transition-all duration-200',
          'cursor-pointer hover:scale-105 hover:shadow-md hover:shadow-primary/10',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          PLAN_STYLES[plan]
        )}
        title={isFree ? 'Scopri i piani Pro e Business' : 'Gestisci il tuo piano'}
      >
        {isFree ? (
          <Zap className="w-3 h-3 transition-transform group-hover/plan:rotate-12" />
        ) : (
          <Sparkles className="w-3 h-3" />
        )}
        {planLabel(plan)}
        <ChevronRight className="w-3 h-3 opacity-0 -ml-1 transition-all group-hover/plan:opacity-100 group-hover/plan:ml-0" />
      </Badge>
      {isFree && showUpgradeHint && (
        <span className="sr-only">Vai ai piani e fai upgrade</span>
      )}
    </Link>
  );
}
