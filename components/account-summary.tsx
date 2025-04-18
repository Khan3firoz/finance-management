import { CreditCard, Landmark, Wallet, LucideIcon } from "lucide-react"

import { Progress } from "@/components/ui/progress"
import { EditAccountDialog } from "@/components/edit-account-dialog"

type Account = {
  _id: string
  name: string
  balance: number
  type: string
  iconName: string
  limit?: number
  accountName: string
  accountType: string
}

const iconMap: Record<string, LucideIcon> = {
  Landmark: Landmark,
  Wallet: Wallet,
  CreditCard: CreditCard,
}

export function AccountSummary({ allAccounts }: { allAccounts: Account[] }) {
  const totalAssets = allAccounts.reduce((sum, account) => {
    return account.accountType !== "credit" ? sum + account.balance : sum
  }, 0)

  return (
    <div className="space-y-4">
      {allAccounts.map((account) => {
        const Icon = iconMap[account.iconName]
        console.log(account, "account")
        return (
          <div key={account._id} className="flex flex-col space-y-2">
            <div className="flex items-center">
              {/* <Icon className="mr-2 h-5 w-5 text-muted-foreground" /> */}
              <span className="font-medium">{account.accountName}</span>
              <span className={`ml-auto font-medium ${account.balance < 0 ? "text-red-500" : ""}`}>
                ${Math.abs(account.balance).toFixed(2)}
              </span>
              <div className="ml-2">
                <EditAccountDialog account={account} />
              </div>
            </div>

            {account.accountType?.trim().toLowerCase().replace(/\s+/g, '') === 'creditcard'
              && typeof account.limit === "number" && account.limit > 0 && (
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
        )
      })}
      <div className="flex items-center border-t pt-4 mt-2">
        <span className="font-medium">Total Assets</span>
        <span className="ml-auto font-bold text-emerald-500">${totalAssets.toFixed(2)}</span>
      </div>
    </div>
  )
}
