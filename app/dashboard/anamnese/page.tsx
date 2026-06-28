"use client"

import { useState, useEffect } from 'react'
import { Upload, FileText, X, Download } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function AnamnesePage() {
  const [patients, setPatients] = useState<any[]>([])
  const [patientId, setPatientId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)

  // Busca os pacientes reais
  useEffect(() => {
    fetch('/api/pacientes')
      .then(res => res.json())
      .then(data => {
        setPatients(Array.isArray(data) ? data : [])
        setIsLoadingPatients(false)
      })
      .catch(() => {
        toast.error('Erro ao carregar lista de pacientes')
        setIsLoadingPatients(false)
      })
  }, [])

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      if (droppedFile.size <= 10 * 1024 * 1024) {
        setFile(droppedFile)
      } else {
        toast.error('O arquivo deve ter no máximo 10MB.')
      }
    } else {
      toast.error('Por favor, envie apenas arquivos PDF.')
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' && selectedFile.size <= 10 * 1024 * 1024) {
        setFile(selectedFile)
      } else {
        toast.error('Arquivo inválido ou muito grande (máximo 10MB).')
      }
    }
  }

  const handleSubmit = async () => {
    if (!patientId || !file) {
      toast.error('Selecione um paciente e o arquivo PDF.')
      return
    }

    setIsUploading(true)
    try {
      // Converte o PDF para base64 para enviar via JSON
      const reader = new FileReader()
      const base64Promise = new Promise((resolve) => {
        reader.onload = () => resolve(reader.result)
        reader.readAsDataURL(file)
      })
      
      const base64File = await base64Promise

      const payload = {
        patient_id: patientId,
        pdfData: base64File,
        fileName: file.name,
        message: notes,
        tipo: 'anamnese'
      }

      const res = await fetch('/api/anamnese', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Falha ao salvar anamnese')

      toast.success('Anamnese enviada com sucesso!')
      setFile(null)
      setNotes('')
      setPatientId('')
    } catch (error) {
      toast.error('Erro ao enviar anamnese. Tente novamente.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Anamnese</h2>
        <p className="text-gray-500">Faça upload de anamneses e vincule aos pacientes.</p>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Paciente <span className="text-red-500">*</span></label>
          <Select value={patientId} onValueChange={setPatientId}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um paciente">
                {patientId
                  ? (patients.find(p => p.id === patientId)?.name ?? patientId)
                  : 'Selecione um paciente'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {isLoadingPatients ? (
                <div className="p-2 text-center text-xs text-gray-500">Carregando...</div>
              ) : patients.length === 0 ? (
                <div className="p-2 text-center text-xs text-gray-500">Nenhum paciente encontrado</div>
              ) : (
                patients.map(p => (
                  <SelectItem key={p.id} value={p.id} textValue={p.name}>
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-verde-claro text-verde-escuro flex items-center justify-center font-bold text-[10px]">
                        {p.name?.charAt(0) || 'P'}
                      </div>
                      {p.name} <span className="text-gray-400 ml-1 text-xs">{p.whatsapp}</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Arquivo PDF <span className="text-red-500">*</span></label>
          
          {!file ? (
            <div 
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-verde-primario hover:bg-verde-claro/20 transition-colors cursor-pointer group"
              onClick={() => document.getElementById('file-upload')?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-verde-primario mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">Arraste o PDF da anamnese aqui</p>
              <p className="text-xs text-gray-500">ou clique para selecionar (Máx 10MB)</p>
              <input 
                id="file-upload" 
                type="file" 
                accept="application/pdf" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="border border-verde-primario bg-verde-claro/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-verde-claro rounded-lg flex items-center justify-center text-verde-primario">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={() => setFile(null)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
                title="Remover arquivo"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Observações (Opcional)</label>
          <Textarea 
            placeholder="Anotações adicionais sobre a anamnese deste paciente..." 
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="resize-none h-24"
            maxLength={500}
          />
          <div className="text-right mt-1 text-xs text-gray-400">{notes.length}/500</div>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isUploading || !patientId || !file}
          className="w-full bg-verde-primario text-white px-5 py-3 rounded-lg font-medium hover:bg-verde-escuro transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {isUploading ? 'Enviando...' : 'Enviar anamnese'}
        </button>
      </div>

      {/* Histórico Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-8">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Anamneses recentes</h3>
        </div>
        
        {patients.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>WhatsApp</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.slice(0, 5).map((p) => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-gray-900">{p.name}</TableCell>
                  <TableCell className="text-gray-500">{p.whatsapp}</TableCell>
                  <TableCell className="text-gray-500">{p.status || 'Ativo'}</TableCell>
                  <TableCell>
                    <div className="text-verde-primario text-xs font-medium">Paciente Ativo</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-gray-500">Nenhuma anamnese recente.</div>
        )}
      </div>
    </div>
  )
}
