"use client"

import { useState } from "react"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { getMonthName } from "@/lib/utils"

// Budget data type definitions
interface Budget {
    _id: string
    budgetId: string
    categoryId: string
    categoryName: string
    categoryColor: string
    budget: number
    spent: number
    remaining: number
}

interface BudgetData {
    month: number
    year: number
    totalBudgets: number
    budgets: Budget[]
}

interface ApiResponse {
    statusCode: number
    data: BudgetData
    message: string
    success: boolean
}

// Sample data structure for reference
/*
const sampleData: ApiResponse = {
    statusCode: 200,
    data: {
        month: 4,
        year: 2025,
        totalBudgets: 4,
        budgets: [...]
    },
    message: "monthly budget summary fetched successfully",
    success: true,
}
*/

// Helper function to format currency
const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

// Helper function to get color based on budget status
const getStatusColor = (remaining: number) => {
    if (remaining < 0) return "text-red-500"
    if (remaining === 0) return "text-yellow-500"
    return "text-green-500"
}

// Helper function to get progress color
const getProgressColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100
    if (percentage > 100) return "bg-red-500"
    if (percentage > 75) return "bg-yellow-500"
    return "bg-green-500"
}

// Map category colors to Tailwind classes
const getCategoryColor = (color: string) => {
    const colorMap: Record<string, string> = {
        pink: "bg-pink-500",
        magenta: "bg-fuchsia-500",
        "light-green": "bg-green-400",
        violet: "bg-violet-500",
    }
    return colorMap[color] || "bg-gray-500"
}

// Map category colors to hex values for charts
const getCategoryHexColor = (color: string) => {
    const colorMap: Record<string, string> = {
        pink: "#ec4899",
        magenta: "#d946ef",
        "light-green": "#4ade80",
        violet: "#8b5cf6",
    }
    return colorMap[color] || "#6b7280"
}

// Custom pie chart label
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
            x={x}
            y={y}
            fill="white"
            textAnchor={x > cx ? "start" : "end"}
            dominantBaseline="central"
            fontSize={12}
            fontWeight="bold"
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

