"use client"

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { 
  Search, 
  Users, 
  Eye, 
  Send as SendIcon, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Plus, 
  Loader2, 
  EyeOff,
  UserCheck
} from 'lucide-react'
import { toast } from 'sonner'
import type { Patient } from '@/types'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export default function PacientesPage() {
  const [loading, setLoading] = useState(true)
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Todos')
  const [goal, setGoal] = useState('Todos')
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchPatients = useCallback(async () => {
    setLoading(true)
    try {
      const query = new URLSearchParams()
      if (search) query.append('search', search)
      if (status !== 'Todos') query.append('status', status)
      if (goal !== 'Todos') query.append('goal', goal)
      
      const res = await fetch(`/api/pacientes?${query.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setPatients(Array.isArray(data) ? data : [])
      } else {
        toast.error('Erro ao carregar lista de pacientes')
      }
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error)
      toast.error('Erro de conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }, [search, status, goal])

  useEffect(() => {
    const timer = setTimeout(fetchPatients, 500)
    return () => clearTimeout(timer)
  }, [fetchPatients])

  const handleUpdateStatus = async (patientId: string, newStatus: string) => {
    setActionLoading(patientId)
    try {
      const res = await fetch(`/api/pacientes/${patientId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        toast.success(`Status atualizado: ${newStatus}`)
        await fetchPatients()
      } else {
        toast.error('Erro ao atualizar status')
      }
    } catch (error) {
      toast.error('Falha na comunicação com o servidor')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (patientId: string) => {
    if (!confirm('Tem certeza que deseja excluir este paciente? Esta ação não pode ser desfeita.')) return
    
    setActionLoading(patientId)
    try {
      const res = await fetch(`/api/pacientes/${patientId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        toast.success('Paciente removido com sucesso')
        await fetchPatients()
      } else {
        toast.error('Erro ao excluir paciente')
      }
    } catch (error) {
      toast.error('Falha ao processar exclusão')
    } finally {
      setActionLoading(null)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr || dateStr === '-') return '-'
    try {
      return new Date(dateStr).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Pacientes</h2>
        <Link href="/dashboard/pacientes/novo" className="bg-verde-primario text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-verde-escuro transition-all hover:shadow-lg active:scale-95">
          <Plus size={18} /> Novo paciente
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Buscar por nome ou WhatsApp..." 
            className="pl-10 border-gray-200 focus:ring-verde-primario"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="border-gray-200">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os status</SelectItem>
              <SelectItem value="Ativo">Ativo</SelectItem>
              <SelectItem value="Inativo">Inativo</SelectItem>
              <SelectItem value="Pausado">Pausado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-48">
          <Select value={goal} onValueChange={setGoal}>
            <SelectTrigger className="border-gray-200">
              <SelectValue placeholder="Objetivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Todos">Todos os objetivos</SelectItem>
              <SelectItem value="Emagrecimento">Emagrecimento</SelectItem>
              <SelectItem value="Ganho de massa">Ganho de massa</SelectItem>
              <SelectItem value="Saúde geral">Saúde geral</SelectItem>
              <SelectItem value="Outro">Outro</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
          </div>
        ) : patients.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="font-bold">Paciente</TableHead>
                  <TableHead className="font-bold">WhatsApp</TableHead>
                  <TableHead className="font-bold">Objetivo</TableHead>
                  <TableHead className="font-bold">Próxima consulta</TableHead>
                  <TableHead className="font-bold">Status</TableHead>
                  <TableHead className="w-[60px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-verde-claro text-verde-escuro flex items-center justify-center font-bold text-sm">
                          {patient.name?.charAt(0) || 'P'}
                        </div>
                        <span className="font-semibold text-gray-900">{patient.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600 font-medium">{patient.whatsapp}</TableCell>
                    <TableCell className="text-gray-500">{patient.goal}</TableCell>
                    <TableCell className="text-gray-500">{formatDate(patient.next_appointment)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${
                        patient.status === 'Ativo' ? 'bg-green-50 text-green-700 border-green-200' :
                        patient.status === 'Pausado' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        'bg-gray-50 text-gray-700 border-gray-200'
                      } px-3 py-1`}>
                        {patient.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreVertical size={18} className="text-gray-500" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 p-2">
                          <DropdownMenuItem asChild>
                            <Link href={`/dashboard/pacientes/${patient.id}`} className="flex items-center gap-3 p-2 cursor-pointer bg-orange-500 text-white hover:bg-orange-600 focus:bg-orange-600 focus:text-white rounded-md">
                              <Eye size={16} /> Ver detalhes
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            <Users size={64} className="text-gray-200 mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum paciente por aqui</h3>
            <p className="text-gray-500 max-w-sm mb-8">
              {search || status !== 'Todos' || goal !== 'Todos' 
                ? 'Nenhum resultado para os filtros aplicados. Tente buscar de outra forma.' 
                : 'Sua lista está vazia. Cadastre seu primeiro paciente para começar o acompanhamento.'}
            </p>
            <Link href="/dashboard/pacientes/novo" className="bg-verde-primario text-white px-8 py-3 rounded-xl font-bold hover:bg-verde-escuro transition-all shadow-md">
              Cadastrar Paciente
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
