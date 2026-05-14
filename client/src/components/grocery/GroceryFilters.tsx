import React from 'react';
import { Filter } from 'lucide-react';
import { type Supermarket } from '../../utils/app.models';
import { generateMonthOptions } from '../../utils/groceryUtils';

interface GroceryFiltersProps {
    filterMonth: string | undefined;
    setFilterMonth: (val: string | undefined) => void;
    filterSupermarket: number | undefined;
    setFilterSupermarket: (val: number | undefined) => void;
    supermarkets: Supermarket[];
    strings: any;
}

export const GroceryFilters: React.FC<GroceryFiltersProps> = ({
    filterMonth,
    setFilterMonth,
    filterSupermarket,
    setFilterSupermarket,
    supermarkets,
    strings
}) => {
    const monthOptions = generateMonthOptions();

    return (
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <select
                    value={filterMonth || ''}
                    onChange={(e) => setFilterMonth(e.target.value || undefined)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer min-w-[160px]"
                >
                    <option value="">{strings.allMonths}</option>
                    {monthOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <select
                    value={filterSupermarket || ''}
                    onChange={(e) => setFilterSupermarket(e.target.value ? parseInt(e.target.value) : undefined)}
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 focus:ring-emerald-500 outline-none appearance-none cursor-pointer min-w-[160px]"
                >
                    <option value="">{strings.allSupermarkets}</option>
                    {supermarkets.map(store => (
                        <option key={store.id} value={store.id}>{store.name}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};
