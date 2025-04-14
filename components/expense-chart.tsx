"use client"

import { useState } from "react"
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

// Sample data - in a real app, this would come from your database
const monthlyData = [
  {
    name: "Jan",
    Groceries: 400,
    Rent: 1200,
    Utilities: 150,
    Entertainment: 300,
    Transportation: 200,
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
const pieData = [
  { name: "Groceries", value: 430, color: "#10b981" },
  { name: "Rent", value: 1200, color: "#3b82f6" },
  { name: "Utilities", value: 165, color: "#6366f1" },
  { name: "Entertainment", value: 330, color: "#f59e0b" },
  { name: "Transportation", value: 215, color: "#ef4444" },
]

// Prepare data for area chart
const areaData = monthlyData.map((item) => ({
  name: item.name,
  Total: item.Groceries + item.Rent + item.Utilities + item.Entertainment + item.Transportation,
}))

export function ExpenseChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [chartType, setChartType] = useState("bar")

  // Define vibrant colors for categories
  const colors = {
    Groceries: "#10b981", // emerald-500
    Rent: "#3b82f6", // blue-500
    Utilities: "#6366f1", // indigo-500
    Entertainment: "#f59e0b", // amber-500
    Transportation: "#ef4444", // red-500
  }

  // Common tooltip and chart grid styling
  const tooltipStyle = {
    contentStyle: {
      backgroundColor: isDark ? "#1f2937" : "#fff",
      borderColor: isDark ? "#374151" : "#e5e7eb",
      color: isDark ? "#fff" : "#000",
    },
  }

  return (
    <div className="space-y-4">
      <Tabs value={chartType} onValueChange={setChartType} className="w-full">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="bar">Bar Chart</TabsTrigger>
          <TabsTrigger value="line">Line Chart</TabsTrigger>
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          <TabsTrigger value="area">Area Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="bar" className="mt-4">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
              <XAxis dataKey="name" stroke={isDark ? "#888" : "#333"} />
              <YAxis stroke={isDark ? "#888" : "#333"} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Bar dataKey="Groceries" fill={colors.Groceries} />
              <Bar dataKey="Rent" fill={colors.Rent} />
              <Bar dataKey="Utilities" fill={colors.Utilities} />
              <Bar dataKey="Entertainment" fill={colors.Entertainment} />
              <Bar dataKey="Transportation" fill={colors.Transportation} />
            </BarChart>
          </ResponsiveContainer>
        </TabsContent>
        <TabsContent value="line" className="mt-4">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
              <XAxis dataKey="name" stroke={isDark ? "#888" : "#333"} />
              <YAxis stroke={isDark ? "#888" : "#333"} />
              <Tooltip {...tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="Groceries" stroke={colors.Groceries} activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="Rent" stroke={colors.Rent} />
              <Line type="monotone" dataKey="Utilities" stroke={colors.Utilities} />
              <Line type="monotone" dataKey="Entertainment" stroke={colors.Entertainment} />
              <Line type="monotone" dataKey="Transportation" stroke={colors.Transportation} />
            </LineChart>
          </ResponsiveContainer>
        </TabsContent>
        <TabsContent value="pie" className="mt-4">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...tooltipStyle} formatter={(value) => [`$${value}`, "Amount"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </TabsContent>
        <TabsContent value="area" className="mt-4">
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={areaData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
              <XAxis dataKey="name" stroke={isDark ? "#888" : "#333"} />
              <YAxis stroke={isDark ? "#888" : "#333"} />
              <Tooltip {...tooltipStyle} formatter={(value) => [`$${value}`, "Total Expenses"]} />
              <Area type="monotone" dataKey="Total" stroke="#8884d8" fill="#8884d8" />
            </AreaChart>
          </ResponsiveContainer>
        </TabsContent>
      </Tabs>
    </div>
  )
}
