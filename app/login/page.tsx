"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Cookies from 'js-cookie'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { loginUser } from "@/app/service/user.service"
import storage from "@/utils/storage"

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(4, "Password must be at least 4 characters"),
})

export default function LoginPage() {
    const routes = useRouter()
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    // async function onSubmit(values: z.infer<typeof loginSchema>) {
    //     try {
    //         setIsLoading(true)
    //         await authService.login(values)
    //         toast.success("Logged in successfully")
    //         router.push("/dashboard")
    //         // router.refresh()
    //     } catch (error: any) {
    //         toast.error(error.message || "Invalid email or password")
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }

    const onSubmit = async (data: z.infer<typeof loginSchema>) => {
        try {
            const res = await loginUser(data)
            const token = res?.data?.accessToken

            if (token) {
                // Store token securely in cookie
                storage.setToken(token)
                // Cookies.set('token', token, {
                //     secure: true,
                //     sameSite: 'strict',
                //     expires: 7 // 7 days
                // })
                routes.push('/dashboard')
                toast.success("Logged in successfully")
            }
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Login failed")
            console.log(err, "error")
        }
    };


    return (
        <main className="flex min-h-screen items-center justify-center bg-background p-4 md:p-8">
            <div className="w-full max-w-[400px] space-y-6 rounded-lg border border-border/50 bg-card p-6 shadow-lg">
                <div className="flex flex-col space-y-2 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">
                        Enter your email to sign in to your account
                    </p>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button className="w-full" type="submit" disabled={isLoading}>
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>
                </Form>

                <p className="text-center text-sm text-muted-foreground">
                    <Link
                        href="/signup"
                        className="hover:text-brand underline underline-offset-4"
                    >
                        Don&apos;t have an account? Sign up
                    </Link>
                </p>
            </div>
        </main>
    )
}