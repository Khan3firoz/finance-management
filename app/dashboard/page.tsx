"use client"

import { Suspense, useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  CreditCard,
  IndianRupee,
  PiggyBank,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSummary } from "@/components/account-summary";
import { RecentTransactions } from "@/components/recent-transactions";
import { useFinance } from "@/app/context/finance-context";
import AISuggestionsCard from "@/components/ui/AISuggestionsCard";

export default function DashboardPage() {
  const {
    summary,
    accounts,
    transactions,
    loading,
    error,
    refreshData,
  } = useFinance();
  console.log(accounts, "accounts==>");
  useEffect(() => {
    refreshData();
  }, []);
  console.log(loading, "loading");

  if (loading) {
    return (
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-2 sm:p-8 pt-6">
          <Skeleton className="h-8 w-[200px]" />
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
            <Skeleton className="h-[120px]" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-2 sm:p-8 pt-6">
          <div className="text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-2 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview" className="text-sm sm:text-base">
              Overview
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-sm sm:text-base">
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Total Balance
                  </CardTitle>
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold">
                    ₹ {summary?.netAmount || 0}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Income
                  </CardTitle>
                  <IndianRupee className="h-4 w-4 text-emerald-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-emerald-500">
                    ₹ {summary?.totalIncome || 0}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    +2.5% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Expenses
                  </CardTitle>
                  <CreditCard className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-red-500">
                    ₹ {summary?.totalExpense || 0}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    +18.2% from last month
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">
                    Savings
                  </CardTitle>
                  <PiggyBank className="h-4 w-4 text-cyan-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-xl sm:text-2xl font-bold text-cyan-500">
                    ₹ 1,607.50
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    +4.3% from last month
                  </p>
                </CardContent>
              </Card>
            </div>
            <Card className="col-span-12">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>
                  You made {transactions?.length || 0} transactions this month.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<Skeleton className="h-[350px] w-full" />}>
                  <RecentTransactions
                    transactions={transactions || []}
                    loading={loading}
                  />
                </Suspense>
              </CardContent>
              {transactions?.length > 0 && (
                <CardFooter>
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/transactions">
                      View All Transactions
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              )}
            </Card>
          </TabsContent>
          <TabsContent value="analytics" className="space-y-4">
            <AISuggestionsCard />
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
                <AccountSummary
                  allAccounts={accounts || []}
                  loading={loading}
                />
              </Suspense>
            </CardContent>
            {accounts?.length > 0 && (
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/accounts">
                    Manage Accounts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

