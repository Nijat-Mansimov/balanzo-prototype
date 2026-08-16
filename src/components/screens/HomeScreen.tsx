import React from 'react';
import { 
  Plus, 
  ChevronRight, 
  UtensilsCrossed,
  CarFront,
  Building2,
  Ticket,
  ShoppingBag,
  ReceiptText,
  ArrowLeftRight,
  ScanLine,
  Wallet,
  TrendingUp,
  Sparkles,
  AlertCircle,
  Clock
} from 'lucide-react';
import { Group, Expense, WorkspaceType } from '../../types';
import { AvatarStack } from '../common/AvatarStack';
import { useLanguage } from '../../i18n/LanguageContext';

interface HomeScreenProps {
  groups: Group[];
  expenses: Expense[];
  workspace: WorkspaceType;
  walletBalance?: number;
  onOpenAddExpense: () => void;
  onOpenSettleUp: () => void;
  onOpenScanReceipt: () => void;
  onSelectGroup: (groupId: string) => void;
  onOpenPlanUsage: () => void;
  onOpenBalances: () => void;
  onOpenAnalytics?: () => void;
  onOpenAddFunds?: () => void;
  onOpenAddPaymentMethod?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  groups,
  expenses,
  workspace,
  walletBalance = 425.50,
  onOpenAddExpense,
  onOpenSettleUp,
  onOpenScanReceipt,
  onSelectGroup,
  onOpenPlanUsage,
  onOpenBalances,
  onOpenAnalytics,
  onOpenAddFunds = () => {},
}) => {
  const { t } = useLanguage();

  // Standardized category icon mapping (clean, cohesive neutral styling)
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'food':
        return <UtensilsCrossed className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />;
      case 'transport':
        return <CarFront className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />;
      case 'hotel':
        return <Building2 className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />;
      case 'entertainment':
        return <Ticket className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />;
      case 'groceries':
        return <ShoppingBag className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />;
      default:
        return <ReceiptText className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />;
    }
  };

  // Financial summary numbers
  const youOweTotal = 86.40;
  const owedToYouTotal = 120.00;
  const netBalance = owedToYouTotal - youOweTotal; // +$33.60
  const isNetPositive = netBalance >= 0;

  return (
    <div className="space-y-4 px-4 pb-24 pt-1 animate-in fade-in duration-300">
      {/* 1. UNIFIED FINANCIAL HERO HUB (Clean, uncluttered, all-in-one card) */}
      <div className="p-4.5 rounded-3xl bg-white dark:bg-neutral-800/95 border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs space-y-3.5">
        {/* Top: Net Balance Header & Full Balances View Link */}
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
              {workspace === 'personal' ? 'Personal Net Balance' : 'Business Balance'}
            </span>
            <div className="mt-1">
              <span className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight tabular-nums">
                {isNetPositive ? '+' : '-'}${Math.abs(netBalance).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isNetPositive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className={`text-xs font-semibold ${
                isNetPositive 
                  ? 'text-emerald-600 dark:text-emerald-400' 
                  : 'text-amber-600 dark:text-amber-400'
              }`}>
                {isNetPositive ? 'You are owed overall' : 'You owe overall'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenBalances}
            id="btn-home-view-balances-pill"
            className="flex items-center gap-1 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white bg-neutral-100 dark:bg-neutral-700/80 hover:bg-neutral-200 dark:hover:bg-neutral-700 px-2.5 py-1.5 rounded-xl cursor-pointer transition-colors shrink-0"
          >
            <span>Breakdown</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Middle: Integrated Two-Metric Strip */}
        <div className="grid grid-cols-2 gap-2 p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
          <div className="px-2">
            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 block">Owed to you</span>
            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              +${owedToYouTotal.toFixed(2)}
            </span>
          </div>
          <div className="px-2 border-l border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500 block">You owe</span>
            <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
              -${youOweTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Primary Action Row: Add Expense & Settle Up */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <button
            type="button"
            onClick={onOpenAddExpense}
            id="btn-hero-add-expense"
            className="py-3 px-3 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-98 transition-all shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add Expense</span>
          </button>

          <button
            type="button"
            onClick={onOpenSettleUp}
            id="btn-hero-settle-up"
            className="py-3 px-3 rounded-2xl bg-white dark:bg-neutral-700/80 border border-neutral-200 dark:border-neutral-600 text-neutral-900 dark:text-white text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 active:scale-98 transition-all shadow-xs cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 stroke-[2.2] text-[#6552FF] dark:text-indigo-400" />
            <span>Settle Up</span>
          </button>
        </div>

        {/* Minimal Secondary Tools Ribbon (Analytics, Balances, Scan, Plan) */}
        <div className="flex items-center justify-between pt-1 border-t border-neutral-100 dark:border-neutral-700/60 text-neutral-600 dark:text-neutral-300 text-[11px] font-semibold overflow-x-auto no-scrollbar gap-1">
          <button
            type="button"
            onClick={onOpenAnalytics || onOpenBalances}
            id="btn-hero-tool-analytics"
            className="flex items-center gap-1.5 py-1 px-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <TrendingUp className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 stroke-[2]" />
            <span>Analytics</span>
          </button>

          <button
            type="button"
            onClick={onOpenScanReceipt}
            id="btn-hero-tool-scan"
            className="flex items-center gap-1.5 py-1 px-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <ScanLine className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 stroke-[2]" />
            <span className="whitespace-nowrap">Scan Receipt</span>
          </button>

          <button
            type="button"
            onClick={onOpenBalances}
            id="btn-hero-tool-balances"
            className="flex items-center gap-1.5 py-1 px-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700/50 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Wallet className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 stroke-[2]" />
            <span>Balances</span>
          </button>

          <button
            type="button"
            onClick={onOpenPlanUsage}
            id="btn-hero-tool-plan"
            className="flex items-center gap-1.5 py-1 px-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-neutral-600 dark:text-neutral-300 transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400 stroke-[2]" />
            <span>Plan</span>
          </button>
        </div>
      </div>

      {/* 2. NEEDS ATTENTION INLINE NOTIFICATION (Only shows when pending action exists) */}
      <div
        onClick={onOpenSettleUp}
        id="card-needs-attention"
        className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 hover:bg-amber-50 dark:hover:bg-amber-950/50 transition-all cursor-pointer group shadow-2xs"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertCircle className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">
              Arif requested settlement
            </p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
              Airport transfer • $11.25 pending
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-amber-600 dark:text-amber-400 tabular-nums">
            $11.25
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>

      {/* 3. ACTIVE GROUPS SECTION (Cleaner, refined visual cards) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {t('home.active_groups', undefined, 'Active Groups')}
          </h2>
          <button
            onClick={() => onSelectGroup('all')}
            id="btn-home-see-all-groups"
            className="text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white cursor-pointer"
          >
            {t('btn.view_all', undefined, 'See all')} ({groups.length})
          </button>
        </div>

        <div className="space-y-2.5">
          {groups.slice(0, 2).map((group) => {
            const isPositive = (group.yourBalance || 0) >= 0;
            return (
              <div
                key={group.id}
                onClick={() => onSelectGroup(group.id)}
                className="overflow-hidden rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all cursor-pointer group shadow-2xs"
              >
                {/* Header Strip with Cover Preview */}
                <div className="relative h-20 w-full overflow-hidden bg-neutral-900">
                  {group.coverImage ? (
                    <img
                      src={group.coverImage}
                      alt={group.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-85"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className="w-full h-full opacity-90"
                      style={{ background: group.coverGradient || '#6552FF' }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Destination Tag */}
                  <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-semibold text-white/90 border border-white/10">
                      {group.inferredDestination || 'Circle'}
                    </span>
                    <span className="text-[10px] text-white/80 font-medium px-1.5 py-0.5 rounded bg-black/30 backdrop-blur-sm">
                      {group.inferredDateRange || 'Active'}
                    </span>
                  </div>

                  {/* Group Title in banner */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                    <h3 className="text-sm font-bold text-white tracking-tight leading-tight drop-shadow-xs">
                      {group.name}
                    </h3>
                    <span className="text-[10px] text-white/80 font-medium">
                      ${(group.totalExpenses || 0).toFixed(2)} total
                    </span>
                  </div>
                </div>

                {/* Card Footer with Members and Balance */}
                <div className="p-3 flex items-center justify-between bg-white dark:bg-neutral-800">
                  <div className="flex items-center gap-2">
                    <AvatarStack members={group.members} size="xs" max={3} />
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                      {group.members.length} members
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-neutral-400 font-medium mr-1.5">
                      {isPositive ? 'You are owed' : 'You owe'}
                    </span>
                    <span
                      className={`text-xs font-black tabular-nums ${
                        isPositive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {isPositive ? '+' : ''}${Math.abs(group.yourBalance || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. RECENT ACTIVITY FEED (Minimal, scannable transaction list) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between pt-1">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {t('home.recent_activity', undefined, 'Recent Activity')}
          </h2>
          <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Latest</span>
          </span>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-700/70 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/80 overflow-hidden shadow-2xs">
          {expenses.slice(0, 3).map((expense) => {
            const isPayer = expense.paidById === 'user-nijat';
            return (
              <div
                key={expense.id}
                className="p-3 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/40 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700/80 flex items-center justify-center shrink-0">
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">
                      {expense.title}
                    </h4>
                    <p className="text-[10px] text-neutral-400 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                      <span>{isPayer ? 'You paid' : 'Paid by Arif'}</span>
                      <span>•</span>
                      <span>{new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white tabular-nums">
                    ${(expense.amount || 0).toFixed(2)}
                  </div>
                  <div className="text-[10px] tabular-nums font-semibold">
                    {isPayer ? (
                      <span className="text-emerald-600 dark:text-emerald-400">
                        +${((expense.amount || 0) - (expense.splits?.find(s => s.memberId === 'user-nijat')?.amount || 0)).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400">
                        -${(expense.splits?.find(s => s.memberId === 'user-nijat')?.amount || 0).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
