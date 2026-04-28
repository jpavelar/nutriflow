import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-6 flex flex-col items-center sm:items-start w-full">
      <div className="space-y-2 mb-4 w-full">
        <Skeleton className="h-8 w-[300px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 h-32">
            <Skeleton className="h-4 w-20 mb-4" />
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-3 w-24" />
          </div>
        ))}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 w-full">
        <div className="bg-white p-6 rounded-xl border border-gray-200 h-80 w-full">
           <Skeleton className="h-6 w-40 mb-6" />
           <div className="space-y-4">
             {[1, 2, 3].map(j => <Skeleton key={j} className="h-12 w-full" />)}
           </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 h-80 w-full">
           <Skeleton className="h-6 w-40 mb-6" />
           <div className="space-y-4">
             {[1, 2, 3].map(j => <Skeleton key={j} className="h-12 w-full" />)}
           </div>
        </div>
      </div>
    </div>
  )
}
