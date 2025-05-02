import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Budget, BudgetStats } from '@/app/types/budget';
import apiClient from '@/app/config/api.config';

const BASE_URL = '/budgets';

// Budgets API endpoints
const budgetsApi = {
    getAll: async (): Promise<Budget[]> => {
        const response = await apiClient.get<Budget[]>(BASE_URL);
        return response.data;
    },

    getById: async (id: string): Promise<Budget> => {
        const response = await apiClient.get<Budget>(`${BASE_URL}/${id}`);
        return response.data;
    },

    create: async (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>): Promise<Budget> => {
        const response = await apiClient.post<Budget>(BASE_URL, budget);
        return response.data;
    },

    update: async ({ id, ...budget }: Budget): Promise<Budget> => {
        const response = await apiClient.put<Budget>(`${BASE_URL}/${id}`, budget);
        return response.data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`${BASE_URL}/${id}`);
    },

    getStats: async (): Promise<BudgetStats> => {
        const response = await apiClient.get<BudgetStats>(`${BASE_URL}/stats`);
        return response.data;
    },
};

// Budgets Query Hooks
export const useBudgets = () => {
    return useQuery({
        queryKey: ['budgets'],
        queryFn: budgetsApi.getAll,
    });
};

export const useBudget = (id: string) => {
    return useQuery({
        queryKey: ['budgets', id],
        queryFn: () => budgetsApi.getById(id),
        enabled: !!id,
    });
};

export const useBudgetStats = () => {
    return useQuery({
        queryKey: ['budgets', 'stats'],
        queryFn: budgetsApi.getStats,
    });
};

export const useCreateBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: budgetsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['budgets', 'stats'] });
        },
    });
};

export const useUpdateBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: budgetsApi.update,
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.invalidateQueries({ queryKey: ['budgets', data.id] });
            queryClient.invalidateQueries({ queryKey: ['budgets', 'stats'] });
        },
    });
};

export const useDeleteBudget = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: budgetsApi.delete,
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: ['budgets'] });
            queryClient.removeQueries({ queryKey: ['budgets', id] });
            queryClient.invalidateQueries({ queryKey: ['budgets', 'stats'] });
        },
    });
};