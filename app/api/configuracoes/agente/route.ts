import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { updateNutritionist } from '@/lib/airtable'

export async function PATCH(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const body = await req.json()
    const { prompt, palavras } = body

    // TODO [DEV]: Verificar no Airtable se plano é Pro ou Clínica antes de permitir
    // TODO [DEV]: updateNutritionist(userId, { system_prompt: prompt, palavras_fallback: palavras })

    console.log('[API] Atualizando agente:', { userId, prompt, palavras })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao atualizar agente:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
