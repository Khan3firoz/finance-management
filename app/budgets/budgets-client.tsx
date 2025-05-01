"use client";

import { useState } from "react";
import { Edit, MoreVertical, PiggyBank, Plus, Trash } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchBudgetList, deleteBudget } from "@/app/service/budget.service";
import { toast } from "sonner";
import { useFinance } from "@/app/context/finance-context";
import { AddBudgetDialog } from "@/components/add-budget-dialog";
import { NoDataFound } from "@/components/no-data-found";
interface AllBudget {
  _id: string;
  name: string;
  amount: number;
  spent: number;
  categoryId: string;
  category: {
    _id: string;
    name: string;
    color: string;
  };
  startDate: string;
  endDate: string;
  recurring: string;
  description?: string;
}

export function BudgetsClient() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editBudget, setEditBudget] = useState<AllBudget | null>(null);
  const { budgetsSummry, loading, refreshData, allBudgets } = useFinance();
  console.log(budgetsSummry);

  const handleDeleteBudget = async (id: string) => {
    try {
      await deleteBudget(id);
      toast.success("Budget deleted successfully");
      refreshData();
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Budgets</CardTitle>
            <CardDescription>
              Manage your budgets and spending limits
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              setEditBudget(null);
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Budget
          </Button>
        </div>
      </CardHeader>
      {budgetsSummry.length > 0 ? (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-[100px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[80px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[120px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[150px]" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-[200px]" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-8 w-8 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                : allBudgets.map((budget) => (
                    <TableRow key={budget?._id}>
                      <TableCell>{budget.name}</TableCell>
                      <TableCell>₹{budget.amount.toLocaleString()}</TableCell>
                      <TableCell>{budget.category.name}</TableCell>
                      <TableCell>
                        {new Date(budget.startDate).toLocaleDateString()} -{" "}
                        {new Date(budget.endDate).toLocaleDateString()}
                      </TableCell>
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
                                const transformedBudget = {
                                  ...budget,
                                  spent: 0,
                                  categoryId: budget.category._id,
                                  category: {
                                    ...budget.category,
                                    color: "#000000", // Default color
                                  },
                                };
                                setEditBudget(transformedBudget);
                                setIsAddDialogOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteBudget(budget?._id)}
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
        </CardContent>
      ) : (
        <NoDataFound
          title="No Budget Data Found"
          description="No budget data available to display."
          isActionRequired={true}
          icon={<PiggyBank className="h-10 w-10 text-muted-foreground" />}
          onAddClick={() => {
            setIsAddDialogOpen(true);
            setEditBudget(null);
          }}
          addButtonText="Add Budget"
        />
      )}

      <AddBudgetDialog
        open={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditBudget(null);
        }}
        editBudget={editBudget}
        onSuccess={() => {
          setIsAddDialogOpen(false);
          setEditBudget(null);
          refreshData();
        }}
      />
    </Card>
  );
}
