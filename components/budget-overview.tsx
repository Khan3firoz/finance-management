"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useTheme } from "next-themes"

// Sample data - in a real app, this would come from your database
const budgetsData = [
  {
    id: "1",
    name: "Groceries",
    amount: 500,
    spent: 320.5,
    period: "Monthly",
    category: "Groceries",
    color: "#10b981", // emerald-500
  },
  {
    id: "2",
    name: "Entertainment",
    amount: 200,
    spent: 150.75,
    period: "Monthly",
    category: "Entertainment",
    color: "#f59e0b", // amber-500
  },
  {
    id: "3",
    name: "Transportation",
    amount: 300,
    spent: 210.25,
    period: "Monthly",
    category: "Transportation",
    color: "#ef4444", // red-500
  },
  {
    id: "4",
    name: "Dining Out",
    amount: 250,
    spent: 180.5,
    period: "Monthly",
    category: "Food & Dining",
    color: "#8b5cf6", // violet-500
  },
  {
    id: "5",
    name: "Utilities",
    amount: 400,
    spent: 350.75,
    period: "Monthly",
    category: "Utilities",
    color: "#3b82f6", // blue-500
  },
]

export function BudgetOverview() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

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

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Monthly Budget Overview</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card>
              <CardHeader className="p-3">
                <CardDescription>Total Budget</CardDescription>
                <CardTitle className="text-xl">${totalBudget.toFixed(2)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-3">
                <CardDescription>Spent</CardDescription>
                <CardTitle className="text-xl text-red-500">${totalSpent.toFixed(2)}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="p-3">
                <CardDescription>Remaining</CardDescription>
                <CardTitle className="text-xl text-emerald-500">${totalRemaining.toFixed(2)}</CardTitle>
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
                  ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                </span>
              </div>
              <Progress
                value={(budget.spent / budget.amount) * 100}
                className="h-2"
                indicatorClassName={budget.spent / budget.amount > 0.9 ? "bg-red-500" : budget.color}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>${(budget.amount - budget.spent).toFixed(2)} remaining</span>
                <span>{Math.round((budget.spent / budget.amount) * 100)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Spending Distribution</h3>
        <div className="h-[300px]">
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
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Spent"]}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
