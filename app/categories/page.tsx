"use client"

import { Suspense } from "react"
import Link from "next/link"
import { Edit, Plus, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data - in a real app, this would come from your database
const categoriesData = [
  {
    id: "1",
    name: "Groceries",
    type: "expense",
    description: "Food and household items",
    color: "#10b981",
  },
  {
    id: "2",
    name: "Housing",
    type: "expense",
    description: "Rent, mortgage, and home maintenance",
    color: "#3b82f6",
  },
  {
    id: "3",
    name: "Entertainment",
    type: "expense",
    description: "Movies, games, and subscriptions",
    color: "#f59e0b",
  },
  {
    id: "4",
    name: "Transportation",
    type: "expense",
    description: "Gas, public transit, and car maintenance",
    color: "#ef4444",
  },
  {
    id: "5",
    name: "Utilities",
    type: "expense",
    description: "Electricity, water, and internet",
    color: "#6366f1",
  },
  {
    id: "6",
    name: "Employment",
    type: "income",
    description: "Salary and wages",
    color: "#10b981",
  },
  {
    id: "7",
    name: "Investment",
    type: "income",
    description: "Dividends and capital gains",
    color: "#3b82f6",
  },
]

export default function CategoriesPage() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-2 sm:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Expense & Income Categories</CardTitle>
            <CardDescription>Manage categories to organize your finances.</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Color</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriesData.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color }} />
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="capitalize">{category.type}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link href={`/categories/${category.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Edit</span>
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
