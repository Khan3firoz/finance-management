"use client"

import { Suspense, useEffect, useState } from "react"
import { Edit, MoreVertical, Plus, Trash } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { fetchBudgetList, deleteBudget } from "@/app/service/budget.service"
import { toast } from "sonner"
import { useFinance } from "@/app/context/finance-context"
import { AddBudgetDialog } from "@/components/add-budget-dialog"

interface Budget {
    _id: string
    name: string
    amount: number
    spent: number
    categoryId: string
    category: {
        name: string
        color: string
    }
    startDate: string
    endDate: string
    recurring: string
    description?: string
}

export default function BudgetsPage() {
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [editBudget, setEditBudget] = useState<Budget | null>(null)
    const { refreshData } = useFinance()

    const loadBudgets = async () => {
        try {
            const response = await fetchBudgetList()
            if (response?.data?.budgets) {
                setBudgets(response.data.budgets)
            }
        } catch (error) {
            toast.error('Failed to load budgets')
        }
    }

    const handleDeleteBudget = async (id: string) => {
        try {
            await deleteBudget(id)
            toast.success('Budget deleted successfully')
            loadBudgets()
            refreshData()
        } catch (error) {
            toast.error('Failed to delete budget')
        }
    }

    useEffect(() => {
        loadBudgets()
    }, [])

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Budgets</CardTitle>
                        <CardDescription>Manage your budgets and spending limits</CardDescription>
                    </div>
                    <Button onClick={() => {
                        setEditBudget(null)
                        setIsAddDialogOpen(true)
                    }}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Budget
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Period</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {budgets.map((budget) => (
                                <TableRow key={budget.id}>
                                    <TableCell>{budget.name}</TableCell>
                                    <TableCell>₹{budget.amount.toLocaleString()}</TableCell>
                                    <TableCell>{budget.category.name}</TableCell>
                                    <TableCell>
                                        {new Date(budget.startDate).toLocaleDateString()} - {new Date(budget.endDate).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{budget.description}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                    <span className="sr-only">Open menu</span>
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setEditBudget(budget)
                                                        setIsAddDialogOpen(true)
                                                    }}
                                                >
                                                    <Edit className="mr-2 h-4 w-4" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    onClick={() => handleDeleteBudget(budget._id)}
                                                    className="text-red-600"
                                                >
                                                    <Trash className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Suspense>
            </CardContent>

            <AddBudgetDialog
                open={isAddDialogOpen}
                onClose={() => {
                    setIsAddDialogOpen(false)
                    setEditBudget(null)
                }}
                editBudget={editBudget}
                onSuccess={() => {
                    setIsAddDialogOpen(false)
                    setEditBudget(null)
                    loadBudgets()
                    refreshData()
                }}
            />
        </Card>
    )
}
