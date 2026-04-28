"use client"

import { useState } from 'react'
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

const MOCK_PATIENTS = [
  { id: '1', name: 'Ana Carolina', whatsapp: '+55 11 99999-9999' },
  { id: '2', name: 'Marcos Silva', whatsapp: '+55 11 98888-8888' },
]

const MOCK_ANAMNESES = [
  { id: '1', patient_name: 'Ana Carolina', date: '15/04/2026', notes: 'Paciente relatou dificuldade para dormir.', pdf_url: '#' },
]

export default function AnamnesePage() {
  const [patientId, setPatientId] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [isUploading, setIsUploading] = useState(false)

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
    if (!patientId) {
      toast.error('Selecione um paciente.')
      return
    }
    if (!file) {
      toast.error('Faça upload do arquivo PDF da anamnese.')
      return
    }

    setIsUploading(true)
    try {
      // Simulação de upload (já que o Dev fará a integração com S3/Uploadthing)
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const payload = {
        patient_id: patientId,
        url_pdf: 'https://example.com/anamnese.pdf', // URL mockada
        notes
      }

      const res = await fetch('/api/anamnese', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error('Falha ao salvar anamnese')

      toast.success('Anamnese salva com sucesso!')
      setFile(null)
      setNotes('')
      setPatientId('')
      // refresh data
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
              <SelectValue placeholder="Selecione um paciente" />
            </SelectTrigger>
            <SelectContent>
              {MOCK_PATIENTS.map(p => (
                <SelectItem key={p.id} value={p.id}>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-verde-claro text-verde-escuro flex items-center justify-center font-bold text-[10px]">
                      {p.name.charAt(0)}
                    </div>
                    {p.name} <span className="text-gray-400 ml-1 text-xs">{p.whatsapp}</span>
                  </div>
                </SelectItem>
              ))}
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
        
        {MOCK_ANAMNESES.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Observações</TableHead>
                <TableHead className="w-[80px]">PDF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_ANAMNESES.map((anamnesis) => (
                <TableRow key={anamnesis.id}>
                  <TableCell className="font-medium text-gray-900">{anamnesis.patient_name}</TableCell>
                  <TableCell className="text-gray-500">{anamnesis.date}</TableCell>
                  <TableCell className="text-gray-500 max-w-[200px] truncate">{anamnesis.notes}</TableCell>
                  <TableCell>
                    <a href={anamnesis.pdf_url} className="text-verde-primario hover:bg-verde-claro p-2 rounded-md inline-block transition-colors">
                      <Download size={18} />
                    </a>
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
