import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import * as api from '../api';
import type { GroceryItem } from '../utils/app.models';
import { ShoppingBasket } from 'lucide-react';
import { getLatestPrice } from '../utils/groceryUtils';
import strings from './nls/grocery_strings.json';

// Sub-components
import { GroceryFilters } from '../components/grocery/GroceryFilters';
import { GroceryHeader } from '../components/grocery/GroceryHeader';
import { GroceryCard } from '../components/grocery/GroceryCard';
import { GroceryHistoryModal } from '../components/grocery/GroceryHistoryModal';

const ITEMS_PER_PAGE_GRID = 10;
const ITEMS_PER_PAGE_HISTORY = 10;

export const GroceryTracker: React.FC = () => {
  const navigate = useNavigate();
  const { groceryItems, deleteGroceryItem, editGroceryItem, supermarkets, currency, groceryPagination, loadGroceryPage } = useStore();
  const [loadingMore, setLoadingMore] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter State
  const [filterMonth, setFilterMonth] = useState<string | undefined>(undefined);
  const [filterSupermarket, setFilterSupermarket] = useState<number | undefined>(undefined);

  // View States
  const [viewHistoryItem, setViewHistoryItem] = useState<string | null>(null);
  const [fetchedHistory, setFetchedHistory] = useState<GroceryItem[] | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Pagination State
  const [historyPage, setHistoryPage] = useState(1);

  // Edit Item Form State (Inline)
  const [editStore, setEditStore] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editQuantity, setEditQuantity] = useState('');
  const [editUnit, setEditUnit] = useState('g');
  const [editDate, setEditDate] = useState('');

  // Group items by name
  const groupedItems = useMemo(() => {
    const groups: { [key: string]: GroceryItem[] } = {};
    groceryItems.forEach(item => {
      if (!groups[item.name]) {
        groups[item.name] = [];
      }
      groups[item.name].push(item);
    });
    return groups;
  }, [groceryItems]);

  const uniqueItemNames = Object.keys(groupedItems).filter(name =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // When search or filters change, request fresh results from the server (page 1).
  useEffect(() => {
    const id = window.setTimeout(() => {
      loadGroceryPage(1, 10, searchTerm, filterMonth, filterSupermarket).catch((e) => console.error('search load failed', e));
    }, 300);
    return () => clearTimeout(id);
  }, [searchTerm, filterMonth, filterSupermarket, loadGroceryPage]);

  const pagesLoaded = groceryPagination?.currentPage ?? Math.max(1, Math.ceil(groceryItems.length / ITEMS_PER_PAGE_GRID));
  const displayedNamesCount = Math.max(ITEMS_PER_PAGE_GRID, pagesLoaded * ITEMS_PER_PAGE_GRID);
  const paginatedNames = uniqueItemNames.slice(0, displayedNamesCount);

  // Pagination Calculations (History Modal)
  const historyItems = (viewHistoryItem && groupedItems[viewHistoryItem]) ? [...groupedItems[viewHistoryItem]] : [];
  const sortedHistoryItems = historyItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const historyToDisplay = fetchedHistory || sortedHistoryItems;
  const totalHistoryPages = Math.ceil(historyToDisplay.length / ITEMS_PER_PAGE_HISTORY);
  const historyStartIndex = (historyPage - 1) * ITEMS_PER_PAGE_HISTORY;
  const paginatedHistoryItems = historyToDisplay.slice(historyStartIndex, historyStartIndex + ITEMS_PER_PAGE_HISTORY);

  // Handlers
  const startEdit = (item: GroceryItem) => {
    setEditingId(item.id);
    const storeId = item.supermarket_id
      ? item.supermarket_id.toString()
      : (supermarkets.find(s => s.name === item.store)?.id.toString() || '');

    setEditStore(storeId);
    setEditPrice(item.price.toString());
    setEditQuantity(item.quantity?.toString() || '');
    setEditUnit(item.unit || 'g');
    setEditDate(item.date);
  };

  const saveEdit = async (id: string, originalItem: GroceryItem) => {
    if (!editStore || !editPrice || !editDate) return;

    const storeObj = supermarkets.find(s => s.id === parseInt(editStore));
    const updated = await editGroceryItem(id, {
      ...originalItem,
      store: storeObj?.name || '',
      supermarket_id: parseInt(editStore),
      price: parseFloat(editPrice),
      quantity: parseFloat(editQuantity),
      unit: editUnit,
      date: editDate
    });

    if (updated && fetchedHistory) {
      setFetchedHistory(fetchedHistory.map(item => item.id === id ? updated : item));
    }
    setEditingId(null);
  };

  const handleDeleteItem = async (id: string) => {
    if (window.confirm(strings.deleteConfirm)) {
      await deleteGroceryItem(id);
      if (fetchedHistory) {
        setFetchedHistory(fetchedHistory.filter(i => i.id !== id));
      }
    }
  };

  return (
    <div className="space-y-6">
      <GroceryFilters
        filterMonth={filterMonth}
        setFilterMonth={setFilterMonth}
        filterSupermarket={filterSupermarket}
        setFilterSupermarket={setFilterSupermarket}
        supermarkets={supermarkets}
        strings={strings}
      />

      <GroceryHeader
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onTrackNew={() => navigate('/grocery/add')}
        strings={strings}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedNames.map(name => (
          <GroceryCard
            key={name}
            name={name}
            items={groupedItems[name]}
            currency={currency}
            strings={strings}
            onClick={() => {
              setViewHistoryItem(name);
              setHistoryPage(1);
              setFetchedHistory(null);
              (async () => {
                setHistoryLoading(true);
                try {
                  const items = groupedItems[name];
                  const latest = getLatestPrice(items);
                  const idToQuery = latest?.id ?? items[0]?.id;
                  if (idToQuery) {
                    const hist = await api.fetchGroceryHistory(idToQuery);
                    setFetchedHistory(hist);
                  }
                } catch (err) {
                  console.error('Failed to fetch item history', err);
                  setFetchedHistory([]);
                } finally {
                  setHistoryLoading(false);
                }
              })();
            }}
          />
        ))}
      </div>

      {groceryPagination?.hasNextPage && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={async (e) => {
              e.stopPropagation();
              if (loadingMore) return;
              setLoadingMore(true);
              try {
                const next = (groceryPagination?.currentPage ?? 1) + 1;
                await loadGroceryPage(next, 10, searchTerm, filterMonth, filterSupermarket);
              } catch (err) {
                console.error('Failed to load more grocery items', err);
              } finally {
                setLoadingMore(false);
              }
            }}
            disabled={loadingMore}
            className="px-6 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 disabled:opacity-60 transition-colors"
          >
            {loadingMore ? strings.loadingMore : strings.loadMoreBtn}
          </button>
        </div>
      )}

      {uniqueItemNames.length === 0 && (
        <div className="py-16 text-center">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBasket className="h-8 w-8 text-slate-300" />
          </div>
          <h3 className="text-slate-900 font-medium">{strings.noItemsFound}</h3>
          <p className="text-slate-500 text-sm mt-1">{strings.noItemsSub}</p>
        </div>
      )}

      {viewHistoryItem && (groupedItems[viewHistoryItem] || fetchedHistory) && (
        <GroceryHistoryModal
          viewHistoryItem={viewHistoryItem}
          items={groupedItems[viewHistoryItem]}
          fetchedHistory={fetchedHistory}
          historyLoading={historyLoading}
          currency={currency}
          supermarkets={supermarkets}
          onClose={() => { setViewHistoryItem(null); setEditingId(null); setFetchedHistory(null); }}
          paginatedHistoryItems={paginatedHistoryItems}
          editingId={editingId}
          editStore={editStore}
          editPrice={editPrice}
          editQuantity={editQuantity}
          editUnit={editUnit}
          editDate={editDate}
          setEditStore={setEditStore}
          setEditPrice={setEditPrice}
          setEditQuantity={setEditQuantity}
          setEditUnit={setEditUnit}
          setEditDate={setEditDate}
          startEdit={startEdit}
          saveEdit={saveEdit}
          cancelEdit={() => setEditingId(null)}
          onDeleteItem={handleDeleteItem}
          historyPage={historyPage}
          totalHistoryPages={totalHistoryPages}
          setHistoryPage={setHistoryPage}
          strings={strings}
        />
      )}
    </div>
  );
};