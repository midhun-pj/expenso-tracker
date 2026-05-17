import { useState, useEffect } from 'react';
import { useStore } from '@store/useStore';

import { generateMonthOptions, generateYearOptions } from '@utils/app.methods';
import type { SelectOption } from '@models/common.model';

interface DashboardFilters {
    filterMonth: number;
    filterYear: number;
    setFilterMonth: (month: number) => void;
    setFilterYear: (year: number) => void;
    monthOptions: SelectOption[];
    yearOptions: SelectOption[];
}

export const useDashboardFilters = (): DashboardFilters => {
    const { loadDashboardSummary } = useStore();

    const [filterMonth, setFilterMonth] = useState<number>(new Date().getMonth() + 1);
    const [filterYear, setFilterYear] = useState<number>(new Date().getFullYear());

    const monthOptions = generateMonthOptions();
    const yearOptions = generateYearOptions();

    useEffect(() => {
        loadDashboardSummary(filterMonth, filterYear);
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
