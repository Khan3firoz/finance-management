import apiClient from '@/app/config/api.config';
import { TransactionFilters } from '@/app/types/transaction';
import { Transaction } from '@/app/types/transaction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const BASE_URL = '/transactions';

// Transactions API endpoints
const transactionsApi = {
    getAll: async (filters: TransactionFilters): Promise<Transaction[]> => {
        const response = await apiClient.get<Transaction[]>(BASE_URL, { params: filters });
        return response.data;
    },

    getById: async (id: string): Promise<Transaction> => {
        const response = await apiClient.get<Transaction>(`${BASE_URL}/${id}`);
        return response.data;
    },

    create: async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
        const response = await apiClient.post<Transaction>(BASE_URL, transaction);
        return response.data;
    },

    update: async ({ id, ...transaction }: Transaction): Promise<Transaction> => {
        const response = await apiClient.put<Transaction>(`${BASE_URL}/${id}`, transaction);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${BASE_URL}/${id}`);
    },
};

// Transactions Query Hooks
export const useTransactions = (filters: TransactionFilters) => {
    return useQuery({
        queryKey: ['transactions', filters],
        queryFn: () => transactionsApi.getAll(filters),
    });
};

export const useTransaction = (id: string) => {
    return useQuery({
        queryKey: ['transactions', id],
        queryFn: () => transactionsApi.getById(id),
        enabled: !!id,
    });
};

export const useCreateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: transactionsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
        },
    });
};

export const useUpdateTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: transactionsApi.update,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.invalidateQueries({ queryKey: ['transactions', data.id] });
        },
    });
};

export const useDeleteTransaction = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: transactionsApi.delete,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            queryClient.removeQueries({ queryKey: ['transactions', id] });
        },
    });
};