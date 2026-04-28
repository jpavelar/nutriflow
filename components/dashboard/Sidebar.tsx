"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Send, Settings } from 'lucide-react'
import { UserButton } from '@clerk/nextjs'

const navItems = [
  { icon: LayoutDashboard, label: 'Visão geral', href: '/dashboard' },
  { icon: Users, label: 'Pacientes', href: '/dashboard/pacientes' },
  { icon: FileText, label: 'Anamnese', href: '/dashboard/anamnese' },
  { icon: Send, label: 'Planos Alimentares', href: '/dashboard/planos' },
  { icon: Settings, label: 'Configurações', href: '/dashboard/configuracoes' },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-60 bg-white border-r border-gray-200 h-screen flex flex-col hidden md:flex fixed left-0 top-0">
      {/* Topo - Logo */}
      <div className="p-5 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-verde-primario text-white flex items-center justify-center font-bold text-sm">
          N
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-verde-primario leading-tight">NutriFlow</span>
          <span className="text-[11px] text-gray-500 leading-tight">by TechForja</span>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/dashboard')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                isActive
                  ? 'bg-verde-claro text-verde-primario font-medium border-l-[3px] border-verde-primario pl-[9px]'
                  : 'text-gray-600 hover:bg-gray-50 border-l-[3px] border-transparent pl-[9px]'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Rodapé */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
          </div>
          <span className="inline-block px-2 py-1 bg-verde-claro text-verde-escuro text-[10px] font-bold rounded-full uppercase tracking-wider">
            Essencial
          </span>
        </div>
      </div>
    </div>
  )
}
