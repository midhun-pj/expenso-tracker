import React from 'react';
import { X, Store, Edit2, Trash2, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { type GroceryItem, type Supermarket } from '../../utils/app.models';

interface GroceryHistoryModalProps {
    viewHistoryItem: string;
    items: GroceryItem[];
    fetchedHistory: GroceryItem[] | null;
    historyLoading: boolean;
    currency: string;
    supermarkets: Supermarket[];
    onClose: () => void;
    // Pagination
    paginatedHistoryItems: GroceryItem[];
    // Editing actions
    editingId: string | null;
    editStore: string;
    editPrice: string;
    editQuantity: string;
    editUnit: string;
    editDate: string;
    setEditStore: (val: string) => void;
    setEditPrice: (val: string) => void;
    setEditQuantity: (val: string) => void;
    setEditUnit: (val: string) => void;
    setEditDate: (val: string) => void;
    startEdit: (item: GroceryItem) => void;
    saveEdit: (id: string, originalItem: GroceryItem) => void;
    cancelEdit: () => void;
    onDeleteItem: (id: string) => void;
    // Pagination state from parent
    historyPage: number;
    totalHistoryPages: number;
    setHistoryPage: React.Dispatch<React.SetStateAction<number>>;
    strings: any;
}

export const GroceryHistoryModal: React.FC<GroceryHistoryModalProps> = ({
    viewHistoryItem,
    items,
    fetchedHistory,
    historyLoading,
    currency,
    supermarkets,
    onClose,
    paginatedHistoryItems,
    editingId,
    editStore,
    editPrice,
    editQuantity,
    editUnit,
    editDate,
    setEditStore,
    setEditPrice,
    setEditQuantity,
    setEditUnit,
    setEditDate,
    startEdit,
    saveEdit,
    cancelEdit,
    onDeleteItem,
    historyPage,
    totalHistoryPages,
    setHistoryPage,
    strings
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
                <div className="px-4 md:px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                    <div>
                        <h3 className="text-lg md:text-xl font-bold text-slate-800">{viewHistoryItem}</h3>
                        <p className="text-xs md:text-sm text-slate-500">{strings.historyTitle}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-colors">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                <div className="overflow-y-auto p-0 flex-1">
                    {historyLoading ? (
                        <div className="p-8 text-center text-slate-500">{strings.loading}</div>
                    ) : (
                        <>
                            <table className="w-full text-left text-sm">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100 sticky top-0 z-10 shadow-sm">
                                    <tr>
                                        <th className="px-4 md:px-6 py-3 hidden sm:table-cell">{strings.colDate}</th>
                                        <th className="px-4 md:px-6 py-3">{strings.colStore}</th>
                                        <th className="px-4 md:px-6 py-3 text-right">{strings.colQty}</th>
                                        <th className="px-4 md:px-6 py-3 text-right">{strings.colPrice}</th>
                                        <th className="px-4 md:px-6 py-3 text-right">{strings.colActions}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {(fetchedHistory ?? paginatedHistoryItems).map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                                            {editingId === item.id ? (
                                                <>
                                                    <td className="px-4 md:px-6 py-3 hidden sm:table-cell">
                                                        <input
                                                            type="date"
                                                            value={editDate}
                                                            onChange={(e) => setEditDate(e.target.value)}
                                                            className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                                        />
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3">
                                                        <select
                                                            value={editStore}
                                                            onChange={(e) => setEditStore(e.target.value)}
                                                            className="w-full min-w-[80px] bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                                        >
                                                            {supermarkets.map(s => <option key={s.id} value={s.id.toString()}>{s.name}</option>)}
                                                        </select>
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <input
                                                                type="number"
                                                                value={editQuantity}
                                                                onChange={(e) => setEditQuantity(e.target.value)}
                                                                className="w-16 bg-white border border-slate-300 rounded px-2 py-1 text-sm text-right focus:ring-2 focus:ring-emerald-500 outline-none"
                                                            />
                                                            <select
                                                                value={editUnit}
                                                                onChange={(e) => setEditUnit(e.target.value)}
                                                                className="w-16 bg-white border border-slate-300 rounded px-1 py-1 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                                            >
                                                                <option value="g">g</option>
                                                                <option value="kg">kg</option>
                                                                <option value="ml">ml</option>
                                                                <option value="l">l</option>
                                                                <option value="count">count</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 text-right">
                                                        <input
                                                            type="number"
                                                            step="0.01"
                                                            value={editPrice}
                                                            onChange={(e) => setEditPrice(e.target.value)}
                                                            className="w-20 md:w-24 ml-auto bg-white border border-slate-300 rounded px-2 py-1 text-sm text-right focus:ring-2 focus:ring-emerald-500 outline-none"
                                                        />
                                                    </td>
                                                    <td className="px-4 md:px-6 py-3 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button onClick={() => saveEdit(item.id, item)} className="text-emerald-600 hover:text-emerald-700 p-1">
                                                                <Check className="h-4 w-4" />
                                                            </button>
                                                            <button onClick={cancelEdit} className="text-slate-400 hover:text-slate-600 p-1">
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-4 md:px-6 py-4 text-slate-600 hidden sm:table-cell">{new Date(item.date).toLocaleDateString()}</td>
                                                    <td className="px-4 md:px-6 py-4 font-medium text-slate-800">
                                                        <span className="flex items-center gap-2">
                                                            <Store className="h-3 w-3 text-slate-400 hidden sm:block" />
                                                            {item.store}
                                                        </span>
                                                        <div className="sm:hidden text-xs text-slate-400 mt-1">{new Date(item.date).toLocaleDateString()}</div>
                                                    </td>
                                                    <td className="px-4 md:px-6 py-4 text-right text-slate-600 text-sm">
                                                        {item.quantity} {item.unit}
                                                    </td>
                                                    <td className="px-4 md:px-6 py-4 text-right font-bold text-slate-700">{currency}{item.price.toFixed(2)}</td>
                                                    <td className="px-4 md:px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => startEdit(item)}
                                                                className="text-slate-400 hover:text-emerald-600 p-1.5 hover:bg-emerald-50 rounded-md transition-colors"
                                                            >
                                                                <Edit2 className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => onDeleteItem(item.id)}
                                                                className="text-slate-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-md transition-colors"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {((fetchedHistory ?? items)?.length ?? 0) === 0 && (
                                <div className="p-12 text-center text-slate-400">{strings.noHistory}</div>
                            )}
                        </>
                    )}
                </div>

                {/* History Pagination */}
                {totalHistoryPages > 1 && (
                    <div className="border-t border-slate-100 px-6 py-3 flex items-center justify-between shrink-0 bg-white">
                        <span className="text-xs text-slate-500">
                            {strings.pageOf.replace('{current}', historyPage.toString()).replace('{total}', totalHistoryPages.toString())}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                                disabled={historyPage === 1}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                onClick={() => setHistoryPage(p => Math.min(totalHistoryPages, p + 1))}
                                disabled={historyPage === totalHistoryPages}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
