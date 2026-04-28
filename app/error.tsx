"use client"

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-creme flex flex-col items-center justify-center p-4 text-center">
      <div className="flex items-baseline space-x-2 mb-6">
        <span className="text-verde-primario text-3xl font-bold">NutriFlow</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Algo deu errado</h2>
      <p className="text-gray-600 mb-8 max-w-sm">
        Ocorreu um erro inesperado ao carregar esta página.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Tentar novamente
        </button>
        <Link 
          href="/dashboard"
          className="bg-verde-primario text-white px-6 py-3 rounded-lg font-medium hover:bg-verde-escuro transition-colors"
        >
          Voltar ao dashboard
        </Link>
      </div>
    </div>
  )
}
