import type { FC } from "react";
import { X } from "lucide-react";

import Strings from './nls/add_expense_strings.json';

import DynamicForm from "../common/DynamicForm";
import type { FormField } from "../../models/common.model";

const fields: FormField[] = [
    {
        name: "title",
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
        type: 'select',
        options: [
            { value: 'expense', label: 'Expense' },
            { value: 'income', label: 'Income' },
        ],
        validation: {
            required: true,
        },
    }

];


export const AddExpense: FC<any> = ({ setIsModalOpen }) => {

    const handleSubmit = () => {

    }
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
                        submitLabel="Save Expense"
                        onSubmit={(values) => {
                            console.log(values);
                        }}
                    />
                </section>


            </div>
        </div>)
}