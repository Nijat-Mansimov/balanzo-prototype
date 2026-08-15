import React from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Sparkles, 
  Receipt, 
  ChevronRight, 
  ArrowRight,
  Clock,
  Compass,
  Utensils,
  Car,
  Building,
  Ticket,
  ShoppingBag,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { Group, Expense, WorkspaceType } from '../../types';
import { AvatarStack } from '../common/AvatarStack';
import { SoftPaywallBanner } from '../common/SoftPaywallBanner';

interface HomeScreenProps {
  groups: Group[];
  expenses: Expense[];
  workspace: WorkspaceType;
  onOpenAddExpense: () => void;
  onOpenSettleUp: () => void;
  onOpenScanReceipt: () => void;
  onSelectGroup: (groupId: string) => void;
  onOpenPlanUsage: () => void;
  onOpenBalances: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  groups,
  expenses,
  workspace,
  onOpenAddExpense,
  onOpenSettleUp,
  onOpenScanReceipt,
  onSelectGroup,
  onOpenPlanUsage,
  onOpenBalances,
}) => {
  // Category icon mapping
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'food':
        return <Utensils className="w-4 h-4 text-orange-500" />;
      case 'transport':
        return <Car className="w-4 h-4 text-blue-500" />;
      case 'hotel':
        return <Building className="w-4 h-4 text-indigo-500" />;
      case 'entertainment':
        return <Ticket className="w-4 h-4 text-purple-500" />;
      case 'groceries':
        return <ShoppingBag className="w-4 h-4 text-emerald-500" />;
      default:
        return <Receipt className="w-4 h-4 text-neutral-500" />;
    }
  };

  // Financial summary numbers
  const youOweTotal = 86.40;
  const owedToYouTotal = 120.00;
  const netBalance = owedToYouTotal - youOweTotal; // +$33.60

  return (
    <div className="space-y-5 px-4 pb-20 pt-1 animate-in fade-in duration-300">
      {/* 1. FINANCIAL SUMMARY HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 p-5 shadow-sm">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#6552FF]/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">
              Net balance summary
            </span>
          </div>
          <button
            onClick={onOpenBalances}
            className="flex items-center gap-1 text-xs font-semibold text-[#6552FF] dark:text-indigo-400 hover:underline"
          >
            All balances
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Big Tabular Figures Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* You Owe Box */}
          <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#9C5317] dark:text-amber-400 mb-1">
              <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>You owe</span>
            </div>
            <div className="text-2xl font-extrabold text-[#9C5317] dark:text-amber-300 tabular-nums tracking-tight">
              ${youOweTotal.toFixed(2)}
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              across 2 friends
            </p>
          </div>

          {/* Owed To You Box */}
          <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30">
            <div className="flex items-center gap-1 text-[11px] font-semibold text-[#16A34A] dark:text-emerald-400 mb-1">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Owed to you</span>
            </div>
            <div className="text-2xl font-extrabold text-[#16A34A] dark:text-emerald-300 tabular-nums tracking-tight">
              ${owedToYouTotal.toFixed(2)}
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5">
              from 3 friends
            </p>
          </div>
        </div>

        {/* Reassuring microcopy */}
        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-700/60 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Net: <strong className="text-neutral-900 dark:text-white tabular-nums">+${netBalance.toFixed(2)}</strong>
          </span>
          <span className="text-[11px] italic">Balanzo records who owes whom</span>
        </div>
      </div>

      {/* 2. QUICK ACTIONS BAR */}
      <div className="grid grid-cols-3 gap-2.5">
        <button
          onClick={onOpenAddExpense}
          id="quick-action-add-expense"
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] text-white shadow-sm shadow-[#6552FF]/20 active:scale-95 transition-all text-center group"
        >
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-xs font-bold tracking-tight">Add Expense</span>
          <span className="text-[10px] text-white/80">3-step split</span>
        </button>

        <button
          onClick={onOpenSettleUp}
          id="quick-action-settle-up"
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-900 dark:text-white active:scale-95 transition-all text-center group shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold tracking-tight">Settle Up</span>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Record balance</span>
        </button>

        <button
          onClick={onOpenScanReceipt}
          id="quick-action-scan-receipt"
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-900 dark:text-white active:scale-95 transition-all text-center group shadow-sm"
        >
          <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
            <Receipt className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-xs font-bold tracking-tight">Scan Receipt</span>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400">Smart OCR</span>
        </button>
      </div>

      {/* 3. SOFT PAYWALL / USAGE BANNER */}
      <SoftPaywallBanner onSeePlans={onOpenPlanUsage} />

      {/* 4. ATTENTION ITEMS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Needs Attention
          </h2>
          <span className="text-[11px] font-semibold text-neutral-400">1 item</span>
        </div>

        <div
          onClick={onOpenSettleUp}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-amber-200 dark:border-amber-900/40 hover:border-amber-300 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-[#9C5317] dark:text-amber-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-900 dark:text-white">
                Arif requested settlement
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Airport transfer • $11.25 pending
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#9C5317] dark:text-amber-400 tabular-nums">
              $11.25
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 5. ACTIVE GROUPS (FLAGSHIP TRIP CARDS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Your Active Groups
          </h2>
          <button
            onClick={() => onSelectGroup('all')}
            className="text-xs font-semibold text-[#6552FF] dark:text-indigo-400 hover:underline"
          >
            See all ({groups.length})
          </button>
        </div>

        {/* Flagship Trip Card 1: Baku */}
        {groups.slice(0, 2).map((group) => {
          const isPositive = (group.yourBalance || 0) >= 0;
          return (
            <div
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className="relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all cursor-pointer group shadow-sm"
            >
              {/* Cover Image / Gradient Header */}
              <div className="relative h-28 w-full overflow-hidden bg-neutral-900">
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
                
                {/* Destination & Date badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[11px] font-semibold text-white/90 border border-white/10 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-[#FF8A3D]" />
                    {group.inferredDestination || 'Trip'}
                  </span>
                  <span className="text-[11px] text-white/80 font-medium px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-sm">
                    {group.inferredDateRange}
                  </span>
                </div>

                {/* Group Title in banner */}
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight leading-tight">
                      {group.name}
                    </h3>
                    <p className="text-[11px] text-white/70">
                      ${group.totalExpenses?.toFixed(2)} total spending
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer with Members and Balance */}
              <div className="p-3.5 flex items-center justify-between bg-white dark:bg-neutral-800">
                <div className="flex items-center gap-2">
                  <AvatarStack members={group.members} size="xs" max={3} />
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    {group.members.length} members
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-neutral-400 font-medium">
                    {isPositive ? 'You are owed' : 'You owe'}
                  </div>
                  <div
                    className={`text-sm font-extrabold tabular-nums ${
                      isPositive
                        ? 'text-[#16A34A] dark:text-emerald-400'
                        : 'text-[#9C5317] dark:text-amber-400'
                    }`}
                  >
                    {isPositive ? '+' : ''}${Math.abs(group.yourBalance || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 6. RECENT ACTIVITY FEED */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Recent Expenses
          </h2>
          <span className="text-[11px] text-neutral-400">Past 4 days</span>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-700/60 bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200/80 dark:border-neutral-700/70 overflow-hidden shadow-sm">
          {expenses.slice(0, 4).map((expense) => {
            const isPayer = expense.paidById === 'user-nijat';
            return (
              <div
                key={expense.id}
                className="p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shrink-0">
                    {getCategoryIcon(expense.category)}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white leading-tight">
                      {expense.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                      <span>{isPayer ? 'You paid' : 'Arif paid'}</span>
                      <span>•</span>
                      <span>{new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white tabular-nums">
                    ${expense.amount.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 tabular-nums">
                    {isPayer ? (
                      <span className="text-[#16A34A] dark:text-emerald-400 font-semibold">
                        you lent ${(expense.amount - (expense.splits.find(s => s.memberId === 'user-nijat')?.amount || 0)).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-[#9C5317] dark:text-amber-400 font-semibold">
                        your share ${expense.splits.find(s => s.memberId === 'user-nijat')?.amount.toFixed(2) || '0.00'}
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
