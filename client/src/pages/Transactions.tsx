import { type FC, useState, useEffect } from "react";


import { useStore } from "@store/useStore";

// components
import TransactionList from "@components/transaction/TransactionList";
import { CreateTransaction } from "@components/transaction/CreateTransaction";
import { MakeTransfer } from "@components/transaction/MakeTransfer";
import { AddButton } from "@components/common/AddButton";
import ToggleButton from "@components/common/ToggleButton";
import FilterDropdown from "@components/common/FilterDropdown";


// models 
import { TransactionFilterOptions, type Transaction, type TransactionFilterType } from "@models/transaction.model";

import Strings from "./nls/transactions_strings.json";
import { DEFAULT_FILTER_PARAMS } from "@utils/app.constant";
import { generateMonthOptions, generateYearOptions } from "@utils/app.methods";

const buttonClasses = "flex-center gap-2 bg-primary bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm whitespace-nowrap";


export const Transactions: FC = () => {

  const {
    currency,
    transactions,
    categories,
    accounts,
    createTransaction,
    createTransfer,
    getTransactions,
    updateTransactionDetails
  } = useStore();

  // Filter State
  const [filterCategory, setFilterCategory] = useState<string>('');
  const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
  const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());

  const [filterType, setFilterType] = useState<TransactionFilterType>("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openTransferModal, setOpenTransferModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const monthOptions = generateMonthOptions();
  const yearOptions = generateYearOptions();

  // Load expenses when filters change
  useEffect(() => {
    setLoading(true);
    getTransactions({
      ...DEFAULT_FILTER_PARAMS,
      month: filterMonth,
      year: filterYear,
      ...(filterCategory && { categoryId: filterCategory }),
      ...(filterType !== "ALL" && { type: filterType }),
    }).finally(() => setLoading(false));
  }, [filterMonth, filterYear, filterType, filterCategory]);

  const openAddModal = () => {
    setIsModalOpen(true);
  };

  const openEditModal = (transaction: Transaction) => {
    setIsModalOpen(true);
    setEditingTransaction(transaction);
  };

  const closeAddTransactionModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const openMakeModal = () => {
    setOpenTransferModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-600 mr-2">
            {Strings.labelType}
          </span>
          <div className="inline-flex rounded-lg bg-slate-100 p-1">
            {
              TransactionFilterOptions.map((option) => (
                <ToggleButton
                  key={option.value}
                  label={option.label}
                  onChange={() => setFilterType(option.value as TransactionFilterType)}
                  isActive={filterType === option.value}
                />
              ))
            }
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">

            <FilterDropdown
              filterValue={String(filterYear)}
              filterOptions={yearOptions}
              defaultOption={Strings.allYears}
              onChange={(value) => setFilterYear(+value)}
            />

            <FilterDropdown
              filterValue={String(filterMonth)}
              filterOptions={monthOptions}
              defaultOption={Strings.allMonths}
              onChange={(value) => setFilterMonth(+value)}
            />


            <FilterDropdown
              filterValue={String(filterCategory)}
              filterOptions={categories.map((cat) => ({
                label: cat.name,
                value: String(cat.id),
              }))}
              defaultOption={Strings.allCategories}
              onChange={(value) => setFilterCategory(value)}
            />

          </div>

          <aside className="flex">
            <AddButton
              onClick={openMakeModal}
              label={Strings.makeTransferBtn}
              mobileLabel={Strings.makeTransferBtnMobile}
              buttonClasses={buttonClasses}
            />

            <AddButton
              onClick={openAddModal}
              label={Strings.addExpenseBtn}
              mobileLabel={Strings.addExpenseBtnMobile}
              buttonClasses={buttonClasses}
            />


          </aside>
        </div>
      </div>

      <TransactionList
        transactions={transactions?.data}
        currency={currency}
        loading={loading}
        type={filterType}
        onEdit={openEditModal}
      />

      {/* {expensePagination && expensePagination.totalCount > 0 && (
        <div className="border-t border-slate-100 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {Strings.paginationShowing}{" "}
            <span className="font-medium">{expenses.length}</span>{" "}
            {Strings.paginationOf}{" "}
            <span className="font-medium">{expensePagination.totalCount}</span>{" "}
            {Strings.paginationResults}
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
                  filterYear,
                );
                setLoading(false);
              }}
              disabled={loading}
              className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors text-sm font-medium"
            >
              {loading ? Strings.loading : Strings.loadMore}
            </button>
          )}
        </div>
      )} */}

      {isModalOpen && (
        <CreateTransaction
          setIsModalOpen={closeAddTransactionModal}
          accounts={accounts}
          categories={categories}
          createTransaction={createTransaction}
          editingTransaction={editingTransaction}
          updateTransactionDetails={updateTransactionDetails}
        />
      )}

      {openTransferModal && (
        <MakeTransfer
          setOpenTransferModal={setOpenTransferModal}
          accounts={accounts}
          createTransfer={createTransfer}
        />
      )}
    </div>
  );
};
