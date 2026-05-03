"use client"

import { useEffect, useRef } from 'react'

export function SyncUser() {
  const syncing = useRef(false)

  useEffect(() => {
    const sync = async () => {
      if (syncing.current) return
      
      try {
        // Verifica se já sincronizou nesta sessão para não sobrecarregar
        const alreadySynced = sessionStorage.getItem('nutriflow_synced')
        if (alreadySynced) return

        syncing.current = true
        const res = await fetch('/api/auth/sync', { method: 'POST' })
        if (res.ok) {
          sessionStorage.setItem('nutriflow_synced', 'true')
          console.log('Usuário sincronizado com sucesso')
        }
      } catch (error) {
        console.error('Falha na sincronização do usuário')
      } finally {
        syncing.current = false
      }
    }

    sync()
  }, [])

  return null
}
