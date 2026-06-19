import type { PlanTier } from '@/lib/database.types';
import { createServiceClient } from '@/lib/supabase/server';

export async function syncProfilePlan(params: {
  userId: string;
  plan: PlanTier;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  stripePriceId?: string | null;
}) {
  const supabase = await createServiceClient();

  const { data, error } = await supabase
    .from('profiles')
    .update({
      plan: params.plan,
      ...(params.stripeCustomerId
        ? { stripe_customer_id: params.stripeCustomerId }
        : {}),
      ...(params.stripeSubscriptionId !== undefined
        ? { stripe_subscription_id: params.stripeSubscriptionId }
        : {}),
      ...(params.stripePriceId ? { stripe_price_id: params.stripePriceId } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', params.userId)
    .select('id, plan')
    .single();

  if (error) {
    console.error('syncProfilePlan failed:', error);
    throw error;
  }

  return data;
}

export function planFromPriceId(priceId: string | null | undefined): PlanTier | null {
  if (!priceId) return null;
  if (priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
  if (priceId === process.env.STRIPE_PRICE_BUSINESS) return 'business';
  return null;
}

export function resolvePlanFromMetadata(
  metadataPlan: string | null | undefined,
  priceId: string | null | undefined
): PlanTier | null {
  if (metadataPlan === 'pro' || metadataPlan === 'business' || metadataPlan === 'free') {
    return metadataPlan;
  }
  return planFromPriceId(priceId);
}
