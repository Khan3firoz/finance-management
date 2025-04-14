import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import dayjs from "dayjs"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { EditTransactionDialog } from "@/components/edit-transaction-dialog"

// Sample data - in a real app, this would come from your database
const transactions = [
  {
    id: "1",
    amount: 2500,
    type: "income",
    description: "Salary",
    category: "Income",
    date: "2023-06-01",
    icon: "💼",
    account: "Checking Account",
  },
  {
    id: "2",
    amount: 120.5,
    type: "expense",
    description: "Grocery Shopping",
    category: "Groceries",
    date: "2023-06-03",
    icon: "🛒",
    account: "Credit Card",
  },
  {
    id: "3",
    amount: 1200,
    type: "expense",
    description: "Rent Payment",
    category: "Housing",
    date: "2023-06-05",
    icon: "🏠",
    account: "Checking Account",
  },
  {
    id: "4",
    amount: 45.99,
    type: "expense",
    description: "Netflix Subscription",
    category: "Entertainment",
    date: "2023-06-07",
    icon: "🎬",
    account: "Credit Card",
  },
  {
    id: "5",
    amount: 500,
    type: "income",
    description: "Freelance Work",
    category: "Income",
    date: "2023-06-10",
    icon: "💻",
    account: "Savings Account",
  },
]

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{transaction.icon}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">
              {transaction.category} • {transaction.account}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <div className="flex items-center">
              {transaction.type === "income" ? (
                <ArrowUpIcon className="mr-1 h-4 w-4 text-emerald-500" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={cn("text-sm", transaction.type === "income" ? "text-emerald-500" : "text-red-500")}>
                ${transaction.amount.toFixed(2)}
              </span>
            </div>
            <p className="text-xs text-right text-muted-foreground">{dayjs(transaction.date).format("MMM D, YYYY")}</p>
          </div>
          <div className="ml-2">
            <EditTransactionDialog transaction={transaction} />
          </div>
        </div>
      ))}
    </div>
  )
}
