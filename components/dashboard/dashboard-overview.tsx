"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Receipt, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { Employee, Sale, Expense } from "@/lib/types"
import { RevenueChart } from "./revenue-chart"
import { ExpensesByCategoryChart } from "./expenses-by-category-chart"
import { RecentTransactions } from "./recent-transactions"

interface DashboardOverviewProps {
  employees: Employee[]
  sales: Sale[]
  expenses: Expense[]
}

export function DashboardOverview({ employees, sales, expenses }: DashboardOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Calculate metrics
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0)
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const netProfit = totalRevenue - totalExpenses
  const activeEmployees = employees.filter((emp) => emp.status === "active").length
  const totalPayroll = employees.filter((emp) => emp.status === "active").reduce((sum, emp) => sum + emp.salary, 0)

  // Calculate month-over-month changes (simplified - comparing last 30 days to previous 30 days)
  const now = new Date()
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  const recentSales = sales.filter((s) => new Date(s.sale_date) >= thirtyDaysAgo)
  const previousSales = sales.filter(
    (s) => new Date(s.sale_date) >= sixtyDaysAgo && new Date(s.sale_date) < thirtyDaysAgo,
  )

  const recentRevenue = recentSales.reduce((sum, sale) => sum + sale.amount, 0)
  const previousRevenue = previousSales.reduce((sum, sale) => sum + sale.amount, 0)
  const revenueChange = previousRevenue > 0 ? ((recentRevenue - previousRevenue) / previousRevenue) * 100 : 0

  const recentExpenses = expenses.filter((e) => new Date(e.expense_date) >= thirtyDaysAgo)
  const previousExpenses = expenses.filter(
    (e) => new Date(e.expense_date) >= sixtyDaysAgo && new Date(e.expense_date) < thirtyDaysAgo,
  )

  const recentExpenseTotal = recentExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const previousExpenseTotal = previousExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const expenseChange =
    previousExpenseTotal > 0 ? ((recentExpenseTotal - previousExpenseTotal) / previousExpenseTotal) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</div>
            <div className="mt-1 flex items-center text-xs">
              {revenueChange >= 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-3 w-3 text-blue-600" />
                  <span className="font-medium text-blue-600">+{revenueChange.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-600" />
                  <span className="font-medium text-red-600">{revenueChange.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1 text-gray-600">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</div>
            <div className="mt-1 flex items-center text-xs">
              {expenseChange >= 0 ? (
                <>
                  <ArrowUpRight className="mr-1 h-3 w-3 text-red-600" />
                  <span className="font-medium text-red-600">+{expenseChange.toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="mr-1 h-3 w-3 text-blue-600" />
                  <span className="font-medium text-blue-600">{expenseChange.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1 text-gray-600">vs last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-blue-600" : "text-red-600"}`}>
              {formatCurrency(netProfit)}
            </div>
            <p className="mt-1 text-xs text-gray-600">{netProfit >= 0 ? "Profitable" : "Operating at loss"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{activeEmployees}</div>
            <p className="mt-1 text-xs text-gray-600">Annual payroll: {formatCurrency(totalPayroll)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueChart sales={sales} expenses={expenses} />
        <ExpensesByCategoryChart expenses={expenses} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions sales={sales} expenses={expenses} />
    </div>
  )
}
