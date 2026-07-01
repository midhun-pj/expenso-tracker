import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStore } from '@store/useStore';

import type { CreateGroceryItemPayload, Tab, BulkRow } from '@models/grocery.model';
import type { FormValues } from '@models/common.model';

// components
import ToggleButton from '@components/common/ToggleButton';
import { SingleTab } from './SingleTab';
import { BulkTab } from './BulkTab';


import Strings from './nls/add_grocery_strings.json';

export const AddGrocery: FC = () => {
    const navigate = useNavigate();
    const { superMarkets, addGroceryItem, addGroceryItemsBulk } = useStore();

    const [tab, setTab] = useState<Tab>('single');
    const [submitting, setSubmitting] = useState(false);

    const onCancel = () => navigate('/groceries');

    const handleSingleSubmit = async (values: FormValues, productId: string) => {
        const payload: CreateGroceryItemPayload = {
            productId,
            supermarketId: String(values.supermarketId),
            date: String(values.date),
            quantity: Number(values.quantity),
            unit: String(values.unit) as CreateGroceryItemPayload['unit'],
            price: Number(values.price),
        };
        setSubmitting(true);
        try {
            await addGroceryItem(payload);
            navigate('/groceries');
        } catch {
            // error handled in store
        } finally {
            setSubmitting(false);
        }
    };

    const handleBulkSubmit = async (sharedValues: FormValues, rows: BulkRow[]) => {
        const items = rows
            .filter((r) => r.productId && r.quantity && r.unit)
            .map((r) => ({
                productId: r.productId,
                supermarketId: String(sharedValues.supermarketId),
                date: String(sharedValues.date),
                quantity: Number(r.quantity),
                unit: r.unit as CreateGroceryItemPayload['unit'],
                price: Number(r.price),
            }));

        if (items.length === 0) return;

        setSubmitting(true);
        try {
            await addGroceryItemsBulk({ items });
            navigate('/groceries');
        } catch {
            // error handled in store
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="w-full" style={{ background: 'var(--bg-card)', borderColor: 'var(--color-border)' }}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 md:bg-transparent md:border-none md:shadow-none overflow-hidden">
                <div className="px-6 pt-6 border-b border-slate-100">
                    <div className="inline-flex rounded-lg bg-slate-100 p-1 mb-4">
                        {([
                            { value: 'single' as Tab, label: Strings.tabSingle },
                            { value: 'bulk' as Tab, label: Strings.tabBulk },
                        ] as const).map((option) => (
                            <ToggleButton
                                key={option.value}
                                label={option.label}
                                onChange={() => setTab(option.value)}
                                isActive={tab === option.value}
                            />
                        ))}
                    </div>
                </div>

                <div className="p-6">
                    {tab === 'single' && (
                        <SingleTab
                            supermarkets={superMarkets}
                            onSubmit={handleSingleSubmit}
                            onCancel={onCancel}
                            submitting={submitting}
                        />
                    )}
                    {tab === 'bulk' && (
                        <BulkTab
                            supermarkets={superMarkets}
                            onSubmit={handleBulkSubmit}
                            onCancel={onCancel}
                            submitting={submitting}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};
