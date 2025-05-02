"use client"

import { useForm } from "react-hook-form"
import * as yup from "yup"
import { yupResolver } from "@hookform/resolvers/yup"
import { ArrowRightLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { useFinance } from "@/app/context/finance-context"
import { toast } from "sonner"
import storage from "@/utils/storage"
import { Checkbox } from "@/components/ui/checkbox"
import { createTransfer } from "@/app/service/account.service"

interface TransferFormValues {
  sourceAccountId: string
  destinationAccountId: string
  amount: number
  description: string
  categoryId: string
  tags?: string[]
  isBillPayment: boolean
}

const formSchema = yup.object().shape({
  sourceAccountId: yup.string().required("Source account is required"),
  destinationAccountId: yup.string().required("Destination account is required"),
  amount: yup
    .number()
    .required("Amount is required")
    .positive("Amount must be positive")
    .typeError("Amount must be a number"),
  description: yup.string().required("Description is required"),
  categoryId: yup.string().required("Category is required"),
  tags: yup.array().of(yup.string()).optional(),
  isBillPayment: yup.boolean().default(false),
})

interface AddTransferModalProps {
  open: boolean
  onClose: () => void
}

export function AddTransferModal({ open, onClose }: AddTransferModalProps) {
  const { accounts, categories, refreshData } = useFinance()
  const userData = storage.getUser()

  const form = useForm<TransferFormValues>({
    resolver: yupResolver(formSchema) as any,
    defaultValues: {
      sourceAccountId: "",
      destinationAccountId: "",
      amount: 0,
      description: "",
      categoryId: "",
      tags: [],
      isBillPayment: false,
    },
  })

  async function onSubmit(values: TransferFormValues) {
    try {
      const payload = {
        ...values,
        userId: userData?._id,
      }
      await createTransfer(payload)
      refreshData()
      form.reset()
      toast.success("Transfer created successfully")
      onClose()
    } catch (error) {
      console.error(error)
      toast.error("Failed to create transfer")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Transfer</DialogTitle>
          <DialogDescription>
            Transfer money between your accounts
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="sourceAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Account</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts?.map((account) => (
                        <SelectItem key={account._id} value={account._id}>
                          {account.accountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="destinationAccountId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Account</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination account" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {accounts?.map((account) => (
                        <SelectItem key={account._id} value={account._id}>
                          {account.accountName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2">
                        ₹
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        className="pl-7"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isBillPayment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Bill Payment</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Mark this transfer as a bill payment
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <ArrowRightLeft className="mr-2 h-4 w-4" />
                Transfer
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 