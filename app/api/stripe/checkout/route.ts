import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await req.json()
    const { priceId } = body

    if (!priceId) {
      return NextResponse.json({ error: 'priceId é obrigatório' }, { status: 400 })
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#precos`,
      metadata: { clerk_user_id: userId },
      locale: 'pt-BR',
      subscription_data: {
        trial_period_days: 14,
        metadata: { clerk_user_id: userId }
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error)
    return NextResponse.json(
      { error: 'Erro interno ao criar sessão de checkout' },
      { status: 500 }
    )
  }
}
