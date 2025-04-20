"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  HomeIcon,
  WalletIcon,
} from "lucide-react"

import { cn } from "@/lib/cn"
import { Button } from "@/components/ui/button"
import { UserNav } from "@/components/user-nav"
import { AddActionDropdown } from "./add-action-dropdown"
import storage from "@/utils/storage"

interface SiteHeaderProps {
  className?: string
}

export function SiteHeader({ className }: SiteHeaderProps) {
  const pathname = usePathname()
  const isAuthenticated = storage.getToken()
  return (
    <header className={cn("sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-3", className)}>
      <div className="container mx-auto max-w-7xl px-2 sm:px-4 lg:px-6 flex h-14 items-center justify-between">
        <div className="flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <WalletIcon className="h-8 w-8" />
            <span className="hidden font-bold text-lg sm:text-xl sm:inline-block">FinanceTracker</span>
          </Link>
          {isAuthenticated &&
            <nav className="hidden md:flex items-center space-x-6 text-sm sm:text-base">
              <Link
                href="/dashboard"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
                )}
              >
                <span className="flex items-start gap-1">
                  <div className="flex items-center justify-center bg-blue-100 p-1 sm:p-1 rounded-full">
                    <HomeIcon className="h-3 w-3 sm:h-5 sm:w-5 text-blue-500" />
                  </div>
                  Dashboard
                </span>
              </Link>
            </nav>}
        </div>
        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <AddActionDropdown className="h-9 w-9" />
            <UserNav />
          </div>) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
            </div>
        )}

        {/* {!isAuthenticated && (
          <>
            <nav className="hidden md:flex items-center space-x-6 text-sm sm:text-base">
              <Link
                href="/dashboard"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === "/dashboard" ? "text-foreground" : "text-foreground/60",
                )}
              >
                <span className="flex items-start gap-1">
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
            <div className="flex items-center gap-2">
              <AddActionDropdown className="h-9 w-9" />
              <UserNav />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        )} */}
      </div>
    </header>
  )
}
