import {
    CreditCard,
    Trash2,
} from 'lucide-react';

import { ACCOUNT_TYPES, type AccountBase, type AccountsFormProps } from '@models/account.model';
import type { FormField } from '@models/common.model';

import DynamicForm from '@components/common/DynamicForm';

import Strings from './nls/accounts_form.json';


const fields: FormField[] = [
    {
        name: "name",
        label: Strings.name,
        type: "text",

        validation: {
            required: true,
            minLength: 3,
        },
    },
    {
        name: "initialBalance",
        label: Strings.balance,
        type: "number",
    },
    {
        name: 'type',
        label: Strings.accountType,
        type: "toggle-group",
        options: ACCOUNT_TYPES.map(ac => {
            return {
                value: ac,
                label: ac
            }
        }),
        validation: {
            required: true,
        },
    }

];

export const AccountsForm = ({ accounts, createAccount, removeAccount, }: AccountsFormProps) => {


    const handleAddAccount = async (accountData: AccountBase) => {

        const { name, type, initialBalance } = accountData;

        const normalizedName = name.trim().toLowerCase();

        const alreadyExists = accounts.some((p) =>
            p.name.toLowerCase() === normalizedName
        );

        if (!normalizedName || alreadyExists) {
            return;
        }

        await createAccount(
            {
                name: name.trim(),
                initialBalance: initialBalance || 0,
                type
            }
        );

    };

    return (
        <section className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 mb-5">
            <header className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-50 p-2 rounded-lg">
                    <CreditCard
                        className="w-6 h-6"
                        style={{
                            color:
                                'var(--color-primary-600)',
                        }}
                    />
                </div>

                <div>
                    <h2 className="text-lg font-bold text-slate-800">
                        {Strings.title}
                    </h2>

                    <p className="text-sm text-slate-500">
                        {Strings.description}
                    </p>
                </div>
            </header>

            <div className="mb-6 space-y-4">
                <DynamicForm
                    fields={fields}
                    submitLabel={Strings.addButton}
                    onSubmit={(values: unknown) => {
                        handleAddAccount(values as AccountBase)
                    }}
                />
            </div>



            {/* Accounts List */}
            <section aria-label="Accounts list">
                {accounts.length === 0 ? (
                    <div className="text-sm text-slate-500 py-6 text-center border border-dashed border-slate-200 rounded-xl">
                        {Strings.emptyState}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-200 text-left">
                                    <th className="py-3 font-semibold text-slate-700">
                                        {
                                            Strings.nameColumn
                                        }
                                    </th>

                                    <th className="py-3 font-semibold text-slate-700">
                                        {
                                            Strings.typeColumn
                                        }
                                    </th>


                                    <th className="py-3 font-semibold text-right text-slate-700">
                                        {
                                            Strings.actionsColumn
                                        }
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {accounts.map(
                                    (account) => (
                                        <tr
                                            key={account.id}
                                            className="border-b border-slate-100 hover:bg-slate-50"
                                        >
                                            <td className="py-3">
                                                {
                                                    account.name
                                                }
                                            </td>

                                            <td className="py-3">
                                                <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                                                    {account.type?.replace(
                                                        '_',
                                                        ' '
                                                    )}
                                                </span>
                                            </td>

                                            <td className="py-3 text-right">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeAccount(
                                                            account.id
                                                        )
                                                    }
                                                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-100 hover:text-red-600 text-slate-400 transition-colors"
                                                    aria-label={`${Strings.removeAccount} ${account.name}`}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>
        </section>
    );
};