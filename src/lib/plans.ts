import type { PlanTier } from '@/lib/database.types';

export const PLAN_LIMITS: Record<
  PlanTier,
  { maxWorkspaces: number; maxMembersPerWorkspace: number }
> = {
  free: { maxWorkspaces: 3, maxMembersPerWorkspace: 5 },
  pro: { maxWorkspaces: Infinity, maxMembersPerWorkspace: 20 },
  business: { maxWorkspaces: Infinity, maxMembersPerWorkspace: Infinity },
};

export function canCreateWorkspace(plan: PlanTier, currentCount: number): boolean {
  return currentCount < PLAN_LIMITS[plan].maxWorkspaces;
}

export function canAddMember(plan: PlanTier, currentCount: number): boolean {
  return currentCount < PLAN_LIMITS[plan].maxMembersPerWorkspace;
}

export function planLabel(plan: PlanTier): string {
  const labels: Record<PlanTier, string> = {
    free: 'Gratuito',
    pro: 'Pro',
    business: 'Business',
  };
  return labels[plan];
}