export default function BudgetVisualization({ apiData }: { apiData: ApiResponse }) {
    const { data } = apiData
    const [activeTab, setActiveTab] = useState("progress");

    // Loading state
    if (!data || !data.budgets || data.budgets.length === 0) {
        return (
            <div className="container mx-auto py-8">
                <Card className="w-full">
                    <CardHeader>
                        <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
                        <Skeleton className="h-4 w-1/2 mx-auto" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <Skeleton className="h-10 w-full" />
                            </div>
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-5 w-24" />
                                    </div>
                                    <Skeleton className="h-10 w-full rounded-md" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Sort the budgets array by category name
    const sortedBudgets = [...data.budgets].sort((a, b) => a.categoryName.localeCompare(b.categoryName))

    // Prepare data for the bar chart
    const barChartData = data.budgets.map((item) => ({
        name: item.categoryName,
        Budget: item.budget,
        Spent: item.spent,
        fill: getCategoryHexColor(item.categoryColor),
    }))

    // Prepare data for the budget pie chart
    const budgetPieData = data.budgets.map((item) => ({
        name: item.categoryName,
        value: item.budget,
        color: getCategoryHexColor(item.categoryColor),
    }))

    // Prepare data for the spent pie chart
    const spentPieData = data.budgets.map((item) => ({
        name: item.categoryName,
        value: item.spent,
        color: getCategoryHexColor(item.categoryColor),
    }))

    return (
        <div className="py-8">
            <Card className="w-full">
                <CardHeader>
                    <CardTitle className="text-2xl md:text-3xl text-center">{getMonthName(data.month)} {data.year} - Monthly Budget Overview</CardTitle>
                    <CardDescription className="text-center">
                        Track your spending across {data.totalBudgets} budget categories
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="progress" value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="progress">Progress</TabsTrigger>
                            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
                            {/* <TabsTrigger value="pie-budget">Budget Pie</TabsTrigger> */}
                            <TabsTrigger value="pie-spent">Spent Pie</TabsTrigger>
                            <TabsTrigger value="cards">Cards</TabsTrigger>
                        </TabsList>

                        {/* Progress Bar View */}
                        <TabsContent value="progress" className="pt-6">
                            <TooltipProvider>
                                <div className="w-full space-y-6">
                                    {data.budgets.map((budget) => (
                                        <div key={budget._id} className="relative">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="font-medium">{budget.categoryName}</span>
                                                <span className="text-sm">
                                                    {formatCurrency(budget.spent)} / {formatCurrency(budget.budget)}
                                                </span>
                                            </div>
                                            <UITooltip>
                                                <TooltipTrigger asChild>
                                                    <div className="w-full h-10 bg-gray-200 rounded-md relative cursor-pointer">
                                                        <div
                                                            className={`h-full rounded-md ${getCategoryColor(budget.categoryColor)}`}
                                                            style={{ width: `${Math.min((budget.spent / budget.budget) * 100, 100)}%` }}
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center">
                                                            <span className="text-xs font-medium text-white drop-shadow-md">
                                                                {((budget.spent / budget.budget) * 100).toFixed(0)}% used
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TooltipTrigger>
                                                <TooltipContent className="p-0 bg-white" sideOffset={5}>
                                                    <div className="p-3 space-y-2 min-w-[200px]">
                                                        <div className="flex justify-between gap-4">
                                                            <span className="font-medium">Budget:</span>
                                                            <span>{formatCurrency(budget.budget)}</span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="font-medium">Spent:</span>
                                                            <span>{formatCurrency(budget.spent)}</span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="font-medium">Remaining:</span>
                                                            <span className={getStatusColor(budget.remaining)}>
                                                                {formatCurrency(budget.remaining)}
                                                            </span>
                                                        </div>
                                                        <div className="flex justify-between gap-4">
                                                            <span className="font-medium">Status:</span>
                                                            <span className={getStatusColor(budget.remaining)}>
                                                                {budget.remaining < 0 ? "Overspent" : "Under Budget"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TooltipContent>
                                            </UITooltip>
                                        </div>
                                    ))}
                                </div>
                            </TooltipProvider>
                        </TabsContent>

                        {/* Bar Chart View */}
                        <TabsContent value="bar" className="pt-6">
                            <div className="w-full h-[400px]">
                                <ChartContainer
                                    config={{
                                        Budget: {
                                            label: "Budget Amount",
                                            color: "hsl(var(--chart-1))",
                                        },
                                        Spent: {
                                            label: "Amount Spent",
                                            color: "hsl(var(--chart-2))",
                                        },
                                    }}
                                >
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} tick={{ fontSize: 12 }} />
                                            <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} width={80} />
                                            <Tooltip
                                                content={<ChartTooltipContent formatter={(value) => [formatCurrency(value as number), "Amount"]} />}
                                            />
                                            <Legend />
                                            <Bar dataKey="Budget" fill="#8884d8">
                                                {barChartData.map((entry, index) => (
                                                    <Cell key={`cell-budget-${index}`} fill={entry.fill} />
                                                ))}
                                            </Bar>
                                            <Bar dataKey="Spent" fill="#82ca9d">
                                                {barChartData.map((entry, index) => (
                                                    <Cell key={`cell-spent-${index}`} fill={entry.fill} opacity={0.7} />
                                                ))}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartContainer>
                            </div>
                        </TabsContent>

                        {/* Budget Pie Chart View */}
                        {/* <TabsContent value="pie-budget" className="pt-6">
                            <div className="w-full h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={budgetPieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={150}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {budgetPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value as number), "Budget"]}
                                            labelFormatter={(name) => `Category: ${name}`}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="text-center mt-4 text-sm text-muted-foreground">
                                Budget distribution across categories
                            </div>
                        </TabsContent> */}

                        {/* Spent Pie Chart View */}
                        <TabsContent value="pie-spent" className="pt-6">
                            <div className="w-full h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={spentPieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                            outerRadius={150}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {spentPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value) => [formatCurrency(value as number), "Spent"]}
                                            labelFormatter={(name) => `Category: ${name}`}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="text-center mt-4 text-sm text-muted-foreground">
                                Spending distribution across categories
                            </div>
                        </TabsContent>

                        {/* Card View */}
                        <TabsContent value="cards" className="pt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sortedBudgets.map((budget) => (
                                    <Card key={budget._id} className="overflow-hidden">
                                        <div className={`h-2 w-full ${getCategoryColor(budget.categoryColor)}`} />
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-center">
                                                <CardTitle>{budget.categoryName}</CardTitle>
                                                <span className={`font-bold ${getStatusColor(budget.remaining)}`}>
                                                    {budget.remaining < 0 ? "Overspent" : "Remaining"}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="flex justify-between text-sm">
                                                    <span>Budget</span>
                                                    <span className="font-medium">{formatCurrency(budget.budget)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Spent</span>
                                                    <span className="font-medium">{formatCurrency(budget.spent)}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span>Remaining</span>
                                                    <span className={`font-medium ${getStatusColor(budget.remaining)}`}>
                                                        {formatCurrency(budget.remaining)}
                                                    </span>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-xs">
                                                        <span>Spent {((budget.spent / budget.budget) * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <Progress
                                                        value={Math.min((budget.spent / budget.budget) * 100, 100)}
                                                        className="h-2"
                                                        indicatorClassName={getProgressColor(budget.spent, budget.budget)}
                                                    />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}
