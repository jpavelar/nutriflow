import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { triggerN8nWorkflow } from '@/lib/n8n'

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    // Solicita os dados do dashboard ao n8n
    const response: any = await triggerN8nWorkflow('nutriflow', {
      action: 'getDashboardData',
      nutritionistId: userId
    })

    // Se o n8n ainda não tiver essa ação configurada, retornamos um mock "inteligente"
    // para não quebrar o frontend, mas avisamos no console.
    if (response?.error || !response) {
      console.warn('[api/dashboard] n8n ainda não possui ação getDashboardData. Usando fallback.')
      return NextResponse.json({
        pacientesAtivos: 0,
        interacoesSemana: 0,
        proximasConsultas: 0,
        fallbacksPendentes: 0,
        consultas: [],
        atividades: []
      })
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
