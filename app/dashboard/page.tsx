"use client"

import { Suspense, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, CreditCard, DollarSign, LineChart, PiggyBank, Plus, Wallet, ChevronDown, BarChart, PieChart, AreaChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

import { AccountSummary } from "@/components/account-summary"
import { RecentTransactions } from "@/components/recent-transactions"
import { BudgetOverview } from "@/components/budget-overview"
import { AddActionDropdown } from "@/components/add-action-dropdown"
import { fetchAccountStatsSummary, fetchIncomeExpense } from "@/app/service/account.service"
import { TimeFilteredChart } from "@/components/time-filtered-chart"
import { expenseData } from "@/app/data/expense-data"

interface Summary {
  netAmount: number
  totalIncome: number
  totalExpense: number
}

interface IncomeExpense {
  income: number
  expense: number
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [incomeExpense, setIncomeExpense] = useState<IncomeExpense | null>(null)

  const getSummary = async () => {
    try {
      const res = await fetchAccountStatsSummary()
      setSummary(res?.data)
    } catch (err) {
      console.log(err, "err")
    }
  }

  const getIncomeExpense = async () => {
    try {
      const res = await fetchIncomeExpense()
      setIncomeExpense(res?.data)
    } catch (err) {
      console.log(err, "err")
    }
  }

  useEffect(() => {
    getSummary()
    getIncomeExpense()
  }, [])

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-2 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="text-sm sm:text-base">Overview</TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm sm:text-base">Analytics</TabsTrigger>
            <TabsTrigger value="budgets" className="text-sm sm:text-base">Budgets</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Balance</CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">₹ {summary?.netAmount}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-500">₹ {summary?.totalIncome}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">+2.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Expenses</CardTitle>
                  <CreditCard className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-red-500">₹ {summary?.totalExpense}</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">+18.2% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Savings</CardTitle>
                  <PiggyBank className="h-4 w-4 text-cyan-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-cyan-500">₹ 1,607.50</div>
                  <p className="text-xs sm:text-sm text-muted-foreground">+4.3% from last month</p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4">
              <Card className="col-span-12">
                {/* <CardHeader>
                  <CardTitle>Expense Overview</CardTitle>
                  <CardDescription>Track your expenses across different categories</CardDescription>
                </CardHeader> */}
                <CardContent className="h-fit">
                  <TimeFilteredChart data={expenseData} />
                </CardContent>
              </Card>
              <Card className="col-span-12">
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>You made 12 transactions this month.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                    <RecentTransactions />
                  </Suspense>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/transactions">
                      View All Transactions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Income vs Expenses</CardTitle>
                <CardDescription>Compare your income and expenses over time.</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[350px] flex items-center justify-center">
                  <LineChart className="h-16 w-16 text-muted-foreground" />
                  <p className="ml-4 text-muted-foreground">Analytics data will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="budgets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Budget Overview</CardTitle>
                <CardDescription>Track your spending against your budget.</CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                  <BudgetOverview />
                </Suspense>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/budgets">
                    Manage Budgets
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        <div className="grid gap-4">
          <Card className="col-span-12">
            <CardHeader>
              <CardTitle>Accounts</CardTitle>
              <CardDescription>Manage your financial accounts.</CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<Skeleton className="h-[200px] w-full" />}>
                <AccountSummary />
              </Suspense>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full">
                <Link href="/accounts">
                  Manage Accounts
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

