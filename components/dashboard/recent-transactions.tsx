"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import type { Sale, Expense } from "@/lib/types"

interface RecentTransactionsProps {
  sales: Sale[]
  expenses: Expense[]
}

type Transaction = {
  id: string
  type: "sale" | "expense"
  description: string
  amount: number
  date: string
  category?: string | null
}

export function RecentTransactions({ sales, expenses }: RecentTransactionsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Combine and sort transactions
  const transactions: Transaction[] = [
    ...sales.map((sale) => ({
      id: sale.id,
      type: "sale" as const,
      description: sale.description,
      amount: sale.amount,
      date: sale.sale_date,
      category: sale.category,
    })),
    ...expenses.map((expense) => ({
      id: expense.id,
      type: "expense" as const,
      description: expense.description,
      amount: expense.amount,
      date: expense.expense_date,
      category: expense.category,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Latest sales and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex h-[200px] items-center justify-center text-sm text-gray-500">No transactions yet</div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full ${
                      transaction.type === "sale" ? "bg-blue-100" : "bg-red-100"
                    }`}
                  >
                    {transaction.type === "sale" ? (
                      <ArrowUpRight className="h-4 w-4 text-blue-600" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-red-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-xs text-gray-600">{formatDate(transaction.date)}</p>
                      {transaction.category && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${
                            transaction.type === "sale"
                              ? "border-blue-200 text-blue-700"
                              : "border-red-200 text-red-700"
                          }`}
                        >
                          {transaction.category}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={`text-right font-semibold ${
                    transaction.type === "sale" ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {transaction.type === "sale" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
