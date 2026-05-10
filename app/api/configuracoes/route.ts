import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { triggerN8nWorkflow } from '@/lib/n8n'

export async function GET() {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    // Busca dados do nutricionista via n8n
    const response: any = await triggerN8nWorkflow('nutriflow', {
      action: 'syncNutritionist',
      clerkUserId: userId
    })

    // Se o n8n retornar um objeto com os campos, usamos ele.
    // Se não, retornamos um objeto vazio para o frontend usar os valores padrão.
    const nutritionist = response?.nutritionist || response || {}
    
    return NextResponse.json(nutritionist)
  } catch (error) {
    console.error('Erro ao buscar configurações:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
