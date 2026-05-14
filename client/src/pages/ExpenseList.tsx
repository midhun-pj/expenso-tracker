import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { Expense } from '../utils/app.models';
import { Filter, Plus, X } from 'lucide-react';
import ExpenseTable from '../components/expense/ExpenseTable';
import { generateMonthOptions, generateYearOptions } from '../utils/chartHelpers';
import strings from './nls/expense_strings.json';
import { AddExpense } from '../components/expense/AddExpense';

const ITEMS_PER_PAGE = 10;

export const ExpenseList: React.FC = () => {
  const navigate = useNavigate();
  const { expenses, expensePagination, deleteExpense, addExpense, editExpense, categories, currency, loadExpensePage } = useStore();

  // Filter State
  const [filterCategory, setFilterCategory] = useState<number | undefined>(undefined);
  const [filterMonth, setFilterMonth] = useState<string | undefined>(undefined);
  const [filterYear, setFilterYear] = useState<string | undefined>(String(new Date().getFullYear()));
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Form State
  const [newAmount, setNewAmount] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newIsIncome, setNewIsIncome] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState<number | undefined>(undefined);
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);

  const monthOptions = generateMonthOptions();
  const yearOptions = generateYearOptions();


  // Load expenses when filters change
  useEffect(() => {
    setLoading(true);
    loadExpensePage(1, ITEMS_PER_PAGE, filterMonth, filterType, filterCategory, filterYear)
      .finally(() => setLoading(false));
  }, [filterCategory, filterMonth, filterYear, filterType, loadExpensePage]);

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const openEditModal = (expense: Expense) => {
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600 mr-2">{strings.labelType}</span>
          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setFilterType('all')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterType === 'all' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {strings.filterAll}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('expense')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterType === 'expense' ? 'bg-white shadow text-rose-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {strings.filterExpenses}
            </button>
            <button
              type="button"
              onClick={() => setFilterType('income')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${filterType === 'income' ? 'bg-white shadow text-emerald-700' : 'text-slate-600 hover:text-slate-900'}`}
            >
              {strings.filterIncome}
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <select
                value={filterYear || ''}
                onChange={(e) => setFilterYear(e.target.value || undefined)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 ring-primary outline-none appearance-none cursor-pointer min-w-[120px]"
              >
                <option value="">{strings.allYears}</option>
                {yearOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <select
                value={filterMonth || ''}
                onChange={(e) => setFilterMonth(e.target.value || undefined)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 ring-primary outline-none appearance-none cursor-pointer min-w-[140px]"
              >
                <option value="">{strings.allMonths}</option>
                {monthOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <select
                value={filterCategory || ''}
                onChange={(e) => setFilterCategory(e.target.value ? parseInt(e.target.value) : undefined)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 ring-primary outline-none appearance-none cursor-pointer min-w-[160px]"
              >
                <option value="">{strings.allCategories}</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="flex items-center justify-center gap-2 bg-primary bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">{strings.addExpenseBtn}</span>
            <span className="sm:hidden">{strings.addExpenseBtnMobile}</span>
          </button>
        </div>
      </div>

      <ExpenseTable
        expenses={expenses}
        categories={categories}
        paymentMethods={[]}
        currency={currency}
        loading={loading}
        onEdit={openEditModal}
        onDelete={deleteExpense}
      />

      {expensePagination && expensePagination.totalCount > 0 && (
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {strings.paginationShowing} <span className="font-medium">{expenses.length}</span> {strings.paginationOf} <span className="font-medium">{expensePagination.totalCount}</span> {strings.paginationResults}
          </p>
          {expensePagination.hasNextPage && (
            <button
              onClick={async () => {
                setLoading(true);
                await loadExpensePage(
                  (expensePagination.currentPage || 1) + 1,
                  ITEMS_PER_PAGE,
                  filterMonth,
                  filterType,
                  filterCategory,
                  filterYear
                );
                setLoading(false);
              }}
              disabled={loading}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors text-sm font-medium"
            >
              {loading ? strings.loading : strings.loadMore}
            </button>
          )}
        </div>
      )}

      {isModalOpen && (
        <AddExpense setIsModalOpen={setIsModalOpen}/>
      )}
    </div>
  );
};