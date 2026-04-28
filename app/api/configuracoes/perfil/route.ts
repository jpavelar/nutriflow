import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { updateNutritionist } from '@/lib/airtable'

export async function PATCH(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const body = await req.json()
    const { nome, especialidade, whatsapp } = body

    // TODO [DEV]: updateNutritionist(userId, { name: nome, specialty: especialidade, whatsapp_pessoal: whatsapp }) no Airtable
    console.log('[API] Atualizando perfil:', { userId, nome, especialidade, whatsapp })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
