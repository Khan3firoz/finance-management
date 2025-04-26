"use client"

import { Plus } from "lucide-react"
import Link from "next/link"
import { WalletIcon } from "lucide-react"
import { AddAccountDialog } from "./add-account-dialog"
import { AddTransactionDialog } from "./add-transaction-dialog"
import { AddBudgetDialog } from "./add-budget-dialog"
import { AddCategoryDialog } from "./add-category-dialog"
import { useState } from "react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface AddActionDropdownProps {
    className?: string
}

export function AddActionDropdown({ className }: AddActionDropdownProps) {
    const [openAddAccount, setOpenAddAccount] = useState(false)

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className={`${className} aspect-square rounded-full hover:bg-accent`}
          >
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add new</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <AddTransactionDialog type="credit" />
          <AddTransactionDialog type="debit" />
          <DropdownMenuItem onClick={() => setOpenAddAccount(true)}>
            <WalletIcon className="h-4 w-4 mr-2" />
            Add Account
          </DropdownMenuItem>
        </DropdownMenuContent>
        {openAddAccount && (
          <AddAccountDialog
            open={openAddAccount}
            onClose={() => setOpenAddAccount(false)}
            editAccount={null}
          />
        )}
      </DropdownMenu>
    );
}
