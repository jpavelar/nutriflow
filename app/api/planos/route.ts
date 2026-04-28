import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createPlan, getPatientPlans, getPatientById } from '@/lib/airtable'
import { triggerN8nWorkflow } from '@/lib/n8n'
import { z } from 'zod'

const planSchema = z.object({
  patient_id: z.string(),
  url_pdf: z.string().url(),
  message: z.string().max(500).optional().default(''),
})

export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const body = await req.json()
    const parsed = planSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.format() }, { status: 400 })
    }

    const patient = await getPatientById(parsed.data.patient_id)
    if (!patient || patient.nutritionist_id !== userId) {
      return NextResponse.json({ error: 'Paciente não encontrado ou não pertence a esta nutricionista' }, { status: 403 })
    }

    // Calcular próxima versão
    const existingPlans = await getPatientPlans(parsed.data.patient_id)
    const nextVersion = existingPlans.length > 0 ? existingPlans[0].version + 1 : 1

    const newPlan = await createPlan({
      patient_id: parsed.data.patient_id,
      url_pdf: parsed.data.url_pdf,
      version: nextVersion,
    })

    // Acionar N8N
    await triggerN8nWorkflow('enviar-plano', {
      patientId: parsed.data.patient_id,
      patientWhatsapp: patient.whatsapp,
      pdfUrl: parsed.data.url_pdf,
      message: parsed.data.message,
    })

    return NextResponse.json(newPlan, { status: 201 })
  } catch (error) {
    console.error('Erro ao salvar plano:', error)
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

    const plans = await getPatientPlans(patient_id)
    return NextResponse.json(plans)
  } catch (error) {
    console.error('Erro ao buscar planos:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
