import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { EmployeeList } from "@/components/employees/employee-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

export default async function EmployeesPage() {
  const supabase = await createClient()
  const {
    data,
    error,
  } = await supabase.auth.getClaims()
  const claims = data?.claims

  if (error || !claims?.sub) {
    redirect("/auth/login")
  }

  const [profileResult, employeesResult] = await Promise.all([
    supabase.from("profiles").select("full_name, email, role").eq("id", claims.sub).maybeSingle(),
    supabase
      .from("employees")
      .select("id, user_id, full_name, position, salary, hire_date, status, created_at, updated_at")
      .order("created_at", { ascending: false }),
  ])
  const profile = profileResult.data
  const employees = employeesResult.data
  const isAdmin = profile?.role === "admin"

  if (isAdmin) {

    return (
      <DashboardLayout profile={profile}>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Employee Management</h1>
            <p className="mt-2 text-sm text-gray-600">Manage employee records and salary information</p>
          </div>
          <EmployeeList employees={employees || []} isAdmin />
        </div>
      </DashboardLayout>
    )
  }

  const count = employees?.filter((employee) => employee.status === "active").length ?? 0

  return (
    <DashboardLayout profile={profile}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Employees</h1>
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
                <Users className="size-8 text-emerald-600" aria-hidden="true" />
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
