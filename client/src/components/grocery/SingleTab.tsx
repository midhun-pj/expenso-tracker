import React, { useState, useMemo, type FC } from 'react';

import { useDynamicForm } from '@hooks/useDynamicForm';

import FieldRenderer from '@components/common/FieldRenderer';
import { ProductTypeahead } from './ProductTypeahead';

import { buildSharedFields, ITEM_FIELDS, today } from '@utils/grocery.utils';
import Strings from './nls/single_tab_strings.json';
import CommonStrings from '@utils/nls/common_strings.json';

import type { SingleTabProps } from '@models/grocery.model';



export const SingleTab: FC<SingleTabProps> = ({ supermarkets, onSubmit, onCancel, submitting }) => {
    const [productId, setProductId] = useState('');
    const [productSearch, setProductSearch] = useState('');
    const [productError, setProductError] = useState('');

    const allFields = useMemo(() => {
        return [...buildSharedFields(supermarkets), ...ITEM_FIELDS];
    }, [supermarkets]);

    const initialValues = useMemo(() => ({
        date: today,
    }), []); // today is stable

    const { values, errors, handleChange, validate } = useDynamicForm(allFields, initialValues);

    const sharedFields = useMemo(() => buildSharedFields(supermarkets), [supermarkets]);

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const isValid = validate();
        if (!productId) {
            setProductError(`${Strings.labelProduct} is required`);
            return;
        }
        setProductError('');
        if (!isValid) return;

        onSubmit(values, productId);
    };

    return (
        <form onSubmit={handleFormSubmit} className="space-y-4">
            {sharedFields.map((field) => (
                <FieldRenderer
                    key={field.name}
                    field={field}
                    value={values[field.name]}
                    error={errors[field.name]}
                    onChange={handleChange}
                />
            ))}

            <ProductTypeahead
                value={productSearch}
                error={productError}
                onChange={(id, name) => {
                    setProductId(id);
                    setProductSearch(name);
                    if (id) setProductError('');
                }}
            />

            <div className="grid grid-cols-3 gap-4">
                {ITEM_FIELDS.map((field) => (
                    <FieldRenderer
                        key={field.name}
                        field={field}
                        value={values[field.name]}
                        error={errors[field.name]}
                        onChange={handleChange}
                    />
                ))}
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                >
                    {CommonStrings.cancel}
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-success bg-success-hover text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-success disabled:opacity-60"
                >
                    {CommonStrings.save}
                </button>
            </div>
        </form>
    );
};
