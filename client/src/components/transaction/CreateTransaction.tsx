import type { FC } from "react";
import { X } from "lucide-react";

import Strings from './nls/create_transaction_strings.json';

import DynamicForm from "@components/common/DynamicForm";

import type { FormField, FormValues } from "@models/common.model";
import type { Category } from "@models/category.model";
import type { Account } from "@models/account.model";

import { formatDateForInput } from "@utils/app.methods";


export const CreateTransaction: FC<any> = ({
    setIsModalOpen, accounts, categories,
    createTransaction, editingTransaction,
    updateTransactionDetails
}) => {

    let initialValues = {
        type: "EXPENSE",
    }

    if (editingTransaction?.id) {
        initialValues = {
            ...editingTransaction,
            date: formatDateForInput(editingTransaction?.date),
            accountId: editingTransaction?.entries[0].accountId,
        };
    }

    const nonEditableFields = ["amount", "type", "categoryId", "accountId"];


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
                disabled: editingTransaction?.id && nonEditableFields.includes("amount"),
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
                disabled: editingTransaction?.id && nonEditableFields.includes("type"),
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
                disabled: editingTransaction?.id && nonEditableFields.includes("categoryId"),
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
                })),
                disabled: editingTransaction?.id && nonEditableFields.includes("accountId"),
            },

        ];
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">
                        {editingTransaction?.id ? Strings.titleEdit : Strings.titleAdd}
                    </h3>
                    <button onClick={() => setIsModalOpen()} className="text-slate-400 hover:text-slate-600">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <section className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <DynamicForm
                        fields={fields}
                        submitLabel={editingTransaction?.id ? Strings.updateButtonLabel : Strings.submitButtonLabel}
                        initialValues={
                            editingTransaction?.id ? initialValues : {
                                type: "EXPENSE",
                            }
                        }
                        resetOnSubmit={true}
                        onSubmit={(values: any) => {
                            if (editingTransaction?.id) {
                                updateTransactionDetails(editingTransaction.id, {
                                    description: values?.description,
                                    date: new Date(values.date).toISOString(),
                                });
                            } else {
                                createTransaction(values);
                            }
                            setIsModalOpen()
                        }}
                    />
                </section>


            </div>
        </div>)
}