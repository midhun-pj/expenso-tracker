
import { create } from 'zustand';
import type { Expense, GroceryItem, User, ThemeConfig, Supermarket, ExpenseSummary } from '../utils/app.models';
import * as api from '../api';
import * as accountsApi from '../api/accounts.api';
import * as categoriesApi from '../api/categories.api';
import type { CategoryType, Category } from '../models/settings.model';

import type { Account } from '../models/account.model';


interface AppState {
    user: User | null;
    isAuthenticated: boolean;
    expenses: Expense[];
    expensePagination: import('../utils/app.models').Pagination | null;
    groceryItems: GroceryItem[];
    groceryPagination: import('../utils/app.models').Pagination | null;
    categories: Category[];
    accounts: Account[];
    supermarkets: Supermarket[];
    currency: string;
    theme: ThemeConfig;
    expenseSummary: ExpenseSummary | null;
    // combined config
    setConfig: (cfg: { theme: ThemeConfig; currency: string }) => Promise<void>;
    setTheme: (themeName: 'ocean' | 'sunset' | 'forest') => void;
    initializeData: () => Promise<void>;

    // Auth Actions
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name?: string) => Promise<void>;
    logout: () => void;

    // Account Actions
    loadAccounts: () => Promise<void>;
    createAccount: (data: Omit<Account, 'id'>) => Promise<void>;
    deleteAccount: (id: string) => Promise<void>;

    // Category Actions
    loadCategories: () => Promise<void>;

    // Expense Actions
    addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
    editExpense: (id: string, updatedExpense: Omit<Expense, 'id'>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    loadExpensePage: (page?: number, limit?: number, month?: string, type?: 'income' | 'expense' | 'all', categoryId?: number, year?: string) => Promise<void>;

    // Grocery Actions
    addGroceryItem: (item: Omit<GroceryItem, 'id'>) => Promise<void>;
    addGroceryItemsBulk: (items: Omit<GroceryItem, 'id'>[]) => Promise<void>;
    editGroceryItem: (id: string, updatedItem: Omit<GroceryItem, 'id'>) => Promise<GroceryItem | undefined>;
    deleteGroceryItem: (id: string) => Promise<void>;
    loadGroceryPage: (page?: number, perPage?: number, search?: string, month?: string, supermarket_id?: number) => Promise<void>;

    // Config Actions
    addCategory: (name: string, categoryType: CategoryType) => Promise<void>;
    removeCategory: (categoryId: string) => Promise<void>;
    addSupermarket: (store: string) => Promise<void>;
    removeSupermarket: (id: number) => Promise<void>;
    setCurrency: (symbol: string) => void;
    loadExpenseSummary: (month?: string, year?: string) => Promise<void>;
}

