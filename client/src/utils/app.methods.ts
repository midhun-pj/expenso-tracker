import type { SelectOption } from "@models/common.model";
import type { ThemeConfig } from "@models/settings.model";

export async function handleResponse(res: Response) {
    if (!res.ok) {
        const text = await res.text();

        throw new Error(`${res.status} ${res.statusText}: ${text}`);
    }
    const contentType = res.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
        return res.json();
    }

    return null;
}



export function authHeaders(): Record<string, string> {
    try {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    } catch {
        return {};
    }
}

export function applyTheme(themeConfig: ThemeConfig) {
    try {
        const root = document.documentElement;
        root.style.setProperty("--nav-bg", themeConfig.navColor);
        root.style.setProperty("--text-color", themeConfig.textColor);
        root.style.setProperty("--btn-bg", themeConfig.primaryColor);

        if (themeConfig.themeName) {
            document.body.setAttribute("data-theme", themeConfig.themeName);
        }
    } catch {
        // ignore
        console.warn("Something went wrong applying theme CSS variables");
    }
}

export const formatCurrency = (currency: string, amount: number) => {
    return `${currency}${Number(amount).toFixed(2)}`;
};



export const generateMonthOptions = (): SelectOption[] => {
    const months: SelectOption[] = [];

    for (let i = 1; i <= 12; i++) {
        months.push({ value: i, label: new Date(2000, i - 1, 1).toLocaleDateString('en-US', { month: 'long' }) });
    }

    return months;
};

export const generateYearOptions = (range = 5): SelectOption[] => {
    const years: SelectOption[] = [];
    const currentYear = new Date().getFullYear();

    for (let i = 0; i < range; i++) {
        const year = currentYear - i;
        years.push({ value: year, label: String(year) });
    }
    return years;

};