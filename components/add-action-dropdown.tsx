"use client"

import { Plus } from "lucide-react"
import Link from "next/link"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { AddTransactionDialog } from "@/components/add-transaction-dialog"

interface AddActionDropdownProps {
    className?: string
}

export function AddActionDropdown({ className }: AddActionDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={`${className} aspect-square rounded-full hover:bg-accent`}
                >
                    <Plus className="h-5 w-5" />
                    <span className="sr-only">Add new</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                    <AddTransactionDialog />
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/accounts/new" className="w-full cursor-pointer">
                        Add Account
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/budgets/new" className="w-full cursor-pointer">
                        Add Budget
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/categories/new" className="w-full cursor-pointer">
                        Add Category
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}