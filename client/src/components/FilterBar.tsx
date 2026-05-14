import type { FC } from 'react';
import { Filter } from 'lucide-react';
import type { SelectOption } from '../utils/chartHelpers';

interface FilterSelectProps {
    value: string | undefined;
    onChange: (value: string | undefined) => void;
    options: SelectOption[];
    placeholder: string;
    minWidth?: string;
}

const FilterSelect: FC<FilterSelectProps> = ({
    value,
    onChange,
    options,
    placeholder,
    minWidth = '120px',
}) => (
    <div className="relative">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
        <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value || undefined)}
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 ring-primary outline-none appearance-none cursor-pointer"
            style={{ minWidth }}
        >
            <option value="">{placeholder}</option>
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

interface FilterBarProps {
    filters: FilterSelectProps[];
}

export const FilterBar: FC<FilterBarProps> = ({ filters }) => (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 flex-wrap">
            {filters.map((filter, index) => (
                <FilterSelect key={index} {...filter} />
            ))}
        </div>
    </div>
);
