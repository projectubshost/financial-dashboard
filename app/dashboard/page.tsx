import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { DashboardOverview } from "@/components/dashboard/dashboard-overview"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data,
    error,
  } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (error || !claims?.sub) {
    redirect("/auth/login")
  }

  const [profileResult, employeesResult, salesResult, expensesResult] = await Promise.all([
    supabase.from("profiles").select("full_name, email, role").eq("id", claims.sub).maybeSingle(),
    supabase.from("employees").select("status, salary"),
    supabase.from("sales").select("id, description, amount, sale_date, category"),
    supabase.from("expenses").select("id, description, amount, expense_date, category"),
  ])

  return (
    <DashboardLayout profile={profileResult.data}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Dashboard</h1>
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
