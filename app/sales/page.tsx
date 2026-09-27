import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SalesList } from "@/components/sales/sales-list"

export default async function SalesPage() {
  const supabase = await createClient()
  const {
    data,
    error,
  } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (error || !claims?.sub) {
    redirect("/auth/login")
  }

  const [profileResult, salesResult] = await Promise.all([
    supabase.from("profiles").select("full_name, email, role").eq("id", claims.sub).maybeSingle(),
    supabase.from("sales").select("id, description, amount, sale_date, category").order("sale_date", { ascending: false }),
  ])

  return (
    <DashboardLayout profile={profileResult.data}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Sales Tracking</h1>
          <p className="mt-2 text-sm text-gray-600">Record and manage sales transactions</p>
        </div>
        <SalesList sales={salesResult.data || []} isAdmin={profileResult.data?.role === "admin"} userId={claims.sub} />
      </div>
    </DashboardLayout>
  )
}