export const useStore = create<AppState>((set) => {
    // initial local defaults
    // determine initial auth from localStorage token (if present)
    let initialAuth = false;
    try {
        initialAuth = !!localStorage.getItem('token');
    } catch {
        // ignore (e.g., SSR or private mode), default to false
        initialAuth = false;
    }

    let initialUser: User | null = null;
    try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            initialUser = JSON.parse(storedUser);
        }
    } catch {
        // ignore
    }

    const state = {
        user: initialUser,
        isAuthenticated: initialAuth,
        expenses: [] as Expense[],
        expensePagination: null as import('../utils/app.models').Pagination | null,
        groceryItems: [] as GroceryItem[],
        groceryPagination: null as import('../utils/app.models').Pagination | null,
        categories: [],
        accounts: [] as Account[],
        supermarkets: [],
        currency: '$',
        theme: { themeName: 'ocean', navColor: '#ffffff', textColor: '#0f172a', buttonColor: '#10b981' } as ThemeConfig,
        expenseSummary: null,

        login: async (email: string, password: string) => {
            try {
                const res = await api.login(email, password);
                if (res?.token) {
                    try {
                        localStorage.setItem('token', res.token);
                    } catch (e) {
                        console.warn('Could not persist token', e);
                    }
                    const user = { id: 'u1', name: email, email: email };
                    try {
                        localStorage.setItem('user', JSON.stringify(user));
                    } catch (e) {
                        console.warn('Could not persist user', e);
                    }
                    set({ isAuthenticated: true, user });
                    // Fetch all data after successful login
                    await state.initializeData();
                } else {
                    throw new Error('Invalid credentials');
                }
            } catch (err) {
                console.error('login failed', err);
                // Re-throw the error so the Auth component can catch it
                throw err;
            }
        },

        register: async (email: string, password: string, name?: string) => {
            try {
                const res = await api.register(email, password, name);

                return res;
            } catch (err) {
                console.error('register failed', err);
                throw err;
            }
        },

        logout: () => {
            try {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } catch (e) {
                console.warn('Could not remove token from localStorage', e);
            }
            // Reset to defaults and clear authentication
            set({
                isAuthenticated: false,
                user: null,
                expenses: [],
                expensePagination: null,
                groceryItems: [],
                groceryPagination: null,
                categories: [],
                supermarkets: [],
                currency: '$',
                theme: { themeName: 'ocean', navColor: '#ffffff', textColor: '#0f172a', buttonColor: '#10b981' }
            });
            // Navigate to root URL - use location.href to force navigation
            try {
                if (window.location.pathname !== '/') {
                    window.location.href = '/';
                }
            } catch (e) {
                console.warn('Could not navigate to root', e);
            }
        },

        // CRUD operations call the API and update local state
        addExpense: async (expense: Omit<Expense, 'id'>) => {
            try {
                const created = await api.createExpense(expense);
                set((s) => ({ expenses: [created, ...s.expenses] }));
            } catch (err) {
                console.error('addExpense failed', err);
            }
        },

        editExpense: async (id: string, updatedExpense: Omit<Expense, 'id'>) => {
            try {
                const updated = await api.updateExpense(id, updatedExpense);
                set((s) => ({ expenses: s.expenses.map((e) => (e.id === id ? updated : e)) }));
            } catch (err) {
                console.error('editExpense failed', err);
            }
        },

        deleteExpense: async (id: string) => {
            try {
                await api.deleteExpenseApi(id);
                set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }));
            } catch (err) {
                console.error('deleteExpense failed', err);
            }
        },

        addGroceryItem: async (item: Omit<GroceryItem, 'id'>) => {
            try {
                const created = await api.createGroceryItem(item);
                set((s) => ({ groceryItems: [created, ...s.groceryItems] }));
            } catch (err) {
                console.error('addGroceryItem failed', err);
            }
        },

        addGroceryItemsBulk: async (items: Omit<GroceryItem, 'id'>[]) => {
            try {
                const createdItems = await api.createGroceryItemsBulk(items);
                set((s) => ({ groceryItems: [...createdItems, ...s.groceryItems] }));
            } catch (err) {
                console.error('addGroceryItemsBulk failed', err);
            }
        },

        editGroceryItem: async (id: string, updatedItem: Omit<GroceryItem, 'id'>) => {
            try {
                const updated = await api.updateGroceryItem(id, updatedItem);
                set((s) => ({ groceryItems: s.groceryItems.map((g) => (g.id === id ? updated : g)) }));
                return updated;
            } catch (err) {
                console.error('editGroceryItem failed', err);
            }
        },

        deleteGroceryItem: async (id: string) => {
            try {
                await api.deleteGroceryItemApi(id);
                set((s) => ({ groceryItems: s.groceryItems.filter((g) => g.id !== id) }));
            } catch (err) {
                console.error('deleteGroceryItem failed', err);
            }
        },

        loadExpensePage: async (page = 1, limit = 10, month?: string, type: 'income' | 'expense' | 'all' = 'all', categoryId?: number, year?: string) => {
            try {
                const res = await api.fetchExpenses(page, limit, month, type, categoryId, year);
                const { data, pagination } = res;
                set((s) => ({
                    expenses: page === 1 ? data : [...s.expenses, ...data.filter(d => !s.expenses.some(existing => existing.id === d.id))],
                    expensePagination: pagination,
                }));
            } catch (err) {
                console.error('loadExpensePage failed', err);
            }
        },

        loadGroceryPage: async (page = 1, perPage = 10, search = '', month?: string, supermarket_id?: number) => {
            try {
                const res = await api.fetchGroceryItems(page, perPage, search, month, supermarket_id);
                const { data, pagination } = res;
                set((s) => ({
                    groceryItems: page === 1 ? data : [...s.groceryItems, ...data.filter(d => !s.groceryItems.some(existing => existing.id === d.id))],
                    groceryPagination: pagination,
                }));
            } catch (err) {
                console.error('loadGroceryPage failed', err);
            }
        },

        loadExpenseSummary: async (month?: string, year?: string) => {
            try {
                const summary = await api.fetchExpenseSummary(month, year);
                set({ expenseSummary: summary });
            } catch (err) {
                console.error('loadExpenseSummary failed', err);
            }
        },

        // Category Actions
        loadCategories: async () => {
            try {
                const categories = await categoriesApi.fetchCategories();
                set({ categories: categories as Category[] });
            } catch (err) {
                console.error('loadCategories failed', err);
            }
        },

        addCategory: async (name: string, categoryType: CategoryType) => {
            try {
                const category = await categoriesApi.createCategory({ name, type: categoryType });
                set((s) => ({ categories: [...s.categories, category] }));
            } catch (err) {
                console.error('createNewCategory failed', err);
                throw err;
            }
        },

        removeCategory: async (categoryId: string) => {
            try {
                await categoriesApi.deleteCategory(categoryId);
                set((s) => ({ categories: s.categories.filter((c) => c.id !== categoryId) }));
            } catch (err) {
                console.error('removeCategory failed', err);
                throw err;
            }
        },


        addSupermarket: async (store: string) => {
            try {
                const created = await api.createSupermarket(store);
                set((s) => ({ supermarkets: [...s.supermarkets, created] }));
            } catch (err) {
                console.error('addSupermarket failed', err);
            }
        },

        removeSupermarket: async (id: number) => {
            try {
                await api.deleteSupermarket(id);
                set((s) => ({ supermarkets: s.supermarkets.filter((c) => c.id !== id) }));
            } catch (err) {
                console.error('removeSupermarket failed', err);
            }
        },

        setCurrency: (symbol: string) => set({ currency: symbol }),

        setTheme: async (themeName: 'ocean' | 'sunset' | 'forest') => {
            // Define theme color presets
            const themePresets = {
                ocean: { navColor: '#ffffff', textColor: '#0f172a', buttonColor: '#4f46e5' },
                sunset: { navColor: '#fafaf9', textColor: '#1c1917', buttonColor: '#ea580c' },
                forest: { navColor: '#fafafa', textColor: '#171717', buttonColor: '#059669' },
            };

            const colors = themePresets[themeName];

            // Update body data-theme attribute
            try {
                document.body.setAttribute('data-theme', themeName);
            } catch (e) {
                console.warn('Could not set data-theme attribute', e);
            }

            // Update theme in state and get current currency
            let currentCurrency = '$';
            set((s) => {
                currentCurrency = s.currency;
                return { theme: { themeName, ...colors } };
            });

            // Persist to API (fire and forget to avoid blocking)
            const cfg = {
                theme: { themeName, ...colors },
                currency: currentCurrency,
            };

            // Call setConfig from the state (access via set callback)
            set((s) => {
                (s as AppState).setConfig(cfg).catch((err) => {
                    console.error('Failed to persist theme to API', err);
                });
                return {}; // No state change
            });
        },

        // theme-only setter removed; use setConfig for combined saves
        setConfig: async (cfg: { theme: ThemeConfig; currency: string }) => {
            try {
                // saveConfig expects { currency, themeConfig }
                const payload = { currency: cfg.currency, themeConfig: cfg.theme };
                const saved = await api.saveConfig(payload).catch(() => payload);
                // apply CSS variables from saved.themeConfig
                try {
                    const root = document.documentElement;
                    root.style.setProperty('--nav-bg', saved.themeConfig.navColor);
                    root.style.setProperty('--text-color', saved.themeConfig.textColor);
                    root.style.setProperty('--btn-bg', saved.themeConfig.buttonColor);
                    // Update body data-theme if themeName is set
                    if (saved.themeConfig.themeName) {
                        document.body.setAttribute('data-theme', saved.themeConfig.themeName);
                    }
                    set({ theme: saved.themeConfig, currency: saved.currency });
                } catch {
                    // ignore
                    console.warn('Something went wrong applying theme CSS variables');
                }
            } catch (err) {
                console.error('setConfig failed', err);
            }
        },

        initializeData: async () => {
            try {
                // Fetch all data from API
                const [categories, configResp, accounts] = await Promise.all([
                    categoriesApi.fetchCategories().catch(() => []),
                    api.fetchConfig().catch(() => ({ user_id: 0, currency: '$', themeConfig: { themeName: 'ocean', navColor: '#ffffff', textColor: '#0f172a', buttonColor: '#10b981' } })),
                    accountsApi.fetchAccounts().catch(() => []),
                ]);

                // configResp includes { user_id?, currency, themeConfig }
                const currencySymbol = (configResp && (configResp as { currency?: string }).currency) || '$';
                const themeCfg = (configResp && (configResp as { themeConfig?: ThemeConfig }).themeConfig) || { themeName: 'ocean', navColor: '#ffffff', textColor: '#0f172a', buttonColor: '#10b981' };

                // const normalizedSupermarkets = Array.isArray(supermarkets)
                //     ? supermarkets.map((s: unknown) => {
                //         if (typeof s === 'object' && s && 'id' in s && 'name' in s) {
                //             return s as Supermarket;
                //         }
                //         return { id: 0, name: String(s) };
                //     })
                //     : [];

                set({
                    // expenses: (expensesResp && expensesResp.data) || [],
                    // expensePagination: expensesResp?.pagination ?? null,
                    // groceryItems: (groceryResp && groceryResp.data) || [],
                    // groceryPagination: groceryResp?.pagination ?? null,
                    categories: categories,
                    // supermarkets: normalizedSupermarkets,
                    currency: currencySymbol,
                    theme: themeCfg,
                    accounts: accounts,
                });
                // apply theme variables
                try {
                    const root = document.documentElement;
                    root.style.setProperty('--nav-bg', themeCfg.navColor);
                    root.style.setProperty('--text-color', themeCfg.textColor);
                    root.style.setProperty('--btn-bg', themeCfg.buttonColor);
                    // Set initial theme on body
                    if (themeCfg.themeName) {
                        document.body.setAttribute('data-theme', themeCfg.themeName);
                    }
                } catch {
                    // ignore
                }
            } catch (err) {
                console.error('Failed to load data from API', err);
            }
        },

        // Account Actions
        loadAccounts: async () => {
            try {
                const accounts = await accountsApi.fetchAccounts();
                set({ accounts });
            } catch (err) {
                console.error('loadAccounts failed', err);
            }
        },

        createAccount: async (data: Omit<Account, 'id'>) => {
            try {
                const account = await accountsApi.createAccount(data);
                set((s) => ({ accounts: [...s.accounts, account] }));
            } catch (err) {
                console.error('createAccount failed', err);
                throw err;
            }
        },

        deleteAccount: async (id: string) => {
            try {
                await accountsApi.deleteAccount(id);
                set((s) => ({ accounts: s.accounts.filter((a) => a.id !== id) }));
            } catch (err) {
                console.error('deleteAccount failed', err);
                throw err;
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
