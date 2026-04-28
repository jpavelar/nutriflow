import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { triggerN8nWorkflow } from '@/lib/n8n'

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const body = await req.json()
    const { workflow, payload } = body

    if (!workflow || !payload) {
      return NextResponse.json({ error: 'workflow e payload são obrigatórios' }, { status: 400 })
    }

    const result = await triggerN8nWorkflow(workflow, payload)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Erro ao acionar n8n:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
