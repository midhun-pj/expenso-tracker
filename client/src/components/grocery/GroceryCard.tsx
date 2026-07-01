import React from 'react';
import { ShoppingCart, Tag, History } from 'lucide-react';
import type { GrocerySummaryItem } from '@models/grocery.model';

interface GroceryCardProps {
    item: GrocerySummaryItem;
    currency: string;
    onClick: () => void;
    strings: any;
}

export const GroceryCard: React.FC<GroceryCardProps> = ({
    item,
    currency,
    onClick,
    strings
}) => {
    const productName = item.product?.name || 'Unknown Product';
    const brandName = item.product?.brandName;

    return (
        <div
            onClick={onClick}
            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all cursor-pointer group"
        >
            <div className="flex justify-between items-start mb-4">
                <div className='flex flex-col'>
                    <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">
                        {productName}
                        {brandName && (
                            <span className="block text-xs font-normal text-slate-400 mt-1">{brandName}</span>
                        )}
                    </h3>
                    <p className="text-sm font-medium text-slate-500">
                        {item.quantity} {item.unit}
                    </p>
                </div>
                <div className="bg-emerald-50 p-3 rounded-xl group-hover:bg-emerald-100 transition-colors">
                    <ShoppingCart className="h-6 w-6 text-emerald-600" />
                </div>
            </div>

            <div className="space-y-3">
                {/* Best Price Section */}
                <div className="flex justify-between items-center p-3 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm font-semibold text-emerald-900">{strings.bestPrice}</span>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-emerald-700">
                            {currency}{item.best_price.toFixed(2)}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-tight">
                            {item.best_quantity} {item.best_unit} • {item.best_store}
                        </span>
                    </div>
                </div>

                {/* Latest Price Section */}
                <div className="flex justify-between items-center p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-2">
                        <History className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">{strings.latestPrice}</span>
                    </div>
                    <div className="text-right">
                        <span className="block font-bold text-slate-700">
                            {currency}{item.price.toFixed(2)}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                            {new Date(item.date).toLocaleDateString()}
                        </span>
                    </div>
                </div>
            </div>

            {item.purchaseCount && item.purchaseCount > 1 && (
                <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        {item.purchaseCount} Total Purchases
                    </span>
                </div>
            )}
        </div>
    );
};
