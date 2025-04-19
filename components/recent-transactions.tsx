import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import dayjs from "dayjs"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EditTransactionDialog } from "@/components/edit-transaction-dialog"
import { useState } from "react"

interface RecentTransactionsProps {
  transactions: any[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {

  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  const totalPages = Math.ceil(transactions.length / transactionsPerPage);
  console.log(transactions, "transactions===>")
  return (
    <div className="space-y-4">
      {currentTransactions.map((transaction) => (
        <div key={transaction._id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{transaction.category?.icon}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-md font-bold leading-none">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">
              {transaction.category?.name} • {transaction.account?.accountName}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <div className="flex items-center">
              {transaction.transactionType === "credit" ? (
                <ArrowUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={cn("text-sm", transaction.transactionType === "credit" ? "text-emerald-500" : "text-red-500")}>
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-right text-muted-foreground">{dayjs(transaction.date).format("MMM D, YYYY")}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
