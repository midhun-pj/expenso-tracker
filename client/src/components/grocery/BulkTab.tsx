import React, { useState, useMemo, type FC } from 'react';

import { Plus, X } from 'lucide-react';

import { useDynamicForm } from '@hooks/useDynamicForm';

import FieldRenderer from '@components/common/FieldRenderer';
import { ProductTypeahead } from './ProductTypeahead';

import { emptyBulkRow, buildSharedFields, ITEM_FIELDS, today, } from '@utils/grocery.utils';

import Strings from '../../pages/nls/groceries_strings.json';
import type { BulkRow, BulkTabProps } from '@models/grocery.model';



export const BulkTab: FC<BulkTabProps> = ({ supermarkets, onSubmit, onCancel, submitting }) => {
    const [rows, setRows] = useState<BulkRow[]>([emptyBulkRow()]);
    const [rowErrors, setRowErrors] = useState<Record<number, Partial<Record<keyof BulkRow, string>>>>({});

    const sharedFields = useMemo(() => buildSharedFields(supermarkets), [supermarkets]);
    const initialValues = useMemo(() => ({
        date: today,
    }), []);

    const { values, errors, handleChange, validate } = useDynamicForm(sharedFields, initialValues);

    const updateRow = (index: number, patch: Partial<BulkRow>) =>
        setRows((prev) => prev.map((r, i) => (i === index ? { ...r, ...patch } : r)));

    const addBulkRow = () => setRows((prev) => [...prev, emptyBulkRow()]);
    const removeRow = (index: number) => {
        setRows((prev) => prev.filter((_, i) => i !== index));
        setRowErrors((prev) => {
            const next = { ...prev };
            delete next[index];
            return next;
        });
    };

    const validateRows = () => {
        const errors: Record<number, Partial<Record<keyof BulkRow, string>>> = {};
        let isValid = true;

        rows.forEach((row, index) => {
            const rowErr: Partial<Record<keyof BulkRow, string>> = {};
            if (!row.productId) {
                rowErr.productId = `${Strings.labelProduct} is required`;
                isValid = false;
            }
            if (!row.quantity) {
                rowErr.quantity = `${Strings.labelQuantity} is required`;
                isValid = false;
            }
            if (!row.unit) {
                rowErr.unit = `${Strings.labelUnit} is required`;
                isValid = false;
            }
            if (!row.price) {
                rowErr.price = `${Strings.labelPrice} is required`;
                isValid = false;
            }
            if (Object.keys(rowErr).length > 0) {
                errors[index] = rowErr;
            }
        });

        setRowErrors(errors);
        return isValid;
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const sharedValid = validate();
        const rowsValid = validateRows();
        if (!sharedValid || !rowsValid) return;
        onSubmit(values, rows);
    };

    const clearRowError = (index: number, name: keyof BulkRow) => {
        if (rowErrors[index]?.[name]) {
            setRowErrors((prev) => ({
                ...prev,
                [index]: { ...prev[index], [name]: '' },
            }));
        }
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sharedFields.map((field) => (
                    <FieldRenderer
                        key={field.name}
                        field={field}
                        value={values[field.name]}
                        error={errors[field.name]}
                        onChange={handleChange}
                    />
                ))}
            </div>

            <div className="space-y-3">
                <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 px-1">
                    {[Strings.labelProduct, Strings.labelQuantity, Strings.labelUnit, Strings.labelPrice, ''].map((h, i) => (
                        <span key={i} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</span>
                    ))}
                </div>

                {rows.map((row, index) => (
                    <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-3 items-start bg-slate-50 p-3 rounded-xl border border-slate-100"
                    >
                        <div className="relative">
                            <ProductTypeahead
                                value={row.productSearch}
                                error={rowErrors[index]?.productId}
                                onChange={(id, name) => {
                                    updateRow(index, { productId: id, productSearch: name });
                                    clearRowError(index, 'productId');
                                }}
                            />
                        </div>

                        {ITEM_FIELDS.map((field) => (
                            <FieldRenderer
                                key={field.name}
                                field={field}
                                value={row[field.name as keyof Pick<BulkRow, 'quantity' | 'unit' | 'price'>]}
                                error={rowErrors[index]?.[field.name as keyof BulkRow]}
                                onChange={(name, val) => {
                                    updateRow(index, { [name]: String(val) });
                                    clearRowError(index, name as keyof BulkRow);
                                }}
                            />
                        ))}

                        <button
                            type="button"
                            onClick={() => removeRow(index)}
                            disabled={rows.length === 1}
                            className="mt-5 p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 transition-colors rounded-lg hover:bg-red-50 self-start"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}

                <button
                    type="button"
                    onClick={addBulkRow}
                    className="w-full py-3 border-2 border-dashed rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                    style={{
                        borderColor: 'var(--color-success-300)',
                        color: 'var(--color-success-600)',
                        backgroundColor: 'var(--color-success-50)',
                    }}
                >
                    <Plus className="w-5 h-5" />
                    {Strings.btnAddAnother}
                </button>
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                    {Strings.btnCancel}
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-success bg-success-hover text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-success disabled:opacity-60"
                >
                    {Strings.btnSaveAll}
                </button>
            </div>
        </form>
    );
};
