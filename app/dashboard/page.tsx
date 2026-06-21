import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch all data for dashboard
  const [employeesResult, salesResult, expensesResult] = await Promise.all([
    supabase.from("employees").select("*"),
    supabase.from("sales").select("*"),
    supabase.from("expenses").select("*"),
  ])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">Overview of your business metrics and performance</p>
        </div>
        <DashboardOverview
          employees={employeesResult.data || []}
          sales={salesResult.data || []}
          expenses={expensesResult.data || []}
        />
      </div>
    </DashboardLayout>
  )
}
