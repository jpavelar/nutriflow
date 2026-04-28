import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAnamnesis, getPatientAnamneses, getPatientById } from '@/lib/airtable'
import { z } from 'zod'

const anamnesisSchema = z.object({
  patient_id: z.string(),
  url_pdf: z.string().url(),
  notes: z.string().optional().default(''),
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const body = await req.json()
    const parsed = anamnesisSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.format() }, { status: 400 })
    }

    const patient = await getPatientById(parsed.data.patient_id)
    if (!patient || patient.nutritionist_id !== userId) {
      return NextResponse.json({ error: 'Paciente não encontrado ou não pertence a esta nutricionista' }, { status: 403 })
    }

    const newAnamnesis = await createAnamnesis({
      patient_id: parsed.data.patient_id,
      url_pdf: parsed.data.url_pdf,
      notes: parsed.data.notes,
      upload_date: new Date().toISOString(),
    })

    return NextResponse.json(newAnamnesis, { status: 201 })
  } catch (error) {
    console.error('Erro ao salvar anamnese:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const patient_id = searchParams.get('patient_id')

    if (!patient_id) {
      return NextResponse.json({ error: 'patient_id é obrigatório' }, { status: 400 })
    }

    const patient = await getPatientById(patient_id)
    if (!patient || patient.nutritionist_id !== userId) {
      return NextResponse.json({ error: 'Paciente não encontrado ou não autorizado' }, { status: 403 })
    }

    const anamneses = await getPatientAnamneses(patient_id)
    return NextResponse.json(anamneses)
  } catch (error) {
    console.error('Erro ao buscar anamneses:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
