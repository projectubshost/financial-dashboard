"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, TrendingUp } from "lucide-react"
import type { Sale } from "@/lib/types"
import { AddSaleDialog } from "./add-sale-dialog"
import { EditSaleDialog } from "./edit-sale-dialog"
import { DeleteSaleDialog } from "./delete-sale-dialog"

interface SalesListProps {
  sales: Sale[]
  isAdmin: boolean
  userId: string
}

export function SalesList({ sales, isAdmin, userId }: SalesListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingSale, setEditingSale] = useState<Sale | null>(null)
  const [deletingSale, setDeletingSale] = useState<Sale | null>(null)

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

  const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0)

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Total Sales</CardTitle>
            <CardDescription>All time revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{formatCurrency(totalSales)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Transactions</CardTitle>
            <CardDescription>Number of sales recorded</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{sales.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sales Records</CardTitle>
            <CardDescription>View and manage all sales transactions</CardDescription>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Sale
          </Button>
        </CardHeader>
        <CardContent>
          {sales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <TrendingUp className="mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-semibold text-foreground">No sales yet</h3>
              <p className="mb-4 text-sm text-gray-600">Start tracking your revenue by adding your first sale</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Sale
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    {isAdmin && <TableHead className="text-right">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{formatDate(sale.sale_date)}</TableCell>
                      <TableCell className="font-medium">{sale.description}</TableCell>
                      <TableCell>
                        {sale.category ? (
                          <Badge variant="outline" className="border-primary/20 text-primary">
                            {sale.category}
                          </Badge>
                        ) : (
                          <span className="text-sm text-gray-400">Uncategorized</span>
                        )}
                      </TableCell>
                      <TableCell className="font-semibold text-primary">{formatCurrency(sale.amount)}</TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setEditingSale(sale)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeletingSale(sale)}>
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

      <AddSaleDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} userId={userId} />

      {editingSale && (
        <EditSaleDialog
          sale={editingSale}
          open={!!editingSale}
          onOpenChange={(open) => !open && setEditingSale(null)}
        />
      )}

      {deletingSale && (
        <DeleteSaleDialog
          sale={deletingSale}
          open={!!deletingSale}
          onOpenChange={(open) => !open && setDeletingSale(null)}
        />
      )}
    </>
  )
}
