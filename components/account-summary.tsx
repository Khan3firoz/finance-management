import { CreditCard, Landmark, Wallet } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import { EditAccountDialog } from "@/components/edit-account-dialog"

// Sample data - in a real app, this would come from your database
const accounts = [
  {
    id: "1",
    name: "Checking Account",
    balance: 2500.75,
    type: "bank",
    icon: Landmark,
  },
  {
    id: "2",
    name: "Savings Account",
    balance: 12500.5,
    type: "bank",
    icon: Wallet,
  },
  {
    id: "3",
    name: "Credit Card",
    balance: -1250.25,
    type: "credit",
    icon: CreditCard,
    limit: 5000,
  },
]

export function AccountSummary() {
  const totalAssets = accounts.reduce((sum, account) => {
    return account.type !== "credit" ? sum + account.balance : sum
  }, 0)

  return (
    <div className="space-y-4">
      {accounts.map((account) => (
        <div key={account.id} className="flex flex-col space-y-2">
          <div className="flex items-center">
            <account.icon className="mr-2 h-5 w-5 text-muted-foreground" />
            <span className="font-medium">{account.name}</span>
            <span className={`ml-auto font-medium ${account.balance < 0 ? "text-red-500" : ""}`}>
              ${Math.abs(account.balance).toFixed(2)}
            </span>
            <div className="ml-2">
              <EditAccountDialog account={account} />
            </div>
          </div>
          {account.type === "credit" && account.limit && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Credit Used</span>
                <span className="text-muted-foreground">
                  ${Math.abs(account.balance).toFixed(2)} / ${account.limit.toFixed(2)}
                </span>
              </div>
              <Progress
                value={(Math.abs(account.balance) / account.limit) * 100}
                className="h-2"
                indicatorClassName={Math.abs(account.balance) / account.limit > 0.8 ? "bg-red-500" : "bg-cyan-500"}
              />
            </div>
          )}
        </div>
      ))}
      <div className="flex items-center border-t pt-4 mt-2">
        <span className="font-medium">Total Assets</span>
        <span className="ml-auto font-bold text-emerald-500">${totalAssets.toFixed(2)}</span>
      </div>
    </div>
  )
}
