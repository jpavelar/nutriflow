"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Calendar, ChevronRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const formSchema = z.object({
  name: z.string().min(3, 'Mínimo 3 caracteres'),
  whatsapp: z.string().regex(/^\+55\d{2}9?\d{8}$/, 'Formato inválido. Use: +5511999999999'),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  restrictions: z.string().optional(),
  next_appointment: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function NovoPacientePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      whatsapp: '',
      email: '',
      restrictions: '',
      notes: '',
      next_appointment: '',
    },
  })

  async function onSubmit(data: FormValues) {
    setIsSubmitting(true)
    try {
      // Formata a data se existir
      const payload = {
        ...data,
        next_appointment: data.next_appointment ? new Date(data.next_appointment).toISOString() : null
      }

      const res = await fetch('/api/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Erro ao salvar paciente')
      }

      toast.success('Paciente cadastrado com sucesso!')
      router.push('/dashboard/pacientes')
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || 'Erro ao salvar. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link href="/dashboard/pacientes" className="hover:text-verde-primario transition-colors">Pacientes</Link>
        <ChevronRight size={14} />
        <span className="text-gray-900 font-medium">Novo paciente</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-200 bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">Cadastrar novo paciente</h2>
          <p className="text-sm text-gray-500 mt-1">Preencha os dados abaixo para adicionar um paciente ao sistema.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-8">
            
            {/* Seção Dados Pessoais */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Dados pessoais</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Nome completo <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Maria Silva" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp <span className="text-red-500">*</span></FormLabel>
                      <FormControl>
                        <Input placeholder="+5511999999999" {...field} />
                      </FormControl>
                      <FormDescription>Formato com DDI: +55 (código) (número)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>E-mail (Opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="maria@email.com" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Seção Perfil Nutricional */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Perfil nutricional</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Campo Objetivo Removido */}

                <FormField
                  control={form.control}
                  name="restrictions"
                  render={({ field }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Restrições alimentares (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: intolerância à lactose, alergia a amendoim, vegetariana..." 
                          className="resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Campo Observações Removido */}
              </div>
            </div>

            {/* Seção Próxima Consulta */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider border-b pb-2">Próxima consulta</h3>
              
              <div className="bg-verde-claro border border-verde-primario rounded-lg p-4 flex gap-3 text-verde-escuro text-sm mb-4">
                <Calendar size={20} className="shrink-0" />
                <p>O agente enviará lembretes automáticos 24h e 2h antes desta data para o WhatsApp do paciente.</p>
              </div>

              <FormField
                control={form.control}
                name="next_appointment"
                render={({ field }) => (
                  <FormItem className="max-w-xs">
                    <FormLabel>Data e hora (Opcional)</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Rodapé Fixo */}
            <div className="fixed bottom-0 left-0 right-0 md:left-60 bg-white border-t border-gray-200 p-4 px-6 flex justify-end gap-3 z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <Link href="/dashboard/pacientes" className="px-5 py-2.5 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition-colors">
                Cancelar
              </Link>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-verde-primario text-white px-5 py-2.5 rounded-lg font-medium hover:bg-verde-escuro transition-colors flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                Salvar paciente
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
