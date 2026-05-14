export interface SelectOption {
    value: string;
    label: string;
}

export const generateDistinctColors = (count: number): string[] => {
    const colors: string[] = [];

    for (let i = 0; i < count; i++) {
        const hue = (220 + (i * (360 / count))) % 360;
        colors.push(`hsl(${hue}, 70%, 50%)`);
    }

    return colors;
};

export const generateMonthOptions = (): SelectOption[] => {
    const months: SelectOption[] = [];
    for (let i = 1; i <= 12; i++) {
        const monthValue = String(i).padStart(2, '0');
        const monthLabel = new Date(2000, i - 1, 1).toLocaleDateString('en-US', { month: 'long' });
        months.push({ value: monthValue, label: monthLabel });
    }
    return months;
};

export const generateYearOptions = (range = 5): SelectOption[] => {
    const years: SelectOption[] = [];
    const currentYear = new Date().getFullYear();
    for (let i = 0; i < range; i++) {
        const year = currentYear - i;
        years.push({ value: String(year), label: String(year) });
    }
    return years;
};
