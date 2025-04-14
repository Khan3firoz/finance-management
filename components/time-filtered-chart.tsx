"use client"

import { useState, useMemo, useEffect } from "react"
import { useTheme } from "next-themes"
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUp, ArrowDown } from "lucide-react"

interface ExpenseData {
    month: string;
    year: string;
    Groceries: number;
    Rent: number;
    Utilities: number;
    Entertainment: number;
    Transportation: number;
}

interface TimeFilteredChartProps {
    data: {
        monthly: ExpenseData[];
        yearly: ExpenseData[];
    }
}

const CATEGORIES = {
    Groceries: {
        color: "#4ade80",  // Green
        icon: "🛒"
    },
    Rent: {
        color: "#60a5fa",  // Blue
        icon: "🏠"
    },
    Utilities: {
        color: "#818cf8",  // Indigo
        icon: "💡"
    },
    Entertainment: {
        color: "#fbbf24",  // Amber
        icon: "🎮"
    },
    Transportation: {
        color: "#f87171",  // Red
        icon: "🚗"
    }
}

const YEARS = ["2024", "2023", "2022", "2021"]
const DEFAULT_YEAR = new Date().getFullYear().toString()

export function TimeFilteredChart({ data }: TimeFilteredChartProps) {
    const { theme } = useTheme()
    const isDark = theme === "dark"
    const [timePeriod, setTimePeriod] = useState<'monthly' | 'yearly'>('monthly')
    const [selectedYear, setSelectedYear] = useState<string>(DEFAULT_YEAR)

    useEffect(() => {
        const availableYears = timePeriod === 'yearly'
            ? data.yearly.map(item => item.month)
            : [...new Set(data.monthly.map(item => item.year))]

        if (!availableYears.includes(selectedYear)) {
            const mostRecentYear = availableYears.sort().reverse()[0]
            setSelectedYear(mostRecentYear || DEFAULT_YEAR)
        }
    }, [data, timePeriod, selectedYear])

    const filteredData = useMemo(() => {
        if (timePeriod === 'yearly') {
            return data.yearly.filter(item => item.month === selectedYear)
        } else {
            return data.monthly.filter(item => item.year === selectedYear)
        }
    }, [data, timePeriod, selectedYear])

    const categoryTotals = useMemo(() => {
        const totals: { [key: string]: number } = {}
        const prevYearTotals: { [key: string]: number } = {}

        // Current year totals
        filteredData.forEach(item => {
            Object.keys(CATEGORIES).forEach(category => {
                const value = item[category as keyof ExpenseData]
                if (typeof value === 'number') {
                    totals[category] = (totals[category] || 0) + value
                }
            })
        })

        // Previous year totals (for comparison)
        const prevYear = (parseInt(selectedYear) - 1).toString()
        const prevYearData = timePeriod === 'yearly'
            ? data.yearly.filter(item => item.month === prevYear)
            : data.monthly.filter(item => item.year === prevYear)

        prevYearData.forEach(item => {
            Object.keys(CATEGORIES).forEach(category => {
                const value = item[category as keyof ExpenseData]
                if (typeof value === 'number') {
                    prevYearTotals[category] = (prevYearTotals[category] || 0) + value
                }
            })
        })

        return { current: totals, previous: prevYearTotals }
    }, [filteredData, data, selectedYear, timePeriod])

    const tooltipStyle = {
        contentStyle: {
            backgroundColor: isDark ? "#1f2937" : "#fff",
            borderColor: isDark ? "#374151" : "#e5e7eb",
            borderRadius: "0.375rem",
            padding: "0.5rem",
        },
        formatter: (value: number) => [`$${value.toFixed(2)}`, "Amount"],
    }

    const getPercentageChange = (current: number, previous: number) => {
        if (previous === 0) return 0
        return ((current - previous) / previous) * 100
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex flex-col gap-2 w-full sm:w-auto mt-4">
                    <h2 className="text-xl sm:text-2xl font-semibold">Expense Overview</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">Track your expenses across different categories</p>
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <Tabs defaultValue="monthly" value={timePeriod} onValueChange={(value) => setTimePeriod(value as 'monthly' | 'yearly')} className="w-full sm:w-auto">
                        <TabsList className="w-full sm:w-auto grid grid-cols-2">
                            <TabsTrigger value="monthly" className="flex-1">Monthly</TabsTrigger>
                            <TabsTrigger value="yearly" className="flex-1">Yearly</TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <Select defaultValue={DEFAULT_YEAR} value={selectedYear} onValueChange={setSelectedYear}>
                        <SelectTrigger className="w-full sm:w-[120px]">
                            <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                            {YEARS.map((year) => (
                                <SelectItem key={year} value={year}>
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {Object.entries(CATEGORIES).map(([category, { color, icon }]) => {
                    const currentTotal = categoryTotals.current[category] || 0
                    const previousTotal = categoryTotals.previous[category] || 0
                    const percentageChange = getPercentageChange(currentTotal, previousTotal)
                    const isIncrease = currentTotal > previousTotal

                    return (
                        <Card key={category} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-4 sm:p-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl sm:text-3xl" role="img" aria-label={category}>
                                        {icon}
                                    </span>
                                    <div className={`flex items-center gap-1 text-xs sm:text-sm ${isIncrease ? 'text-red-500' : 'text-green-500'}`}>
                                        {isIncrease ? <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4" /> : <ArrowDown className="h-3 w-3 sm:h-4 sm:w-4" />}
                                        {Math.abs(percentageChange).toFixed(1)}%
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-4">
                                    <p className="text-xs sm:text-sm font-medium text-muted-foreground">{category}</p>
                                    <p className="text-lg sm:text-2xl font-bold mt-1" style={{ color }}>
                                        ${currentTotal.toFixed(2)}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )
                })}
            </div> */}

            <Card className="p-3 sm:p-6">
                <div className="h-[300px] sm:h-[400px] lg:h-[500px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={filteredData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke={isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                                vertical={false}
                            />
                            <XAxis
                                dataKey="month"
                                stroke={isDark ? "#888" : "#333"}
                                tickLine={false}
                                axisLine={false}
                                tick={{ fontSize: 12 }}
                                interval={window?.innerWidth < 768 ? 1 : 0}
                            />
                            <YAxis
                                stroke={isDark ? "#888" : "#333"}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `$${value}`}
                                tick={{ fontSize: 12 }}
                                width={60}
                            />
                            <Tooltip {...tooltipStyle} />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                wrapperStyle={{ fontSize: '12px' }}
                            />
                            {Object.entries(CATEGORIES).map(([category, { color }]) => (
                                <Bar
                                    key={category}
                                    dataKey={category}
                                    fill={color}
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={40}
                                />
                            ))}
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    )
}