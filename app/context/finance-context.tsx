"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { fetchAccountList, fetchAccountStatsSummary, fetchAllTransaction, fetchIncomeExpense } from "@/app/service/account.service"
import { startOfMonth } from "date-fns"
import { fetchCategory } from "../service/category.service"
import storage from "@/utils/storage"
import { fetchBudgetList } from "../service/budget.service"

interface Account {
    _id: string
    name: string
    balance: number
    type: string
}

interface Transaction {
    _id: string
    amount: number
    type: 'income' | 'expense'
    category: string
    date: Date
    description: string
    accountId: string
}

interface Category {
    _id: string
    name: string
    type: 'credit' | 'debit'
    budget?: number
}

interface Budget {
    _id: string
    categoryId: string
    amount: number
    period: 'monthly' | 'yearly'
    startDate: Date
    endDate: Date
}

interface FinanceContextType {
    accounts: Account[]
    transactions: Transaction[]
    categories: Category[]
    budgets: Budget[]
    categoriesRes: Category[] | null
    userData: any
    summary: {
        netAmount: number
        totalIncome: number
        totalExpense: number
    } | null
    incomeExpense: {
        income: number
        expense: number
    } | null
    loading: boolean
    error: string | null
    refreshData: () => Promise<void>
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined)

export function FinanceProvider({ children }: { children: ReactNode }) {
    const [accounts, setAccounts] = useState<Account[]>([])
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [budgets, setBudgets] = useState<Budget[]>([])
    const [summary, setSummary] = useState<FinanceContextType['summary']>(null)
    const [incomeExpense, setIncomeExpense] = useState<FinanceContextType['incomeExpense']>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userData, setUserData] = useState<any>(null)

    useEffect(() => {
        const userData = storage.getUser()
        if (userData) {
            setUserData(userData)
        }
    }, [])

    const refreshData = async () => {
        try {
            setLoading(true)
            setError(null)

            // Fetch all data in parallel
            const [accountsRes, transactionsRes, summaryRes, incomeExpenseRes, categoriesRes, budgetRes] = await Promise.all([
                fetchAccountList(),
                fetchAllTransaction('all', startOfMonth(new Date()), new Date()),
                fetchAccountStatsSummary(),
                fetchIncomeExpense({ filterType: "monthly", date: new Date(), month: new Date().getMonth() + 1, year: new Date().getFullYear() }),
                fetchCategory(),
                fetchBudgetList()
            ])

            setAccounts(accountsRes?.data?.accounts || [])
            setTransactions(transactionsRes?.data?.transactions || [])
            setSummary(summaryRes?.data || null)
            setIncomeExpense(incomeExpenseRes?.data || null)
            setCategories(categoriesRes?.data?.categories || [])
            setBudgets(budgetRes?.data?.budgets || [])

            // TODO: Add API calls for categories and budgets when available
            // For now, using mock data
            // setCategories([
            //     { id: '1', name: 'Groceries', type: 'debit' },
            //     { id: '2', name: 'Salary', type: 'credit' },
            //     { id: '3', name: 'Rent', type: 'debit' },
            //     { id: '4', name: 'Utilities', type: 'debit' },
            //     { id: '5', name: 'Entertainment', type: 'debit' },
            //     { id: '6', name: 'Transportation', type: 'debit' }
            // ])

            // setBudgets([
            //     {
            //         id: '1',
            //         categoryId: '1',
            //         amount: 1000,
            //         period: 'monthly',
            //         startDate: startOfMonth(new Date()),
            //         endDate: new Date()
            //     }
            // ])

        } catch (err) {
            setError('Failed to fetch data')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        refreshData()
    }, [])

    return (
        <FinanceContext.Provider value={{
            accounts,
            transactions,
            categories,
            budgets,
            summary,
            incomeExpense,
            loading,
            error,
            refreshData,
            userData
        }}>
            {children}
        </FinanceContext.Provider>
    )
}

export function useFinance() {
    const context = useContext(FinanceContext)
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider')
    }
    return context
}