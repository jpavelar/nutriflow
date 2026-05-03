import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { getPatients, createPatient } from '@/lib/airtable'
import { triggerN8nWorkflow } from '@/lib/n8n'
import { z } from 'zod'

const patientSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  whatsapp: z.string().regex(/^\+55\d{2}9?\d{8}$/, 'Formato inválido. Use: +5511999999999'),
  goal: z.string().optional().default(''),
  restrictions: z.string().optional().default(''),
  next_appointment: z.string().datetime().optional().nullable(),
})

export async function GET(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const goal = searchParams.get('goal') || undefined

    // Se houver ID, busca apenas um paciente
    if (id) {
      const response: any = await triggerN8nWorkflow('nutriflow', {
        action: 'getPatientById',
        nutritionistId: userId,
        patientId: id
      })
      
      const patient = response?.patient || response
      if (!patient || patient.error) {
        return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
      }
      return NextResponse.json(patient)
    }

    // Buscar lista de pacientes via N8N
    const response = await triggerN8nWorkflow('nutriflow', {
      action: 'getPatients',
      nutritionistId: userId,
      search,
      status,
      goal
    })

    console.log('[API Pacientes] Resposta do n8n:', JSON.stringify(response, null, 2))

    const rawResponse = response
    let rawPatients: any[] = []

    if (Array.isArray(rawResponse)) {
      rawPatients = rawResponse
    } else if (rawResponse && typeof rawResponse === 'object') {
      if ((rawResponse as any).patients) {
        rawPatients = (rawResponse as any).patients
      } 
      else if ((rawResponse as any).id || (rawResponse as any).fields) {
        rawPatients = [rawResponse]
      }
    }
    
    console.log('[API Pacientes] Processando', rawPatients.length, 'pacientes')

    const patients = rawPatients.map((p: any) => {
      // Tenta pegar o nome de todas as formas possíveis
      const name = p.Name || p.fields?.Name || p.name || p.fields?.name || p.json?.fields?.Name || p.json?.Name
      const whatsapp = p.WhatsApp || p.fields?.WhatsApp || p.whatsapp || p.fields?.whatsapp
      
      // Trata o objetivo (pode ser texto ou um anexo do Airtable)
      let goalRaw = p.Objetivo || p.fields?.Objetivo || p.goal || p.fields?.goal
      let goal = 'Sem objetivo'
      
      if (Array.isArray(goalRaw)) {
        // Se for um anexo do Airtable, pega o nome do arquivo
        goal = goalRaw[0]?.filename || goalRaw[0]?.name || 'Arquivo anexado'
      } else if (typeof goalRaw === 'string') {
        goal = goalRaw
      }

      const status = p.Status || p.fields?.Status || p.status || p.fields?.status
      
      return {
        id: p.id || p.json?.id,
        name: name,
        whatsapp: whatsapp,
        goal: goal,
        status: status,
        next_appointment: p["Próxima consulta"] || p.fields?.["Próxima consulta"] || p.next_appointment
      }
    }).filter((p: any) => p.name);

    console.log('[API Pacientes] Enviando para o front:', patients.length, 'pacientes')

    return NextResponse.json(patients)
  } catch (error) {
    console.error('Erro ao buscar pacientes:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}


export async function POST(req: Request) {
  try {
    const { userId } = auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const body = await req.json()
    const parsed = patientSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.format() }, { status: 400 })
    }

    const newPatientResponse: any = await triggerN8nWorkflow('nutriflow', {
      action: 'createPatient',
      nutritionistId: userId,
      ...parsed.data
    })

    return NextResponse.json(newPatientResponse?.patient || newPatientResponse, { status: 201 })
  } catch (error) {
    console.error('Erro ao criar paciente:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
