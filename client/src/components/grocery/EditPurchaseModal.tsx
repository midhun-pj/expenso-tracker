import { type FC } from 'react';
import { X } from 'lucide-react';
import DynamicForm from '@components/common/DynamicForm';
import type { FormField } from '@models/common.model';
import { formatDateForInput } from '@utils/app.methods';
import { GROCERY_UNITS, type CreateGroceryItemPayload, type GroceryItem } from '@models/grocery.model';

import Strings from './nls/edit_purchase_modal_strings.json'

interface EditPurchaseModalProps {
    editingItem: GroceryItem | null;
    setEditingItem: (item: GroceryItem | null) => void;
    superMarkets: { id: string; name: string }[];
    handleEditSave: (id: string, updatedData: Partial<CreateGroceryItemPayload>) => void;
}

export const EditPurchaseModal: FC<EditPurchaseModalProps> = ({ editingItem, setEditingItem, superMarkets, handleEditSave }) => {
    if (!editingItem) return null;

    const fields: FormField[] = [
        {
            name: 'date',
            label: 'Date',
            type: 'date',
            validation: { required: true },
        },
        {
            name: 'supermarketId',
            label: 'Supermarket',
            type: 'select',
            options: superMarkets.map(s => ({ label: s.name, value: s.id })),
            validation: { required: true },
        },
        {
            name: 'quantity',
            label: 'Quantity',
            type: 'number',
            validation: { required: true, min: 0 },
        },
        {
            name: 'unit',
            label: 'Unit',
            type: 'select',
            options: GROCERY_UNITS.map(u => ({ label: u, value: u })),
            validation: { required: true },
        },
        {
            name: 'price',
            label: 'Price',
            type: 'number',
            validation: { required: true, min: 0 },
        }
    ];

    const initialValues = {
        date: formatDateForInput(new Date(editingItem.date)),
        supermarketId: editingItem.supermarketId,
        quantity: editingItem.quantity,
        unit: editingItem.unit,
        price: editingItem.price
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="text-lg font-bold text-slate-800">{Strings.title}</h3>
                    <button
                        onClick={() => setEditingItem(null)}
                        className="text-slate-400 hover:text-slate-600"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <section className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                    <DynamicForm
                        fields={fields}
                        submitLabel={Strings.button}
                        resetOnSubmit={true}
                        onSubmit={(values: any) => {
                            handleEditSave(editingItem.id, {
                                date: String(values.date),
                                supermarketId: String(values.supermarketId),
                                quantity: Number(values.quantity),
                                unit: String(values.unit) as any,
                                price: Number(values.price)
                            });
                        }}
                        initialValues={initialValues}
                    />
                </section>
            </div>
        </div>
    );
};
