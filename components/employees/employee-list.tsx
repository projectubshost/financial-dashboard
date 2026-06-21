"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2 } from "lucide-react"
import type { Employee } from "@/lib/types"
import { AddEmployeeDialog } from "./add-employee-dialog"
import { EditEmployeeDialog } from "./edit-employee-dialog"
import { DeleteEmployeeDialog } from "./delete-employee-dialog"
import { Users } from "lucide-react" // Import Users component

interface EmployeeListProps {
  employees: Employee[]
  isAdmin: boolean
}

export function EmployeeList({ employees, isAdmin }: EmployeeListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null)
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Employees</CardTitle>
            <CardDescription>
              {employees.length} total employee{employees.length !== 1 ? "s" : ""}
            </CardDescription>
          </div>
          {isAdmin && (
            <Button onClick={() => setIsAddDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {employees.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-gray-900">No employees yet</h3>
              <p className="mb-4 text-sm text-gray-600">Get started by adding your first employee</p>
              {isAdmin && (
                <Button onClick={() => setIsAddDialogOpen(true)} className="bg-emerald-600 hover:bg-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Employee
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead>Status</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell className="font-medium">{employee.full_name}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell>{formatCurrency(employee.salary)}</TableCell>
                      <TableCell>{formatDate(employee.hire_date)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={employee.status === "active" ? "default" : "secondary"}
                          className={
                            employee.status === "active" ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-100" : ""
                          }
                        >
                          {employee.status}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingEmployee(employee)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeletingEmployee(employee)}>
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddEmployeeDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />

      {editingEmployee && (
        <EditEmployeeDialog
          employee={editingEmployee}
          open={!!editingEmployee}
          onOpenChange={(open) => !open && setEditingEmployee(null)}
        />
      )}

      {deletingEmployee && (
        <DeleteEmployeeDialog
          employee={deletingEmployee}
          open={!!deletingEmployee}
          onOpenChange={(open) => !open && setDeletingEmployee(null)}
        />
      )}
    </>
  )
}
