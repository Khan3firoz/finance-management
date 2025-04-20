"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { AlertTriangle } from "lucide-react";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, Title);

type Budget = {
    categoryName: string;
    categoryColor: string; // HEX or Tailwind color (e.g. #f43f5e)
    budget: number;
    spent: number;
    remaining: number;
};

const budgets: Budget[] = [
    {
        categoryName: "Groceries",
        categoryColor: "#ec4899", // pink
        budget: 12345,
        spent: 600,
        remaining: 11745,
    },
    {
        categoryName: "Utilities & Bills",
        categoryColor: "#a21caf", // magenta
        budget: 4500,
        spent: 10000,
        remaining: -5500,
    },
    {
        categoryName: "Entertainment",
        categoryColor: "#4ade80", // light-green
        budget: 4500,
        spent: 10000,
        remaining: -5500,
    },
    {
        categoryName: "Shopping",
        categoryColor: "#8b5cf6", // violet
        budget: 50000,
        spent: 0,
        remaining: 50000,
    },
];

const BudgetChart = () => {
    const spentColors = budgets.map((b) =>
        b.spent > b.budget ? "#ef4444" : b.categoryColor
    );

    const data = {
        labels: budgets.map((b) => b.categoryName),
        datasets: [
            {
                label: "Spent",
                data: budgets.map((b) => b.spent),
                backgroundColor: spentColors,
            },
            {
                label: "Remaining",
                data: budgets.map((b) => Math.max(0, b.remaining)),
                backgroundColor: "#10b981", // consistent green
            },
        ],
    };

    const options = {
        indexAxis: "y" as const,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: true,
                text: "Monthly Budget Overview",
                font: {
                    size: 18,
                },
                color: "#1f2937",
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const idx = context.dataIndex;
                        const b = budgets[idx];
                        return [
                            `Budget: ₹${b.budget.toLocaleString()}`,
                            `Spent: ₹${b.spent.toLocaleString()}`,
                            `Remaining: ₹${b.remaining.toLocaleString()}`,
                            ...(b.spent > b.budget ? ["⚠️ Over Budget!"] : []),
                        ];
                    },
                },
            },
            legend: {
                position: "bottom" as const,
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: function (value: number) {
                        return `₹${value.toLocaleString()}`;
                    },
                },
            },
        },
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-lg w-full max-w-5xl mx-auto">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-700 flex items-center gap-2">
                    Monthly Budget Overview
                </h2>
                <p className="text-sm text-gray-500">Hover to see details for each category</p>
            </div>

            <div className="h-[400px]">
                <Bar data={data} options={options} />
            </div>

            <div className="mt-4 text-sm text-red-500 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span>Red bar = Over Budget</span>
            </div>
        </div>
    );
};

export default BudgetChart;
