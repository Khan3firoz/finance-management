"use client";

import { useState } from "react";
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
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { getMonthName } from "@/lib/utils";
import { NoDataFound } from "../no-data-found";
import { PiggyBank } from "lucide-react";

interface Budget {
  _id: string;
  budgetId: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  budget: number;
  spent: number;
  remaining: number;
}

interface BudgetData {
  month: number;
  year: number;
  totalBudgets: number;
  budgets: Budget[];
}

interface ApiResponse {
  statusCode: number;
  data: BudgetData;
  message: string;
  success: boolean;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const getStatusColor = (remaining: number) => {
  if (remaining < 0) return "text-red-500";
  if (remaining === 0) return "text-yellow-500";
  return "text-green-500";
};

const getProgressColor = (spent: number, budget: number) => {
  const percentage = (spent / budget) * 100;
  if (percentage > 100) return "bg-red-500";
  if (percentage > 75) return "bg-yellow-500";
  return "bg-green-500";
};

const defaultColors = [
  "#10b981", // emerald-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#3b82f6", // blue-500
  "#ec4899", // pink-500
  "#14b8a6", // teal-500
  "#f97316", // orange-500
];

const getCategoryColor = (color: any, index: any) => {
  // const colorMap: Record<string, string> = {
  //   pink: "bg-pink-500",
  //   magenta: "bg-fuchsia-500",
  //   "light-green": "bg-green-400",
  //   violet: "bg-violet-500",

  // };
  const colorMap = defaultColors[index % defaultColors.length];
  return colorMap[color] || "bg-gray-500";
};

const getCategoryHexColor = (color: string) => {
  const colorMap: Record<string, string> = {
    pink: "#ec4899",
    magenta: "#d946ef",
    "light-green": "#4ade80",
    violet: "#8b5cf6",
  };
  return colorMap[color] || "#6b7280";
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

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
  );
};

