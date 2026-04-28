import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getPatientById, updatePatient } from '@/lib/airtable'
import { z } from 'zod'

const patientUpdateSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres').optional(),
  whatsapp: z.string().regex(/^\+55\d{2}9?\d{8}$/, 'Formato inválido. Use: +5511999999999').optional(),
  goal: z.enum(['Emagrecimento', 'Ganho de massa', 'Saúde geral', 'Outro']).optional(),
  restrictions: z.string().optional(),
  next_appointment: z.string().datetime().optional().nullable(),
  status: z.enum(['Ativo', 'Inativo', 'Pausado']).optional(),
}).partial()

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const patient = await getPatientById(params.id)
    if (!patient || patient.nutritionist_id !== userId) {
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

    const patient = await getPatientById(params.id)
    if (!patient || patient.nutritionist_id !== userId) {
      return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
    }

    const body = await req.json()
    const parsed = patientUpdateSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.format() }, { status: 400 })
    }

    const updatedPatient = await updatePatient(params.id, parsed.data)
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

    const patient = await getPatientById(params.id)
    if (!patient || patient.nutritionist_id !== userId) {
      return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
    }

    await updatePatient(params.id, { status: 'Inativo' })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Erro ao excluir paciente:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
