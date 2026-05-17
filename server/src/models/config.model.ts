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
