"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { fetchAccountList, fetchAccountStatsSummary, fetchAllTransaction, fetchIncomeExpense } from "@/app/service/account.service"
import { startOfMonth } from "date-fns"
import { fetchCategory } from "../service/category.service"
import storage from "@/utils/storage"
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

interface FinanceContextType {
  accounts: Account[];
  transactions: Transaction[];
  categories: Category[];
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
  updateUserData: (userData: any) => void;
  isAuthenticated: boolean;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

const CACHE_KEYS = {
  TRANSACTIONS: undefined,
  SUMMARY: "finance_summary",
  CATEGORIES: "finance_categories",
};

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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

  const updateUserData = (newUserData: any) => {
    setUserData(newUserData);
    storage.setUser(newUserData);
  };

  const isAuthenticated = !!userData && !!storage.getToken();

  const refreshData = async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // If force refresh is true, clear all caches
      if (forceRefresh) {
        // Only clear caches for keys that are still used
        cache.remove(CACHE_KEYS.SUMMARY);
        cache.remove(CACHE_KEYS.CATEGORIES);
      }

      // Always fetch these from backend, do not use cache
      const accountsRes = await fetchAccountList();
      const transactionsRes = await fetchAllTransaction("all", startOfMonth(new Date()), new Date());
      const incomeExpenseRes = await fetchIncomeExpense({
        filterType: "monthly",
        date: new Date(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });

      // Use cache for these (if not force refresh)
      const cachedSummary = forceRefresh ? null : cache.get(CACHE_KEYS.SUMMARY);
      const cachedCategories = forceRefresh ? null : cache.get(CACHE_KEYS.CATEGORIES);

      const [
        summaryRes,
        categoriesRes,
      ] = await Promise.all([
        cachedSummary ? Promise.resolve({ data: cachedSummary }) : fetchAccountStatsSummary(),
        cachedCategories ? Promise.resolve({ data: { categories: cachedCategories } }) : fetchCategory(),
      ]);

      // Cache the fetched data (only for the remaining keys)
      if (!cachedSummary) cache.set(CACHE_KEYS.SUMMARY, summaryRes?.data);
      if (!cachedCategories) cache.set(CACHE_KEYS.CATEGORIES, categoriesRes?.data?.categories);

      // Set state with fetched data
      const fetchedAccounts = accountsRes?.data?.accounts || [];
      setAccounts(Array.isArray(fetchedAccounts) ? fetchedAccounts : []);

      const fetchedTransactions = transactionsRes?.data?.transactions || [];
      setTransactions(Array.isArray(fetchedTransactions) ? fetchedTransactions : []);

      const fetchedCategories = categoriesRes?.data?.categories || [];
      setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);

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
        summary,
        incomeExpense,
        loading,
        error,
        refreshData,
        userData,
        updateUserData,
        isAuthenticated,
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