"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from "react"
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
  isAuthLoading: boolean;
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
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const userData = storage.getUser();
    if (userData) {
      setUserData(userData);
    }
    setIsAuthLoading(false);
  }, []);

  const updateUserData = useCallback((newUserData: any) => {
    setUserData(newUserData);
    storage.setUser(newUserData);
  }, []);

  const isAuthenticated = useMemo(() => !!userData && !!storage.getToken(), [userData]);

  const refreshData = useCallback(async (forceRefresh = false) => {
    try {
      setLoading(true);
      setError(null);

      // Clear caches if force refresh
      if (forceRefresh) {
        cache.remove(CACHE_KEYS.SUMMARY);
        cache.remove(CACHE_KEYS.CATEGORIES);
      }

      // Check cache first for static data
      const cachedSummary = forceRefresh ? null : cache.get(CACHE_KEYS.SUMMARY);
      const cachedCategories = forceRefresh ? null : cache.get(CACHE_KEYS.CATEGORIES);

      // Fetch all data in parallel - only fetch what's not cached
      const promises = [];
      
      // Always fetch dynamic data (accounts, transactions, income/expense)
      promises.push(fetchAccountList());
      promises.push(fetchAllTransaction("all", startOfMonth(new Date()), new Date()));
      promises.push(fetchIncomeExpense({
        filterType: "monthly",
        date: new Date(),
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      }));

      // Only fetch cached data if not in cache
      if (!cachedSummary) {
        promises.push(fetchAccountStatsSummary());
      }
      if (!cachedCategories) {
        promises.push(fetchCategory());
      }

      const results = await Promise.all(promises);
      
      // Process results
      const [accountsRes, transactionsRes, incomeExpenseRes, summaryRes, categoriesRes] = results;

      // Set dynamic data
      const fetchedAccounts = accountsRes?.data?.accounts || [];
      setAccounts(Array.isArray(fetchedAccounts) ? fetchedAccounts : []);

      const fetchedTransactions = transactionsRes?.data?.transactions || [];
      setTransactions(Array.isArray(fetchedTransactions) ? fetchedTransactions : []);

      setIncomeExpense(incomeExpenseRes?.data || null);

      // Handle cached data
      if (cachedSummary) {
        setSummary(cachedSummary);
      } else if (summaryRes) {
        setSummary(summaryRes?.data || null);
        cache.set(CACHE_KEYS.SUMMARY, summaryRes?.data);
      }

      if (cachedCategories) {
        setCategories(cachedCategories);
      } else if (categoriesRes) {
        const fetchedCategories = categoriesRes?.data?.categories || [];
        setCategories(Array.isArray(fetchedCategories) ? fetchedCategories : []);
        cache.set(CACHE_KEYS.CATEGORIES, fetchedCategories);
      }

    } catch (err) {
      setError("Failed to fetch data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      refreshData();
    }
  }, [userData, refreshData]);

  const contextValue = useMemo(() => ({
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
    isAuthLoading,
  }), [accounts, transactions, categories, summary, incomeExpense, loading, error, refreshData, userData, updateUserData, isAuthenticated, isAuthLoading]);

  return (
    <FinanceContext.Provider value={contextValue}>
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