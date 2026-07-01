import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useStore } from '@store/useStore';

import { Searchbar } from '@components/common/Searchbar';
import { AddButton } from '@components/common/AddButton';
import { GroceryCard } from '@components/grocery/GroceryCard';

import { COMMON_BUTTON_CLASS } from '@utils/app.constant';

import Strings from './nls/groceries_strings.json';

export const Groceries: FC = () => {
    const navigate = useNavigate();
    const {
        grocerySummary,
        getGrocerySummary,
        currency
    } = useStore();

    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchSummary = async (search: string, page = 1, append = false) => {
        setLoading(true);
        await getGrocerySummary({
            page,
            limit: 12,
            search: search.trim() || undefined
        }, append);
        setLoading(false);
    };

    useEffect(() => {
        fetchSummary(searchTerm, 1, false);
    }, []);

    const handleSearch = (value: string) => {
        setSearchTerm(value);
        fetchSummary(value, 1, false);
    };

    const handleLoadMore = () => {
        if (grocerySummary?.pagination) {
            const nextPage = (grocerySummary.pagination.page || 1) + 1;
            fetchSummary(searchTerm, nextPage, true);
        }
    };

    const summaryData = grocerySummary?.data || [];

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex-1">
                    <Searchbar
                        searchTerm={searchTerm}
                        setSearchTerm={handleSearch}
                        searchPlaceholder={Strings.searchPlaceholder}
                    />
                </div>

                <div className="flex items-center gap-3 flex-wrap">

                    <AddButton
                        buttonClasses={COMMON_BUTTON_CLASS}
                        onClick={() => navigate('/groceries/add')}
                        label={Strings.btnAddGrocery}
                        mobileLabel={Strings.btnAddGroceryMobile}
                    />
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {summaryData.map((item) => (
                    <GroceryCard
                        key={item.id}
                        item={item as any}
                        currency={currency}
                        strings={Strings}
                        onClick={() => navigate(`/groceries/history/${item.productId}`)}
                    />
                ))}
            </div>

            {/* Load More Button */}
            {(grocerySummary?.pagination?.totalPages || 0) >
                (grocerySummary?.pagination?.page || 0) && (
                    <div className="flex justify-center mt-6">
                        <button
                            onClick={handleLoadMore}
                            disabled={loading}
                            className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-all text-sm font-medium shadow-sm"
                        >
                            {Strings.loadMore}
                        </button>
                    </div>
                )}

            {summaryData.length === 0 && !loading && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-100">
                    <p className="text-slate-400 font-medium">No products found matching your filters.</p>
                </div>
            )}

        </div>
    );
};
