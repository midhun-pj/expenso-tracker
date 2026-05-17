import type { FC } from "react";
import { X } from "lucide-react";

import Strings from "./nls/make_transfer_strings.json";

import DynamicForm from "@components/common/DynamicForm";

import type { FormField } from "@models/common.model";
import type { Account } from "@models/account.model";
import type { CreateTransferRequest } from "@models/transaction.model";

export const MakeTransfer: FC<any> = ({ setOpenTransferModal, accounts, createTransfer }) => {
  const fields: FormField[] = [
    {
      name: "description",
      label: Strings.description,
      type: "text",
    },
    {
      name: "amount",
      label: Strings.amount,
      type: "number",

      validation: {
        required: true,
        min: 1,
      },
    },

    {
      name: "date",
      label: Strings.date,
      type: "date",

      validation: {
        required: true,
      },
    },

    {
      name: "fromAccountId",
      label: Strings.accountFrom,
      type: "select",

      validation: {
        required: true,
      },
      options: accounts.map((c: Account) => ({
        label: c.name,
        value: c.id,
      })),
    },
    {
      name: "toAccountId",
      label: Strings.accountTo,
      type: "select",

      validation: {
        required: true,
      },
      options: accounts.map((c: Account) => ({
        label: c.name,
        value: c.id,
      })),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">
            {Strings.titleAdd}
          </h3>
          <button
            onClick={() => setOpenTransferModal(false)}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <section className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <DynamicForm
            fields={fields}
            submitLabel={Strings.submitButtonLabel}
            resetOnSubmit={true}
            onSubmit={(values: unknown) => {
              createTransfer(values as CreateTransferRequest)

              setOpenTransferModal(false);
            }}
          />
        </section>
      </div>
    </div>
  );
};
