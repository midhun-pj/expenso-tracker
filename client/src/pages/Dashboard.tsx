import type { FC } from 'react';
import { ArrowDownRight, ArrowUpRight, DollarSign, TrendingUp } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

import { useStore } from '../store/useStore';
import { useDashboardFilters } from '../hooks/useDashboardFilters';
import { generateDistinctColors } from '../utils/chartHelpers';
import { SummaryCard } from '../components/SummaryCard';
import { FilterBar } from '../components/FilterBar';
import strings from './nls/dashboard_strings.json';

export const Dashboard: FC = () => {
  const { currency, theme, expenseSummary } = useStore();
  const {
    filterMonth,
    filterYear,
    setFilterMonth,
    setFilterYear,
    monthOptions,
    yearOptions,
  } = useDashboardFilters();

  const totalIncome = expenseSummary?.totalIncome || 0;
  const totalSpent = expenseSummary?.totalExpenses || 0;
  const netBalance = totalIncome - totalSpent;

  const pieData = (expenseSummary?.expenseDistribution || []).map(item => ({
    name: item.category_name,
    value: item.total,
  }));

  const barData = (expenseSummary?.monthlyData || []).map(item => {
    const monthName = new Date(2000, parseInt(item.month) - 1, 1).toLocaleDateString('en-US', { month: 'short' });
    return {
      name: monthName,
      amt: item.expense,
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <FilterBar
        filters={[
          {
            value: filterYear,
            onChange: setFilterYear,
            options: yearOptions,
            placeholder: strings.allYears,
            minWidth: '120px',
          },
          {
            value: filterMonth,
            onChange: setFilterMonth,
            options: monthOptions,
            placeholder: strings.allMonths,
            minWidth: '140px',
          },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title={strings.totalIncome}
          value={`${currency}${totalIncome.toFixed(2)}`}
          icon={
            <div className="bg-primary-50 p-4 rounded-xl">
              <DollarSign className="w-8 h-8" style={{ color: 'var(--color-primary-600)' }} />
            </div>
          }
        >
          {totalIncome > 0 && (
            <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full mt-2">
              <ArrowUpRight className="w-3 h-3 mr-1" /> {strings.incomeBadge}
            </span>
          )}
        </SummaryCard>

        <SummaryCard
          title={strings.totalSpent}
          value={`${currency}${totalSpent.toFixed(2)}`}
          icon={
            <div className="bg-pink-50 p-4 rounded-xl">
              <TrendingUp className="w-8 h-8 text-pink-600" />
            </div>
          }
        >
          <span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full mt-2">
            <ArrowDownRight className="w-3 h-3 mr-1" /> {strings.expenseBadge}
          </span>
        </SummaryCard>

        <SummaryCard
          title={strings.netBalance}
          value={`${netBalance >= 0 ? '+' : '-'}${currency}${Math.abs(netBalance).toFixed(2)}`}
          icon={
            <div className="bg-success-50 p-4 rounded-xl">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: 'var(--color-success-600)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          }
        >
          <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3 w-32">
            <div className="h-2.5 rounded-full" style={{ backgroundColor: 'var(--color-success-500)', width: `${Math.min(100, totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0)}%` }}></div>
          </div>
        </SummaryCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">{strings.expenseDistribution}</h3>
          <div className="h-64" style={{ height: '16rem', width: '100%' }}>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((_, index) => {
                      const colors = generateDistinctColors(pieData.length);
                      return <Cell key={`cell-${index}`} fill={colors[index]} />;
                    })}
                  </Pie>
                  <Tooltip formatter={(value) => `${currency}${value}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                {strings.noExpenseData}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">{strings.monthlyTrends}</h3>
          <div className="h-64">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value) => `${currency}${Number(value).toFixed(2)}`} />
                  <Bar dataKey="amt" fill={theme?.buttonColor || '#4f46e5'} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                {strings.noMonthlyData}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};