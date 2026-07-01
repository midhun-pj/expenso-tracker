// strings
import Strings from "./nls/create_account_strings.json";
import CommonStrings from "../../utils/nls/common_strings.json";
// components
import DynamicForm from "@components/common/DynamicForm";
import { CloseButton } from "@components/common/CloseButton";
// models
import type { FC } from "react";
import type { FormField } from "@models/common.model";
import { ACCOUNT_TYPES, type Account, type AccountBase, type CreateAccountProps } from "@models/account.model";

export const CreateAccount: FC<CreateAccountProps> = ({ setIsModalOpen, addAccount, accounts }) => {

  const fields: FormField[] = [
    {
      name: "name",
      label: Strings.formLabels.name,
      type: "text",
      validation: {
        required: true,
      },
    },
    {
      name: "initialBalance",
      label: Strings.formLabels.initialBalance,
      type: "number",
    },
    {
      name: "type",
      label: Strings.formLabels.type,
      type: "toggle-group",
      options: ACCOUNT_TYPES.map((ac) => {
        return {
          value: ac,
          label: ac,
        };
      }),
      validation: {
        required: true,
      },
    },
  ];

  const handleAddAccount = async (accountData: AccountBase) => {
    const { name, type, initialBalance } = accountData;

    const normalizedName = name.trim().toLowerCase();

    const alreadyExists = accounts.some(
      (p: Account) => p.name.toLowerCase() === normalizedName,
    );

    if (!normalizedName || alreadyExists) {
      return;
    }

    await addAccount({
      name: name.trim(),
      initialBalance: initialBalance || 0,
      type,
    });

    setIsModalOpen()
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="text-lg font-bold text-slate-800">{Strings.title}</h3>
          <CloseButton onClick={() => setIsModalOpen(false)} />
        </div>

        <section className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <DynamicForm
            fields={fields}
            submitLabel={CommonStrings.create}
            resetOnSubmit={true}
            onSubmit={(values: any) => handleAddAccount(values)}
          />
        </section>
      </div>
    </div>
  );
};
