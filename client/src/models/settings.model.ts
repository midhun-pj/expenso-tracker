
export const COMMON_CURRENCIES = ['$', '€', '£', '₹', '¥', 'R', 'kr', 'AED', '₱'];

export const THEME_PRESETS: ThemeConfig[] = [
    {
        themeName: 'ocean',
        label: 'Ocean Blue',
        description: 'Cool and professional',
        primaryColor: '#4f46e5',
        successColor: '#10b981',
        navColor: '#ffffff',
        textColor: '#0f172a',
    },
    {
        themeName: 'sunset',
        label: 'Sunset Orange',
        description: 'Warm and energetic',
        primaryColor: '#ea580c',
        successColor: '#84cc16',
        navColor: '#fafaf9',
        textColor: '#1c1917',
    },
    {
        themeName: 'forest',
        label: 'Forest Green',
        description: 'Natural and calm',
        primaryColor: '#059669',
        successColor: '#06b6d4',
        navColor: '#fafafa',
        textColor: '#171717',
    },
] as const;

export type ThemeName = typeof THEME_PRESETS[number]['themeName'];

export interface ThemeConfig {
    themeName: string
    navColor: string
    textColor: string
    primaryColor: string
    successColor?: string
    label?: string
    description?: string
}

export interface Config {
    userId?: string
    id?: string
    createdAt?: Date
    updatedAt?: Date
    currency: string
    themeConfig: ThemeConfig
}


export const DEFAULT_CURRENCY = '$';
export const DEFAULT_THEME: ThemeConfig = {
    themeName: 'ocean',
    label: 'Ocean Blue',
    description: 'Cool and professional',
    primaryColor: '#4f46e5',
    successColor: '#10b981',
    navColor: '#ffffff',
    textColor: '#0f172a',
};

export type SettingsFormProps = {
    currency: string;
    theme: ThemeConfig;
    setConfig: (cfg: Config) => Promise<{ success: boolean }>;
    setTheme: (themeName: string) => void;
};
