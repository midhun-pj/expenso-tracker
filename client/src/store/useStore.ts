import { create } from "zustand";

// models
import type { User } from "@models/user.model";
import type { AppState } from "@models/app.model";
import type { Account } from "@models/account.model";
import type { CategoryType, Category } from "@models/category.model";
import type {
  CreateTransferRequest,
  Transaction,
  TransactionsQuery,
  UpdateTransactionDetailsRequest,
} from "@models/transaction.model";
import {
  DEFAULT_CURRENCY,
  DEFAULT_THEME,
  THEME_PRESETS,
  type Config,
  type ThemeConfig,
} from "@models/settings.model";

// api services
import * as configApi from "../api/config.api";
import * as accountsApi from "../api/accounts.api";
import * as categoriesApi from "../api/categories.api";
import * as transactionApi from "../api/transaction.api";
import * as dashboardApi from "../api/dashboard.api";
import * as authApi from "../api/auth.api";

import { applyTheme } from "../utils/app.methods";
import { DEFAULT_FILTER_PARAMS } from "../utils/app.constant";

export const useStore = create<AppState>((set) => {
  let initialAuth = false;
  try {
    initialAuth = !!localStorage.getItem("token");
  } catch {
    initialAuth = false;
  }

  let initialUser: User | null = null;
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      initialUser = JSON.parse(storedUser);
    }
  } catch {
    // ignore
  }

  const state = {
    user: initialUser,
    isAuthenticated: initialAuth,
    categories: [],
    accounts: [] as Account[],
    currency: DEFAULT_CURRENCY,
    theme: DEFAULT_THEME,
    transactions: {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
    },
    dashboardSummary: null,

    initializeData: async () => {
      try {
        await state.loadCategories().catch(() => []);
        await state.loadAccounts().catch(() => []);
        const configResp = await configApi
          .fetchConfig()
          .catch(() => ({
            currency: DEFAULT_CURRENCY,
            themeConfig: DEFAULT_THEME,
          }));

        const currencySymbol = configResp?.currency;
        const themeCfg = configResp?.themeConfig;

        set({
          currency: currencySymbol,
          theme: themeCfg,
        });

        try {
          const root = document.documentElement;
          root.style.setProperty("--nav-bg", themeCfg.navColor);
          root.style.setProperty("--text-color", themeCfg.textColor);
          root.style.setProperty("--btn-bg", themeCfg.primaryColor);

          if (themeCfg.themeName) {
            document.body.setAttribute("data-theme", themeCfg.themeName);
          }
        } catch {
          // ignore
        }
      } catch (err) {
        console.error("Failed to load data from API", err);
      }
    },

    login: async (email: string, password: string) => {
      try {
        const res = await authApi.login(email, password);
        if (res?.token) {
          try {
            localStorage.setItem("token", res.token);
          } catch (e) {
            console.warn("Could not persist token", e);
          }
          const user = { id: "u1", name: email, email: email };
          try {
            localStorage.setItem("user", JSON.stringify(user));
          } catch (e) {
            console.warn("Could not persist user", e);
          }
          set({ isAuthenticated: true, user });
          // Fetch all data after successful login
          await state.initializeData();
        } else {
          throw new Error("Invalid credentials");
        }
      } catch (err) {
        console.error("login failed", err);
        // Re-throw the error so the Auth component can catch it
        throw err;
      }
    },

    register: async (email: string, password: string, name?: string) => {
      try {
        const res = await authApi.register(email, password, name);

        return res;
      } catch (err) {
        console.error("register failed", err);
        throw err;
      }
    },

    logout: () => {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {
        console.warn("Could not remove token from localStorage", e);
      }
      // Reset to defaults and clear authentication
      set({
        isAuthenticated: false,
        user: null,
        categories: [],
        currency: DEFAULT_CURRENCY,
        theme: DEFAULT_THEME,
      });
      // Navigate to root URL - use location.href to force navigation
      try {
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
      } catch (e) {
        console.warn("Could not navigate to root", e);
      }
    },

    // Category Actions
    loadCategories: async () => {
      try {
        const categories = await categoriesApi.fetchCategories();
        set({ categories: categories as Category[] });
      } catch (err) {
        console.error("loadCategories failed", err);
      }
    },

    addCategory: async (name: string, categoryType: CategoryType) => {
      try {
        const category = await categoriesApi.createCategory({
          name,
          type: categoryType,
        });
        set((s) => ({ categories: [...s.categories, category] }));
      } catch (err) {
        console.error("createNewCategory failed", err);
        throw err;
      }
    },

    removeCategory: async (categoryId: string) => {
      try {
        await categoriesApi.deleteCategory(categoryId);
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== categoryId),
        }));
      } catch (err) {
        console.error("removeCategory failed", err);
        throw err;
      }
    },

    setCurrency: (symbol: string) => set({ currency: symbol }),

    setTheme: async (themeName: string) => {
      const theme = THEME_PRESETS.find(
        (t: ThemeConfig) => t.themeName === themeName,
      );

      if (theme) {
        set({ theme });
      }
    },

    getConfig: async () => {
      try {
        const config = await configApi.fetchConfig();
        set({ currency: config.currency, theme: config.themeConfig });
      } catch (err) {
        console.error("Failed to fetch config", err);
      }
    },

    setConfig: async (cfg: Config) => {
      try {
        const saved = await configApi.saveConfig(cfg).catch(() => cfg);

        applyTheme(saved.themeConfig);

        set({ theme: saved.themeConfig, currency: saved.currency });

        return { success: true };
      } catch (err) {
        console.error("setConfig failed", err);
        return { success: false };
      }
    },

    // Account Actions
    loadAccounts: async () => {
      try {
        const accounts = await accountsApi.list();
        set({ accounts });
      } catch (err) {
        console.error("loadAccounts failed", err);
      }
    },

    createAccount: async (data: Omit<Account, "id">) => {
      try {
        const account = await accountsApi.create(data);
        set((s) => ({ accounts: [...s.accounts, account] }));
      } catch (err) {
        console.error("createAccount failed", err);
        throw err;
      }
    },

    removeAccount: async (id: string) => {
      try {
        await accountsApi.remove(id);
        set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) }));
      } catch (err) {
        console.error("removeAccount failed", err);
        throw err;
      }
    },

    // transactions

    createTransaction: async (data: Omit<Transaction, "id">) => {
      try {
        const reqPayload = {
          ...data,
          date: new Date(data.date).toISOString(),
        };

        await transactionApi.create(reqPayload);

        await state.getTransactions(DEFAULT_FILTER_PARAMS);
      } catch (err) {
        console.error("createTransaction failed", err);
        throw err;
      }
    },

    getTransactions: async (params: TransactionsQuery, append = false) => {
      try {
        const transactions = await transactionApi.list(params);
        set((state) => ({
          transactions:
            append && state.transactions
              ? {
                data: [
                  ...(state.transactions.data || []),
                  ...transactions.data,
                ],
                pagination: transactions.pagination,
              }
              : transactions,
        }));
      } catch (err) {
        console.error("loadAccounts failed", err);
      }
    },

    updateTransactionDetails: async (
      id: string,
      data: UpdateTransactionDetailsRequest,
    ) => {
      try {
        await transactionApi.updateTransactionDetails(id, data);
        await state.getTransactions(DEFAULT_FILTER_PARAMS);
      } catch (err) {
        console.error("updateTransactionDetails failed", err);
        throw err;
      }
    },

    updateTransaction: async (id: string, data: Transaction) => {
      try {
        await transactionApi.updateTransaction(id, data);
        await state.getTransactions(DEFAULT_FILTER_PARAMS);
      } catch (err) {
        console.error("updateTransaction failed", err);
        throw err;
      }
    },

    deleteTransaction: async (id: string) => {
      try {
        await transactionApi.deleteTransaction(id);
        await state.getTransactions(DEFAULT_FILTER_PARAMS);
      } catch (err) {
        console.error("deleteTransaction failed", err);
        throw err;
      }
    },

    createTransfer: async (data: CreateTransferRequest) => {
      try {
        const reqPayload = {
          ...data,
          date: new Date(data.date).toISOString(),
        };

        await transactionApi.createTransfer(reqPayload);
        await state.getTransactions(DEFAULT_FILTER_PARAMS);
      } catch (err) {
        console.error("createTransfer failed", err);
        throw err;
      }
    },

    loadDashboardSummary: async () => {
      try {
        const summary = await dashboardApi.fetchDashboardSummary();
        set({ dashboardSummary: summary });
      } catch (err) {
        console.error("loadDashboardSummary failed", err);
      }
    },
  };

  // Load initial data from API only if authenticated (fire-and-forget)
  if (initialAuth) {
    (async () => {
      await state.initializeData();
    })();
  }

  return state;
});
