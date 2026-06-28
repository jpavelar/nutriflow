import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { triggerN8nWorkflow } from '@/lib/n8n'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    // Busca notificações/fallbacks pendentes via n8n
    const response: any = await triggerN8nWorkflow('nutriflow-v2', {
      action: 'getDashboardData',
      nutritionistId: userId
    })

    // O n8n costuma retornar um array. Vamos garantir que pegamos o objeto correto.
    const data = Array.isArray(response) ? response[0]?.json || response[0] : response
    const notifications = data?.notifications || []
    
    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Erro ao buscar notificações:', error)
    return NextResponse.json([])
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { notificationId, action } = await req.json()

    // Ação para marcar como lida ou resolver o fallback
    await triggerN8nWorkflow('nutriflow-v2', {
      action: 'resolveNotification',
      nutritionistId: userId,
      notificationId,
      resolveAction: action
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao processar notificação:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
