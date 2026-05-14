import { Plus, SettingsIcon, X } from "lucide-react";
import { useState, type FC, type FormEvent } from "react";

import Strings from './nls/supermarket_strings.json';
import type { FormField } from "../../models/common.model";
import DynamicForm from "../common/DynamicForm";

type SupermarketProps = {
    addSupermarket: (val: string) => void,
    removeSupermarket: (val: string) => void,
    supermarkets: []
}


const fields: FormField[] = [
    {
        name: "newSupermarket",
        label: Strings.name,
        type: "text",

        validation: {
            required: true,
            minLength: 3,
        },
    },

];

export const Supermarket: FC<SupermarketProps> = ({ addSupermarket, supermarkets, removeSupermarket }) => {


    const [newSupermarket, setNewSupermarket] = useState('');

    const handleAddSupermarket = (e: FormEvent) => {
        e.preventDefault();
        // if (newSupermarket.trim() && !supermarkets.some(s => s.name === newSupermarket.trim())) {
        //     addSupermarket(newSupermarket.trim());
        //     setNewSupermarket('');
        // }
    };


    return (
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100" >
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-success-50 p-2 rounded-lg">
                    <SettingsIcon className="w-6 h-6" style={{ color: 'var(--color-success-600)' }} />
                </div>
                <div>
                    <h2 className="text-lg font-bold text-slate-800">{Strings.title}</h2>
                    <p className="text-sm text-slate-500">{Strings.subTitle}</p>
                </div>
            </div>

              <div className="mb-6 space-y-4">
                <DynamicForm
                    fields={fields}
                    submitLabel={Strings.addButton}
                    onSubmit={(values) => {
                        console.log(values);
                    }}
                />
            </div>

            <div className="flex flex-wrap gap-2">
                {supermarkets.map((store: any) => (
                    <div
                        key={store.id}
                        className="group flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                    >
                        <span>{store.name}</span>
                        <button
                            onClick={() => removeSupermarket(store.id)}
                            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-100 hover:text-red-600 text-slate-400 transition-colors"
                            title="Remove store"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        </div>)
}