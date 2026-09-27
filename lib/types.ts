export interface Profile {
  id: string
  email: string
  full_name: string
  role: "admin" | "employee"
  created_at: string
  updated_at: string
}

export interface Employee {
  id: string
  user_id: string | null
  full_name: string
  position: string
  salary: number
  hire_date: string
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export type EmployeeMetric = Pick<Employee, "status" | "salary">
export type EmployeeReportRecord = Pick<Employee, "full_name" | "position" | "salary" | "hire_date" | "status">

export interface Sale {
  id: string
  description: string
  amount: number
  sale_date: string
  category: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export type SaleRecord = Pick<Sale, "id" | "description" | "amount" | "sale_date" | "category">

export interface Expense {
  id: string
  description: string
  amount: number
  expense_date: string
  category: string
  created_by: string | null
  created_at: string
  updated_at: string
}

export type ExpenseRecord = Pick<Expense, "id" | "description" | "amount" | "expense_date" | "category">
export type ExpenseReportRecord = Pick<Expense, "description" | "amount" | "expense_date" | "category">
export type SaleReportRecord = Pick<Sale, "description" | "amount" | "sale_date" | "category">
