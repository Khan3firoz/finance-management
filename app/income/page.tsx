import { Suspense } from "react"
import { ArrowUpDown } from "lucide-react"
import dayjs from "dayjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AddIncomeDialog } from "@/components/add-income-dialog"
import { EditTransactionDialog } from "@/components/edit-transaction-dialog"

// Sample data - in a real app, this would come from your database
const incomeData = [
  {
    id: "1",
    date: "2023-06-01",
    description: "Salary",
    category: "Employment",
    amount: 3500.0,
    account: "Checking Account",
  },
  {
    id: "2",
    date: "2023-06-10",
    description: "Freelance Work",
    category: "Self-Employment",
    amount: 500.0,
    account: "Savings Account",
  },
  {
    id: "3",
    date: "2023-06-15",
    description: "Dividend Payment",
    category: "Investment",
    amount: 120.5,
    account: "Investment Account",
  },
  {
    id: "4",
    date: "2023-06-20",
    description: "Side Project",
    category: "Self-Employment",
    amount: 350.0,
    account: "Checking Account",
  },
  {
    id: "5",
    date: "2023-06-25",
    description: "Tax Refund",
    category: "Other",
    amount: 750.0,
    account: "Checking Account",
  },
]

export default function IncomePage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Income</h2>
          <div className="flex items-center space-x-2">
            <AddIncomeDialog />
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Income Transactions</CardTitle>
            <CardDescription>Manage and track all your income sources.</CardDescription>
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
                    {incomeData.map((income) => (
                      <TableRow key={income.id} className="hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                        <TableCell>{dayjs(income.date).format("MMM D, YYYY")}</TableCell>
                        <TableCell className="font-medium">{income.description}</TableCell>
                        <TableCell className="hidden md:table-cell">{income.category}</TableCell>
                        <TableCell className="hidden md:table-cell">{income.account}</TableCell>
                        <TableCell className="font-medium text-emerald-600 dark:text-emerald-400">
                          ₹{income.amount.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <EditTransactionDialog
                            transaction={{
                              id: income.id,
                              amount: income.amount,
                              type: "income",
                              description: income.description,
                              category: income.category,
                              date: income.date,
                              icon: "💰",
                              account: income.account,
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
