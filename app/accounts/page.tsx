'use client'
import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { CreditCard, Edit, Landmark, Plus, Trash, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteAccount, fetchAccountList } from "../service/account.service"
import { AddAccountDialog } from "@/components/add-account-dialog"
import { toast } from "sonner"
import { EditAccountDialog } from "@/components/edit-account-dialog"

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
  const [allAccounts, setAllAccounts] = useState<any[]>([])
  const [openAddAccountDialog, setOpenAddAccountDialog] = useState(false)
  const [editAccount, setEditAccount] = useState<any>(null)

  const fetchAccounts = async () => {
    const res = await fetchAccountList()
    setAllAccounts(res?.data?.accounts)
  }

  useEffect(() => {
    fetchAccounts()
  }, [])

  const handleEditAccount = (account: any) => {
    setOpenAddAccountDialog(true)
    setEditAccount(account)
  }

  const handleDeleteAccount = async (id: any) => {
    try {
      const res = await deleteAccount(id)
      toast.success("Account deleted successfully")
      fetchAccounts()
    } catch (error) {
      console.log(error, "error")
    }
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-2 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Accounts</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" className="cursor-pointer" onClick={() => setOpenAddAccountDialog(true)} >
              <Plus />Add Account</Button>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allAccounts?.map((account) => (
                    <TableRow key={account._id}>
                      <TableCell>
                        {/* <account.icon className="h-5 w-5 text-muted-foreground" /> */}
                        {account.accountName}
                      </TableCell>
                      <TableCell className="font-medium">{account.accountType}</TableCell>
                      <TableCell className={account.balance < 0 ? "text-red-500" : ""}>
                        {account.currency}{account.balance.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {account.accountType === "credit" && account.limit ? (
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
                          <EditAccountDialog account={account} />
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteAccount(account._id)}>
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
      {openAddAccountDialog && (
        <AddAccountDialog
          open={openAddAccountDialog}
          onClose={() => setOpenAddAccountDialog(false)}
          editAccount={null}
        />
      )}
    </div>
  )
}
