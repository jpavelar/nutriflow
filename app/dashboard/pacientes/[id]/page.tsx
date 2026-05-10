"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { ChevronRight, MessageSquare, Calendar, Download, Edit, Plus, FileText, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from '@/components/ui/skeleton'

export default function PacienteDetailsPage() {
  const router = useRouter()

  const params = useParams()
  const patientId = params.id as string
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [patient, setPatient] = useState<any>(null)
  const [plans, setPlans] = useState<any[]>([])
  const [anamneses, setAnamneses] = useState<any[]>([])
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const [isEditing, setIsEditing] = useState(searchParams?.get('edit') === 'true')

  const [editedPatient, setEditedPatient] = useState<any>({})

  async function fetchData() {
    setLoading(true)
    try {
      // Buscar dados do paciente (forçando sem cache)
      const pRes = await fetch(`/api/pacientes?id=${patientId}`, { cache: 'no-store' })
      if (pRes.ok) {
        const data = await pRes.json()
        const p = Array.isArray(data) ? data[0] : data
        setPatient(p)
        setEditedPatient(p)
        
        // Se o paciente tiver um PDF vinculado diretamente, adiciona na lista
        if (p.url_pdf) {
          setAnamneses([{ 
            id: 'anamnese-atual', 
            url_pdf: p.url_pdf, 
            pdf_url: p.url_pdf, // para compatibilidade
            created_at: p.created_at || new Date().toISOString() 
          }])
        }
      }

      // Buscar planos
      const plRes = await fetch(`/api/planos?patient_id=${patientId}`, { cache: 'no-store' })
      if (plRes.ok) setPlans(await plRes.json())

      // Buscar lista de anamneses (todas as versões)
      const anRes = await fetch(`/api/anamnese?patient_id=${patientId}`, { cache: 'no-store' })
      if (anRes.ok) {
        const list = await anRes.json()
        if (Array.isArray(list) && list.length > 0) {
          setAnamneses(list)
        }
      }

    } catch (error) {
      console.error('Erro ao buscar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (patientId) fetchData()
  }, [patientId])

  const handleUpdateStatus = async (newStatus: string) => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/pacientes/${patientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        toast.success(`Status atualizado para ${newStatus}`)
        await fetchData()
      }
    } catch (error) {
      toast.error('Erro ao atualizar status')
    } finally {
      setActionLoading(false)
    }
  }

  const handleSaveEdit = async () => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/pacientes/${patientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedPatient)
      })
      if (res.ok) {
        toast.success('Paciente atualizado com sucesso')
        setIsEditing(false)
        await fetchData()
      }
    } catch (error) {
      toast.error('Erro ao salvar alterações')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) return <PacienteDetailsSkeleton />
  if (!patient) return <div className="text-center p-12">Paciente não encontrado.</div>

  const waLink = `https://wa.me/${patient.whatsapp?.replace(/\D/g, '')}`

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link href="/dashboard/pacientes" className="hover:text-verde-primario transition-colors">Pacientes</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">{patient.name}</span>
      </div>

      {/* Cabeçalho do Paciente */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-full bg-verde-claro text-verde-escuro flex items-center justify-center font-bold text-2xl shrink-0">
            {patient.name?.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
              <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${patient.status === 'Ativo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {patient.status || 'Ativo'}
              </span>
            </div>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-green-600 transition-colors">
              <MessageSquare size={16} className="text-green-500" />
              {patient.whatsapp}
            </a>
          </div>
        </div>

        <div className="flex w-full md:w-auto gap-3">
          {isEditing ? (
            <>
              <button 
                onClick={() => { setIsEditing(false); setEditedPatient(patient); }}
                className="flex-1 md:flex-none justify-center px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <X size={18} /> Cancelar
              </button>
              <button 
                onClick={handleSaveEdit}
                disabled={actionLoading}
                className="flex-1 md:flex-none justify-center bg-verde-primario text-white px-5 py-2.5 rounded-lg font-medium hover:bg-verde-escuro transition-colors flex items-center gap-2"
              >
                <Check size={18} /> Salvar
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => setIsEditing(true)}
                className="flex-1 md:flex-none justify-center px-5 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Edit size={18} /> Editar
              </button>


            </>
          )}
        </div>
      </div>

      {/* Layout Unificado — Tudo em uma tela */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Coluna 1 — Informações Clínicas */}
        <div className="lg:col-span-2 space-y-6">


          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
              <FileText className="text-verde-primario" size={20} /> Informações Clínicas
            </h3>

          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">

                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Restrições alimentares</h4>
                  {isEditing ? (
                    <Textarea 
                      value={editedPatient.restrictions || ''} 
                      onChange={(e) => setEditedPatient({...editedPatient, restrictions: e.target.value})}
                      className="min-h-[250px] resize-y"
                    />
                  ) : (
                    <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{patient.restrictions || 'Nenhuma restrição informada.'}</p>
                  )}
                </div>

              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 text-blue-600">Nome Completo</h4>
                  {isEditing ? (
                    <Input 
                      value={editedPatient.name || ''} 
                      onChange={(e) => setEditedPatient({...editedPatient, name: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{patient.name}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2 text-green-600">WhatsApp</h4>
                  {isEditing ? (
                    <Input 
                      value={editedPatient.whatsapp || ''} 
                      onChange={(e) => setEditedPatient({...editedPatient, whatsapp: e.target.value})}
                      placeholder="+5511999999999"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{patient.whatsapp}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Status do paciente</h4>
                  <div className="flex gap-2">
                    {['Ativo', 'Pausado', 'Inativo'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          console.log('Alterando status para:', s);
                          setEditedPatient({...editedPatient, status: s});
                        }}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                          (editedPatient?.status || patient?.status || 'Ativo') === s
                            ? 'bg-verde-primario text-white border-verde-primario shadow-sm'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 flex gap-3">
                  <Calendar className="text-laranja shrink-0" />
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-orange-900 mb-1">Próxima consulta</h4>
                    {isEditing ? (
                      <Input 
                        type="datetime-local" 
                        value={editedPatient.next_appointment ? new Date(editedPatient.next_appointment).toISOString().slice(0, 16) : ''} 
                        onChange={(e) => setEditedPatient({...editedPatient, next_appointment: e.target.value})}
                      />
                    ) : (
                      <p className="text-orange-800 font-medium">{patient.next_appointment ? new Date(patient.next_appointment).toLocaleString('pt-BR') : 'Não agendada'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Coluna 2 — Documentos (Sidebar) */}
        <div className="space-y-6">

            {/* Anamneses */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="text-blue-500" size={18} /> Anamneses
                </h3>
              </div>
              <div className="p-6">
                {anamneses.length > 0 ? (
                  <div className="space-y-3">
                    {anamneses.map((an: any) => (
                      <div key={an.id} className="flex items-center justify-between p-3 bg-blue-50/30 rounded-lg border border-blue-100">
                        <div className="flex items-center gap-3">
                          <FileText className="text-blue-400" size={18} />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">Anamnese</p>
                            <p className="text-[10px] text-gray-500 uppercase">{new Date(an.created_at).toLocaleDateString('pt-BR')}</p>
                          </div>
                        </div>
                        <a 
                          href={an.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1.5 text-blue-600 hover:bg-white rounded transition-all"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (patient.url_pdf || patient.goal_attachment?.[0] || patient.Objetivo?.[0]) ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                        <Download size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900">PDF da Anamnese (Airtable)</p>
                        <p className="text-xs text-blue-700">Vínculo direto</p>
                      </div>
                    </div>
                    <a 
                      href={patient.url_pdf || patient.goal_attachment?.[0]?.url || patient.Objetivo?.[0]?.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-white text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 italic text-sm">
                    Nenhuma anamnese cadastrada.
                  </div>
                )}
              </div>
            </div>

            {/* Planos Alimentares */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <Calendar className="text-verde-primario" size={18} /> Planos Alimentares
                </h3>
                <Link href="/dashboard/planos" className="text-xs text-verde-primario font-bold hover:underline">Novo plano</Link>
              </div>
              <div className="p-6">
                {plans.length > 0 ? (
                  <div className="space-y-3">
                    {plans.map((plan: any) => (
                      <div key={plan.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-verde-claro/20 transition-colors">
                        <div className="flex items-center gap-3">
                          <FileText className="text-gray-400" size={18} />
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{plan.name || 'Plano Alimentar'}</p>
                            <p className="text-[10px] text-gray-500 uppercase">{plan.sent_at ? new Date(plan.sent_at).toLocaleDateString('pt-BR') : 'Data não informada'}</p>
                          </div>
                        </div>
                        <a 
                          href={plan.url_pdf || plan.pdf_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-1.5 text-verde-primario hover:bg-white rounded transition-all"
                        >
                          <Download size={16} />
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 italic text-sm">
                    Nenhum plano alimentar enviado ainda.
                  </div>
                )}
              </div>
            </div>
        </div>
      </div>

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
