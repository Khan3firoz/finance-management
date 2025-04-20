"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { Tag } from "lucide-react"
import { createCategory } from "@/app/service/category.service"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { useFinance } from "@/app/context/finance-context"

type FormValues = {
    name: string
    transactionType: "credit" | "debit"
}

const formSchema = yup.object({
    name: yup.string().required("Category name is required"),
    transactionType: yup.string().oneOf(["credit", "debit"] as const).required("Category type is required"),
}).required()

export function AddCategoryDialog() {
    const [open, setOpen] = useState(false)
    const { refreshData, userData } = useFinance()

    const form = useForm<FormValues>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            name: "",
            transactionType: "debit",
        },
    })


    const onSubmit = async (values: FormValues) => {
        const payload = {
            ...values,
            userId: userData?.user?._id,
            parentCategory: null,
        }
        try {
            const res = await createCategory(payload)
            refreshData()
            console.log(res, "res")
            toast.success("Category added succesfully")
            setOpen(false)
            form.reset()
        } catch (error) {
            console.log(error, "error")
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Add Category
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                    <DialogDescription>
                        Create a new category to organize your transactions.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Groceries" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="transactionType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a type" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="debit">Expense</SelectItem>
                                            <SelectItem value="credit">Income</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Add Category</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
