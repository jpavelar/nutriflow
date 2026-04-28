import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createCustomerPortalSession } from '@/lib/stripe'
import { getNutritionistByClerkId } from '@/lib/airtable'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    // TODO [DEV]: Buscar stripe_customer_id da nutricionista no Airtable
    // const nutritionist = await getNutritionistByClerkId(userId)
    // const customerId = nutritionist?.stripe_customer_id
    
    // Usando um customer ID mockado para evitar erros sem o Airtable
    const customerId = 'cus_mocked123'

    if (!customerId) {
      return NextResponse.json({ error: 'Customer não encontrado' }, { status: 404 })
    }

    const session = await createCustomerPortalSession(customerId)
    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Erro ao criar portal de assinatura:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
