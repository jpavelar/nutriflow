import { Suspense } from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { Users, MessageCircle, Calendar, AlertTriangle, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

// Funções utilitárias mockadas
async function getDashboardData() {
  // Simulação de delay
  await new Promise(resolve => setTimeout(resolve, 1500))
  return {
    pacientesAtivos: 12,
    interacoesSemana: 0,
    proximasConsultas: 3,
    fallbacksPendentes: 0,
    consultas: [
      { id: 1, nome: 'Ana Carolina', iniciais: 'AC', data: 'Amanhã, 14:00', status: 'Confirmado' },
      { id: 2, nome: 'Marcos Silva', iniciais: 'MS', data: 'Qua, 09:30', status: 'Pendente' },
    ],
    atividades: []
  }
}

export default async function DashboardPage() {
  const user = await currentUser()
  const firstName = user?.firstName || 'Nutricionista'

  const hora = new Date().getHours()
  let saudacao = 'Bom dia'
  if (hora >= 12 && hora < 18) saudacao = 'Boa tarde'
  else if (hora >= 18) saudacao = 'Boa noite'

  return (
    <div className="space-y-6 flex flex-col items-center sm:items-start">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{saudacao}, {firstName}! 👋</h2>
        <p className="text-gray-500">Aqui está o resumo da sua conta.</p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardContent />
      </Suspense>
    </div>
  )
}

async function DashboardContent() {
  const data = await getDashboardData()

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {/* Card 1 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase">Pacientes ativos</CardTitle>
            <Users size={16} className="text-verde-primario" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.pacientesAtivos}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              +2 esta semana
            </p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase">Interações (7d)</CardTitle>
            <MessageCircle size={16} className="text-teal-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.interacoesSemana}</div>
            <p className="text-xs text-gray-400 mt-1">Aguardando dados</p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase">Próx. consultas</CardTitle>
            <Calendar size={16} className="text-laranja" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.proximasConsultas}</div>
            <p className="text-xs text-gray-500 mt-1">Nos próximos 7 dias</p>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase">Fallbacks</CardTitle>
            <AlertTriangle size={16} className="text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.fallbacksPendentes}</div>
            <p className="text-xs text-gray-500 mt-1">Nenhuma atenção necessária</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full">
        {/* Próximas Consultas */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-base font-semibold">Próximas consultas</CardTitle>
            <Link href="/dashboard/pacientes" className="text-sm text-verde-primario hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {data.consultas.length > 0 ? (
              <ul className="divide-y">
                {data.consultas.map(c => (
                  <li key={c.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-verde-claro text-verde-escuro flex items-center justify-center font-bold text-sm">
                        {c.iniciais}
                      </div>
                      <div>
                        <div className="font-medium text-sm text-gray-900">{c.nome}</div>
                        <div className="text-xs text-gray-500">{c.data}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full ${c.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {c.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center p-6">
                <Calendar size={32} className="text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">Nenhuma consulta agendada</p>
                <Link href="/dashboard/pacientes/novo" className="text-xs text-verde-primario hover:underline">
                  Cadastrar paciente
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Atividade Recente */}
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-base font-semibold">Atividade recente</CardTitle>
            <Link href="/dashboard/pacientes" className="text-sm text-verde-primario hover:underline flex items-center gap-1">
              Ver tudo <ArrowRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {data.atividades.length > 0 ? (
              <ul className="divide-y">
                {/* Mock atividade items if they existed */}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center p-6">
                <MessageCircle size={32} className="text-gray-300 mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">Nenhuma interação registrada ainda</p>
                <p className="text-xs text-gray-500">O agente começará a registrar as interações dos seus pacientes aqui.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}

function DashboardSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map(i => (
          <Card key={i}>
            <CardHeader className="pb-2"><Skeleton className="h-4 w-20" /></CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6 w-full">
        <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
        <Card><CardContent className="p-6"><Skeleton className="h-32 w-full" /></CardContent></Card>
      </div>
    </>
  )
}
