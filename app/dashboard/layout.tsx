import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { Suspense } from 'react'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        <Suspense fallback={<div className="h-16 bg-white border-b border-gray-200"></div>}>
          <Header />
        </Suspense>
        <main className="flex-1 p-6 max-w-[1200px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
