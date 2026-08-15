import React from 'react';
import { 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ChevronRight, 
  Compass,
  UtensilsCrossed,
  CarFront,
  Building2,
  Ticket,
  ShoppingBag,
  ReceiptText,
  ArrowLeftRight,
  ScanLine,
  WalletCards,
  Wallet,
  TrendingUp,
  Scale,
  Sparkles
} from 'lucide-react';
import { Group, Expense, WorkspaceType } from '../../types';
import { AvatarStack } from '../common/AvatarStack';
import { SoftPaywallBanner } from '../common/SoftPaywallBanner';
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

  // Distinctive category icon mapping
  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'food':
        return <UtensilsCrossed className="w-4 h-4 text-orange-500 stroke-[2]" />;
      case 'transport':
        return <CarFront className="w-4 h-4 text-blue-500 stroke-[2]" />;
      case 'hotel':
        return <Building2 className="w-4 h-4 text-indigo-500 stroke-[2]" />;
      case 'entertainment':
        return <Ticket className="w-4 h-4 text-purple-500 stroke-[2]" />;
      case 'groceries':
        return <ShoppingBag className="w-4 h-4 text-emerald-500 stroke-[2]" />;
      default:
        return <ReceiptText className="w-4 h-4 text-neutral-500 stroke-[2]" />;
    }
  };

  // Financial summary numbers
  const youOweTotal = 86.40;
  const owedToYouTotal = 120.00;
  const netBalance = owedToYouTotal - youOweTotal; // +$33.60
  const isNetPositive = netBalance >= 0;

  return (
    <div className="space-y-4 px-4 pb-24 pt-1 animate-in fade-in duration-300">
      {/* 1. WELCOME & DEDICATED BALANCES TRIGGER BANNER */}
      <div className="p-4.5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/90 dark:border-neutral-700/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-bold text-sm shadow-xs">
            <WalletCards className="w-5 h-5 stroke-[2]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                User Balances
              </h2>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300">
                Active
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-base font-extrabold text-neutral-900 dark:text-white tabular-nums">
                {isNetPositive ? '+' : '-'}${Math.abs(netBalance).toFixed(2)}
              </span>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                net balance
              </span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenBalances}
          id="btn-home-open-dedicated-balances"
          className="flex items-center gap-1 px-3 py-2 rounded-2xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-xs font-bold text-neutral-900 dark:text-white active:scale-95 transition-all shadow-xs"
        >
          <span>View Balances</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 2. REDESIGNED MODERN QUICK ACTIONS BAR */}
      <div className="grid grid-cols-4 gap-2">
        {/* Action 1: Add Expense (Primary Redesigned CTA) */}
        <button
          type="button"
          onClick={onOpenAddExpense}
          id="quick-action-add-expense"
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-95 transition-all text-center group shadow-sm shadow-neutral-900/10 dark:shadow-white/5"
          aria-label={t('nav.add_expense', undefined, 'Add Expense')}
        >
          <div className="w-7 h-7 rounded-full bg-white/20 dark:bg-neutral-900/20 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-[11px] font-bold tracking-tight">Add Expense</span>
        </button>

        {/* Action 2: Analytics Screen */}
        <button
          type="button"
          onClick={onOpenAnalytics || onOpenBalances}
          id="quick-action-analytics"
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700/80 text-neutral-900 dark:text-white active:scale-95 transition-all text-center group shadow-xs"
          aria-label="Expense Analytics"
        >
          <div className="w-7 h-7 rounded-full bg-[#6552FF]/10 text-[#6552FF] dark:text-indigo-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-4 h-4 stroke-[2.4]" />
          </div>
          <span className="text-[11px] font-bold tracking-tight">Analytics</span>
        </button>

        {/* Action 3: Settle Up */}
        <button
          type="button"
          onClick={onOpenSettleUp}
          id="quick-action-settle-up"
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700/80 text-neutral-900 dark:text-white active:scale-95 transition-all text-center group shadow-xs"
          aria-label={t('btn.settle_up', undefined, 'Settle Up')}
        >
          <div className="w-7 h-7 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <ArrowLeftRight className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold tracking-tight">Settle Up</span>
        </button>

        {/* Action 4: Balances & Wallet */}
        <button
          type="button"
          onClick={onOpenBalances}
          id="quick-action-balances-panel"
          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-700/80 text-neutral-900 dark:text-white active:scale-95 transition-all text-center group shadow-xs"
          aria-label="User Balances"
        >
          <div className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
            <Wallet className="w-4 h-4 stroke-[2.2]" />
          </div>
          <span className="text-[11px] font-bold tracking-tight">Balances</span>
        </button>
      </div>

      {/* 3. SOFT PAYWALL / USAGE BANNER */}
      <SoftPaywallBanner onSeePlans={onOpenPlanUsage} />

      {/* 5. ATTENTION ITEMS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Needs Attention
          </h2>
          <span className="text-[11px] font-semibold text-neutral-400">1 item</span>
        </div>

        <div
          onClick={onOpenSettleUp}
          className="flex items-center justify-between p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ArrowLeftRight className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-900 dark:text-white">
                Arif requested settlement
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                Airport transfer • $11.25 pending
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 tabular-nums">
              $11.25
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>

      {/* 6. ACTIVE GROUPS (FLAGSHIP TRIP CARDS) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {t('home.active_groups', undefined, 'Active Groups')}
          </h2>
          <button
            onClick={() => onSelectGroup('all')}
            className="text-xs font-bold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
          >
            {t('btn.view_all', undefined, 'See all')} ({groups.length})
          </button>
        </div>

        {groups.slice(0, 2).map((group) => {
          const isPositive = (group.yourBalance || 0) >= 0;
          return (
            <div
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className="relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all cursor-pointer group shadow-xs"
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
                    <Compass className="w-3 h-3 text-[#FF8A3D] stroke-[2]" />
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
                      ${(group.totalExpenses || 0).toFixed(2)} {t('groups.total_spent', undefined, 'total spending')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer with Members and Balance */}
              <div className="p-3.5 flex items-center justify-between bg-white dark:bg-neutral-800">
                <div className="flex items-center gap-2">
                  <AvatarStack members={group.members} size="xs" max={3} />
                  <span className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                    {group.members.length} {t('groups.members_count', undefined, 'members')}
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                    {isPositive ? t('home.you_are_owed', undefined, 'You are owed') : t('home.you_owe', undefined, 'You owe')}
                  </div>
                  <div
                    className={`text-sm font-extrabold tabular-nums ${
                      isPositive
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
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

      {/* 7. RECENT ACTIVITY FEED */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {t('home.recent_activity', undefined, 'Recent Activity')}
          </h2>
          <span className="text-[11px] text-neutral-400 font-medium">{t('home.past_4_days', undefined, 'Past 4 days')}</span>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-700/80 bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200/80 dark:border-neutral-700/80 overflow-hidden shadow-xs">
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
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5 font-medium">
                      <span>{isPayer ? t('expense.you_paid', undefined, 'You paid') : `${t('expense.paid_by', undefined, 'Paid by')} Arif`}</span>
                      <span>•</span>
                      <span>{new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-bold text-neutral-900 dark:text-white tabular-nums">
                    ${(expense.amount || 0).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-neutral-500 dark:text-neutral-400 tabular-nums">
                    {isPayer ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        you lent ${((expense.amount || 0) - (expense.splits?.find(s => s.memberId === 'user-nijat')?.amount || 0)).toFixed(2)}
                      </span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-semibold">
                        your share ${(expense.splits?.find(s => s.memberId === 'user-nijat')?.amount || 0).toFixed(2)}
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

