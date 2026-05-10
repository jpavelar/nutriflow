import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { triggerN8nWorkflow } from '@/lib/n8n'
import { z } from 'zod'

const patientUpdateSchema = z.object({
  name: z.string().min(2, 'Mínimo 2 caracteres').optional(),
  whatsapp: z.string().optional(), // Removido regex restritivo para evitar erro 400
  goal: z.string().optional(),
  restrictions: z.string().optional(),
  notes: z.string().optional(),
  next_appointment: z.string().optional().nullable(),
  status: z.string().optional(),
}).partial()

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const response: any = await triggerN8nWorkflow('nutriflow', {
      action: 'getPatientById',
      nutritionistId: userId,
      patientId: params.id
    })
    
    const patient = response?.patient || response
    if (!patient || patient.error) {
      return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
    }

    return NextResponse.json(patient)
  } catch (error) {
    console.error('Erro ao buscar paciente:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const body = await req.json()
    console.log('[DEBUG PATCH] Corpo recebido:', JSON.stringify(body, null, 2))
    console.log('[DEBUG PATCH] ID do paciente:', params.id)

    // Chama o n8n com a ação updatePatient ignorando validação por enquanto
    const response: any = await triggerN8nWorkflow('nutriflow', {
      action: 'updatePatient',
      nutritionistId: userId,
      patientId: params.id,
      ...body
    })

    console.log('[DEBUG PATCH] Resposta do n8n:', JSON.stringify(response, null, 2))

    const updatedPatient = response?.patient || response
    return NextResponse.json(updatedPatient)
  } catch (error) {
    console.error('Erro ao atualizar paciente via n8n:', error)
    return NextResponse.json({ error: 'Erro interno ao chamar n8n' }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    // Em vez de deletar o registro físico do Airtable, 
    // apenas alteramos o status para "Inativo" para preservar o histórico.
    await triggerN8nWorkflow('nutriflow', {
      action: 'updatePatient',
      nutritionistId: userId,
      patientId: params.id,
      status: 'Inativo'
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao inativar paciente:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}


