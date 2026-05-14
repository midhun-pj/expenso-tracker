import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import * as categoriesApi from '../api/categories.api';

export const CategoryCreation: FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) {
            setError('Category name is required');
            return;
        }

        setLoading(true);
        try {
            await categoriesApi.createCategory({ name, type });
            navigate('/categories');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create category');
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
                    <h1 className="text-3xl font-bold text-slate-900">Create Category</h1>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category Name */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Category Name *
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Groceries, Salary, Entertainment"
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-slate-900"
                                required
                            />
                        </div>

                        {/* Category Type */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Category Type *
                            </label>
                            <div className="flex gap-4">
                                {(['EXPENSE', 'INCOME'] as const).map((typeOption) => (
                                    <button
                                        key={typeOption}
                                        type="button"
                                        onClick={() => setType(typeOption)}
                                        className={`flex-1 px-4 py-3 rounded-lg font-medium transition-all ${
                                            type === typeOption
                                                ? typeOption === 'EXPENSE'
                                                    ? 'bg-red-500 text-white shadow-md'
                                                    : 'bg-green-500 text-white shadow-md'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                        }`}
                                    >
                                        {typeOption}
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
                            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {loading ? 'Creating...' : (
                                <>
                                    <Plus className="h-5 w-5" />
                                    Create Category
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
