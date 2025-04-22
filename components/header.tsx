"use client"

import { Plus, ArrowUpRight, ArrowDownRight, Wallet, PiggyBank, Tag, CreditCard, Menu, X } from "lucide-react"
import { useState } from "react"

import { AddCategoryDialog } from "./add-category-dialog"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between">
                <div className="flex items-center">
                    <a className="flex items-center space-x-2" href="/">
                        <span className="font-bold">
                            Finance App
                        </span>
                    </a>
                </div>
                
                {/* Mobile menu button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden p-2"
                    aria-label="Toggle menu"
                >
                    {isOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-4">
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

                {/* Mobile Navigation */}
                {isOpen && (
                    <div className="absolute top-14 left-0 right-0 bg-background border-b md:hidden">
                        <nav className="container py-4">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm" className="w-full justify-start">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-[200px]">
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
                )}
            </div>
        </header>
    )
}