import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ReportsView } from "@/components/reports/reports-view"

export default async function ReportsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch all data for reports
  const [employeesResult, salesResult, expensesResult] = await Promise.all([
    supabase.from("employees").select("*").order("created_at", { ascending: false }),
    supabase.from("sales").select("*").order("sale_date", { ascending: false }),
    supabase.from("expenses").select("*").order("expense_date", { ascending: false }),
  ])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Export</h1>
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