export default function BudgetVisualization({
  apiData,
  loading,
}: {
  apiData: ApiResponse;
  loading: boolean;
}) {
  const { data } = apiData;
  const [activeTab, setActiveTab] = useState("progress");

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="w-full">
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hasBudgets = data?.budgets?.length > 0;

  const sortedBudgets = [...(data.budgets || [])].sort((a, b) =>
    a.categoryName.localeCompare(b.categoryName)
  );

  const barChartData = data.budgets.map((item) => ({
    name: item.categoryName,
    Budget: item.budget,
    Spent: item.spent,
    fill: getCategoryHexColor(item.categoryColor),
  }));

  const budgetPieData = data.budgets.map((item) => ({
    name: item.categoryName,
    value: item.budget,
    color: getCategoryHexColor(item.categoryColor),
  }));

  const spentPieData = data.budgets.map((item) => ({
    name: item.categoryName,
    value: item.spent,
    color: getCategoryHexColor(item.categoryColor),
  }));

  return (
    <div className="py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl text-center">
            {getMonthName(data.month)} {data.year} - Monthly Budget Overview
          </CardTitle>
          <CardDescription className="text-center">
            {hasBudgets
              ? `Track your spending across ${data.totalBudgets} budget categories`
              : "No budget data available to display."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="progress"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="bar">Bar Chart</TabsTrigger>
              <TabsTrigger value="pie-spent">Spent Pie</TabsTrigger>
              <TabsTrigger value="cards">Cards</TabsTrigger>
            </TabsList>

            <TabsContent value="progress" className="pt-6">
              {hasBudgets ? (
                <TooltipProvider>
                  <div className="w-full space-y-6">
                    {data.budgets.map((budget, index) => (
                      <div key={`${budget._id}-${index}`} className="relative">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">
                            {budget.categoryName}
                          </span>
                          <span className="text-sm">
                            {formatCurrency(budget.spent)} /{" "}
                            {formatCurrency(budget.budget)}
                          </span>
                        </div>
                        <UITooltip>
                          <TooltipTrigger asChild>
                            <div className="w-full h-10 bg-gray-200 rounded-md relative cursor-pointer">
                              <div
                                className={`h-full rounded-md ${getCategoryColor(
                                  budget.categoryColor,
                                  index
                                )}`}
                                style={{
                                  width: `${Math.min(
                                    (budget.spent / budget.budget) * 100,
                                    100
                                  )}%`,
                                }}
                              />
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-medium text-white drop-shadow-md">
                                  {(
                                    (budget.spent / budget.budget) *
                                    100
                                  ).toFixed(0)}
                                  % used
                                </span>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent
                            className="p-0 bg-white"
                            sideOffset={5}
                          >
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
                                <span
                                  className={getStatusColor(budget.remaining)}
                                >
                                  {formatCurrency(budget.remaining)}
                                </span>
                              </div>
                              <div className="flex justify-between gap-4">
                                <span className="font-medium">Status:</span>
                                <span
                                  className={getStatusColor(budget.remaining)}
                                >
                                  {budget.remaining < 0
                                    ? "Overspent"
                                    : "Under Budget"}
                                </span>
                              </div>
                            </div>
                          </TooltipContent>
                        </UITooltip>
                      </div>
                    ))}
                  </div>
                </TooltipProvider>
              ) : (
                <NoDataFound
                  title="No Budget Data Found"
                  description="No budget data available to display."
                  isActionRequired={false}
                  icon={
                    <PiggyBank className="h-10 w-10 text-muted-foreground" />
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="bar" className="pt-6">
              {hasBudgets ? (
                <div className="w-full h-[400px]">
                  <ChartContainer
                    config={{
                      Budget: { label: "Budget", color: "#8884d8" },
                      Spent: { label: "Spent", color: "#82ca9d" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={barChartData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={70}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          tickFormatter={(v) => `₹${v.toLocaleString()}`}
                          width={80}
                        />
                        <Tooltip
                          content={
                            <ChartTooltipContent
                              formatter={(value) => [
                                formatCurrency(value as number),
                                "Amount",
                              ]}
                            />
                          }
                        />
                        <Legend />
                        <Bar dataKey="Budget">
                          {barChartData.map((entry, i) => (
                            <Cell key={`budget-${i}`} fill={entry.fill} />
                          ))}
                        </Bar>
                        <Bar dataKey="Spent">
                          {barChartData.map((entry, i) => (
                            <Cell key={`spent-${i}`} fill={entry.fill} opacity={0.7} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              ) : (
                <NoDataFound
                  title="No Budget Data Found"
                  description="No budget data available to display."
                  isActionRequired={false}
                  icon={
                    <PiggyBank className="h-10 w-10 text-muted-foreground" />
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="pie-spent" className="pt-6">
              {hasBudgets ? (
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
                          <Cell key={`pie-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(value as number),
                          "Spent",
                        ]}
                        labelFormatter={(name) => `Category: ${name}`}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-4 text-sm text-muted-foreground">
                    Spending distribution across categories
                  </div>
                </div>
              ) : (
                <NoDataFound
                  title="No Budget Data Found"
                  description="No budget data available to display."
                  isActionRequired={false}
                  icon={
                    <PiggyBank className="h-10 w-10 text-muted-foreground" />
                  }
                />
              )}
            </TabsContent>

            <TabsContent value="cards" className="pt-6">
              {hasBudgets ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sortedBudgets.map((budget, index) => (
                    <Card key={`${budget._id}-card-${index}`} className="overflow-hidden">
                      <div
                        className={`h-2 w-full ${getCategoryColor(
                          budget.categoryColor,
                          index
                        )}`}
                      />
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle>{budget.categoryName}</CardTitle>
                          <span
                            className={`font-bold ${getStatusColor(
                              budget.remaining
                            )}`}
                          >
                            {budget.remaining < 0 ? "Overspent" : "Remaining"}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between text-sm">
                            <span>Budget</span>
                            <span className="font-medium">
                              {formatCurrency(budget.budget)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Spent</span>
                            <span className="font-medium">
                              {formatCurrency(budget.spent)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span>Remaining</span>
                            <span
                              className={`font-medium ${getStatusColor(
                                budget.remaining
                              )}`}
                            >
                              {formatCurrency(budget.remaining)}
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs">
                              <span>
                                Spent{" "}
                                {((budget.spent / budget.budget) * 100).toFixed(
                                  0
                                )}
                                %
                              </span>
                            </div>
                            <Progress
                              value={Math.min(
                                (budget.spent / budget.budget) * 100,
                                100
                              )}
                              className="h-2"
                              indicatorClassName={getProgressColor(
                                budget.spent,
                                budget.budget
                              )}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <NoDataFound
                  title="No Budget Data Found"
                  description="No budget data available to display."
                  isActionRequired={false}
                  icon={
                    <PiggyBank className="h-10 w-10 text-muted-foreground" />
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
