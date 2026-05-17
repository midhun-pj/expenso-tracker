import { Filter } from "lucide-react";
import type { FilterDropdownProps } from "@models/common.model";

export default function FilterDropdown({ filterValue, filterOptions, defaultOption, onChange }: FilterDropdownProps) {
    return (
        <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <select
                value={filterValue}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:ring-2 ring-primary outline-none appearance-none cursor-pointer min-w-[120px]"
            >
                <option value="">{defaultOption}</option>
                {filterOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}