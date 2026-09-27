import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ReportsView } from "@/components/reports/reports-view"

export default async function ReportsPage() {
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
    supabase
      .from("profiles")
      .select("full_name, email, role")
      .eq("id", claims.sub)
      .maybeSingle(),
    supabase
      .from("employees")
      .select("full_name, position, salary, hire_date, status")
      .order("hire_date", { ascending: false }),
    supabase
      .from("sales")
      .select("id, description, amount, sale_date, category")
      .order("sale_date", { ascending: false }),
    supabase
      .from("expenses")
      .select("id, description, amount, expense_date, category")
      .order("expense_date", { ascending: false }),
  ])

  return (
    <DashboardLayout profile={profileResult.data}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Reports &amp; Export</h1>
          <p className="mt-2 text-sm text-gray-600">Generate reports and export data for analysis</p>
        </div>
        <ReportsView
          employees={employeesResult.data || []}
          sales={salesResult.data || []}
          expenses={expensesResult.data || []}
        />
      </div>
    </DashboardLayout>
  )
}
