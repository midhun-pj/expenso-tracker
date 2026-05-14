import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import * as accountsApi from '../api/accounts.api';

export const AccountCreation: FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [type, setType] = useState<'CASH' | 'BANK' | 'CREDIT_CARD' | 'SAVINGS' | 'WALLET'>('CASH');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const accountTypes: Array<'CASH' | 'BANK' | 'CREDIT_CARD' | 'SAVINGS' | 'WALLET'> = [
        'CASH',
        'BANK',
        'CREDIT_CARD',
        'SAVINGS',
        'WALLET'
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Account name is required');
            return;
        }

        setLoading(true);
        try {
            await accountsApi.createAccount({ name, type });
            navigate('/accounts');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-slate-600" />
                    </button>
                    <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Account Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Account Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., My Checking Account"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900"
                                required
                            />
                        </div>

                        {/* Account Type */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Account Type *
                            </label>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                {accountTypes.map((typeOption) => (
                                    <button
                                        key={typeOption}
                                        type="button"
                                        onClick={() => setType(typeOption)}
                                        className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                                            type === typeOption
                                                ? 'bg-blue-500 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {typeOption.replace('_', ' ')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creating...' : (
                                <>
                                    <Plus className="h-5 w-5" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
