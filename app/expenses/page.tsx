import { Suspense } from "react"
import { ArrowUpDown } from "lucide-react"
import dayjs from "dayjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddExpenseDialog } from "@/components/add-expense-dialog"
import { EditTransactionDialog } from "@/components/edit-transaction-dialog"

// Sample data - in a real app, this would come from your database
const expenseData = [
  {
    id: "1",
    date: "2023-06-03",
    description: "Grocery Shopping",
    category: "Groceries",
    amount: 120.5,
    account: "Credit Card",
  },
  {
    id: "2",
    date: "2023-06-05",
    description: "Rent Payment",
    category: "Housing",
    amount: 1200.0,
    account: "Checking Account",
  },
  {
    id: "3",
    date: "2023-06-07",
    description: "Netflix Subscription",
    category: "Entertainment",
    amount: 15.99,
    account: "Credit Card",
  },
  {
    id: "4",
    date: "2023-06-10",
    description: "Gas",
    category: "Transportation",
    amount: 45.0,
    account: "Credit Card",
  },
  {
    id: "5",
    date: "2023-06-15",
    description: "Electricity Bill",
    category: "Utilities",
    amount: 85.75,
    account: "Checking Account",
  },
]

export default function ExpensesPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Expenses</h2>
          <div className="flex items-center space-x-2">
            <AddExpenseDialog />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Expense Transactions</CardTitle>
            <CardDescription>Manage and track all your expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <div className="overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="hidden md:table-cell">Category</TableHead>
                      <TableHead className="hidden md:table-cell">Account</TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Amount
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {expenseData.map((expense) => (
                      <TableRow key={expense.id} className="hover:bg-red-50 dark:hover:bg-red-950/20">
                        <TableCell>{dayjs(expense.date).format("MMM D, YYYY")}</TableCell>
                        <TableCell className="font-medium">{expense.description}</TableCell>
                        <TableCell className="hidden md:table-cell">{expense.category}</TableCell>
                        <TableCell className="hidden md:table-cell">{expense.account}</TableCell>
                        <TableCell className="font-medium text-red-600 dark:text-red-400">
                          ${expense.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <EditTransactionDialog
                            transaction={{
                              id: expense.id,
                              amount: expense.amount,
                              type: "expense",
                              description: expense.description,
                              category: expense.category,
                              date: expense.date,
                              icon: "🛒",
                              account: expense.account,
                            }}
                          />
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
