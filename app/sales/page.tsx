import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { SalesList } from "@/components/sales/sales-list"

export default async function SalesPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile to check role
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  // Fetch all sales
  const { data: sales } = await supabase.from("sales").select("*").order("sale_date", { ascending: false })

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Tracking</h1>
          <p className="mt-2 text-sm text-gray-600">Record and manage sales transactions</p>
        </div>
        <SalesList sales={sales || []} isAdmin={profile?.role === "admin"} userId={user.id} />
      </div>
    </DashboardLayout>
  )
}
