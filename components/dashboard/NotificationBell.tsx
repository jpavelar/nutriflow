"use client"

import { useState, useEffect } from 'react'
import { Bell, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'
import { toast } from 'sonner'

interface Notification {
  id: string
  patientId: string
  patientName: string
  message: string
  createdAt: string
  type: 'fallback' | 'system'
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  const fetchNotifications = async () => {
    try {
      const res = await fetch('/api/notifications')
      if (res.ok) {
        const data = await res.json()
        setNotifications(data)
      }
    } catch (e) {
      console.error('Erro ao buscar notificações:', e)
    }
  }

  useEffect(() => {
    setMounted(true)
    fetchNotifications()
    // Polling a cada 30 segundos para novas notificações
    const interval = setInterval(fetchNotifications, 30000)
    return () => clearInterval(interval)
  }, [])


  if (!mounted) {
    return (
      <button className="text-gray-400 p-1">
        <Bell size={20} />
      </button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="text-gray-400 hover:text-gray-600 relative p-1 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={20} />
          {notifications.length > 0 && (
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-laranja rounded-full border-2 border-white animate-pulse"></span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 mr-4 max-h-[500px] overflow-y-auto" align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="flex items-center justify-between sticky top-0 bg-popover z-10">
            Notificações
            {notifications.length > 0 && (
              <span className="text-[10px] bg-laranja/10 text-laranja px-2 py-0.5 rounded-full">
                {notifications.length} pendentes
              </span>
            )}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-500">
              <CheckCircle2 className="mx-auto mb-2 text-gray-300" size={24} />
              Tudo em ordem por aqui!
            </div>
          ) : (
            notifications.map((notif) => (
              <DropdownMenuItem key={notif.id} className="p-0 focus:bg-transparent">
                <Link 
                  href={`/dashboard/pacientes/${notif.patientId}`}
                  className="w-full p-4 flex gap-3 hover:bg-gray-50 transition-colors group"
                >
                  <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    notif.type === 'fallback' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {notif.type === 'fallback' ? <AlertTriangle size={16} /> : <MessageSquare size={16} />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-bold text-gray-900 group-hover:text-verde-primario transition-colors">
                      {notif.patientName}
                    </p>
                    <p className="text-xs text-gray-600 line-clamp-2 italic">
                      "{notif.message}"
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-gray-400">
                        {formatDistanceToNow(new Date(notif.createdAt), { addSuffix: true, locale: ptBR })}
                      </span>
                    </div>
                  </div>
                </Link>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <Link 
              href="/dashboard/pacientes?filter=fallback"
              className="w-full p-2 text-center text-xs font-medium text-gray-500 hover:text-verde-primario block"
            >
              Ver todos os alertas
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
