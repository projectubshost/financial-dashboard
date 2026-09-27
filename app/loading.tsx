import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <main aria-busy="true" aria-label="Loading page" className="mx-auto w-full max-w-6xl p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-72 rounded-xl" />
        <Skeleton className="h-72 rounded-xl" />
      </div>
    </main>
  )
}
