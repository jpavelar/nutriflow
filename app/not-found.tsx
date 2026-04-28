import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-creme flex flex-col items-center justify-center p-4">
      <div className="mb-6 text-center flex flex-col items-center">
        <div className="flex items-baseline space-x-2 mb-2">
          <span className="text-verde-primario text-3xl font-bold">NutriFlow</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2">404 — Página não encontrada</h2>
        <p className="text-gray-600 max-w-md text-center mb-8">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link href="/" className="bg-verde-primario text-white px-6 py-3 rounded-lg font-medium hover:bg-verde-escuro transition-colors">
          Voltar ao início
        </Link>
      </div>
    </div>
  )
}
