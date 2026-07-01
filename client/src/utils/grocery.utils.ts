import type { FormField } from '@models/common.model';
import { GROCERY_UNITS, type BulkRow } from '@models/grocery.model';
import { formatDateForInput } from '@utils/app.methods';
import Strings from '../pages/nls/groceries_strings.json';


export const emptyBulkRow = (): BulkRow => ({
    productId: '',
    productSearch: '',
    quantity: '',
    unit: '',
    price: '',
});

export const today = formatDateForInput(new Date());

export const buildSharedFields = (supermarkets: { id: string; name: string }[]): FormField[] => [
    {
        name: 'date',
        label: Strings.labelDate,
        type: 'date',
        defaultValue: today,
        validation: { required: true },
    },
    {
        name: 'supermarketId',
        label: Strings.labelSupermarket,
        type: 'select',
        options: supermarkets.map((s) => ({ label: s.name, value: s.id })),
        validation: { required: true },
    },
];

export const ITEM_FIELDS: FormField[] = [
    {
        name: 'quantity',
        label: Strings.labelQuantity,
        type: 'number',
        placeholder: 'QTY',
        validation: { required: true, min: 0 },
    },
    {
        name: 'unit',
        label: Strings.labelUnit,
        type: 'select',
        options: GROCERY_UNITS.map((u) => ({ label: u, value: u })),
        validation: { required: true },
    },
    {
        name: 'price',
        label: Strings.labelPrice,
        type: 'number',
        placeholder: '0.00',
        validation: { required: true, min: 0 },
    },
];
