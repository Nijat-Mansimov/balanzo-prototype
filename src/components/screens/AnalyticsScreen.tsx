import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  PieChart as PieIcon, 
  Calendar, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  UtensilsCrossed, 
  CarFront, 
  Building2, 
  Ticket, 
  ShoppingBag, 
  ReceiptText, 
  Sparkles, 
  DollarSign, 
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';
import { Expense, Group } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface AnalyticsScreenProps {
  expenses: Expense[];
  groups: Group[];
  onOpenAddExpense: () => void;
  onOpenBalances: () => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  expenses,
  groups,
  onOpenAddExpense,
  onOpenBalances,
}) => {
  const { t } = useLanguage();
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  const [activeChartTab, setActiveChartTab] = useState<'trend' | 'category' | 'flow'>('trend');

  // Monthly trends data (6 months)
  const monthlyTrendData = [
    { month: 'Mar', yourShare: 145.20, totalSpend: 310.00, lent: 80.00, borrowed: 45.00 },
    { month: 'Apr', yourShare: 198.50, totalSpend: 420.00, lent: 110.00, borrowed: 60.00 },
    { month: 'May', yourShare: 230.00, totalSpend: 540.00, lent: 140.00, borrowed: 85.00 },
    { month: 'Jun', yourShare: 310.80, totalSpend: 680.00, lent: 190.00, borrowed: 95.00 },
    { month: 'Jul', yourShare: 275.40, totalSpend: 590.00, lent: 155.00, borrowed: 70.00 },
    { month: 'Aug', yourShare: 214.50, totalSpend: 495.20, lent: 120.00, borrowed: 86.40 },
  ];

  // Category breakdown data
  const categoryData = [
    { name: 'Food & Dining', value: 168.40, color: '#F97316', icon: UtensilsCrossed, count: 8, pct: '38%' },
    { name: 'Transport & Flights', value: 112.00, color: '#3B82F6', icon: CarFront, count: 4, pct: '25%' },
    { name: 'Hotels & Lodging', value: 95.00, color: '#6366F1', icon: Building2, count: 2, pct: '21%' },
    { name: 'Entertainment', value: 42.50, color: '#A855F7', icon: Ticket, count: 3, pct: '10%' },
    { name: 'Groceries & Supplies', value: 26.30, color: '#10B981', icon: ShoppingBag, count: 2, pct: '6%' },
  ];

  // Group distribution data
  const groupDistribution = [
    { name: 'Trip to Baku 2026', amount: 245.80, sharePct: 50, color: 'from-[#6552FF] to-indigo-600' },
    { name: 'Summer Lake Cabin', amount: 135.40, sharePct: 27, color: 'from-amber-500 to-orange-600' },
    { name: 'Flat 4B Roommates', amount: 114.00, sharePct: 23, color: 'from-emerald-500 to-teal-600' },
  ];

  // Key monthly computed metrics
  const totalMonthlySpend = 495.20;
  const userMonthlyShare = 214.50;
  const upfrontPaidByYou = 380.00;
  const avgDailySpend = (userMonthlyShare / 30).toFixed(2);

  return (
    <div className="space-y-4 px-4 pb-24 pt-1 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
            Expense Analytics
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Monthly breakdowns, personal share & category trends
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="flex p-1 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80">
          <button
            type="button"
            onClick={() => setTimeframe('month')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'month'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
            }`}
          >
            This Month
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('quarter')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'quarter'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
            }`}
          >
            3M
          </button>
          <button
            type="button"
            onClick={() => setTimeframe('year')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              timeframe === 'year'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300'
            }`}
          >
            YTD
          </button>
        </div>
      </div>

      {/* Top Monthly Metrics Cards */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* Card 1: Your Actual Share */}
        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">
            <span>Your Net Share</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.5 rounded-full">
              <TrendingDown className="w-3 h-3" />
              -14%
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums tracking-tight">
            ${userMonthlyShare.toFixed(2)}
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
            Avg. ${avgDailySpend}/day in August
          </p>
        </div>

        {/* Card 2: Total Group Spending */}
        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1 font-semibold">
            <span>Total Group Spend</span>
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-neutral-600 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-700 px-1.5 py-0.5 rounded-full">
              3 Groups
            </span>
          </div>
          <div className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums tracking-tight">
            ${totalMonthlySpend.toFixed(2)}
          </div>
          <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
            Paid upfront: ${upfrontPaidByYou.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Main Interactive Chart Section */}
      <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs space-y-3">
        {/* Chart Sub-Tabs */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-700/80">
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setActiveChartTab('trend')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeChartTab === 'trend'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              Trend (6M)
            </button>
            <button
              type="button"
              onClick={() => setActiveChartTab('category')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeChartTab === 'category'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              Categories
            </button>
            <button
              type="button"
              onClick={() => setActiveChartTab('flow')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                activeChartTab === 'flow'
                  ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                  : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              Lent vs Borrowed
            </button>
          </div>
        </div>

        {/* Chart 1: Trend Bar Chart */}
        {activeChartTab === 'trend' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#6552FF]" />
                Your Share ($)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                Total Bill ($)
              </span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      backgroundColor: '#1E1E24', 
                      color: '#fff', 
                      border: 'none',
                      fontSize: '12px',
                      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)'
                    }} 
                  />
                  <Bar dataKey="totalSpend" fill="#E2E8F0" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="yourShare" fill="#6552FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 2: Category Donut Chart */}
        {activeChartTab === 'category' && (
          <div className="space-y-3">
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Spent']}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      backgroundColor: '#1E1E24', 
                      color: '#fff', 
                      border: 'none',
                      fontSize: '12px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Quick mini legend */}
            <div className="grid grid-cols-2 gap-2 pt-1 border-t border-neutral-100 dark:border-neutral-700/80 text-[11px]">
              {categoryData.slice(0, 4).map((cat) => (
                <div key={cat.name} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-neutral-700 dark:text-neutral-300 truncate font-medium">{cat.name}</span>
                  <span className="font-bold text-neutral-900 dark:text-white ml-auto">{cat.pct}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chart 3: Lent vs Borrowed Cash Flow */}
        {activeChartTab === 'flow' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                Owed to You ($)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                You Owe ($)
              </span>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyTrendData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#888' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      backgroundColor: '#1E1E24', 
                      color: '#fff', 
                      border: 'none',
                      fontSize: '12px'
                    }} 
                  />
                  <Bar dataKey="lent" fill="#10B981" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="borrowed" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Category Breakdown List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Category Breakdown
          </h2>
          <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
            5 Categories
          </span>
        </div>

        <div className="space-y-2">
          {categoryData.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.name}
                className="p-3.5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 flex items-center justify-between shadow-xs hover:border-neutral-300 dark:hover:border-neutral-600 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    <IconComponent className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                      {cat.count} expenses • {cat.pct} of monthly total
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-black text-neutral-900 dark:text-white tabular-nums">
                    ${cat.value.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-neutral-400 font-medium">
                    avg ${(cat.value / cat.count).toFixed(2)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Trips & Groups Distribution */}
      <div className="space-y-2.5">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Spending by Group
        </h2>

        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3.5 shadow-xs">
          {groupDistribution.map((group) => (
            <div key={group.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-neutral-900 dark:text-white truncate">
                  {group.name}
                </span>
                <span className="font-black text-neutral-900 dark:text-white tabular-nums">
                  ${group.amount.toFixed(2)}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-100 dark:bg-neutral-700 overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-gradient-to-r ${group.color}`} 
                  style={{ width: `${group.sharePct}%` }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Automated Insight Card */}
      <div className="p-4 rounded-3xl bg-neutral-900 dark:bg-neutral-800 text-white border border-neutral-800 dark:border-neutral-700 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
          <Sparkles className="w-4 h-4 text-[#6552FF] stroke-[2]" />
          <span>Smart Balanzo Spending Insights</span>
        </div>
        <p className="text-xs text-neutral-300 leading-relaxed font-normal">
          You have paid <strong className="text-white font-bold">$380.00</strong> upfront this month, but your actual net consumption was only <strong className="text-white font-bold">$214.50</strong>. You are currently owed <strong className="text-emerald-400 font-bold">$120.00</strong> from Leyla & Samir.
        </p>
        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenBalances}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            <span>View Balances & Settle Up</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
