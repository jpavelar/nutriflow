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

// Helper para mapear os campos do Airtable/N8N para o formato do Frontend
function mapPatient(p: any) {
  if (!p) return null;
  
  const fields = p.fields || p;
  const jsonFields = p.json?.fields || p.json || {};
  
  // Tenta pegar os valores de múltiplas fontes possíveis (Airtable raw, N8N, etc.)
  const name = fields.Name || fields.name || jsonFields.Name || jsonFields.name || p.name;
  const whatsapp = fields.WhatsApp || fields.whatsapp || jsonFields.WhatsApp || jsonFields.whatsapp || p.whatsapp;
  const status = fields.Status || fields.status || jsonFields.Status || jsonFields.status || p.status;
  const goal = fields.Objetivo || fields.goal || jsonFields.Objetivo || jsonFields.goal || p.goal;
  const restrictions = fields.Restrições || fields.restrictions || jsonFields.Restrições || jsonFields.restrictions || p.restrictions;
  const notes = fields.Observações || fields.notes || jsonFields.Observações || jsonFields.notes || p.notes;
  const next_appointment = fields["Próxima consulta"] || fields.next_appointment || jsonFields["Próxima consulta"] || jsonFields.next_appointment || p.next_appointment;

  // Trata o objetivo se for anexo
  let goalText = 'Sem objetivo';
  if (Array.isArray(goal)) {
    goalText = goal[0]?.filename || goal[0]?.name || 'Arquivo anexado';
  } else if (typeof goal === 'string') {
    goalText = goal;
  }

  return {
    id: p.id || p.json?.id || p.ID,
    name,
    whatsapp,
    goal: goalText,
    status: status || 'Ativo',
    restrictions,
    notes,
    next_appointment,
    // Mantém os campos originais para compatibilidade de anexo (Anamnese)
    goal_attachment: Array.isArray(goal) ? goal : null,
    Objetivo: Array.isArray(goal) ? goal : null,
    created_at: fields.criado_em || p.created_at || p.createdTime
  };
}

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
        patientId: id,
        tipo: 'paciente'
      })
      
      const rawPatient = response?.patient || response
      if (!rawPatient || rawPatient.error) {
        return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
      }
      return NextResponse.json(mapPatient(rawPatient))
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

    const patients = rawPatients
      .map(mapPatient)
      .filter((p: any) => p && p.name);

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
