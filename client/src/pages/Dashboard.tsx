import type { FC } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { useStore } from "@store/useStore";
import { useDashboardFilters } from "@hooks/useDashboardFilters";
import { SummaryCard } from "@components/common/SummaryCard";
import FilterDropdown from "@components/common/FilterDropdown";
import List from "@components/common/List";

import type { Account } from "@models/account.model";
import { generateDistinctColors } from "@utils/app.methods";
import Strings from "./nls/dashboard_strings.json";

export const Dashboard: FC = () => {
  const { currency, dashboardSummary, theme } = useStore();
  const {
    filterMonth,
    filterYear,
    setFilterMonth,
    setFilterYear,
    monthOptions,
    yearOptions,
  } = useDashboardFilters();

  const totalIncome = dashboardSummary?.summary.totalIncome || 0;
  const totalSpent = dashboardSummary?.summary.totalExpense || 0;
  const netBalance = dashboardSummary?.totalBalance || 0;

  const accounts = dashboardSummary?.accounts || [];
  const pieData = dashboardSummary?.pieData || [];
  const barData = dashboardSummary?.barData || [];

  const allAccounts = accounts.map((account: Account) => ({
    id: account.id,
    name: account.name,
    type: account.type,
    balance: `${currency}${Number(account?.balance || 0).toFixed(2)}`,
  }));

  const colors = generateDistinctColors(pieData.length);

  return (
    <div className="space-y-6 animate-fade-in">
      <section className="flex items-center gap-3 flex-wrap bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <FilterDropdown
          filterValue={String(filterYear)}
          filterOptions={yearOptions}
          defaultOption={Strings.allYears}
          onChange={(value) => setFilterYear(+value)}
        />

        <FilterDropdown
          filterValue={String(filterMonth)}
          filterOptions={monthOptions}
          defaultOption={Strings.allMonths}
          onChange={(value) => setFilterMonth(+value)}
        />
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title={Strings.totalIncome}
          value={`${currency}${totalIncome.toFixed(2)}`}
          icon={
            <div className="bg-primary-50 p-4 rounded-xl">
              <DollarSign
                className="w-8 h-8"
                style={{ color: "var(--color-primary-600)" }}
              />
            </div>
          }
        >
          {totalIncome > 0 && (
            <span className="inline-flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full mt-2">
              <ArrowUpRight className="w-3 h-3 mr-1" /> {Strings.incomeBadge}
            </span>
          )}
        </SummaryCard>

        <SummaryCard
          title={Strings.totalSpent}
          value={`${currency}${totalSpent.toFixed(2)}`}
          icon={
            <div className="bg-pink-50 p-4 rounded-xl">
              <TrendingUp className="w-8 h-8 text-pink-600" />
            </div>
          }
        >
          <span className="inline-flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full mt-2">
            <ArrowDownRight className="w-3 h-3 mr-1" /> {Strings.expenseBadge}
          </span>
        </SummaryCard>

        <SummaryCard
          title={Strings.netBalance}
          value={`${netBalance >= 0 ? "+" : "-"}${currency}${Math.abs(netBalance).toFixed(2)}`}
          icon={
            <div className="bg-success-50 p-4 rounded-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-8 h-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: "var(--color-success-600)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          }
        >
          <div className="w-full bg-slate-100 rounded-full h-2.5 mt-3 w-32">
            <div
              className="h-2.5 rounded-full"
              style={{
                backgroundColor: "var(--color-success-500)",
                width: `${Math.min(100, totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0)}%`,
              }}
            ></div>
          </div>
        </SummaryCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            {Strings.expenseDistribution}
          </h3>
          <div className="h-64" style={{ height: "16rem", width: "100%" }}>
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
                    {pieData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={colors[index % colors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) =>
                      `${currency}${Number(value).toFixed(2)}`
                    }
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                {Strings.noExpenseData}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-6">
            {Strings.monthlyTrends}
          </h3>
          <div className="h-64">
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: "#f1f5f9" }}
                    formatter={(value, name) => [
                      `${currency}${Number(value).toFixed(2)}`,
                      name === "expense" ? "Expense" : "Income",
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="expense"
                    name="expense"
                    stackId="a"
                    fill={theme?.primaryColor || "#4f46e5"}
                    radius={[0, 0, 0, 0]}
                  />
                  <Bar
                    dataKey="income"
                    name="income"
                    stackId="a"
                    fill={theme?.successColor || "#10b981"}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-slate-400">
                {Strings.noMonthlyData}
              </div>
            )}
          </div>
        </div>
      </div>

      <List
        data={allAccounts}
        headers={[
          {
            key: "name",
            label: "Name",
          },
          {
            key: "type",
            label: "Type",
          },
          {
            key: "balance",
            label: "Balance",
          },
        ]}
      />
    </div>
  );
};
