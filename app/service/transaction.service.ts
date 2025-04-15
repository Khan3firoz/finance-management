import axios from "axios"
import { storage } from "@/lib/utils"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface GetTransactionsParams {
    page: number
    limit: number
    startDate?: string
    endDate?: string
    type?: 'credit' | 'debit'
}

interface Transaction {
    _id: string
    transactionType: string
    category: {
        name: string
        icon: string
    }
    amount: number
    type: "credit" | "debit"
    description: string
    date: string
}

interface TransactionsResponse {
    data: Transaction[]
    total: number
    page: number
    limit: number
}

export const transactionService = {
    async getTransactions(params: GetTransactionsParams): Promise<{ data: TransactionsResponse }> {
        const token = storage.getToken()
        const response = await axios.get(`${API_URL}/transactions`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            params: {
                page: params.page,
                limit: params.limit,
                startDate: params.startDate,
                endDate: params.endDate,
                type: params.type,
            },
        })
        return response
    },
}