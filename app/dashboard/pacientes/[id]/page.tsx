"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ChevronRight, MessageSquare, Send, Calendar, Download, Edit, Phone } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from '@/components/ui/skeleton'

// Mock Data
const MOCK_PATIENT = {
  id: '1',
  name: 'Ana Carolina',
  whatsapp: '+55 11 99999-9999',
  goal: 'Emagrecimento',
  restrictions: 'Intolerância à lactose',
  notes: 'Gosta de doces após o almoço.',
  created_at: '2026-04-15T10:00:00Z',
  last_interaction: '2026-04-26T15:30:00Z',
  next_appointment: 'Amanhã, 14:00',
  status: 'Ativo',
  fallback_triggered: false
}

const MOCK_HISTORY = [
  { id: '1', datetime: '26/04/2026 15:30', patient_message: 'Posso trocar o lanche da tarde por uma maçã?', ai_response: 'Sim! A maçã é uma ótima opção. De acordo com o seu plano, você pode consumir 1 unidade média. Lembre-se que as frutas substituem bem o seu lanche da tarde atual.', fallback: false },
  { id: '2', datetime: '24/04/2026 09:15', patient_message: 'Estou sentindo muita dor de cabeça hoje e um pouco de enjoo.', ai_response: 'Sinto muito que você não esteja bem. Como você mencionou sintomas (dor, enjoo), vou encaminhar sua mensagem imediatamente para a Dra. Nutricionista avaliar.', fallback: true },
]

const MOCK_PLANS = [
  { id: '1', version: 2, sent_at: '20/04/2026', seen_at: '20/04/2026', url_pdf: '#' },
  { id: '2', version: 1, sent_at: '15/04/2026', seen_at: '15/04/2026', url_pdf: '#' },
]

