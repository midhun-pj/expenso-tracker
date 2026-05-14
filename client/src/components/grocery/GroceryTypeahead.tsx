import React, { useState, useEffect, useRef } from 'react';
import { fetchGroceryItems } from '../../api';
import type { GroceryItem } from '../../utils/app.models';
import { Search } from 'lucide-react';

interface GroceryTypeaheadProps {
    value: string;
    onChange: (value: string) => void;
    onSelect?: (item: GroceryItem) => void;
    placeholder?: string;
    className?: string;
    required?: boolean;
}

export const GroceryTypeahead: React.FC<GroceryTypeaheadProps> = ({
    value,
    onChange,
    onSelect,
    placeholder = "Search or enter item name...",
    className = "",
    required = false
}) => {
    const [suggestions, setSuggestions] = useState<GroceryItem[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (value.length >= 2 && showSuggestions) {
                setLoading(true);
                try {
                    // Fetch suggestions (page 1, limit 5)
                    const { data } = await fetchGroceryItems(1, 5, value);
                    // Filter out exact matches to avoid showing the same item if already typed fully
                    // but usually typeahead shows it anyway. Let's keep it simple.
                    setSuggestions(data);
                } catch (error) {
                    console.error("Failed to fetch suggestions", error);
                    setSuggestions([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setSuggestions([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [value, showSuggestions]);

    // Handle outside click to close suggestions
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [wrapperRef]);

    const handleSelect = (item: GroceryItem) => {
        onChange(item.name);
        if (onSelect) {
            onSelect(item);
        }
        setShowSuggestions(false);
    };

    const createNewProduct = () => {
        
    }

    return (
        <div ref={wrapperRef} className="relative w-full">
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    setShowSuggestions(true);
                }}
                onFocus={() => {
                    if (value.length >= 2) setShowSuggestions(true);
                }}
                placeholder={placeholder}
                required={required}
                className={className}
                autoComplete="off"
            />

            {showSuggestions && (value.length >= 2) && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-100">
                    {loading ? (
                        <div className="p-3 text-sm text-slate-400 text-center">Loading...</div>
                    ) : suggestions.length > 0 ? (
                        <ul className="py-1">
                            {suggestions.map((item) => (
                                <li
                                    key={item.id}
                                    onClick={() => handleSelect(item)}
                                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer transition-colors flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-2">
                                        <Search className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
                                        <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                                            {item.name}
                                        </span>
                                    </div>
                                    {item.store && (
                                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                            {item.store}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="p-3 text-sm text-slate-400 text-center">
                            No existing items found. <span onClick={() => createNewProduct()}>Create new?</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
