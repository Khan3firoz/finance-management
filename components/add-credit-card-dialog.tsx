"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { CreditCard } from "lucide-react"

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

type FormValues = {
    cardName: string
    cardNumber: string
    expiryDate: string
    cvv: string
    limit: number
}

const formSchema = yup.object({
    cardName: yup.string().required("Card name is required"),
    cardNumber: yup.string().matches(/^\d{16}$/, "Card number must be 16 digits").required("Card number is required"),
    expiryDate: yup.string().matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry date must be in MM/YY format").required("Expiry date is required"),
    cvv: yup.string().matches(/^\d{3,4}$/, "CVV must be 3 or 4 digits").required("CVV is required"),
    limit: yup.number().positive("Limit must be positive").required("Credit limit is required"),
}).required()

export function AddCreditCardDialog() {
    const [open, setOpen] = useState(false)

    const form = useForm<FormValues>({
        resolver: yupResolver(formSchema),
        defaultValues: {
            cardName: "",
            cardNumber: "",
            expiryDate: "",
            cvv: "",
            limit: 0,
        },
    })

    const onSubmit = (values: FormValues) => {
        // In a real app, you would save the credit card to your database here
        console.log(values)
        setOpen(false)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Add Credit Card
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Credit Card</DialogTitle>
                    <DialogDescription>
                        Add a new credit card to track your expenses and payments.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="cardName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Card Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Chase Sapphire" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cardNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Card Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="1234 5678 9012 3456" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="expiryDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Expiry Date</FormLabel>
                                        <FormControl>
                                            <Input placeholder="MM/YY" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cvv"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CVV</FormLabel>
                                        <FormControl>
                                            <Input placeholder="123" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="limit"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Credit Limit</FormLabel>
                                    <FormControl>
                                        <Input type="number" placeholder="5000" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Add Credit Card</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}