import { TransactionCategory } from './transaction';

export interface Budget {
    id: string;
    userId: string;
    category: TransactionCategory;
    amount: number;
    period: 'monthly' | 'yearly';
    startDate: string;
    endDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface BudgetProgress {
    category: TransactionCategory;
    budgeted: number;
    spent: number;
    remaining: number;
    percentage: number;
}

export interface BudgetStats {
    totalBudgeted: number;
    totalSpent: number;
    remaining: number;
    categoryProgress: BudgetProgress[];
}