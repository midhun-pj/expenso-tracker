import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { generateMonthOptions, generateYearOptions, type SelectOption } from '../utils/chartHelpers';

interface DashboardFilters {
    filterMonth: string | undefined;
    filterYear: string | undefined;
    setFilterMonth: (month: string | undefined) => void;
    setFilterYear: (year: string | undefined) => void;
    monthOptions: SelectOption[];
    yearOptions: SelectOption[];
}

export const useDashboardFilters = (): DashboardFilters => {
    const { loadExpenseSummary } = useStore();

    const [filterMonth, setFilterMonth] = useState<string | undefined>(undefined);
    const [filterYear, setFilterYear] = useState<string | undefined>(String(new Date().getFullYear()));

    const monthOptions = generateMonthOptions();
    const yearOptions = generateYearOptions();

    useEffect(() => {
        loadExpenseSummary(filterMonth, filterYear);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterMonth, filterYear]);

    return {
        filterMonth,
        filterYear,
        setFilterMonth,
        setFilterYear,
        monthOptions,
        yearOptions,
    };
};
