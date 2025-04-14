import { Suspense } from "react"
import dayjs from "dayjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddBudgetDialog } from "@/components/add-budget-dialog"
import { EditBudgetDialog } from "@/components/edit-budget-dialog"

// Sample data - in a real app, this would come from your database
const budgetsData = [
  {
    id: "1",
    name: "Groceries",
    amount: 500,
    spent: 320.5,
    period: "Monthly",
    category: "Groceries",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    color: "#10b981",
  },
  {
    id: "2",
    name: "Entertainment",
    amount: 200,
    spent: 150.75,
    period: "Monthly",
    category: "Entertainment",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    color: "#f59e0b",
  },
  {
    id: "3",
    name: "Transportation",
    amount: 300,
    spent: 210.25,
    period: "Monthly",
    category: "Transportation",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    color: "#ef4444",
  },
  {
    id: "4",
    name: "Dining Out",
    amount: 250,
    spent: 180.5,
    period: "Monthly",
    category: "Food & Dining",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    color: "#8b5cf6",
  },
  {
    id: "5",
    name: "Utilities",
    amount: 400,
    spent: 350.75,
    period: "Monthly",
    category: "Utilities",
    startDate: "2023-06-01",
    endDate: "2023-06-30",
    color: "#3b82f6",
  },
]

export default function BudgetsPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Budgets</h2>
          <div className="flex items-center space-x-2">
            <AddBudgetDialog />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Budget Management</CardTitle>
            <CardDescription>Create and manage budgets to control your spending.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="hidden md:table-cell">Period</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {budgetsData.map((budget) => (
                      <TableRow key={budget.id} className="hover:bg-cyan-50 dark:hover:bg-cyan-950/20">
                        <TableCell className="font-medium">{budget.name}</TableCell>
                        <TableCell className="hidden md:table-cell">{budget.category}</TableCell>
                        <TableCell className="hidden md:table-cell">
                          {dayjs(budget.startDate).format("MMM D")} - {dayjs(budget.endDate).format("MMM D")}
                        </TableCell>
                        <TableCell>${budget.amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <div className="w-full md:w-40 space-y-1">
                            <div className="flex text-xs justify-between">
                              <span>${budget.spent.toFixed(2)} spent</span>
                              <span>{Math.round((budget.spent / budget.amount) * 100)}%</span>
                            </div>
                            <Progress
                              value={(budget.spent / budget.amount) * 100}
                              className="h-2"
                              indicatorClassName={
                                budget.spent > budget.amount
                                  ? "bg-red-500"
                                  : budget.spent / budget.amount > 0.8
                                    ? "bg-amber-500"
                                    : "bg-emerald-500"
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <EditBudgetDialog budget={budget} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
