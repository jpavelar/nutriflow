"use client"

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Bell, Menu } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'
import { toast } from 'sonner'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from './Sidebar'
import { NotificationBell } from './NotificationBell'

const routeNames: Record<string, string> = {
  '/dashboard': 'Visão geral',
  '/dashboard/pacientes': 'Pacientes',
  '/dashboard/pacientes/novo': 'Novo paciente',
  '/dashboard/anamnese': 'Anamnese',
  '/dashboard/planos': 'Planos Alimentares',
  '/dashboard/configuracoes': 'Configurações',
}

export function Header() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Find best matching route name
  let pageName = 'Dashboard'
  const matchedRoute = Object.keys(routeNames).find(route => pathname === route || (pathname.startsWith(route) && route !== '/dashboard'))
  if (matchedRoute) {
    pageName = routeNames[matchedRoute]
  }

  // Handle checkout success toast
  useEffect(() => {
    if (searchParams.get('checkout') === 'success') {
      toast.success('🎉 Bem-vinda ao NutriFlow! Seu trial de 14 dias começou.', {
        duration: 5000,
      })
      
      // Limpar o parametro da URL silenciosamente
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('checkout')
      window.history.replaceState({}, '', newUrl.toString())
    }
  }, [searchParams])

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        <Sheet>
          <SheetTrigger className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-md">
            <Menu size={20} />
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-60">
            <div className="w-full bg-white h-screen flex flex-col">
               {/* Usar uma variação da Sidebar para o mobile se necessário, ou reutilizar o layout mas sem absolute */}
               <SidebarMobile />
            </div>
          </SheetContent>
        </Sheet>
        
        <h1 className="font-semibold text-gray-900">{pageName}</h1>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />
        <div className="md:hidden">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  )
}

function SidebarMobile() {
  // Uma cópia simplificada da Sidebar apenas para o mobile Sheet
  return (
    <>
      <div className="p-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-verde-primario text-white flex items-center justify-center font-bold text-sm">
          N
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-verde-primario leading-tight">NutriFlow</span>
          <span className="text-[11px] text-gray-500 leading-tight">by TechForja</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {/* Usaria o navItems novamente aqui, para simplificar vamos apenas avisar */}
        <div className="text-sm text-gray-500 px-3 py-2">
          Navegue pelo menu
        </div>
      </nav>
    </>
  )
}
