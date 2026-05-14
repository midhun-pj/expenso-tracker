import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { Category, Expense, PaymentMethod } from "../../utils/app.models";
import { formatCurrency } from "../../utils/expense.utils";

interface ExpenseRowProps {
  expense: Expense;
  categories: Category[];
  paymentMethods: PaymentMethod[];
  currency: string;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseRow: React.FC<ExpenseRowProps> = ({
  expense,
  categories,
  currency,
  paymentMethods,
  onEdit,
  onDelete,
}) => {

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        {new Date(expense.date).toLocaleDateString()}
      </td>

      <td className="px-4 md:px-6 py-4 font-medium text-slate-800">
        {expense.description}
        <div className="sm:hidden text-xs text-slate-400 mt-1">{new Date(expense.date).toLocaleDateString()}</div>
      </td>

      <td className="px-4 md:px-6 py-4 hidden md:table-cell">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          {categories.find(c => c.id === expense.categoryId)?.name || 'Unknown'}
        </span>
        {expense.paymentMethodId && (
          <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600">
            {paymentMethods.find(p => p.id === expense.paymentMethodId)?.name || 'Unknown'}
          </span>
        )}
      </td>

      <td className="px-4 md:px-6 py-4 text-right font-semibold text-slate-800">
        <span className={expense.isIncome ? "text-emerald-600" : "text-rose-600"}>{formatCurrency(currency, expense.amount)}</span>

      </td>

      <td className="px-4 md:px-6 py-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onEdit(expense)}
            className="text-slate-400 transition-colors p-1" style={{ color: 'var(--color-primary-600)' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-600)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-neutral-400)'}
            title="Edit expense"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(expense.id)}
            className="text-slate-400 hover:text-red-500 transition-colors p-1"
            title="Delete expense"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default React.memo(ExpenseRow);
