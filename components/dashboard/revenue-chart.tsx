"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Sale, Expense } from "@/lib/types"

interface RevenueChartProps {
  sales: Sale[]
  expenses: Expense[]
}

export function RevenueChart({ sales, expenses }: RevenueChartProps) {
  // Group data by month for the last 6 months
  const now = new Date()
  const monthsData = []

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthName = date.toLocaleDateString("en-US", { month: "short" })
    const year = date.getFullYear()

    const monthSales = sales.filter((sale) => {
      const saleDate = new Date(sale.sale_date)
      return saleDate.getMonth() === date.getMonth() && saleDate.getFullYear() === date.getFullYear()
    })

    const monthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.expense_date)
      return expenseDate.getMonth() === date.getMonth() && expenseDate.getFullYear() === date.getFullYear()
    })

    const revenue = monthSales.reduce((sum, sale) => sum + sale.amount, 0)
    const expense = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0)

    monthsData.push({
      month: `${monthName} ${year}`,
      revenue: Math.round(revenue),
      expenses: Math.round(expense),
      profit: Math.round(revenue - expense),
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue vs Expenses</CardTitle>
        <CardDescription>Last 6 months comparison</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthsData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis dataKey="month" className="text-xs" />
            <YAxis className="text-xs" />
            <Tooltip
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
              }}
              formatter={(value: number) =>
                new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(value)
              }
            />
            <Legend />
            <Bar dataKey="revenue" fill="#2563eb" name="Revenue" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
