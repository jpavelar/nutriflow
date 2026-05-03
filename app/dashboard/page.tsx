import { Suspense } from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { Users, Calendar, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { auth } from '@clerk/nextjs/server'
import { triggerN8nWorkflow } from '@/lib/n8n'

async function getDashboardData() {
  try {
    const { userId } = auth()
    if (!userId) return null

    const response: any = await triggerN8nWorkflow('nutriflow', {
      action: 'getDashboardData',
      nutritionistId: userId
    })

    // Normaliza a resposta do n8n
    const finalData = Array.isArray(response) ? response[0]?.json || response[0] : response?.json || response
    
    return {
      pacientesAtivos: finalData?.pacientesAtivos ?? 0,
      proximasConsultas: finalData?.proximasConsultas ?? 0,
      fallbacksPendentes: finalData?.fallbacksPendentes ?? 0,
      consultas: Array.isArray(finalData?.consultas) ? finalData.consultas : []
    }
  } catch (error) {
    console.error('Erro ao buscar dados do dashboard:', error)
    return {
      pacientesAtivos: 0,
      proximasConsultas: 0,
      fallbacksPendentes: 0,
      consultas: []
    }
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
    <div className="space-y-6 flex flex-col items-center sm:items-start w-full">
      <div className="w-full">
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
  if (!data) return null

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {/* Card 1 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase font-bold">Pacientes ativos</CardTitle>
            <Users size={16} className="text-verde-primario" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.pacientesAtivos}</div>
            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
              +2 esta semana
            </p>
          </CardContent>
        </Card>

        {/* Card 2 - Próx. Consultas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase font-bold">Próx. consultas</CardTitle>
            <Calendar size={16} className="text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.proximasConsultas}</div>
            <p className="text-xs text-gray-500 mt-1">Nos próximos 7 dias</p>
          </CardContent>
        </Card>

        {/* Card 3 - Fallbacks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-gray-500 uppercase font-bold">Fallbacks</CardTitle>
            <AlertTriangle size={16} className="text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.fallbacksPendentes}</div>
            <p className="text-xs text-gray-500 mt-1">Atenção necessária</p>
          </CardContent>
        </Card>
      </div>

      <div className="w-full">
        <Card className="flex flex-col border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between pb-4 border-b">
            <CardTitle className="text-base font-bold">Próximas consultas</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            {data.consultas.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {data.consultas.map((c: any, index: number) => (
                  <li key={c.id || `consulta-${index}`} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-verde-claro text-verde-escuro flex items-center justify-center font-bold text-sm">
                        {c.iniciais}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-gray-900">{c.nome}</div>
                        <div className="text-xs text-gray-500">{c.data}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full ${c.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                      {c.status || 'Agendado'}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-center p-6">
                <Calendar size={32} className="text-gray-200 mb-3" />
                <p className="text-sm font-medium text-gray-400 mb-1">Nenhuma consulta agendada para os próximos dias</p>
                <Link href="/dashboard/pacientes" className="text-xs text-verde-primario hover:underline font-semibold">
                  Ver lista de pacientes
                </Link>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        {[1, 2, 3].map(i => (
          <Card key={i}>
            <CardHeader className="pb-2"><Skeleton className="h-4 w-20" /></CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-12 mb-2" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="w-full">
        <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
      </div>
    </>
  )
}
