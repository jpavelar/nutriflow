"use client"

import { useEffect, useState } from 'react'
import { Upload, FileText, X, Download, Send, Smartphone, Loader2, ChevronDown } from 'lucide-react'
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

export default function PlanosPage() {
  const [patientId, setPatientId] = useState('')
  const [patients, setPatients] = useState<any[]>([])
  const [plans, setPlans] = useState<any[]>([])
  const [isLoadingPatients, setIsLoadingPatients] = useState(true)
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/pacientes')
        if (res.ok) {
          const data = await res.json()
          setPatients(data)
        }
      } catch (error) {
        console.error('Erro ao buscar pacientes:', error)
      } finally {
        setIsLoadingPatients(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (patientId) {
      async function fetchPlans() {
        try {
          const res = await fetch(`/api/planos?patient_id=${patientId}`)
          if (res.ok) {
            const data = await res.json()
            setPlans(data)
          }
        } catch (error) {
          console.error('Erro ao buscar planos:', error)
        }
      }
      fetchPlans()
    }
  }, [patientId])

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
      toast.error('Faça upload do arquivo PDF do plano alimentar.')
      return
    }

    setIsUploading(true)
    try {
      // Simulação de upload do arquivo para S3/Uploadthing e endpoint
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Converter o arquivo para Base64 para enviar via API
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = async () => {
        const base64File = reader.result as string;
        
        const payload = {
          patient_id: patientId,
          pdfData: base64File, 
          fileName: file.name,
          message,
          tipo: 'plano'
        }

        const res = await fetch('/api/planos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (!res.ok) throw new Error('Falha ao enviar plano via n8n')

        const patientName = patients.find(p => p.id === patientId)?.name
        toast.success(`Plano enviado para ${patientName}!`, { icon: '✓' })
        
        setFile(null)
        setMessage('')
        setPatientId('')
      };
    } catch (error) {
      toast.error('Plano salvo, mas falha no envio WhatsApp. Contate o suporte.')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Planos Alimentares</h2>
        <p className="text-gray-500">Envie planos em PDF diretamente para o WhatsApp dos pacientes.</p>
      </div>

      {/* Upload Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 bg-verde-claro text-verde-escuro text-xs font-bold px-3 py-1.5 rounded-bl-lg flex items-center gap-1.5">
          <Smartphone size={14} /> Envia via WhatsApp automaticamente
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5 mt-2">Paciente <span className="text-red-500">*</span></label>
          <div className="relative group">
            <select
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              disabled={isLoadingPatients}
              className="w-full h-10 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-verde-escuro/20 focus:border-verde-escuro appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="" disabled>
                {isLoadingPatients ? "Carregando pacientes..." : "Selecione um paciente"}
              </option>
              {patients.map((p) => (
                <option key={String(p.id)} value={String(p.id)}>
                  {p.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-gray-500">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Arquivo PDF do Plano <span className="text-red-500">*</span></label>
          
          {!file ? (
            <div 
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-verde-primario hover:bg-verde-claro/20 transition-colors cursor-pointer group"
              onClick={() => document.getElementById('file-upload-plan')?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 group-hover:text-verde-primario mb-3" />
              <p className="text-sm font-medium text-gray-900 mb-1">Arraste o PDF do plano aqui</p>
              <p className="text-xs text-gray-500">ou clique para selecionar (Máx 10MB)</p>
              <input 
                id="file-upload-plan" 
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Mensagem personalizada (Opcional)</label>
          <Textarea 
            placeholder="Ex: Olá! Segue seu plano alimentar atualizado para o próximo mês. Qualquer dúvida é só perguntar aqui no WhatsApp! 🌿" 
            value={message}
            onChange={e => setMessage(e.target.value)}
            className="resize-none h-24"
            maxLength={500}
          />
          <div className="text-right mt-1 text-xs text-gray-400">{message.length}/500</div>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg text-sm text-blue-800 flex gap-3">
          <Smartphone size={20} className="shrink-0 text-blue-600" />
          <p>
            O plano será enviado automaticamente para o WhatsApp do paciente após o upload. O paciente receberá a mensagem + o link do PDF.
          </p>
        </div>

        <button 
          onClick={handleSubmit}
          disabled={isUploading || !patientId || !file}
          className="w-full bg-verde-primario text-white px-5 py-3 rounded-lg font-medium hover:bg-verde-escuro transition-colors disabled:opacity-70 flex justify-center items-center gap-2"
        >
          {isUploading ? 'Enviando plano...' : <><Send size={18} /> Enviar plano via WhatsApp</>}
        </button>
      </div>

      {/* Histórico Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-8">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Histórico de envios</h3>
        </div>
        
        {plans.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Paciente</TableHead>
                <TableHead>Versão</TableHead>
                <TableHead>Data de envio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[80px]">PDF</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {plans.map((plan) => (
                <TableRow key={plan.id}>
                  <TableCell className="font-medium text-gray-900">{plan.patient_name || patients.find(p => p.id === patientId)?.name}</TableCell>
                  <TableCell className="text-gray-500">v{plan.version}</TableCell>
                  <TableCell className="text-gray-500">{plan.sent_at}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-md border ${plan.status === 'Visualizado' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                      {plan.status === 'Visualizado' ? '✓ Visualizado' : 'Enviado'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <a href={plan.pdf_url} target="_blank" rel="noopener noreferrer" className="text-verde-primario hover:bg-verde-claro p-2 rounded-md inline-block transition-colors">
                      <Download size={18} />
                    </a>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="p-8 text-center text-gray-500">
            {patientId ? 'Nenhum plano enviado para este paciente ainda.' : 'Selecione um paciente para ver o histórico.'}
          </div>
        )}
      </div>
    </div>
  )
}
