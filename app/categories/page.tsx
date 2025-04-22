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
  _id: string
  name: string
  type: string
  description: string
  color: string
}



export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<Category | null>(null)
  const { refreshData } = useFinance()

  const loadCategories = async () => {
    try {
      const response = await fetchCategory()
      if (response?.data?.categories) {
        setCategories(response.data.categories)
      }
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory(id)
      toast.success('Category deleted successfully')
      loadCategories()
      refreshData()
    } catch (error) {
      toast.error('Failed to delete category')
    }
  }

  useEffect(() => {
    loadCategories()
  }, [])

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Manage your expense and income categories</CardDescription>
          </div>
          <Button onClick={() => {
            setEditCategory(null)
            setIsAddDialogOpen(true)
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.name}</TableCell>
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
                            setEditCategory(category)
                            setIsAddDialogOpen(true)
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
        </Suspense>
      </CardContent>

      <AddCategoryDialog
        open={isAddDialogOpen}
        onClose={() => {
          setIsAddDialogOpen(false)
          setEditCategory(null)
        }}
        editCategory={editCategory}
        onSuccess={() => {
          setIsAddDialogOpen(false)
          setEditCategory(null)
          loadCategories()
          refreshData()
        }}
      />
    </Card>
  )
}
