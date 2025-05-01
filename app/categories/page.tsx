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
import { fetchCategory, deleteCategory } from "@/app/service/category.service"
import { toast } from "sonner"
import { useFinance } from "@/app/context/finance-context"
import { AddCategoryDialog } from "@/components/add-category-dialog"

type CategoryType = 'debit' | 'credit';

interface Category {
  _id: string;
  name: string;
  type: string;
  description: string;
  color: string;
  transactionType: string;
}

export default function CategoriesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const { categories, loading, refreshData } = useFinance();

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success("Category deleted successfully");
      refreshData();
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage your transaction categories
            </CardDescription>
          </div>
          <Button
            onClick={() => {
              setEditCategory(null);
              setIsAddDialogOpen(true);
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Color</TableHead>
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
                        <Skeleton className="h-4 w-[60px]" />
                      </TableCell>
                      <TableCell className="text-right">
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
              : categories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell
                      className={`${
                        category.transactionType === "debit"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      {category.transactionType === "debit"
                        ? "Debit"
                        : "Credit"}
                    </TableCell>
                    <TableCell>
                      <div
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
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
                              setEditCategory(category);
                              setIsAddDialogOpen(true);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteCategory(category._id)}
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

      <AddCategoryDialog
        open={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false);
          setEditCategory(null);
        }}
        editCategory={editCategory}
        onSuccess={() => {
          setIsAddDialogOpen(false);
          setEditCategory(null);
          refreshData();
        }}
      />
    </Card>
  );
}
