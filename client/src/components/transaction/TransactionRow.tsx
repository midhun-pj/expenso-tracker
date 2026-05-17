import React from "react";
import type { Transaction } from "@models/transaction.model";
import { formatCurrency } from "@utils/app.methods";

type TransactionRowProps = {
  currency: string;
  transaction: Transaction;
}

export const TransactionRow: React.FC<TransactionRowProps> = ({
  currency,
  transaction,
}) => {

  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-4 md:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
        {new Date(transaction.date).toLocaleDateString()}
      </td>

      <td className="px-4 md:px-6 py-4 font-medium text-slate-800">
        {transaction.description}
        <div className="sm:hidden text-xs text-slate-400 mt-1">
          {new Date(transaction.date).toLocaleDateString()}
        </div>
      </td>

      <td className={`px-4 md:px-6 py-4 hidden md:table-cell`}>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          {transaction.category?.name || "Transfer"}
        </span>
      </td>

      <td className="px-4 md:px-6 py-4 text-right font-semibold text-slate-800">
        <span
          className={
            transaction.type === "INCOME"
              ? "text-emerald-600"
              : "text-rose-600"
          }
        >
          {formatCurrency(currency, transaction.amount)}
        </span>
      </td>

      {/* <td className="px-4 md:px-6 py-4 text-center">
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
      </td> */}
    </tr>
  );
};

export default React.memo(TransactionRow);
