import type { FC, FormEvent } from 'react';

import { useEffect, useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

import {
    type Config, type ThemeConfig,
    COMMON_CURRENCIES, THEME_PRESETS,
    type SettingsFormProps
} from '@models/settings.model';


export const SettingsForm: FC<SettingsFormProps> = ({
    currency,
    theme,
    setConfig,
    setTheme,
}) => {
    const [navColor, setNavColor] = useState<string>(theme?.navColor);
    const [textColor, setTextColor] = useState<string>(theme?.textColor);
    const [primaryColor, setPrimaryColor] = useState<string>(theme?.primaryColor);
    const [localCurrency, setLocalCurrency] = useState<string>(currency);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!theme) return;

        setNavColor(theme.navColor);
        setTextColor(theme.textColor);
        setPrimaryColor(theme.primaryColor);
    }, [theme]);

    const handleSaveTheme = async (e: FormEvent) => {
        e.preventDefault();

        const configuration: Config = {
            themeConfig: {
                themeName: theme?.themeName,
                navColor,
                textColor,
                primaryColor,
            },
            currency: localCurrency,
        }

        await setConfig(configuration);

        showSuccessMessage();
    };

    const showSuccessMessage = () => {
        setSuccessMessage('Configuration saved successfully!');
        setTimeout(() => setSuccessMessage(null), 3000);
    }




    const handleThemePresetClick = async (preset: ThemeConfig) => {
        setNavColor(preset.navColor);
        setTextColor(preset.textColor);
        setPrimaryColor(preset.primaryColor);

        setTheme(preset.themeName);
    };

    return (
        <div className="space-y-8 animate-fade-in mx-auto">
            {successMessage && (
                <div className="fixed top-4 right-4 z-50 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {successMessage}
                </div>
            )}

            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-primary-50 p-2 rounded-lg">
                        <SettingsIcon className="w-6 h-6" style={{ color: 'var(--color-primary-600)' }} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-slate-800">Appearance & Currency</h2>
                        <p className="text-sm text-slate-500">Customize your app theme and currency settings</p>
                    </div>
                </div>

                <form onSubmit={handleSaveTheme} className="space-y-6">
                    {/* Theme Selector Row */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Theme</label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {THEME_PRESETS.map((preset: ThemeConfig) => (
                                <button
                                    key={preset.themeName}
                                    type="button"
                                    onClick={() => handleThemePresetClick(preset)}
                                    className={`p-4 rounded-xl border-2 transition-all text-left ${theme?.themeName === preset.themeName
                                        ? 'border-current shadow-lg scale-105'
                                        : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                                        }`}
                                    style={{
                                        borderColor: theme?.themeName === preset.themeName ? preset.primaryColor : 'white',
                                    }}
                                >
                                    <div className="grid grid-cols-2 gap-2 mb-3">
                                        <div
                                            className="h-10 rounded-lg"
                                            style={{ backgroundColor: preset.primaryColor }}
                                            title="Primary Color"
                                        />
                                        <div
                                            className="h-10 rounded-lg"
                                            style={{ backgroundColor: preset.successColor }}
                                            title="Success Color"
                                        />
                                        <div
                                            className="h-10 rounded-lg border border-slate-200"
                                            style={{ backgroundColor: preset.navColor }}
                                            title="Navigation Color"
                                        />
                                        <div
                                            className="h-10 rounded-lg"
                                            style={{ backgroundColor: preset.textColor }}
                                            title="Text Color"
                                        />
                                    </div>
                                    <h3 className="font-bold text-slate-800 mb-1">{preset.label}</h3>
                                    <p className="text-xs text-slate-500">{preset.description}</p>
                                    {theme?.themeName === preset.themeName && (
                                        <div className="mt-3 text-xs font-medium" style={{ color: preset.primaryColor }}>
                                            ✓ Active
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Currency Selector Row */}
                    <section>
                        <label className="block text-sm font-medium text-slate-700 mb-3">Currency</label>
                        <div className="flex items-center gap-3 flex-wrap">
                            {COMMON_CURRENCIES.map((symbol: string) => (
                                <button
                                    key={symbol}
                                    type="button"
                                    onClick={() => setLocalCurrency(symbol)}
                                    className={`w-12 h-12 flex items-center justify-center rounded-xl font-bold text-lg transition-all ${localCurrency === symbol
                                        ? 'ring-2 ring-offset-2 shadow-md'
                                        : 'bg-slate-50 hover:bg-slate-100'
                                        }`}
                                    style={{
                                        backgroundColor: localCurrency === symbol ? primaryColor : undefined,
                                        color: localCurrency === symbol ? '#ffffff' : undefined,
                                    }}
                                >
                                    {symbol}
                                </button>
                            ))}
                            <input
                                value={localCurrency}
                                onChange={(e) => setLocalCurrency(e.target.value)}
                                placeholder="Custom"
                                className="w-28 h-12 px-3 rounded-xl border border-slate-200 font-medium text-center focus:ring-2 focus:ring-offset-1 outline-none transition-all"
                                style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                            />
                        </div>
                    </section>

                    {/* Save Button Row */}
                    <section className="flex items-center gap-3 pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg text-white font-medium shadow-sm hover:shadow-md transition-all"
                            style={{ backgroundColor: primaryColor }}
                        >
                            Save Configuration
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                // revert local inputs back to the saved store config
                                setNavColor(theme?.navColor ?? '#ffffff');
                                setTextColor(theme?.textColor ?? '#0f172a');
                                setPrimaryColor(theme?.primaryColor ?? '#10b981');
                                setLocalCurrency(currency ?? '$');
                            }}
                            className="px-4 py-2.5 rounded-lg border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </section>
                </form>
            </div>
        </div>
    );
};