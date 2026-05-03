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
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
  const [isEditing, setIsEditing] = useState(searchParams?.get('edit') === 'true')

  const [editedPatient, setEditedPatient] = useState<any>(null)

  async function fetchData() {
    setLoading(true)
    try {
      // Buscar dados do paciente
      const pRes = await fetch(`/api/pacientes?id=${patientId}`)
      if (pRes.ok) {
        const data = await pRes.json()
        const p = Array.isArray(data) ? data[0] : data
        setPatient(p)
        setEditedPatient(p)
      }

      // Buscar planos
      const plRes = await fetch(`/api/planos?patient_id=${patientId}`)
      if (plRes.ok) setPlans(await plRes.json())

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

      {/* Abas */}
      <Tabs defaultValue="info" className="w-full">
        <TabsList className="bg-white border border-gray-200 mb-6 p-1 h-auto rounded-lg inline-flex w-full overflow-x-auto justify-start md:w-auto">
          <TabsTrigger value="info" className="data-[state=active]:bg-verde-claro data-[state=active]:text-verde-escuro rounded-md px-6 py-2.5 font-medium">Informações</TabsTrigger>
          <TabsTrigger value="documentos" className="data-[state=active]:bg-verde-claro data-[state=active]:text-verde-escuro rounded-md px-6 py-2.5 font-medium">Planos e Anamneses</TabsTrigger>
          <TabsTrigger value="historico" className="data-[state=active]:bg-verde-claro data-[state=active]:text-verde-escuro rounded-md px-6 py-2.5 font-medium">Histórico (IA)</TabsTrigger>
        </TabsList>

        {/* ABA 1 — Informações */}
        <TabsContent value="info" className="focus-visible:outline-none">
          <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Objetivo principal</h4>
                  {isEditing ? (
                    <Select value={editedPatient.goal} onValueChange={(val) => setEditedPatient({...editedPatient, goal: val})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o objetivo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Emagrecimento">Emagrecimento</SelectItem>
                        <SelectItem value="Ganho de massa">Ganho de massa</SelectItem>
                        <SelectItem value="Saúde geral">Saúde geral</SelectItem>
                        <SelectItem value="Outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-gray-900 font-medium">{patient.goal || 'Não informado'}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Restrições alimentares</h4>
                  {isEditing ? (
                    <Textarea 
                      value={editedPatient.restrictions || ''} 
                      onChange={(e) => setEditedPatient({...editedPatient, restrictions: e.target.value})}
                      className="resize-none"
                    />
                  ) : (
                    <p className="text-gray-900">{patient.restrictions || 'Nenhuma restrição informada.'}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Observações</h4>
                  {isEditing ? (
                    <Textarea 
                      value={editedPatient.notes || ''} 
                      onChange={(e) => setEditedPatient({...editedPatient, notes: e.target.value})}
                      className="resize-none"
                    />
                  ) : (
                    <p className="text-gray-900">{patient.notes || 'Nenhuma observação adicional.'}</p>
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
                  <Select value={patient.status || 'Ativo'} onValueChange={handleUpdateStatus} disabled={actionLoading}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Pausado">Pausado</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
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
        </TabsContent>

        {/* ABA 2 — Documentos (Planos e Anamneses) */}
        <TabsContent value="documentos" className="focus-visible:outline-none">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Anamneses */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="text-blue-500" size={18} /> Anamnese Atual
                </h3>
              </div>
              <div className="p-6">
                {patient.goal_attachment?.[0] || patient.Objetivo?.[0] ? (
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                        <Download size={20} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-blue-900">PDF da Anamnese</p>
                        <p className="text-xs text-blue-700">Enviado em: {patient.created_at ? new Date(patient.created_at).toLocaleDateString('pt-BR') : 'Recentemente'}</p>
                      </div>
                    </div>
                    <a 
                      href={(patient.goal_attachment?.[0]?.url || patient.Objetivo?.[0]?.url)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 bg-white text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 italic text-sm">
                    Nenhuma anamnese em PDF cadastrada.
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
                            <p className="text-[10px] text-gray-500 uppercase">{plan.sent_at || plan.created_at}</p>
                          </div>
                        </div>
                        <a 
                          href={plan.pdf_url || plan['URL do PDF']?.[0]?.url} 
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
        </TabsContent>

        {/* ABA 3 — Histórico */}
        <TabsContent value="historico" className="focus-visible:outline-none">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900">Interações e Evolução</h3>
              <span className="text-sm text-gray-500 italic">Integrado com WhatsApp</span>
            </div>
            <div className="p-12 text-center text-gray-500">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-200 mb-4" />
              <p className="text-sm">O histórico de logs do paciente está sendo processado.</p>
            </div>
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
