import type { Account, Category } from "../../models/settings.model";
import type { Expense } from "../../utils/app.models";
import ExpenseRow from "./ExpenseRow";
import strings from './nls/expense_table_strings.json';

type Props = {
  expenses: Expense[];
  categories: Category[];
  paymentMethods: Account[];
  currency: string;
  loading: boolean;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
};

export default function ExpenseTable({
  expenses,
  categories,
  paymentMethods,
  currency,
  loading,
  onEdit,
  onDelete,
}: Props) {

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      {loading && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 text-sm text-blue-700 text-center">
          {strings.loadingExpenses}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-xs">
            <tr>
              <th className="px-4 md:px-6 py-4 hidden sm:table-cell">{strings.date}</th>
              <th className="px-4 md:px-6 py-4">{strings.description}</th>
              <th className="px-4 md:px-6 py-4 hidden md:table-cell">{strings.category}</th>
              <th className="px-4 md:px-6 py-4 text-right">{strings.amount}</th>
              <th className="px-4 md:px-6 py-4 text-center">{strings.actions}</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <ExpenseRow
                key={expense.id}
                expense={expense}
                categories={categories}
                paymentMethods={paymentMethods}
                currency={currency}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>


    </div>
  );
}
