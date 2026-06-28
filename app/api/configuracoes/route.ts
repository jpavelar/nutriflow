import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { triggerN8nWorkflow } from '@/lib/n8n'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    // Busca dados do nutricionista via n8n
    const response: any = await triggerN8nWorkflow('nutriflow-v2', {
      action: 'getNutritionist',
      clerkUserId: userId
    })

    const rawData = Array.isArray(response) ? response[0] : (response?.nutritionist || response)
    const nutritionist = rawData || {}
    
    return NextResponse.json(nutritionist)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json({})
  }
}
