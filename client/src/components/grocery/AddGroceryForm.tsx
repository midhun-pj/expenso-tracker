import React from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { type Supermarket, type BulkItem } from '../../utils/app.models';
import { GroceryTypeahead } from './GroceryTypeahead';

interface AddGroceryFormProps {
    onCancel: () => void;
    addMethod: 'single' | 'bulk';
    setAddMethod: (method: 'single' | 'bulk') => void;
    supermarkets: Supermarket[];
    currency: string;
    // Single form
    newName: string;
    setNewName: (val: string) => void;
    newStore: string;
    setNewStore: (val: string) => void;
    newPrice: string;
    setNewPrice: (val: string) => void;
    newQuantity: string;
    setNewQuantity: (val: string) => void;
    newUnit: string;
    setNewUnit: (val: string) => void;
    newDate: string;
    setNewDate: (val: string) => void;
    onAddItem: (e: React.FormEvent) => void;
    // Bulk form
    bulkStore: string;
    setBulkStore: (val: string) => void;
    bulkDate: string;
    setBulkDate: (val: string) => void;
    bulkItems: BulkItem[];
    onBulkAdd: (e: React.FormEvent) => void;
    addBulkRow: () => void;
    removeBulkRow: (id: string) => void;
    updateBulkItem: (id: string, field: keyof BulkItem, value: string) => void;
    setProductId: (val: any)=> void;
    strings: any;
}

export const AddGroceryForm: React.FC<AddGroceryFormProps> = ({
    onCancel,
    addMethod,
    setAddMethod,
    supermarkets,
    currency,
    newName,
    setNewName,
    newStore,
    setNewStore,
    newPrice,
    setNewPrice,
    newQuantity,
    setNewQuantity,
    newUnit,
    setNewUnit,
    newDate,
    setNewDate,
    onAddItem,
    bulkStore,
    setBulkStore,
    bulkDate,
    setBulkDate,
    bulkItems,
    onBulkAdd,
    addBulkRow,
    removeBulkRow,
    updateBulkItem,
    strings
}) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-800">{strings.trackNewBtn}</h2>
                </div>

                <div className="bg-slate-100 p-1 rounded-xl flex items-center">
                    <button
                        onClick={() => setAddMethod('single')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${addMethod === 'single' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {strings.singleItem}
                    </button>
                    <button
                        onClick={() => setAddMethod('bulk')}
                        className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${addMethod === 'bulk' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {strings.bulkAdd}
                    </button>
                </div>
            </div>

            <div className="p-6 max-w-3xl mx-auto">
                {addMethod === 'single' ? (
                    <form onSubmit={onAddItem} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{strings.labelStoreName}</label>
                                <select
                                    required
                                    value={newStore}
                                    onChange={e => setNewStore(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-success focus:border-transparent outline-none"
                                >
                                    <option value="" disabled>{strings.labelStoreName}</option>
                                    {supermarkets.map(store => (
                                        <option key={store.id} value={store.id.toString()}>{store.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{strings.labelDate}</label>
                                <input
                                    type="date"
                                    required
                                    value={newDate}
                                    onChange={e => setNewDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-success focus:border-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{strings.labelItemName}</label>
                            <GroceryTypeahead
                                value={newName}
                                onChange={setNewName}
                                required
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-success focus:border-transparent outline-none"
                                placeholder={strings.placeholderItemName}
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{strings.labelPrice}</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-3 text-slate-500">{currency}</span>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={newPrice}
                                        onChange={e => setNewPrice(e.target.value)}
                                        className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-success focus:border-transparent outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{strings.labelQuantity}</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={newQuantity}
                                    onChange={e => setNewQuantity(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-success focus:border-transparent outline-none"
                                    placeholder="1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{strings.labelUnit}</label>
                                <select
                                    value={newUnit}
                                    onChange={e => setNewUnit(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 ring-success focus:border-transparent outline-none"
                                >
                                    <option value="g">g</option>
                                    <option value="kg">kg</option>
                                    <option value="ml">ml</option>
                                    <option value="l">l</option>
                                    <option value="count">count</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                            >
                                {strings.btnCancel}
                            </button>
                            <button
                                type="submit"
                                className="bg-success bg-success-hover text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-success"
                            >
                                {strings.btnSaveItem}
                            </button>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={onBulkAdd} className="space-y-8">
                        <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{strings.labelSupermarket}</label>
                                <select
                                    required
                                    value={bulkStore}
                                    onChange={e => setBulkStore(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 ring-success outline-none"
                                >
                                    <option value="" disabled>{strings.labelSupermarket}</option>
                                    {supermarkets.map(store => (
                                        <option key={store.id} value={store.id.toString()}>{store.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{strings.labelPurchaseDate}</label>
                                <input
                                    type="date"
                                    required
                                    value={bulkDate}
                                    onChange={e => setBulkDate(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 ring-success outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between px-1">
                                <h3 className="font-semibold text-slate-800">{strings.itemsList}</h3>
                                <span className="text-xs text-slate-500">{strings.countItems.replace('{count}', bulkItems.length.toString())}</span>
                            </div>

                            {bulkItems.map((item) => (
                                <div key={item.id} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-white p-3 border border-slate-200 rounded-xl animate-fade-in">
                                    <div className="flex-1 w-full sm:w-auto">
                                        <GroceryTypeahead
                                            value={item.name}
                                            onChange={(val) => updateBulkItem(item.id, 'name', val)}
                                            placeholder={strings.labelItemName}
                                            required
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 ring-success outline-none text-sm"
                                        />
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <div className="relative w-28">
                                            <span className="absolute left-3 top-2 text-slate-500 text-sm">{currency}</span>
                                            <input
                                                type="number"
                                                placeholder={strings.placeholderPrice}
                                                step="0.01"
                                                min="0"
                                                value={item.price}
                                                onChange={e => updateBulkItem(item.id, 'price', e.target.value)}
                                                className="w-full pl-6 pr-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 ring-success outline-none text-sm"
                                                required
                                            />
                                        </div>
                                        <input
                                            type="number"
                                            placeholder={strings.placeholderQty}
                                            step="0.01"
                                            min="0"
                                            value={item.quantity}
                                            onChange={e => updateBulkItem(item.id, 'quantity', e.target.value)}
                                            className="w-20 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 ring-success outline-none text-sm"
                                            required
                                        />
                                        <select
                                            value={item.unit}
                                            onChange={e => updateBulkItem(item.id, 'unit', e.target.value)}
                                            className="w-24 px-2 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 ring-success outline-none text-sm"
                                        >
                                            <option value="g">g</option>
                                            <option value="kg">kg</option>
                                            <option value="ml">ml</option>
                                            <option value="l">l</option>
                                            <option value="count">count</option>
                                        </select>
                                        <button
                                            type="button"
                                            onClick={() => removeBulkRow(item.id)}
                                            disabled={bulkItems.length === 1}
                                            className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addBulkRow}
                                className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 font-medium transition-all flex items-center justify-center gap-2"
                                style={{ borderColor: 'var(--color-success-300)', color: 'var(--color-success-600)', backgroundColor: 'var(--color-success-50)' }}
                            >
                                <Plus className="w-5 h-5" />
                                {strings.btnAddAnother}
                            </button>
                        </div>

                        <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="px-6 py-3 text-slate-600 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                            >
                                {strings.btnCancel}
                            </button>
                            <button
                                type="submit"
                                className="bg-success bg-success-hover text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-success"
                            >
                                {strings.btnSaveAll}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};
