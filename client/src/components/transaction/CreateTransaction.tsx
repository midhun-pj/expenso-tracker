import type { FC } from "react";
import { X } from "lucide-react";

import Strings from './nls/create_transaction_strings.json';

import DynamicForm from "@components/common/DynamicForm";

import type { FormField, FormValues } from "@models/common.model";
import type { Category } from "@models/category.model";
import type { Account } from "@models/account.model";


export const CreateTransaction: FC<any> = ({ setIsModalOpen, accounts, categories, createTransaction }) => {

    const fields = (values: FormValues): FormField[] => {

        const filteredCategories = categories.filter((category: Category) => category.type === values.type);

        return [
            {
                name: "description",
                label: Strings.description,
                type: "text",

                validation: {
                    required: true,
                    minLength: 3,
                },
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
                name: 'type',
                label: 'Type',
                type: 'toggle-group',
                options: [
                    { value: 'EXPENSE', label: 'Expense' },
                    { value: 'INCOME', label: 'Income' },
                ],
                validation: {
                    required: true,
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
                name: "categoryId",
                label: Strings.category,
                type: "select",

                validation: {
                    required: true,
                },
                options: filteredCategories.map(
                    (category: Category) => ({
                        label: category.name,
                        value: category.id,
                    })
                ),
            },

            {
                name: "accountId",
                label: Strings.account,
                type: "select",

                validation: {
                    required: true,
                },
                options: accounts.map((c: Account) => ({
                    label: c.name,
                    value: c.id,
                }))
            },

        ];
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">
                        {Strings.titleAdd}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <section className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <DynamicForm
                        fields={fields}
                        submitLabel={Strings.submitButtonLabel}
                        initialValues={{
                            type: "EXPENSE",
                        }}
                        resetOnSubmit={true}
                        onSubmit={(values: unknown) => {
                            createTransaction(values as any);
                            setIsModalOpen(false)
                        }}
                    />
                </section>


            </div>
        </div>)
}