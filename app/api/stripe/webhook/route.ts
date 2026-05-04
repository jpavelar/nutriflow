import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

// TODO [DEV]: importar funções do Airtable quando implementadas
// import { createNutritionist, deactivateNutritionist, markNutritionistInadimplente } from '@/lib/airtable'

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature') as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err: any) {
    console.error(`⚠️ Webhook signature verification failed.`, err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const clerk_user_id = session.metadata?.clerk_user_id
        
        if (!clerk_user_id) break

        // Retrieve the subscription to get the priceId if not in line_items
        let plan: 'Essencial' | 'Pro' | 'Clínica' = 'Essencial'
        
        // Em um cenário real, você buscaria os line_items da sessão ou a subscription
        // Aqui estamos usando metadata ou determinando a partir do priceId (simplificado)
        
        console.log('[Webhook] checkout.session.completed para usuário:', clerk_user_id)
        
        /* TODO [DEV]:
        await createNutritionist({
          clerk_user_id,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          plan,
          status: 'Ativa',
          inicio_assinatura: new Date().toISOString()
        })
        */
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        console.log('[Webhook] customer.subscription.deleted para customer:', subscription.customer)
        // TODO [DEV]: await deactivateNutritionist(subscription.customer as string)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        console.log('[Webhook] invoice.payment_failed para customer:', invoice.customer)
        // TODO [DEV]: await markNutritionistInadimplente(invoice.customer as string)
        break
      }

      default:
        console.log(`[Webhook] Unhandled event type ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Webhook] Error handling event', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
