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
