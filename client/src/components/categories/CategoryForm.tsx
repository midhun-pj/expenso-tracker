import type { FC } from 'react';
import { Settings as SettingsIcon, X } from 'lucide-react';

import type { CategoryType, Category } from '@models/category.model';
import type { FormField } from '@models/common.model';

import DynamicForm from '@components/common/DynamicForm';

import Strings from './nls/category_form.json'

type CategoryFormProps = {
    categories: Category[];
    addCategory: (name: string, type: CategoryType) => void;
    removeCategory: (id: string) => void;
}

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
        name: 'type',
        label: Strings.type,
        type: "toggle-group",
        options: [
            { value: 'EXPENSE', label: 'Expense' },
            { value: 'INCOME', label: 'Income' },
        ],
        validation: {
            required: true,
        },
    }

];


export const CategoryForm: FC<CategoryFormProps> = ({ categories, addCategory, removeCategory }) => {

    const handleAddCategory = (newCategory: { name: string, type: CategoryType }) => {

        const { name, type } = newCategory;

        if (name.trim()) {
            addCategory(name.trim(), type);
        }
    };
    return (
        <section
            aria-labelledby="category-management-title" className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 mb-10">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary-50 p-2 rounded-lg">
                    <SettingsIcon className="w-6 h-6" style={{ color: 'var(--color-primary-600)' }} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">{Strings.title}</h2>
                    <p className="text-sm text-slate-500">{Strings.description}</p>
                </div>
            </div>

            <div className="mb-6 space-y-4">
                <DynamicForm
                    fields={fields}
                    submitLabel="Add"
                    onSubmit={(values) => {
                        handleAddCategory(values as { name: string, type: CategoryType })
                    }}
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {categories.map((category: Category) => (
                    <div
                        key={category.id}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                    >
                        <span>{category.name}</span>
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{category.type === 'INCOME' ? 'Income' : 'Expense'}</span>
                        <button
                            onClick={() => removeCategory(category.id)}
                            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-600 text-slate-400 transition-colors"
                            title={Strings.removeCategory}
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </section>
    );
};