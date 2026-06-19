import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';
import type { PlanTier } from '@/lib/database.types';

const INTERNAL_SECRET = process.env.WEBHOOK_INTERNAL_SECRET || 'taskflow_webhook_2026';

async function syncPlan(
  userId: string,
  plan: PlanTier,
  stripeCustomerId?: string | null,
  stripeSubscriptionId?: string | null
) {
  const supabase = await createClient();
  const { error } = await supabase.rpc('sync_profile_plan', {
    p_user_id: userId,
    p_plan: plan,
    p_stripe_customer_id: stripeCustomerId ?? null,
    p_stripe_subscription_id: stripeSubscriptionId ?? null,
    p_webhook_secret: INTERNAL_SECRET,
  });
  if (error) console.error('sync_profile_plan error:', error);
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature error:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const plan = session.metadata?.plan as PlanTier | undefined;

      if (userId && plan) {
        await syncPlan(
          userId,
          plan,
          typeof session.customer === 'string' ? session.customer : session.customer?.id,
          typeof session.subscription === 'string'
            ? session.subscription
            : session.subscription?.id
        );
      }
      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.user_id;
      const plan = subscription.metadata?.plan as PlanTier | undefined;

      if (userId) {
        const isActive =
          subscription.status === 'active' || subscription.status === 'trialing';

        await syncPlan(
          userId,
          isActive && plan ? plan : 'free',
          null,
          isActive ? subscription.id : null
        );
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
