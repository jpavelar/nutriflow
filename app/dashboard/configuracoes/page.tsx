"use client"

import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'
import { toast } from 'sonner'
import { useUser } from '@clerk/nextjs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

// Mock
const MOCK_NUTRITIONIST = {
  plan: 'Pro', // Mudar para 'Essencial' para ver o bloqueio
  trial_active: true,
  trial_days_left: 12,
  specialty: 'Nutrição Clínica',
  whatsapp_pessoal: '+55 11 99999-9999',
  system_prompt: `Você é assistente nutricional da Dra. [SEU NOME], especialista em [SUA ESPECIALIDADE].\n\nResponda apenas dúvidas sobre alimentação e nutrição com base nos protocolos da nutricionista.\nNUNCA prescreva quantidades exatas de nutrientes ou suplementos.\nSe o paciente mencionar sintomas físicos, dor ou emergência: encaminhe para a nutricionista.\nMáximo de 3 parágrafos por resposta. Tom: simpático, motivador e acessível.`,
  palavras_fallback: "dor\nsintoma\nemergência\ntontura\nfebre\nenjoo\nmédico\nhospital"
}

export default function ConfiguracoesPage() {
  const { user } = useUser()

  const [perfil, setPerfil] = useState({
    nome: user?.fullName || '',
    especialidade: MOCK_NUTRITIONIST.specialty,
    whatsapp: MOCK_NUTRITIONIST.whatsapp_pessoal,
  })

  const [agente, setAgente] = useState({
    prompt: MOCK_NUTRITIONIST.system_prompt,
    palavras: MOCK_NUTRITIONIST.palavras_fallback,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/configuracoes')
        if (res.ok) {
          const data = await res.json()
          if (data) {
            setPerfil({
              nome: data.nome || data.Nome || user?.fullName || '',
              especialidade: data.especialidade || data.Especialidade || MOCK_NUTRITIONIST.specialty,
              whatsapp: data.whatsapp_pessoal || data['WhatsApp pessoal'] || MOCK_NUTRITIONIST.whatsapp_pessoal,
            })
            setAgente({
              prompt: data.system_prompt || data['System Prompt'] || MOCK_NUTRITIONIST.system_prompt,
              palavras: data.palavras_fallback || data['Palavras de fallback'] || MOCK_NUTRITIONIST.palavras_fallback,
            })
          }
        }
      } catch (e) {
        console.error('Erro ao carregar configurações:', e)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchData()
    }
  }, [user])

  const handleSavePerfil = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/configuracoes/perfil', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(perfil)
      })
      if (!res.ok) throw new Error()
      toast.success('Perfil salvo com sucesso')
    } catch (e) {
      toast.error('Ocorreu um erro ao salvar o perfil')
    } finally {
      setIsSaving(false)
    }
  }

  const handleSaveAgente = async () => {
    setIsSaving(true)
    try {
      const res = await fetch('/api/configuracoes/agente', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agente)
      })
      if (!res.ok) throw new Error()
      toast.success('Configurações do agente salvas com sucesso')
    } catch (e) {
      toast.error('Ocorreu um erro ao salvar o agente')
    } finally {
      setIsSaving(false)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-verde-primario"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-4xl pb-24">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configurações</h2>
        <p className="text-gray-500">Gerencie seu perfil, assinatura e o comportamento da IA.</p>
      </div>

      {/* CARD 1 — Meu perfil */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Meu perfil</h3>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome profissional</label>
              <Input
                value={perfil.nome}
                onChange={e => setPerfil({ ...perfil, nome: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Especialidade</label>
              <Input
                placeholder="Ex: Nutrição Clínica"
                value={perfil.especialidade}
                onChange={e => setPerfil({ ...perfil, especialidade: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">WhatsApp pessoal</label>
              <Input
                placeholder="+5511999999999"
                value={perfil.whatsapp}
                onChange={e => setPerfil({ ...perfil, whatsapp: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1.5">
                Você receberá alertas de fallback neste número quando um paciente mandar mensagem sobre sintomas ou emergências.
              </p>
            </div>
          </div>
          <button
            onClick={handleSavePerfil}
            className="mt-2 bg-verde-primario text-white px-5 py-2 rounded-lg font-medium hover:bg-verde-escuro transition-colors"
          >
            Salvar perfil
          </button>
        </div>
      </div>

      {/* CARD 2 — Agente de IA */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden relative">
        <div className="p-5 border-b border-gray-200">
          <h3 className="font-bold text-gray-900">Agente de IA</h3>
        </div>

        {MOCK_NUTRITIONIST.plan === 'Essencial' ? (
          <div className="p-12 flex flex-col items-center justify-center text-center bg-gray-50">
            <Lock className="text-gray-400 mb-4" size={32} />
            <h4 className="text-lg font-bold text-gray-900 mb-2">Disponível no Plano Pro e Clínica</h4>
            <p className="text-gray-500 max-w-sm mb-6">Faça o upgrade do seu plano para personalizar o comportamento do agente e as palavras de fallback.</p>
            <a href="/#precos" className="bg-verde-primario text-white px-5 py-2 rounded-lg font-medium hover:bg-verde-escuro transition-colors">
              Fazer upgrade
            </a>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Instruções do agente (System Prompt)</label>
              <p className="text-xs text-gray-500 mb-2">
                Defina como o agente deve se comportar, o tom de voz e os limites do que pode responder.
              </p>
              <Textarea
                className="min-h-[200px]"
                value={agente.prompt}
                onChange={e => setAgente({ ...agente, prompt: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Palavras de fallback (uma por linha)</label>
              <p className="text-xs text-gray-500 mb-2">
                Quando o paciente usar essas palavras, você receberá uma notificação imediata.
              </p>
              <Textarea
                className="min-h-[120px]"
                value={agente.palavras}
                onChange={e => setAgente({ ...agente, palavras: e.target.value })}
              />
            </div>

            <button
              onClick={handleSaveAgente}
              className="bg-verde-primario text-white px-5 py-2 rounded-lg font-medium hover:bg-verde-escuro transition-colors flex items-center gap-2"
            >
              <Save size={18} /> Salvar configurações do agente
            </button>
          </div>
        )}
      </div>


    </div>
  )
}
