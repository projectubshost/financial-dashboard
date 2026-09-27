import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ExpensesList } from "@/components/expenses/expenses-list"

export default async function ExpensesPage() {
  const supabase = await createClient()
  const {
    data,
    error,
  } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (error || !claims?.sub) {
    redirect("/auth/login")
  }

  const [profileResult, expensesResult] = await Promise.all([
    supabase.from("profiles").select("full_name, email, role").eq("id", claims.sub).maybeSingle(),
    supabase
      .from("expenses")
      .select("id, description, amount, expense_date, category")
      .order("expense_date", { ascending: false }),
  ])

  return (
    <DashboardLayout profile={profileResult.data}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Expense Tracking</h1>
          <p className="mt-2 text-sm text-gray-600">Record and manage business expenses</p>
        </div>
        <ExpensesList expenses={expensesResult.data || []} isAdmin={profileResult.data?.role === "admin"} userId={claims.sub} />
      </div>
    </DashboardLayout>
  )
}
