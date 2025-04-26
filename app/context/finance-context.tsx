"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { fetchAccountList, fetchAccountStatsSummary, fetchAllTransaction, fetchIncomeExpense } from "@/app/service/account.service"
import { startOfMonth } from "date-fns"
import { fetchCategory } from "../service/category.service"
import storage from "@/utils/storage"
import { fetchBudgetSummary } from "../service/budget.service"

interface Account {
    _id: string
    name: string
    balance: number
    type: string
    iconName: string
    limit?: number
    accountName: string
    accountType: string
    currency: string
}

interface Transaction {
    _id: string
    amount: number
    type: string
    category: string
    date: string
    description: string
}

interface Category {
  _id: string;
  name: string;
  icon: string;
  transactionType: string;
}

interface Budget {
  _id: string;
  budgetId: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
  budget: number;
  spent: number;
  remaining: number;
}

interface FinanceContextType {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
  budgetsSummry: Budget[];
  summary: {
    netAmount: number;
    totalIncome: number;
    totalExpense: number;
  } | null;
  incomeExpense: {
    income: number;
    expense: number;
  } | null;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  userData?: any;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgetsSummry, setBudgetsSummry] = useState<Budget[]>([]);
  const [summary, setSummary] = useState<FinanceContextType["summary"]>(null);
  const [incomeExpense, setIncomeExpense] =
    useState<FinanceContextType["incomeExpense"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const userData = storage.getUser();
    if (userData) {
      setUserData(userData);
    }
  }, []);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      const [
        accountsRes,
        transactionsRes,
        summaryRes,
        incomeExpenseRes,
        categoriesRes,
        budgetsRes,
      ] = await Promise.all([
        fetchAccountList(),
        fetchAllTransaction("all", startOfMonth(new Date()), new Date()),
        fetchAccountStatsSummary(),
        fetchIncomeExpense({
          filterType: "monthly",
          date: new Date(),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        }),
        fetchCategory(),
        fetchBudgetSummary({
          period: "monthly",
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        }),
      ]);

      // Set accounts with proper type checking
      const fetchedAccounts = accountsRes?.data?.accounts || [];
      setAccounts(Array.isArray(fetchedAccounts) ? fetchedAccounts : []);

      // Set transactions with proper type checking
      const fetchedTransactions = transactionsRes?.data?.transactions || [];
      setTransactions(
        Array.isArray(fetchedTransactions) ? fetchedTransactions : []
      );

      // Set categories with proper type checking
      const fetchedCategories = categoriesRes?.data?.categories || [];
      setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);

      // Set budgets with proper type checking
      const fetchedBudgets = budgetsRes?.data?.budgets || [];
      setBudgetsSummry(Array.isArray(fetchedBudgets) ? fetchedBudgets : []);

      // Set summary and incomeExpense
      setSummary(summaryRes?.data || null);
      setIncomeExpense(incomeExpenseRes?.data || null);
    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) {
      refreshData();
    }
  }, [userData]);

  return (
    <FinanceContext.Provider
      value={{
        accounts,
        transactions,
        categories,
        budgetsSummry,
        summary,
        incomeExpense,
        loading,
        error,
        refreshData,
        userData,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
    const context = useContext(FinanceContext)
    if (context === undefined) {
        throw new Error('useFinance must be used within a FinanceProvider')
    }
    return context
}