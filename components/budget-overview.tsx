"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"
import { useFinance } from "@/app/context/finance-context"
import { Skeleton } from "@/components/ui/skeleton"

// Define colors for categories that don't have a color assigned
const defaultColors = [
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#3b82f6", // blue-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
  "#f97316", // orange-500
]

export function BudgetOverview() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { budgetsSummry, loading, error } = useFinance()

  // Map budget data to the format expected by the component
  const budgetsData = budgetsSummry.map((budget, index) => ({
    id: budget._id || budget.budgetId || String(index),
    name: budget.categoryName,
    amount: budget.budget,
    spent: budget.spent,
    period: "Monthly",
    category: budget.categoryName,
    color: budget.categoryColor || defaultColors[index % defaultColors.length],
    remaining: budget.remaining
  }))

  // Calculate total budget and spent
  const totalBudget = budgetsData.reduce((sum, budget) => sum + budget.amount, 0)
  const totalSpent = budgetsData.reduce((sum, budget) => sum + budget.spent, 0)
  const totalRemaining = totalBudget - totalSpent

  // Prepare data for pie chart
  const pieData = budgetsData.map((budget) => ({
    name: budget.name,
    value: budget.spent,
    color: budget.color,
  }))

  // Show loading state
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <div className="mb-6">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-3 gap-4 mb-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
            <Skeleton className="h-2 w-full mb-2" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <Skeleton className="h-[300px] w-full rounded-md" />
        </div>
      </div>
    )
  }

  // Show error state
  if (error || budgetsData.length === 0) {
    return (
      <div className="p-4 border border-red-200 bg-red-50 text-red-800 rounded-md">
        {error || "No budget data available. Please create a budget to see your overview."}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Monthly Budget Overview</h3>
          {/* <div className="grid grid-cols-3 gap-4 mb-4"> */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardHeader className="p-3">
                <CardDescription>Total Budget</CardDescription>
                <CardTitle className="text-xl">₹{totalBudget.toFixed(2)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-3">
                <CardDescription>Spent</CardDescription>
                <CardTitle className="text-xl text-red-500">₹{totalSpent.toFixed(2)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-3">
                <CardDescription>Remaining</CardDescription>
                <CardTitle className="text-xl text-emerald-500">₹{totalRemaining.toFixed(2)}</CardTitle>
              </CardHeader>
            </Card>
          </div>
          <Progress
            value={(totalSpent / totalBudget) * 100}
            className="h-2 mb-1"
            indicatorClassName={totalSpent / totalBudget > 0.9 ? "bg-red-500" : "bg-emerald-500"}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{Math.round((totalSpent / totalBudget) * 100)}% spent</span>
            <span>100%</span>
          </div>
        </div>

        <div className="space-y-4">
          {budgetsData.map((budget) => (
            <div key={budget.id} className="space-y-1">
              <div className="flex justify-between">
                <span className="font-medium">{budget.name}</span>
                <span className="text-sm text-muted-foreground">
                ₹{budget.spent.toFixed(2)} / ₹{budget.amount.toFixed(2)}
                </span>
              </div>
              <Progress
                value={(budget.spent / budget.amount) * 100}
                className="h-2"
                indicatorClassName={budget.spent / budget.amount > 0.9 ? "bg-red-500" : budget.color}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>₹{(budget.amount - budget.spent).toFixed(2)} remaining</span>
                <span>{Math.round((budget.spent / budget.amount) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Spending Distribution</h3>
        <div className="h-[300px]">
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1f2937" : "#fff",
                    borderColor: isDark ? "#374151" : "#e5e7eb",
                    color: isDark ? "#fff" : "#000",
                  }}
                  formatter={(value: number) => [`₹${value.toFixed(2)}`, "Spent"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No spending data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
