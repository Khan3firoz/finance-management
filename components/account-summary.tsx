import { CreditCard, Landmark, Wallet, LucideIcon } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import { EditAccountDialog } from "@/components/edit-account-dialog"

interface Account {
  _id: string
  name: string
  balance: number
  type: string
  iconName: string
  limit?: number
  accountName: string
  accountType: string
  currency: string
}

const iconMap: Record<string, LucideIcon> = {
  Landmark: Landmark,
  Wallet: Wallet,
  CreditCard: CreditCard,
}

interface AccountSummaryProps {
  allAccounts?: Account[]
}

export function AccountSummary({ allAccounts = [] }: AccountSummaryProps) {
  const totalAssets = allAccounts.reduce((sum, account) => {
    if (!account) return sum
    return account.accountType !== "credit" ? sum + (account.balance || 0) : sum
  }, 0)

  if (!allAccounts.length) {
    return (
      <div className="flex items-center justify-center h-32 text-muted-foreground">
        No accounts found
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {allAccounts.map((account) => {
        if (!account) return null

        const Icon = iconMap[account.iconName] || Wallet
        const balance = account.balance || 0
        const limit = account.limit || 0

        return (
          <div key={account._id} className="flex flex-col space-y-2">
            <div className="flex items-center">
              <Icon className="mr-2 h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{account.accountName}</span>
              <span className={`ml-auto font-medium ${balance < 0 ? "text-red-500" : ""}`}>
                {account.currency}{Math.abs(balance).toFixed(2)}
              </span>
              <div className="ml-2">
                <EditAccountDialog account={account} />
              </div>
            </div>

            {account.accountType === "credit_card" && limit > 0 && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Credit Used</span>
                  <span className="text-muted-foreground">
                    {account.currency}{Math.abs(balance).toFixed(2)} /{limit.toFixed(2)}
                  </span>
                </div>
                <Progress
                  value={(Math.abs(balance) / limit) * 100}
                  className="h-2"
                  indicatorClassName={Math.abs(balance) / limit > 0.8 ? "bg-red-500" : "bg-cyan-500"}
                />
              </div>
            )}
          </div>
        )
      })}
      <div className="flex items-center border-t pt-4 mt-2">
        <span className="font-medium">Total Assets</span>
        <span className="ml-auto font-bold text-emerald-500">${totalAssets.toFixed(2)}</span>
      </div>
    </div>
  )
}
