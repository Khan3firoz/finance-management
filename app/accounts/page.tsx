import { Suspense } from "react"
import Link from "next/link"
import { CreditCard, Edit, Landmark, Plus, Trash, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data - in a real app, this would come from your database
const accountsData = [
  {
    id: "1",
    name: "Checking Account",
    type: "bank",
    balance: 2500.75,
    icon: Landmark,
  },
  {
    id: "2",
    name: "Savings Account",
    type: "bank",
    balance: 12500.5,
    icon: Wallet,
  },
  {
    id: "3",
    name: "Credit Card",
    type: "credit",
    balance: -1250.25,
    limit: 5000,
    icon: CreditCard,
  },
]

export default function AccountsPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
          <div className="flex items-center space-x-2">
            <Button asChild>
              <Link href="/accounts/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Account
              </Link>
            </Button>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Financial Accounts</CardTitle>
            <CardDescription>Manage your bank accounts, credit cards, and other financial accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accountsData.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <account.icon className="h-5 w-5 text-muted-foreground" />
                      </TableCell>
                      <TableCell className="font-medium">{account.name}</TableCell>
                      <TableCell className={account.balance < 0 ? "text-red-500" : ""}>
                        ${account.balance.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {account.type === "credit" && account.limit ? (
                          <div className="w-40 space-y-1">
                            <div className="flex text-xs justify-between">
                              <span>Credit Used</span>
                              <span>{Math.round((Math.abs(account.balance) / account.limit) * 100)}%</span>
                            </div>
                            <Progress value={(Math.abs(account.balance) / account.limit) * 100} className="h-2" />
                          </div>
                        ) : (
                          <span className="text-green-500">Active</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/accounts/${account.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
