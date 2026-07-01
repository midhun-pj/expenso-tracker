import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { useStore } from '@store/useStore';
import List from '@components/common/List';
import Strings from './nls/groceries_strings.json';
import type { CreateGroceryItemPayload, GroceryItem } from '@models/grocery.model';
import { EditPurchaseModal } from '@components/grocery/EditPurchaseModal';

export const GroceryHistory: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { groceryItems, getGroceryItems, currency, removeGroceryItem, updateGroceryItem, products, getProducts, superMarkets } = useStore();
    const [editingItem, setEditingItem] = useState<GroceryItem | null>(null);

    // Initial load for items
    useEffect(() => {
        if (productId) {
            getGroceryItems({ productId, page: 1, limit: 10 });
        }
    }, [productId, getGroceryItems]);

    useEffect(() => {
        if (products?.data?.length === 0) {
            getProducts({ search: '', limit: 100, page: 1 }, false);
        }
    }, [products, getProducts]);

    const productName = products?.data?.find(p => p.id === productId)?.name || 'Product History';

    const handleLoadMore = () => {
        if (groceryItems && groceryItems.pagination.page < groceryItems.pagination.totalPages) {
            getGroceryItems({
                productId,
                page: groceryItems.pagination.page + 1,
                limit: 10
            }, true);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this purchase?")) {
            await removeGroceryItem(id);
            getGroceryItems({ productId, page: 1, limit: groceryItems?.pagination.limit || 10 });
        }
    };

    const handleEditSave = async (id: string, updatedData: Partial<CreateGroceryItemPayload>) => {
        await updateGroceryItem(id, updatedData);
        setEditingItem(null);
        getGroceryItems({ productId, page: 1, limit: groceryItems?.pagination.limit || 10 });
    };

    return (
        <div className="w-full space-y-6">
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 md:bg-transparent md:border-none md:shadow-none md:p-0">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate('/groceries')}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all"
                    >
                        <ArrowLeft className="h-6 w-6" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{productName}</h1>
                        <p className="text-sm text-slate-500 mt-1">{(Strings as any).purchaseHistorySubtitle}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="min-h-[400px]">
                    <List
                        data={groceryItems?.data || []}
                        headers={[
                            {
                                key: 'date',
                                label: Strings.tableDate,
                                render: (val) => new Date(String(val)).toLocaleDateString(),
                                width: '150px'
                            },
                            {
                                key: 'supermarket',
                                label: Strings.tableSupermarket,
                                render: (_, row) => row.supermarket?.name || (Strings as any).unknownStore
                            },
                            {
                                key: 'quantity',
                                label: Strings.tableQuantity,
                                render: (val, row) => `${val} ${row.unit}`,
                                align: 'center'
                            },
                            {
                                key: 'price',
                                label: Strings.tablePrice,
                                render: (val) => `${currency}${Number(val).toFixed(2)}`,
                                align: 'right'
                            },
                        ]}
                        renderActions={(row) => (
                            <div className="flex justify-end gap-2 text-right">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setEditingItem(row); }}
                                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                        emptyMessage={(Strings as any).noHistoryFound || "No history found."}
                    />

                    {groceryItems && groceryItems.pagination.page < groceryItems.pagination.totalPages && (
                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={handleLoadMore}
                                className="px-8 py-3 bg-white border-2 border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-all"
                            >
                                {(Strings as any).btnLoadMore || "Load More"}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <EditPurchaseModal
                editingItem={editingItem}
                setEditingItem={setEditingItem}
                superMarkets={superMarkets}
                handleEditSave={handleEditSave}
            />
        </div>
    );
};
