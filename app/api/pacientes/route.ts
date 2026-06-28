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

// Helper para mapear os campos do Airtable/N8N para o formato do Frontend
function mapPatient(p: any) {
  if (!p) return null;
  
  const fields = p.fields || p;
  const jsonFields = p.json?.fields || p.json || {};
  
  // Tenta pegar os valores de múltiplas fontes possíveis
  const name = fields.Name || fields.name || jsonFields.Name || jsonFields.name || p.name;
  const whatsapp = fields.WhatsApp || fields.whatsapp || jsonFields.WhatsApp || jsonFields.whatsapp || p.whatsapp;
  const status = fields.Status || fields.status || jsonFields.Status || jsonFields.status || p.status;
  const goal = fields.Objetivo || fields.goal || jsonFields.Objetivo || jsonFields.goal || p.goal;
  const restrictions = fields.Restrições || fields.restrictions || jsonFields.Restrições || jsonFields.restrictions || p.restrictions;
  const notes = fields.Observações || fields.notes || jsonFields.Observações || jsonFields.notes || p.notes;
  const rawNextAppointment = fields["Próxima consulta"] || fields.next_appointment || jsonFields["Próxima consulta"] || jsonFields.next_appointment || p.next_appointment;
  const next_appointment = typeof rawNextAppointment === 'string'
    ? rawNextAppointment.replace(/^"|"$/g, '')
    : rawNextAppointment;
  
  // Busca o link do PDF em qualquer lugar possível
  let url_pdf = fields.url_pdf || jsonFields.url_pdf || p.url_pdf;
  
  // Se o 'goal' ou 'Objetivo' for um anexo do Airtable, pega a URL dele
  if (Array.isArray(goal) && goal[0]?.url) {
    url_pdf = url_pdf || goal[0].url;
  }

  // Trata o texto do objetivo (se for JSON ou anexo, limpa para o usuário)
  let goalText = 'Sem objetivo';
  if (typeof goal === 'string') {
    if (goal.startsWith('[') || goal.startsWith('{')) {
      goalText = 'Arquivo anexado'; // Limpa o JSON estranho
      try {
        const parsed = JSON.parse(goal);
        const potentialUrl = Array.isArray(parsed) ? parsed[0]?.url : parsed?.url;
        if (potentialUrl) url_pdf = url_pdf || potentialUrl;
      } catch(e) {}
    } else {
      goalText = goal;
    }
  } else if (Array.isArray(goal)) {
    goalText = goal[0]?.filename || goal[0]?.name || 'Arquivo anexado';
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
    url_pdf,
    created_at: fields.criado_em || p.created_at || p.createdTime
  };
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const search = searchParams.get('search') || undefined
    const status = searchParams.get('status') || undefined
    const goal = searchParams.get('goal') || undefined

    // Se houver ID, busca apenas um paciente
    if (id) {
      const response: any = await triggerN8nWorkflow('nutriflow-v2', {
        action: 'getPatientById',
        nutritionistId: userId,
        patientId: id,
        tipo: 'paciente'
      })
      
      const rawResponse = response?.patient || response
      const rawPatient = Array.isArray(rawResponse) ? rawResponse[0] : rawResponse
      
      if (!rawPatient || rawPatient.error) {
        return NextResponse.json({ error: 'Paciente não encontrado' }, { status: 404 })
      }
      return NextResponse.json(mapPatient(rawPatient))
    }

    // Buscar lista de pacientes via N8N
    const response = await triggerN8nWorkflow('nutriflow-v2', {
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
    return NextResponse.json([])
  }
}


export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

    const body = await req.json()
    const parsed = patientSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', details: parsed.error.format() }, { status: 400 })
    }

    const newPatientResponse: any = await triggerN8nWorkflow('nutriflow-v2', {
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
