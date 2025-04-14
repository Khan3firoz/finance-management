"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowDownRight,
  ArrowUpRight,
  BanknoteIcon as BanknotesIcon,
  BarChartIcon as ChartBarIcon,
  CreditCardIcon,
  HomeIcon,
  MenuIcon,
  WalletIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserNav } from "@/components/user-nav"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"
import { AddActionDropdown } from "./add-action-dropdown"

interface SiteHeaderProps {
  className?: string
}

export function SiteHeader({ className }: SiteHeaderProps) {
  const pathname = usePathname()

  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3", className)}>
      <div className="container mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <MenuIcon className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 py-4">
                <Link href="/" className="flex items-center gap-2">
                  <WalletIcon className="h-8 w-8" />
                  <span className="font-bold text-lg sm:text-xl">FinanceTracker</span>
                </Link>
                <nav className="flex flex-col gap-4 text-sm sm:text-base">
                  <Link href="/dashboard" className="flex items-center gap-2">
                    <HomeIcon className="h-5 w-5" />
                    Dashboard
                  </Link>
                  <Link href="/income" className="flex items-center gap-2 text-lg font-medium">
                    <BanknotesIcon className="h-5 w-5 text-emerald-500" />
                    Income
                  </Link>
                  <Link href="/expenses" className="flex items-center gap-2 text-lg font-medium">
                    <CreditCardIcon className="h-5 w-5 text-red-500" />
                    Expenses
                  </Link>
                  <Link href="/budgets" className="flex items-center gap-2 text-lg font-medium">
                    <ChartBarIcon className="h-5 w-5 text-cyan-500" />
                    Budgets
                  </Link>
                  <Link href="/accounts" className="flex items-center gap-2 text-lg font-medium">
                    <WalletIcon className="h-5 w-5 text-purple-500" />
                    Accounts
                  </Link>
                  <Link href="/categories" className="flex items-center gap-2 text-lg font-medium">
                    <ChartBarIcon className="h-5 w-5 text-amber-500" />
                    Categories
                  </Link>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <WalletIcon className="h-8 w-8" />
              <span className="hidden font-bold text-lg sm:text-xl sm:inline-block">FinanceTracker</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm sm:text-base">
              <Link
                href="/dashboard"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
                )}
              >
                <span className="flex items-center gap-1">
                  <div className="flex items-center justify-center bg-blue-100 p-1 sm:p-1 rounded-full">
                    <HomeIcon className="h-3 w-3 sm:h-5 sm:w-5 text-blue-500" />
                  </div>
                  Dashboard
                </span>
              </Link>
              <Link
                href="/income"
                className={cn(
                  "transition-colors hover:text-foreground/80 relative group",
                  pathname?.startsWith("/income") ? "text-foreground" : "text-foreground/60",
                )}
              >
                <span className="flex items-center gap-1">
                  <div className="flex items-center justify-center bg-green-100 p-1 sm:p-1 rounded-full group-hover:bg-gray-100 transition-colors">
                    <ArrowDownRight className="h-2 w-2 sm:h-5 sm:w-5 text-green-500 group-hover:text-gray-500" />
                  </div>
                  Income
                </span>
                <div className="absolute inset-0 bg-gray-100/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/expenses"
                className={cn(
                  "transition-colors hover:text-foreground/80 relative group",
                  pathname?.startsWith("/expenses") ? "text-foreground" : "text-foreground/60",
                )}
              >
                <span className="flex items-center gap-1">
                  <div className="flex items-center justify-center bg-red-100 p-1 sm:p-1 rounded-full group-hover:bg-gray-100 transition-colors">
                    <ArrowUpRight className="h-3 w-3 sm:h-5 sm:w-5 text-red-500 group-hover:text-gray-500" />
                  </div>
                  Expenses
                </span>
                <div className="absolute inset-0 bg-gray-100/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
              <Link
                href="/budgets"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname?.startsWith("/budgets") ? "text-foreground" : "text-foreground/60",
                )}
              >
                <span className="flex items-center gap-1">
                  <ChartBarIcon className="h-4 w-4 text-cyan-500" />
                  Budgets
                </span>
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <AddActionDropdown className="h-9 w-9" />
          <UserNav />
        </div>
      </div>
    </header>
  )
}