export default function PacienteDetailsPage() {
  const params = useParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <PacienteDetailsSkeleton />

  const waLink = `https://wa.me/${MOCK_PATIENT.whatsapp.replace(/\D/g, '')}`

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/pacientes" className="hover:text-verde-primario transition-colors">Pacientes</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">{MOCK_PATIENT.name}</span>
      </div>

      {/* Cabeçalho do Paciente */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-verde-claro text-verde-escuro flex items-center justify-center font-bold text-2xl shrink-0">
            {MOCK_PATIENT.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{MOCK_PATIENT.name}</h2>
              <span className="px-2.5 py-1 text-[10px] uppercase font-bold rounded-full bg-green-100 text-green-800">
                {MOCK_PATIENT.status}
              </span>
            </div>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-green-600 transition-colors">
              <MessageSquare size={16} className="text-green-500" />
              {MOCK_PATIENT.whatsapp}
            </a>
          </div>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          <button className="flex-1 md:flex-none justify-center px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2">
            <Edit size={18} /> Editar
          </button>
          <Link href={`/dashboard/planos?patient=${MOCK_PATIENT.id}`} className="flex-1 md:flex-none justify-center bg-verde-primario text-white px-5 py-2.5 rounded-lg font-medium hover:bg-verde-escuro transition-colors flex items-center gap-2">
            <Send size={18} /> Enviar plano
          </Link>
        </div>
      </div>

      {/* Abas */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-white border border-gray-200 mb-6 p-1 h-auto rounded-lg inline-flex w-full overflow-x-auto justify-start md:w-auto">
          <TabsTrigger value="info" className="data-[state=active]:bg-verde-claro data-[state=active]:text-verde-escuro rounded-md px-6 py-2.5 font-medium">Informações</TabsTrigger>
          <TabsTrigger value="historico" className="data-[state=active]:bg-verde-claro data-[state=active]:text-verde-escuro rounded-md px-6 py-2.5 font-medium">Histórico (IA)</TabsTrigger>
          <TabsTrigger value="planos" className="data-[state=active]:bg-verde-claro data-[state=active]:text-verde-escuro rounded-md px-6 py-2.5 font-medium">Planos alimentares</TabsTrigger>
          <TabsTrigger value="anamnese" className="data-[state=active]:bg-verde-claro data-[state=active]:text-verde-escuro rounded-md px-6 py-2.5 font-medium">Anamnese</TabsTrigger>
        </TabsList>

        {/* ABA 1 — Informações */}
        <TabsContent value="info" className="focus-visible:outline-none">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Objetivo principal</h4>
                  <p className="text-gray-900 font-medium">{MOCK_PATIENT.goal}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Restrições alimentares</h4>
                  <p className="text-gray-900">{MOCK_PATIENT.restrictions || 'Nenhuma restrição informada.'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Observações</h4>
                  <p className="text-gray-900">{MOCK_PATIENT.notes || 'Nenhuma observação adicional.'}</p>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Data de cadastro</h4>
                  <p className="text-gray-900">15 de Abril de 2026</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Última interação com IA</h4>
                  <p className="text-gray-900">Ontem, 15:30</p>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex gap-3">
                  <Calendar className="text-laranja shrink-0" />
                  <div>
                    <h4 className="text-sm font-bold text-orange-900 mb-1">Próxima consulta</h4>
                    <p className="text-orange-800 font-medium">{MOCK_PATIENT.next_appointment}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* ABA 2 — Histórico */}
        <TabsContent value="historico" className="focus-visible:outline-none">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900">Histórico de interações no WhatsApp</h3>
              <span className="text-sm text-gray-500">Últimos 30 dias</span>
            </div>
            <div className="p-6 space-y-8">
              {MOCK_HISTORY.map((log) => (
                <div key={log.id} className="space-y-4">
                  <div className="flex justify-center">
                    <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      {log.datetime}
                    </span>
                  </div>
                  
                  {/* Mensagem Paciente */}
                  <div className="flex justify-end">
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl rounded-tr-sm p-4 max-w-[85%] sm:max-w-[70%]">
                      <p className="text-gray-800">{log.patient_message}</p>
                    </div>
                  </div>

                  {/* Resposta IA */}
                  <div className="flex flex-col items-start gap-1">
                    {log.fallback && (
                      <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mb-1 flex items-center gap-1">
                        ⚠️ Alerta de Fallback
                      </span>
                    )}
                    <div className={`${log.fallback ? 'bg-orange-50 border-orange-200' : 'bg-verde-claro border-verde-primario/30'} border rounded-2xl rounded-tl-sm p-4 max-w-[85%] sm:max-w-[70%]`}>
                      <p className="text-gray-800">{log.ai_response}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* ABA 3 — Planos alimentares */}
        <TabsContent value="planos" className="focus-visible:outline-none">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="font-bold text-gray-900">Planos enviados</h3>
              <Link href={`/dashboard/planos?patient=${MOCK_PATIENT.id}`} className="text-verde-primario text-sm font-medium hover:underline flex items-center gap-1">
                <Plus size={16} /> Novo plano
              </Link>
            </div>
            
            {MOCK_PLANS.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {MOCK_PLANS.map((plan) => (
                  <div key={plan.id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                        <FileText size={24} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">Plano Alimentar</h4>
                          <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">v{plan.version}</span>
                        </div>
                        <p className="text-sm text-gray-500">Enviado em {plan.sent_at}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <span className="bg-green-50 text-green-700 text-xs font-semibold px-2.5 py-1 rounded-md border border-green-200">
                        ✓ Visualizado
                      </span>
                      <a href={plan.url_pdf} className="text-verde-primario hover:bg-verde-claro p-2 rounded-md transition-colors ml-auto">
                        <Download size={20} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-gray-500">Nenhum plano enviado ainda.</div>
            )}
          </div>
        </TabsContent>

        {/* ABA 4 — Anamnese */}
        <TabsContent value="anamnese" className="focus-visible:outline-none">
           <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <FileText size={48} className="text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-6">Nenhuma anamnese registrada no sistema.</p>
            <Link href={`/dashboard/anamnese?patient=${MOCK_PATIENT.id}`} className="inline-flex items-center gap-2 bg-verde-claro text-verde-escuro px-4 py-2 rounded-lg font-medium hover:bg-green-100 transition-colors">
              <Plus size={18} /> Adicionar anamnese
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PacienteDetailsSkeleton() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      <Skeleton className="h-4 w-48 mb-8" />
      <div className="bg-white rounded-xl border border-gray-200 p-6 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <div className="flex gap-3">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32 rounded-md" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
    </div>
  )
}
