"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartTypeDropdown } from "@/components/chart-type-dropdown"
import { useForm } from "react-hook-form"

interface ChartData {
  name: string;
  Groceries: number;
  Rent: number;
  Utilities: number;
  Entertainment: number;
  Transportation: number;
}

interface PieData {
  name: string;
  value: number;
  color: string;
}

// Sample data - in a real app, this would come from your database
const monthlyData: ChartData[] = [
  {
    name: "Jan",
    Groceries: 400,
    Rent: 1200,
    Utilities: 150,
    Entertainment: 200,
    Transportation: 100,
  },
  {
    name: "Feb",
    Groceries: 380,
    Rent: 1200,
    Utilities: 140,
    Entertainment: 250,
    Transportation: 180,
  },
  {
    name: "Mar",
    Groceries: 420,
    Rent: 1200,
    Utilities: 160,
    Entertainment: 320,
    Transportation: 210,
  },
  {
    name: "Apr",
    Groceries: 390,
    Rent: 1200,
    Utilities: 145,
    Entertainment: 280,
    Transportation: 190,
  },
  {
    name: "May",
    Groceries: 410,
    Rent: 1200,
    Utilities: 155,
    Entertainment: 310,
    Transportation: 205,
  },
  {
    name: "Jun",
    Groceries: 430,
    Rent: 1200,
    Utilities: 165,
    Entertainment: 330,
    Transportation: 215,
  },
]

// Prepare data for pie chart
const pieData: PieData[] = [
  { name: "Groceries", value: 400, color: "#10b981" },
  { name: "Rent", value: 1200, color: "#3b82f6" },
  { name: "Utilities", value: 150, color: "#6366f1" },
  { name: "Entertainment", value: 200, color: "#f59e0b" },
  { name: "Transportation", value: 100, color: "#ef4444" },
]

// Prepare data for area chart
const areaData = monthlyData.map((item) => ({
  name: item.name,
  Total: item.Groceries + item.Rent + item.Utilities + item.Entertainment + item.Transportation,
}))

interface ExpenseChartProps {
  chartType: 'bar' | 'line' | 'pie' | 'area'
}

interface FormData {
  amount: number;
  category: string;
  description: string;
  date: Date;
}

function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Call handler right away so state gets updated with initial window size
    handleResize()

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return windowSize
}

export function ExpenseChart({ chartType }: ExpenseChartProps) {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const { width } = useWindowSize()
  const isMobile = width < 768

  const fontSize: { axis: number; legend: number } = {
    axis: isMobile ? 12 : 14,
    legend: isMobile ? 10 : 12,
  }

  const form = useForm<FormData>({
    defaultValues: {
      amount: 0,
      category: "",
      description: "",
      date: new Date(),
    },
  })

  // Define vibrant colors for categories
  const colors = {
    Groceries: "#10b981", // emerald-500
    Rent: "#3b82f6", // blue-500
    Utilities: "#6366f1", // indigo-500
    Entertainment: "#f59e0b", // amber-500
    Transportation: "#ef4444", // red-500
  }

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderColor: isDark ? "#374151" : "#e5e7eb",
      borderRadius: "0.375rem",
      padding: "0.5rem",
    },
    formatter: (value: number) => [`$${value.toFixed(2)}`, "Amount"],
  }

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <BarChart width="100%" height={350} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
            <XAxis
              dataKey="name"
              stroke={isDark ? "#888" : "#333"}
              tick={{ fontSize: fontSize.axis }}
            />
            <YAxis
              stroke={isDark ? "#888" : "#333"}
              tick={{ fontSize: fontSize.axis }}
            />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: fontSize.legend }} />
            <Bar dataKey="Groceries" fill={colors.Groceries} />
            <Bar dataKey="Rent" fill={colors.Rent} />
            <Bar dataKey="Utilities" fill={colors.Utilities} />
            <Bar dataKey="Entertainment" fill={colors.Entertainment} />
            <Bar dataKey="Transportation" fill={colors.Transportation} />
          </BarChart>
        )
      case 'line':
        return (
          <LineChart width="100%" height={350} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
            <XAxis
              dataKey="name"
              stroke={isDark ? "#888" : "#333"}
              tick={{ fontSize: fontSize.axis }}
            />
            <YAxis
              stroke={isDark ? "#888" : "#333"}
              tick={{ fontSize: fontSize.axis }}
            />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: fontSize.legend }} />
            <Line type="monotone" dataKey="Groceries" stroke={colors.Groceries} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="Rent" stroke={colors.Rent} />
            <Line type="monotone" dataKey="Utilities" stroke={colors.Utilities} />
            <Line type="monotone" dataKey="Entertainment" stroke={colors.Entertainment} />
            <Line type="monotone" dataKey="Transportation" stroke={colors.Transportation} />
          </LineChart>
        )
      case 'pie':
        return (
          <PieChart width={400} height={350}>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => isMobile ? `${(percent * 100).toFixed(0)}%` : `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: fontSize.legend }} />
          </PieChart>
        )
      case 'area':
        return (
          <AreaChart width="100%" height={350} data={areaData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
            <XAxis
              dataKey="name"
              stroke={isDark ? "#888" : "#333"}
              tick={{ fontSize: fontSize.axis }}
            />
            <YAxis
              stroke={isDark ? "#888" : "#333"}
              tick={{ fontSize: fontSize.axis }}
            />
            <Tooltip {...tooltipStyle} />
            <Area type="monotone" dataKey="Total" stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        )
      default:
        return (
          <BarChart width="100%" height={350} data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
            <XAxis
              dataKey="name"
              stroke={isDark ? "#888" : "#333"}
              tick={{ fontSize: fontSize.axis }}
            />
            <YAxis
              stroke={isDark ? "#888" : "#333"}
              tick={{ fontSize: fontSize.axis }}
            />
            <Tooltip {...tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: fontSize.legend }} />
            <Bar dataKey="Groceries" fill={colors.Groceries} />
            <Bar dataKey="Rent" fill={colors.Rent} />
            <Bar dataKey="Utilities" fill={colors.Utilities} />
            <Bar dataKey="Entertainment" fill={colors.Entertainment} />
            <Bar dataKey="Transportation" fill={colors.Transportation} />
          </BarChart>
        )
    }
  }

  return (
    <div className="space-y-4 px-[10px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0">
        <h3 className="text-base sm:text-lg font-medium">Expense Overview</h3>
        <div className="flex items-center gap-2 w-full sm:w-auto">

        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height={350}>
          {renderChart()}
        </ResponsiveContainer>
      </div>
    </div>
  )
}
