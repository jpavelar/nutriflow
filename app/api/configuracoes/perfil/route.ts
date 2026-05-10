import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { triggerN8nWorkflow } from '@/lib/n8n'

export async function PATCH(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const body = await req.json()
    const { nome, especialidade, whatsapp } = body

    // Chama o n8n para atualizar o nutricionista no Airtable
    const response = await triggerN8nWorkflow('nutriflow', {
      action: 'syncNutritionist',
      clerkUserId: userId,
      'Nome': nome,
      'WhatsApp pessoal': whatsapp
    })

    console.log('[API] Perfil atualizado via n8n:', response)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
