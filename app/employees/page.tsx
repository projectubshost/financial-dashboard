import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EmployeeList } from "@/components/employees/employee-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default async function EmployeesPage() {
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

  const isAdmin = profile?.role === "admin"

  if (isAdmin) {
    const { data: employees } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false })

    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employee Management</h1>
            <p className="mt-2 text-sm text-gray-600">Manage employee records and salary information</p>
          </div>
          <EmployeeList employees={employees || []} isAdmin={true} />
        </div>
      </DashboardLayout>
    )
  } else {
    const { count } = await supabase
      .from("employees")
      .select("*", { count: "exact", head: true })
      .eq("status", "active")

    return (
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
            <p className="mt-2 text-sm text-gray-600">View employee statistics</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Total Employees</CardTitle>
              <CardDescription>Current number of active employees in the organization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-emerald-100 p-3">
                  <Users className="h-8 w-8 text-emerald-600" />
                </div>
                <div>
                  <p className="text-4xl font-bold text-gray-900">{count || 0}</p>
                  <p className="text-sm text-gray-600">Active employees</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }
}
