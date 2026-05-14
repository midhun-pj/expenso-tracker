import { useState, useEffect, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import * as transactionsApi from '../api/transactions.api';
import * as accountsApi from '../api/accounts.api';

interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
}

export const ExpenseCreation: FC = () => {
    const navigate = useNavigate();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [accountId, setAccountId] = useState('');
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [accountsLoading, setAccountsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            const data = await accountsApi.fetchAccounts();
            setAccounts(data);
            if (data.length > 0) {
                setAccountId(data[0].id);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load accounts');
        } finally {
            setAccountsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!accountId) {
            setError('Please select an account');
            return;
        }

        if (!amount || parseFloat(amount) <= 0) {
            setError('Amount must be greater than 0');
            return;
        }

        setLoading(true);
        try {
            await transactionsApi.createExpense({
                accountId,
                amount: parseFloat(amount),
                description: description || undefined,
            });
            navigate('/expenses');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create expense');
        } finally {
            setLoading(false);
        }
    };

    if (accountsLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
                <div className="text-slate-600">Loading accounts...</div>
            </div>
        );
    }

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
                    <h1 className="text-3xl font-bold text-slate-900">Create Expense</h1>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                    {accounts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-slate-600 mb-4">No accounts found. Please create an account first.</p>
                            <button
                                onClick={() => navigate('/accounts/create')}
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                            >
                                <Plus className="h-5 w-5" />
                                Create Account
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Account Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Account *
                                </label>
                                <select
                                    value={accountId}
                                    onChange={(e) => setAccountId(e.target.value)}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-slate-900"
                                    required
                                >
                                    <option value="">Select an account</option>
                                    {accounts.map((acc) => (
                                        <option key={acc.id} value={acc.id}>
                                            {acc.name} ({acc.type}) - Balance: {acc.balance}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Amount *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-slate-900"
                                    required
                                />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Enter expense description..."
                                    rows={3}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all text-slate-900 resize-none"
                                />
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
                                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                            >
                                {loading ? 'Creating...' : (
                                    <>
                                        <Plus className="h-5 w-5" />
                                        Create Expense
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};
