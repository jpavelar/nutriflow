// ═══════════════════════════════════════════════════════
// TODO [DEV — INTEGRAÇÃO N8N]
// Workflows disponíveis no n8n (Hostinger VPS):
//   - enviar-plano: { patientId, patientWhatsapp, pdfUrl, message? }
//   - onboarding-nutricionista: { nutritionistId, name, email, whatsappPessoal }
// URL base: process.env.N8N_WEBHOOK_URL
// Secret: x-webhook-secret header
// ═══════════════════════════════════════════════════════

export async function triggerN8nWorkflow(
  workflowPath: string,
  payload: Record<string, unknown>
): Promise<unknown> {
  const url = `${process.env.N8N_WEBHOOK_URL}/${workflowPath}`

  // TODO [DEV]: descomentar quando n8n estiver configurado no VPS
  /*
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-secret': process.env.N8N_WEBHOOK_SECRET!,
    },
    body: JSON.stringify(payload),
  })
  if (!response.ok) {
    throw new Error(`n8n webhook falhou: ${response.status} ${response.statusText}`)
  }
  return response.json()
  */

  // Simulação local (remover quando n8n estiver ativo)
  console.log('[n8n] Simulando trigger:', workflowPath, JSON.stringify(payload, null, 2))
  return { ok: true, simulated: true, workflow: workflowPath }
}
