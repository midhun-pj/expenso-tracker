import React from 'react';
import { Plus, Search } from 'lucide-react';

interface GroceryHeaderProps {
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    onTrackNew: () => void;
    strings: any;
}

export const GroceryHeader: React.FC<GroceryHeaderProps> = ({
    searchTerm,
    setSearchTerm,
    onTrackNew,
    strings
}) => {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                    type="text"
                    placeholder={strings.searchPlaceholder}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
                />
            </div>
            <button
                onClick={onTrackNew}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-success bg-success-hover text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm hover:shadow-md"
            >
                <Plus className="h-5 w-5" />
                <span className="md:inline">{strings.trackNewBtn}</span>
            </button>
        </div>
    );
};
