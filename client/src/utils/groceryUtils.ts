import type { GroceryItem } from './app.models';

export const generateMonthOptions = () => {
    const months = [];
    const now = new Date();
    for (let i = 0; i < 12; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        months.push({ value: monthKey, label: monthLabel });
    }
    return months;
};

export const getBestPrice = (items: GroceryItem[]) => {
    if (items.length === 0) return null;
    return items.reduce((min, item) => item.price < min.price ? item : min, items[0]);
};

export const getLatestPrice = (items: GroceryItem[]) => {
    if (items.length === 0) return null;
    return items.reduce((latest, item) =>
        new Date(item.date) > new Date(latest.date) ? item : latest, items[0]
    );
};
