// ═══════════════════════════════════════════════════════
// TODO [DEV — INTEGRAÇÃO N8N]
// Workflows disponíveis no n8n (Hostinger VPS):
//   - upload-pdf: { patientId, patientWhatsapp, pdfUrl, message? }
//   - onboarding-nutricionista: { nutritionistId, name, email, whatsappPessoal }
// URL base: process.env.N8N_WEBHOOK_URL
// Secret: x-webhook-secret header
// ═══════════════════════════════════════════════════════

export async function triggerN8nWorkflow(
  workflowPath: string,
  payload: Record<string, unknown>
): Promise<unknown> {
  const url = `${process.env.N8N_WEBHOOK_URL}/${workflowPath}`

  console.log('[n8n] Triggering:', url, JSON.stringify(payload, null, 2))

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (process.env.N8N_WEBHOOK_SECRET) {
    headers['x-webhook-secret'] = process.env.N8N_WEBHOOK_SECRET
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`n8n webhook falhou: ${response.status} ${response.statusText}`)
  }

  const text = await response.text()
  if (!text) return {}

  try {
    return JSON.parse(text)
  } catch (e) {
    console.warn('[n8n] Resposta não é um JSON válido:', text)
    return { text }
  }
}

