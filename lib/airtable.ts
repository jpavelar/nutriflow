import Airtable from 'airtable'
import type { Nutritionist, Patient, Plan, Anamnesis } from '@/types'

// ═══════════════════════════════════════════════════════
// TODO [DEV — INTEGRAÇÃO AIRTABLE]
// Tabelas necessárias no Airtable (base: NutriFlow):
//   - Nutricionistas (campos: clerk_user_id, nome, email,
//     whatsapp_pessoal, plano, status, stripe_customer_id,
//     stripe_subscription_id, system_prompt, palavras_fallback,
//     inicio_assinatura)
//   - Pacientes (campos: nome, whatsapp, nutritionist_id,
//     status, objetivo, restricoes, proxima_consulta,
//     ultima_interacao, fallback_acionado, criado_em)
//   - Planos (campos: paciente_id, url_pdf, versao,
//     enviado_em, visto_em)
//   - Anamneses (campos: paciente_id, url_pdf,
//     data_upload, observacoes)
//   - Logs_Interacao (campos: paciente_id, data_hora,
//     mensagem_paciente, resposta_ia, fallback,
//     tokens_consumidos)
// ═══════════════════════════════════════════════════════

const airtableApiKey = process.env.AIRTABLE_API_KEY || 'dummy_key';
const airtableBaseId = process.env.AIRTABLE_BASE_ID || 'dummy_base';

const base = new Airtable({ apiKey: airtableApiKey })
  .base(airtableBaseId)

// ─── NUTRICIONISTAS ───────────────────────────────────

export async function createNutritionist(
  data: Pick<Nutritionist,
    'clerk_user_id' | 'stripe_customer_id' | 'stripe_subscription_id' |
    'plan' | 'status' | 'inicio_assinatura'>
): Promise<Nutritionist> {
  // TODO [DEV]: implementar
  console.log('[airtable] createNutritionist', data)
  throw new Error('Not implemented — ver lib/airtable.ts')
}

export async function getNutritionistByClerkId(
  clerkUserId: string
): Promise<Nutritionist | null> {
  // TODO [DEV]: implementar
  // filterByFormula: `{clerk_user_id} = '${clerkUserId}'`
  return null
}

export async function updateNutritionist(
  id: string,
  data: Partial<Nutritionist>
): Promise<Nutritionist> {
  // TODO [DEV]: implementar
  throw new Error('Not implemented')
}

export async function deactivateNutritionist(
  stripeCustomerId: string
): Promise<void> {
  // TODO [DEV]: atualizar status para 'Cancelada'
  console.log('[airtable] deactivateNutritionist', stripeCustomerId)
}

export async function markNutritionistInadimplente(
  stripeCustomerId: string
): Promise<void> {
  // TODO [DEV]: atualizar status para 'Inadimplente'
  console.log('[airtable] markInadimplente', stripeCustomerId)
}

// ─── PACIENTES ────────────────────────────────────────

export async function getPatients(
  nutritionistId: string,
  filters?: { search?: string; status?: string; goal?: string }
): Promise<Patient[]> {
  // TODO [DEV]: implementar
  // filterByFormula: AND({nutritionist_id}='${nutritionistId}', ...)
  return []
}

export async function getPatientById(id: string): Promise<Patient | null> {
  // TODO [DEV]: implementar
  return null
}

export async function createPatient(
  data: Omit<Patient, 'id' | 'created_at' | 'last_interaction' | 'fallback_triggered'>
): Promise<Patient> {
  // TODO [DEV]: implementar
  throw new Error('Not implemented')
}

export async function updatePatient(
  id: string,
  data: Partial<Patient>
): Promise<Patient> {
  // TODO [DEV]: implementar
  throw new Error('Not implemented')
}

// ─── PLANOS ───────────────────────────────────────────

export async function getPatientPlans(patientId: string): Promise<Plan[]> {
  // TODO [DEV]: implementar
  // sort: [{ field: 'versao', direction: 'desc' }]
  return []
}

export async function createPlan(
  data: Omit<Plan, 'id' | 'sent_at' | 'seen_at'>
): Promise<Plan> {
  // TODO [DEV]: implementar
  throw new Error('Not implemented')
}

// ─── ANAMNESE ─────────────────────────────────────────

export async function createAnamnesis(
  data: Omit<Anamnesis, 'id'>
): Promise<Anamnesis> {
  // TODO [DEV]: implementar
  throw new Error('Not implemented')
}

export async function getPatientAnamneses(
  patientId: string
): Promise<Anamnesis[]> {
  // TODO [DEV]: implementar
  return []
}
