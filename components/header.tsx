"use client"

import { Plus, ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, Tag, CreditCard } from "lucide-react"

import { AddCategoryDialog } from "./add-category-dialog"
import { AddCreditCardDialog } from "./add-credit-card-dialog"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
                <div className="mr-4 hidden md:flex">
                    <a className="mr-6 flex items-center space-x-2" href="/">
                        <span className="hidden font-bold sm:inline-block">
                            Finance App
                        </span>
                    </a>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Add your search component here */}
                    </div>
                    <nav className="flex items-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Add
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                    <ArrowUpRight className="h-4 w-4 text-green-500" />
                                    Add Income
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                    <ArrowDownRight className="h-4 w-4 text-red-500" />
                                    Add Expense
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                    <Wallet className="h-4 w-4" />
                                    Add Account
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                    <CreditCard className="h-4 w-4" />
                                    Add Credit Card
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                    <PiggyBank className="h-4 w-4" />
                                    Add Budget
                                </DropdownMenuItem>
                                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                                    <Tag className="h-4 w-4" />
                                    Add Category
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>
            </div>
        </header>
    )
}