"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Search, Users, Eye, Send as SendIcon, Edit, Trash2, MoreVertical, Plus } from 'lucide-react'
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

// Mock Data
const MOCK_PATIENTS = [
  { id: '1', name: 'Ana Carolina', whatsapp: '+55 11 99999-9999', goal: 'Emagrecimento', next_appointment: 'Amanhã, 14:00', status: 'Ativo' },
  { id: '2', name: 'Marcos Silva', whatsapp: '+55 11 98888-8888', goal: 'Ganho de massa', next_appointment: 'Qua, 09:30', status: 'Pausado' },
  { id: '3', name: 'Juliana Costa', whatsapp: '+55 11 97777-7777', goal: 'Saúde geral', next_appointment: '-', status: 'Inativo' },
]

export default function PacientesPage() {
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('Todos')
  const [goal, setGoal] = useState('Todos')

  useEffect(() => {
    // Simular fetch
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Pacientes</h2>
        <Link href="/dashboard/pacientes/novo" className="bg-verde-primario text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-verde-escuro transition-colors">
          <Plus size={18} /> Novo paciente
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl border border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Buscar por nome ou WhatsApp..." 
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-48">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger>
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
            <SelectTrigger>
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

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : MOCK_PATIENTS.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Paciente</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Objetivo</TableHead>
                    <TableHead>Próxima consulta</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[80px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {MOCK_PATIENTS.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-verde-claro text-verde-escuro flex items-center justify-center font-bold text-xs">
                            {patient.name.charAt(0)}
                          </div>
                          <span className="font-medium text-gray-900">{patient.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-500">{patient.whatsapp}</TableCell>
                      <TableCell className="text-gray-500">{patient.goal}</TableCell>
                      <TableCell className="text-gray-500">{patient.next_appointment}</TableCell>
                      <TableCell>
                        <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                          patient.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                          patient.status === 'Pausado' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {patient.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger className="p-2 hover:bg-gray-100 rounded-md">
                            <MoreVertical size={16} className="text-gray-500" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/pacientes/${patient.id}`} className="flex items-center gap-2 cursor-pointer">
                                <Eye size={16} /> Ver detalhes
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/planos?patient=${patient.id}`} className="flex items-center gap-2 cursor-pointer">
                                <SendIcon size={16} /> Enviar plano
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                              <Edit size={16} /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                              <Trash2 size={16} /> Desativar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="p-4 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
              <span>Mostrando 1–3 de 3 pacientes</span>
              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Anterior</button>
                <button className="px-3 py-1 border rounded hover:bg-gray-50 disabled:opacity-50" disabled>Próximo</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <Users size={48} className="text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum paciente cadastrado ainda.</h3>
            <p className="text-gray-500 max-w-md mb-6">
              Cadastre seu primeiro paciente e o agente estará pronto para atendê-lo.
            </p>
            <Link href="/dashboard/pacientes/novo" className="bg-verde-primario text-white px-5 py-2.5 rounded-lg font-medium hover:bg-verde-escuro transition-colors">
              Cadastrar primeiro paciente
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
