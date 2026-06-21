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

  console.log("[v0] Fetching profile for user:", user.id)

  // Fetch user profile to check role
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()

  console.log("[v0] Profile data:", profile)

  const isAdmin = profile?.role === "admin"

  if (isAdmin) {
    const { data: employees, error: employeesError } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false })

    console.log("[v0] Employees data:", { count: employees?.length || 0, employees, error: employeesError })

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
    const { count, error: countError } = await supabase.from("employees").select("*", { count: "exact", head: true })

    console.log("[v0] Employee count:", { count, error: countError })

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
              <CardDescription>Current number of employees in the organization</CardDescription>
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
