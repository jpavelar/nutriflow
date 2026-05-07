import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createPlan, getPatientPlans, getPatientById } from '@/lib/airtable'
import { triggerN8nWorkflow } from '@/lib/n8n'
import { z } from 'zod'
 

const planSchema = z.object({
  patient_id: z.string(),
  pdfData: z.string(), // Base64
  fileName: z.string().optional(),
  message: z.string().max(500).optional().default(''),
  tipo: z.string().optional().default('plano'),
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


    // Chamada para o Webhook UNIFICADO (Produção)
    console.log("[api/planos] Enviando para o webhook unificado...");
    let n8nRes: any = {};
    try {
      n8nRes = await triggerN8nWorkflow('nutriflow', {
        action: 'uploadAndSend',
        patientId: parsed.data.patient_id,
        pdfData: parsed.data.pdfData, // Base64
        fileName: parsed.data.fileName || 'plano-alimentar.pdf',
        message: parsed.data.message || `Olá, segue seu plano alimentar atualizado!`,
        nutritionistId: userId,
        tipo: parsed.data.tipo
      });
    } catch (e) {
      console.warn("[api/planos] Erro na resposta do n8n:", e);
    }


    return NextResponse.json({ success: true, n8nRes });
  } catch (error: any) {
    console.error('--- ERRO CRÍTICO NO ENVIO DE PLANO ---');
    console.error('Mensagem:', error.message);
    if (error.response) {
      console.error('Status n8n:', error.response.status);
      console.error('Dados n8n:', await error.response.text());
    }
    console.error('Stack:', error.stack);
    return NextResponse.json({ 
      error: 'Erro interno ao processar plano', 
      details: error.message 
    }, { status: 500 })
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

    // Buscar dados do paciente via N8N
    const patientResponse: any = await triggerN8nWorkflow('nutriflow', {
      action: 'getPatientById',
      patientId: patient_id,
      nutritionistId: userId
    })

    const patient = patientResponse?.patient || patientResponse
    if (!patient || (patient.nutritionist_id && patient.nutritionist_id !== userId)) {
      return NextResponse.json({ error: 'Paciente não encontrado ou não autorizado' }, { status: 403 })
    }

    // const plans = await getPatientPlans(patient_id)

    // Buscar histórico de planos via N8N
    const response: any = await triggerN8nWorkflow('nutriflow', {
      action: 'getPatientPlans',
      patientId: patient_id,
      nutritionistId: userId
    })

    const rawPlans = Array.isArray(response) ? response : response?.plans || []
    
    const plans = rawPlans.map((pl: any) => {
      const fields = pl.fields || pl;
      const jsonFields = pl.json?.fields || pl.json || {};

      return {
        id: pl.id || pl.json?.id,
        name: fields.name || fields.Name || jsonFields.name || jsonFields.Name || 'Plano Alimentar',
        pdf_url: fields.url_pdf || fields['URL do PDF']?.[0]?.url || jsonFields.url_pdf || jsonFields['URL do PDF']?.[0]?.url || pl.pdf_url,
        sent_at: fields.enviado_em || fields.sent_at || jsonFields.enviado_em || jsonFields.sent_at || pl.sent_at || pl.createdTime,
        version: fields.versao || fields.version || jsonFields.versao || jsonFields.version || pl.version
      };
    });

    return NextResponse.json(plans)
  } catch (error) {
    console.error('Erro ao buscar planos:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
