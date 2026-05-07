import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { triggerN8nWorkflow } from '@/lib/n8n'
import { z } from 'zod'

const patientUpdateSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres').optional(),
  whatsapp: z.string().regex(/^\+55\d{2}9?\d{8}$/, 'Formato inválido. Use: +5511999999999').optional(),
  goal: z.string().optional(), // Mais flexível que enum estrito
  restrictions: z.string().optional(),
  notes: z.string().optional(),
  next_appointment: z.string().optional().nullable().transform(val => val ? new Date(val).toISOString() : null),
  status: z.enum(['Ativo', 'Inativo', 'Pausado']).optional(),
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
    const parsed = patientUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.format() }, { status: 400 })
    }

    const response: any = await triggerN8nWorkflow('nutriflow', {
      action: 'updatePatient',
      nutritionistId: userId,
      patientId: params.id,
      ...parsed.data
    })

    const updatedPatient = response?.patient || response
    return NextResponse.json(updatedPatient)
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
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


