import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { triggerN8nWorkflow } from '@/lib/n8n'
import { z } from 'zod'


const anamnesisSchema = z.object({
  patient_id: z.string(),
  pdfData: z.string(), // base64
  fileName: z.string(),
  message: z.string().optional().default(''),
  tipo: z.string().optional().default('anamnese'),
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

    // Chama o n8n para processar o upload e atualizar o paciente no Airtable
    const response: any = await triggerN8nWorkflow('nutriflow', {
      action: 'uploadAndSend', 
      nutritionistId: userId,
      patientId: parsed.data.patient_id,
      pdfData: parsed.data.pdfData,
      fileName: parsed.data.fileName,
      message: parsed.data.message,
      tipo: parsed.data.tipo
    })

    return NextResponse.json({ success: true, response }, { status: 201 })
  } catch (error) {
    console.error('Erro ao processar anamnese:', error)
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
