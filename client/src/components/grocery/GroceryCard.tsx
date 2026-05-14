import React from 'react';
import { ShoppingCart, Tag, History } from 'lucide-react';
import type { GroceryItem } from '../../utils/app.models';
import { getBestPrice, getLatestPrice } from '../../utils/groceryUtils';

interface GroceryCardProps {
    name: string;
    items: GroceryItem[];
    currency: string;
    onClick: () => void;
    strings: any;
}

export const GroceryCard: React.FC<GroceryCardProps> = ({
    name,
    items,
    currency,
    onClick,
    strings
}) => {
    const latest = getLatestPrice(items);

    // Prefer the best price from the backend distinct query if available
    const best = (items[0]?.best_price !== undefined) ? {
        price: items[0].best_price!,
        quantity: items[0].best_quantity!,
        unit: items[0].best_unit!,
        store: items[0].best_store!
    } : getBestPrice(items);

    if (!best || !latest) return null;

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className='flex flex-col'>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">{name}</h3>
                    <p className="text-sm text-slate-500 mb-4">{items[0].quantity} {items[0].unit}</p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl group-hover:bg-emerald-100 transition-colors">
                    <ShoppingCart className="h-6 w-6 text-emerald-600" />
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-emerald-50/50 rounded-lg">
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-medium text-emerald-900">{strings.bestPrice}</span>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-emerald-700">{currency}{(best.price || 0).toFixed(2)}</span>
                        <span className="text-xs text-emerald-600">{best.quantity} {best.unit} - {best.store}</span>
                    </div>
                </div>

                <div className="flex justify-between items-center p-2 rounded-lg">
                    <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">{strings.latestPrice}</span>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-slate-700">{currency}{(latest.price || 0).toFixed(2)}</span>
                        <span className="text-xs text-slate-400">{new Date(latest.date).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
