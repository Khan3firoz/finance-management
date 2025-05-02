import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Transaction, TransactionFilters } from '../types/transaction';
import { Budget } from '../types/budget';
import { User, LoginCredentials, SignupCredentials } from '../types/auth';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Auth API
export const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) throw new Error('Login failed');
            return response.json();
        },
    });
};

export const useSignup = () => {
    return useMutation({
        mutationFn: async (credentials: SignupCredentials) => {
            const response = await fetch(`${API_URL}/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            if (!response.ok) throw new Error('Signup failed');
            return response.json();
        },
    });
};

// Transactions API
export const useTransactions = (filters: TransactionFilters) => {
    return useQuery({
        queryKey: ['transactions', filters],
        queryFn: async () => {
            const params = new URLSearchParams(filters as any);
            const response = await fetch(`${API_URL}/transactions?${params}`);
            if (!response.ok) throw new Error('Failed to fetch transactions');
            return response.json();
        },
    });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>) => {
            const response = await fetch(`${API_URL}/transactions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(transaction),
            });
            if (!response.ok) throw new Error('Failed to create transaction');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
};

// Budgets API
export const useBudgets = () => {
    return useQuery({
        queryKey: ['budgets'],
        queryFn: async () => {
            const response = await fetch(`${API_URL}/budgets`);
            if (!response.ok) throw new Error('Failed to fetch budgets');
            return response.json();
        },
    });
};

export const useCreateBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => {
            const response = await fetch(`${API_URL}/budgets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(budget),
            });
            if (!response.ok) throw new Error('Failed to create budget');
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
        },
    });
};