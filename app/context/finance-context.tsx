"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { fetchAccountList, fetchAccountStatsSummary, fetchAllTransaction, fetchIncomeExpense } from "@/app/service/account.service"
import { startOfMonth } from "date-fns"
import { fetchCategory } from "../service/category.service"
import storage from "@/utils/storage"
import { fetchBudgetSummary } from "../service/budget.service"
import { fetchAllBudgets } from "../service/budget.service";
import { cache } from "@/app/lib/cache";

interface Account {
  _id: string;
  name: string;
  balance: number;
  type: string;
  iconName: string;
  limit?: number;
  accountName: string;
  accountType: string;
  currency: string;
}

interface Transaction {
  _id: string;
  amount: number;
  type: string;
  category: string;
  date: string;
  description: string;
}

interface Category {
  _id: string;
  name: string;
  icon: string;
  transactionType: string;
  color: string;
  description: string;
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
interface AllBudget {
  _id: string;
  userId: string;
  amount: number;
  recurring: string;
  createdAt: string;
  startDate: string;
  endDate: string;
  name: string;
  category: {
    _id: string;
    name: string;
  };
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
  refreshData: (forceRefresh?: boolean) => Promise<void>;
  userData?: any;
  allBudgets: AllBudget[];
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const CACHE_KEYS = {
  ACCOUNTS: "finance_accounts",
  TRANSACTIONS: "finance_transactions",
  SUMMARY: "finance_summary",
  INCOME_EXPENSE: "finance_income_expense",
  CATEGORIES: "finance_categories",
  BUDGETS: "finance_budgets",
  ALL_BUDGETS: "finance_all_budgets",
};

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
  const [allBudgets, setAllBudgets] = useState<AllBudget[]>([]);

  useEffect(() => {
    const userData = storage.getUser();
    if (userData) {
      setUserData(userData);
    }
  }, []);

  const refreshData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // If force refresh is true, clear all caches
      if (forceRefresh) {
        Object.values(CACHE_KEYS).forEach((key) => cache.remove(key));
      }

      // Try to get cached data first
      const cachedAccounts = forceRefresh
        ? null
        : cache.get(CACHE_KEYS.ACCOUNTS);
      const cachedTransactions = forceRefresh
        ? null
        : cache.get(CACHE_KEYS.TRANSACTIONS);
      const cachedSummary = forceRefresh ? null : cache.get(CACHE_KEYS.SUMMARY);
      const cachedIncomeExpense = forceRefresh
        ? null
        : cache.get(CACHE_KEYS.INCOME_EXPENSE);
      const cachedCategories = forceRefresh
        ? null
        : cache.get(CACHE_KEYS.CATEGORIES);
      const cachedBudgets = forceRefresh ? null : cache.get(CACHE_KEYS.BUDGETS);
      const cachedAllBudgets = forceRefresh
        ? null
        : cache.get(CACHE_KEYS.ALL_BUDGETS);

      // Fetch only uncached data
      const [
        accountsRes,
        transactionsRes,
        summaryRes,
        incomeExpenseRes,
        categoriesRes,
        budgetsRes,
        allBudgetsRes,
      ] = await Promise.all([
        cachedAccounts
          ? Promise.resolve({ data: { accounts: cachedAccounts } })
          : fetchAccountList(),
        cachedTransactions
          ? Promise.resolve({ data: { transactions: cachedTransactions } })
          : fetchAllTransaction("all", startOfMonth(new Date()), new Date()),
        cachedSummary
          ? Promise.resolve({ data: cachedSummary })
          : fetchAccountStatsSummary(),
        cachedIncomeExpense
          ? Promise.resolve({ data: cachedIncomeExpense })
          : fetchIncomeExpense({
              filterType: "monthly",
              date: new Date(),
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            }),
        cachedCategories
          ? Promise.resolve({ data: { categories: cachedCategories } })
          : fetchCategory(),
        cachedBudgets
          ? Promise.resolve({ data: { budgets: cachedBudgets } })
          : fetchBudgetSummary({
              period: "monthly",
              month: new Date().getMonth() + 1,
              year: new Date().getFullYear(),
            }),
        cachedAllBudgets
          ? Promise.resolve({ data: { budgets: cachedAllBudgets } })
          : fetchAllBudgets(),
      ]);

      // Cache the fetched data
      if (!cachedAccounts)
        cache.set(CACHE_KEYS.ACCOUNTS, accountsRes?.data?.accounts);
      if (!cachedTransactions)
        cache.set(CACHE_KEYS.TRANSACTIONS, transactionsRes?.data?.transactions);
      if (!cachedSummary) cache.set(CACHE_KEYS.SUMMARY, summaryRes?.data);
      if (!cachedIncomeExpense)
        cache.set(CACHE_KEYS.INCOME_EXPENSE, incomeExpenseRes?.data);
      if (!cachedCategories)
        cache.set(CACHE_KEYS.CATEGORIES, categoriesRes?.data?.categories);
      if (!cachedBudgets)
        cache.set(CACHE_KEYS.BUDGETS, budgetsRes?.data?.budgets);
      if (!cachedAllBudgets)
        cache.set(CACHE_KEYS.ALL_BUDGETS, allBudgetsRes?.data?.budgets);

      // Set state with fetched data
      const fetchedAccounts = accountsRes?.data?.accounts || [];
      setAccounts(Array.isArray(fetchedAccounts) ? fetchedAccounts : []);

      const fetchedAllBudgets = allBudgetsRes?.data?.budgets || [];
      setAllBudgets(Array.isArray(fetchedAllBudgets) ? fetchedAllBudgets : []);

      const fetchedTransactions = transactionsRes?.data?.transactions || [];
      setTransactions(
        Array.isArray(fetchedTransactions) ? fetchedTransactions : []
      );

      const fetchedCategories = categoriesRes?.data?.categories || [];
      setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);

      const fetchedBudgets = budgetsRes?.data?.budgets || [];
      setBudgetsSummry(Array.isArray(fetchedBudgets) ? fetchedBudgets : []);

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
        allBudgets,
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