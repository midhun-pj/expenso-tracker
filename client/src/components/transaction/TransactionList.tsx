import type { TransactionFilterType, Transaction } from "@models/transaction.model";

import TransactionRow from "@components/transaction/TransactionRow";

import Strings from "./nls/transaction_list_strings.json";

type Props = {
  transactions: Transaction[] | undefined;
  currency: string;
  loading: boolean;

  type: TransactionFilterType;
};

export default function TransactionList({
  currency,
  loading,
  transactions,
  type,
}: Props) {

  const filteredTransactions = transactions?.filter((transaction: Transaction) => {
    if (type === 'ALL') {
      return transaction.type !== 'TRANSFER';
    }
    return transaction.type === type;
  });


  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      {loading && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-100 text-sm text-blue-700 text-center">
          {Strings.loadingTransactions}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold text-xs">
            <tr>
              <th className="px-4 md:px-6 py-4 hidden sm:table-cell">
                {Strings.date}
              </th>
              <th className="px-4 md:px-6 py-4">{Strings.description}</th>
              <th className={`px-4 md:px-6 py-4 hidden md:table-cell`}>
                {Strings.category}
              </th>
              <th className="px-4 md:px-6 py-4 text-right">{Strings.amount}</th>
              {/* <th className="px-4 md:px-6 py-4 text-center">
                {Strings.actions}
              </th> */}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredTransactions?.map((transaction: Transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                currency={currency}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
