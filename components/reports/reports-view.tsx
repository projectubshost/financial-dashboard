"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Download, FileText, Users, TrendingUp, Receipt } from "lucide-react"
import type { EmployeeReportRecord, SaleReportRecord, ExpenseReportRecord } from "@/lib/types"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ReportsViewProps {
  employees: EmployeeReportRecord[]
  sales: SaleReportRecord[]
  expenses: ExpenseReportRecord[]
}

type DateRange = "all" | "month" | "quarter" | "year" | "custom"
type CsvValue = string | number | null | undefined
type CsvRow = Record<string, CsvValue>

function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

export function ReportsView({ employees, sales, expenses }: ReportsViewProps) {
  const [dateRange, setDateRange] = useState<DateRange>("all")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR", // Changed from USD to INR
    }).format(amount)
  }

  const filterByDate = <T extends { sale_date?: string; expense_date?: string; hire_date?: string }>(
    items: T[],
    dateField: "sale_date" | "expense_date" | "hire_date",
  ): T[] => {
    if (dateRange === "all") return items

    const now = new Date()
    let firstDay: Date

    switch (dateRange) {
      case "month":
        firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case "quarter":
        firstDay = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        break
      case "year":
        firstDay = new Date(now.getFullYear(), 0, 1)
        break
      case "custom":
        if (!startDate || !endDate || startDate > endDate) return []
        return items.filter((item) => {
          const itemDate = item[dateField]?.slice(0, 10)
          return Boolean(itemDate && itemDate >= startDate && itemDate <= endDate)
        })
      default:
        return items
    }

    const firstDayKey = toDateKey(firstDay)
    const todayKey = toDateKey(now)

    return items.filter((item) => {
      const itemDate = item[dateField]?.slice(0, 10)
      return Boolean(itemDate && itemDate >= firstDayKey && itemDate <= todayKey)
    })
  }

  const filteredSales = filterByDate(sales, "sale_date")
  const filteredExpenses = filterByDate(expenses, "expense_date")
  const isCustomRangeValid = dateRange !== "custom" || Boolean(startDate && endDate && startDate <= endDate)

  const exportToCSV = (data: CsvRow[], filename: string, headers: string[]) => {
    const escapeCell = (value: CsvValue) => {
      const cellValue = value == null ? "" : String(value)
      const firstVisibleCharacter = typeof value === "string" ? value.trimStart().slice(0, 1) : ""
      const isSpreadsheetFormula = ["=", "+", "-", "@"].includes(firstVisibleCharacter)
      const safeValue = isSpreadsheetFormula ? `'${cellValue}` : cellValue
      return `"${safeValue.replace(/"/g, '""')}"`
    }
    const csvContent = [
      headers.map(escapeCell).join(","),
      ...data.map((row) => headers.map((header) => escapeCell(row[header.toLowerCase().replace(/ /g, "_")])).join(",")),
    ].join("\r\n")

    const blob = new Blob([`\uFEFF${csvContent}`], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = `${filename}_${toDateKey(new Date())}.csv`
    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
  }

  const exportEmployees = () => {
    const data = employees.map((emp) => ({
      full_name: emp.full_name,
      position: emp.position,
      salary: emp.salary,
      hire_date: emp.hire_date,
      status: emp.status,
    }))
    exportToCSV(data, "employees", ["Full Name", "Position", "Salary", "Hire Date", "Status"])
  }

  const exportSales = () => {
    const data = filteredSales.map((sale) => ({
      sale_date: sale.sale_date,
      description: sale.description,
      category: sale.category || "Uncategorized",
      amount: sale.amount,
    }))
    exportToCSV(data, "sales", ["Sale Date", "Description", "Category", "Amount"])
  }

  const exportExpenses = () => {
    const data = filteredExpenses.map((expense) => ({
      expense_date: expense.expense_date,
      description: expense.description,
      category: expense.category,
      amount: expense.amount,
    }))
    exportToCSV(data, "expenses", ["Expense Date", "Description", "Category", "Amount"])
  }

  const exportFinancialSummary = () => {
    const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.amount, 0)
    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const netProfit = totalRevenue - totalExpenses

    const data = [
      { metric: "Total Revenue", amount: totalRevenue },
      { metric: "Total Expenses", amount: totalExpenses },
      { metric: "Net Profit", amount: netProfit },
      { metric: "Number of Sales", amount: filteredSales.length },
      { metric: "Number of Expenses", amount: filteredExpenses.length },
      { metric: "Active Employees", amount: employees.filter((e) => e.status === "active").length },
    ]
    exportToCSV(data, "financial_summary", ["Metric", "Amount"])
  }

  const totalRevenue = filteredSales.reduce((sum, sale) => sum + sale.amount, 0)
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const netProfit = totalRevenue - totalExpenses

  return (
    <div className="space-y-6">
      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Report Filters</CardTitle>
          <CardDescription>Select date range for financial reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="dateRange">Date Range</Label>
              <Select value={dateRange} onValueChange={(value) => setDateRange(value as DateRange)}>
                <SelectTrigger id="dateRange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                  <SelectItem value="year">This Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {dateRange === "custom" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    max={endDate || undefined}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    min={startDate || undefined}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
          {dateRange === "custom" && !isCustomRangeValid && (
            <p className="mt-3 text-sm text-destructive" role="status">
              Choose a valid start and end date to filter and export financial data.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</div>
            <p className="mt-1 text-xs text-gray-600">{filteredSales.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Expenses</CardTitle>
            <Receipt className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
            <p className="mt-1 text-xs text-gray-600">{filteredExpenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Net Profit</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netProfit >= 0 ? "text-primary" : "text-red-600"}`}>
              {formatCurrency(netProfit)}
            </div>
            <p className="mt-1 text-xs text-gray-600">{netProfit >= 0 ? "Profitable" : "Operating at loss"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>Download reports in CSV format for further analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="financial" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="financial">Financial Reports</TabsTrigger>
              <TabsTrigger value="hr">HR Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="financial" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <TrendingUp className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Sales Report</CardTitle>
                        <CardDescription className="text-xs">Export all sales transactions</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={exportSales} className="w-full" disabled={!isCustomRangeValid}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Sales ({filteredSales.length})
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                        <Receipt className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Expenses Report</CardTitle>
                        <CardDescription className="text-xs">Export all expense records</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={exportExpenses} className="w-full" disabled={!isCustomRangeValid}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Expenses ({filteredExpenses.length})
                    </Button>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">Financial Summary</CardTitle>
                        <CardDescription className="text-xs">Export comprehensive financial overview</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button onClick={exportFinancialSummary} className="w-full" disabled={!isCustomRangeValid}>
                      <Download className="mr-2 h-4 w-4" />
                      Export Summary Report
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="hr" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                      <Users className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base">Employee Report</CardTitle>
                      <CardDescription className="text-xs">
                        Export all employee records and payroll data
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button onClick={exportEmployees} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export Employees ({employees.length})
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
