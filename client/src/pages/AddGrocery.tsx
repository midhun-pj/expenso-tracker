import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import type { BulkItem } from '../utils/app.models';
import { AddGroceryForm } from '../components/grocery/AddGroceryForm';
import strings from './nls/grocery_strings.json';

export const AddGrocery: React.FC = () => {
    const navigate = useNavigate();
    const { addGroceryItem, addGroceryItemsBulk, supermarkets, currency } = useStore();

    const [addMethod, setAddMethod] = useState<'single' | 'bulk'>('single');

    // Add Item Single Form State
    const [newName, setNewName] = useState('');
    const [newStore, setNewStore] = useState(supermarkets[0]?.id.toString() || '');
    const [newPrice, setNewPrice] = useState('');
    const [newQuantity, setNewQuantity] = useState('1');
    const [newUnit, setNewUnit] = useState('g');
    const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
    const [product, setProduct] = useState('');

    // Bulk Add Form State
    const [bulkStore, setBulkStore] = useState(supermarkets[0]?.id.toString() || '');
    const [bulkDate, setBulkDate] = useState(new Date().toISOString().split('T')[0]);
    const [bulkItems, setBulkItems] = useState<BulkItem[]>([
        { id: '1', name: '', price: '', quantity: '1', unit: 'g' }
    ]);

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newStore || !newPrice) return;

        const storeObj = supermarkets.find(s => s.id === parseInt(newStore));
        addGroceryItem({
            name: newName,
            store: storeObj?.name || '',
            supermarket_id: parseInt(newStore),
            price: parseFloat(newPrice),
            quantity: parseFloat(newQuantity),
            unit: newUnit,
            date: newDate
        });

        navigate('/grocery');
    };

    const handleBulkAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!bulkStore || !bulkDate) return;

        const validItems = bulkItems.filter(item => item.name && item.price);
        if (validItems.length === 0) return;

        const itemsToAdd = validItems.map(item => {
            const storeObj = supermarkets.find(s => s.id === parseInt(bulkStore));
            return {
                name: item.name,
                store: storeObj?.name || '',
                supermarket_id: parseInt(bulkStore),
                price: parseFloat(item.price),
                quantity: parseFloat(item.quantity),
                unit: item.unit,
                date: bulkDate
            };
        });

        addGroceryItemsBulk(itemsToAdd);
        navigate('/grocery');
    };

    const addBulkRow = () => {
        setBulkItems([...bulkItems, { id: Math.random().toString(), name: '', price: '', quantity: '1', unit: 'g' }]);
    };

    const removeBulkRow = (id: string) => {
        if (bulkItems.length > 1) {
            setBulkItems(bulkItems.filter(item => item.id !== id));
        }
    };

    const updateBulkItem = (id: string, field: keyof BulkItem, value: string) => {
        setBulkItems(bulkItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    return (
        <div className="max-w-4xl mx-auto py-6">
            <AddGroceryForm
                onCancel={() => navigate('/grocery')}
                addMethod={addMethod}
                setAddMethod={setAddMethod}
                supermarkets={supermarkets}
                currency={currency}
                newName={newName}
                setNewName={setNewName}
                newStore={newStore}
                setNewStore={setNewStore}
                newPrice={newPrice}
                setNewPrice={setNewPrice}
                newQuantity={newQuantity}
                setNewQuantity={setNewQuantity}
                newUnit={newUnit}
                setNewUnit={setNewUnit}
                newDate={newDate}
                setNewDate={setNewDate}
                onAddItem={handleAddItem}
                bulkStore={bulkStore}
                setBulkStore={setBulkStore}
                bulkDate={bulkDate}
                setBulkDate={setBulkDate}
                bulkItems={bulkItems}
                onBulkAdd={handleBulkAdd}
                addBulkRow={addBulkRow}
                removeBulkRow={removeBulkRow}
                updateBulkItem={updateBulkItem}
                strings={strings}
                setProductId={setProduct}
            />
        </div>
    );
};
