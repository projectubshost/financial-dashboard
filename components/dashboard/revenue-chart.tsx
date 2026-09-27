"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { SaleRecord, ExpenseRecord } from "@/lib/types"

interface RevenueChartProps {
  sales: SaleRecord[]
  expenses: ExpenseRecord[]
}

export function RevenueChart({ sales, expenses }: RevenueChartProps) {
  const monthlyTotals = new Map<string, { revenue: number; expenses: number }>()

  for (const sale of sales) {
    const monthKey = sale.sale_date.slice(0, 7)
    const totals = monthlyTotals.get(monthKey) ?? { revenue: 0, expenses: 0 }
    totals.revenue += sale.amount
    monthlyTotals.set(monthKey, totals)
  }

  for (const expense of expenses) {
    const monthKey = expense.expense_date.slice(0, 7)
    const totals = monthlyTotals.get(monthKey) ?? { revenue: 0, expenses: 0 }
    totals.expenses += expense.amount
    monthlyTotals.set(monthKey, totals)
  }

  const now = new Date()
  const monthsData = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const totals = monthlyTotals.get(monthKey) ?? { revenue: 0, expenses: 0 }

    return {
      month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
      revenue: Math.round(totals.revenue),
      expenses: Math.round(totals.expenses),
      profit: Math.round(totals.revenue - totals.expenses),
    }
  })

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
              formatter={(value) =>
                new Intl.NumberFormat("en-IN", {
                  style: "currency",
                  currency: "INR",
                }).format(Number(value ?? 0))
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
