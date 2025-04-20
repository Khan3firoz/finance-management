"use client";

import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const CategorySpentChart = ({ budgets }: any) => {
    const [chartHeight, setChartHeight] = useState(400);

    useEffect(() => {
        const updateChartHeight = () => {
            if (window.innerWidth < 640) {
                setChartHeight(300);
            } else {
                setChartHeight(400);
            }
        };

        updateChartHeight();
        window.addEventListener('resize', updateChartHeight);
        return () => window.removeEventListener('resize', updateChartHeight);
    }, []);

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: {
                    color: '#8884d8',
                    font: {
                        size: 12
                    }
                }
            },
            tooltip: {
                backgroundColor: 'rgba(55, 65, 81, 0.9)',
                titleColor: '#fff',
                bodyColor: '#fff',
                borderColor: '#8884d8',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                callbacks: {
                    label: function (context: any) {
                        const value = context.raw;
                        const label = context.dataset.label;
                        if (context.datasetIndex === 2) {
                            return `Over Budget: ${value}`;
                        }
                        return `${label}: ${value}`;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                grid: {
                    color: 'rgba(136, 132, 216, 0.1)'
                },
                ticks: {
                    color: '#8884d8'
                }
            },
            y: {
                stacked: true,
                grid: {
                    color: 'rgba(136, 132, 216, 0.1)'
                },
                ticks: {
                    color: '#8884d8'
                },
                beginAtZero: true
            }
        }
    };

    const data = {
        labels: budgets.map((budget: any) => budget.categoryName),
        datasets: [
            {
                label: 'Remaining',
                data: budgets.map((budget: any) => Math.max(0, budget.monthlyBudget - budget.spent)),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1,
                borderRadius: 6,
            },
            {
                label: 'Spent',
                data: budgets.map((budget: any) => Math.min(budget.spent, budget.monthlyBudget)),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 6,
            },
            {
                label: 'Over Budget',
                data: budgets.map((budget: any) => Math.max(0, budget.spent - budget.monthlyBudget)),
                backgroundColor: 'rgba(239, 68, 68, 0.8)',
                borderColor: 'rgb(239, 68, 68)',
                borderWidth: 1,
                borderRadius: 6,
            }
        ]
    };

    return (
        <div className="w-full h-auto">
            <h2 className="text-sm sm:text-base font-medium mb-1 sm:mb-2 text-white">Category Spending</h2>
            <div style={{ height: chartHeight }}>
                <Bar options={options} data={data} />
            </div>
        </div>
    );
};

export default CategorySpentChart;
