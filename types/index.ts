export interface Nutritionist {
  id: string
  clerk_user_id: string
  name: string
  email: string
  whatsapp_pessoal: string
  plan: 'Essencial' | 'Pro' | 'Clínica'
  status: 'Ativa' | 'Inadimplente' | 'Cancelada'
  stripe_customer_id: string
  stripe_subscription_id: string
  system_prompt: string
  palavras_fallback: string
  inicio_assinatura: string
}

export interface Patient {
  id: string
  name: string
  whatsapp: string
  nutritionist_id: string
  status: 'Ativo' | 'Inativo' | 'Pausado'
  goal: 'Emagrecimento' | 'Ganho de massa' | 'Saúde geral' | 'Outro'
  restrictions: string
  next_appointment: string | null
  last_interaction: string | null
  fallback_triggered: boolean
  created_at: string
}

export interface Plan {
  id: string
  patient_id: string
  url_pdf: string
  version: number
  sent_at: string | null
  seen_at: string | null
}

export interface Anamnesis {
  id: string
  patient_id: string
  url_pdf: string
  upload_date: string
  notes: string
}

export interface InteractionLog {
  id: string
  patient_id: string
  datetime: string
  patient_message: string
  ai_response: string
  fallback: boolean
  tokens_used: number
}
