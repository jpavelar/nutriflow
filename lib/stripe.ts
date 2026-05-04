import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy';

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-04-10',
  typescript: true,
})

export async function createCheckoutSession(userId: string, priceId: string) {
  return stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#precos`,
    metadata: { clerk_user_id: userId },
    locale: 'pt-BR',
    subscription_data: { trial_period_days: 14 },
  })
}

export async function createCustomerPortalSession(customerId: string) {
  return stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/configuracoes`,
  })
}
