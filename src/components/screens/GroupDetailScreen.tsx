import React, { useState } from 'react';
import { 
  Plus, 
  ArrowLeft, 
  Compass, 
  UserPlus, 
  Users,
  Zap, 
  Receipt, 
  Utensils, 
  Car, 
  Building, 
  Ticket, 
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  Filter,
  Search
} from 'lucide-react';
import { Group, Expense, Member } from '../../types';
import { Avatar } from '../common/Avatar';
import { AvatarStack } from '../common/AvatarStack';
import { useLanguage } from '../../i18n/LanguageContext';

interface GroupDetailScreenProps {
  group: Group;
  expenses: Expense[];
  onBack: () => void;
  onAddExpense: () => void;
  onSettleUp: (memberId?: string) => void;
  onOpenMembers?: () => void;
  initialTab?: 'expenses' | 'balances' | 'settle' | 'activity';
}

export const GroupDetailScreen: React.FC<GroupDetailScreenProps> = ({
  group,
  expenses,
  onBack,
  onAddExpense,
  onSettleUp,
  onOpenMembers,
  initialTab = 'expenses',
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'expenses' | 'balances' | 'settle' | 'activity'>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');

  const groupExpenses = expenses.filter((e) => e.groupId === group.id);
  const totalSpending = groupExpenses.reduce((sum, e) => sum + e.amount, 0);

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'food':
        return <Utensils className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />;
      case 'transport':
        return <Car className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />;
      case 'hotel':
        return <Building className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />;
      case 'entertainment':
        return <Ticket className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />;
      case 'groceries':
        return <ShoppingBag className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />;
      default:
        return <Receipt className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />;
    }
  };

  return (
    <div className="pb-24 animate-in fade-in duration-300">
      {/* 1. DESTINATION HERO HEADER */}
      <div className="relative h-56 w-full bg-neutral-900 overflow-hidden">
        {group.coverImage ? (
          <img
            src={group.coverImage}
            alt={group.name}
            className="w-full h-full object-cover opacity-85"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div
            className="w-full h-full"
            style={{ background: group.coverGradient || '#6552FF' }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20" />

        {/* Top Floating Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <button
            onClick={onBack}
            className="p-2.5 rounded-full bg-black/40 backdrop-blur-md text-white hover:bg-black/60 transition-colors active:scale-95 border border-white/10"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenMembers}
              id="btn-group-header-view-members"
              className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-xs font-bold text-white hover:bg-black/70 border border-white/20 flex items-center gap-1.5 active:scale-95 transition-all shadow-sm"
              title="View Group Members"
            >
              <Users className="w-3.5 h-3.5 text-neutral-200 stroke-[2]" />
              <span>{group.members.length} Members</span>
            </button>

            {group.inferredDestination && (
              <span className="px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-md text-xs font-semibold text-white/90 border border-white/10 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-neutral-200 stroke-[2]" />
                {group.inferredDestination}
              </span>
            )}
          </div>
        </div>

        {/* Hero Title & Subtext */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-black tracking-tight leading-tight drop-shadow-md">
                {group.name}
              </h1>
              <p className="text-xs text-white/80 font-medium mt-0.5">
                {group.inferredDateRange} • {group.members.length} {t('groups.members_count', undefined, 'members')}
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-white/70 block uppercase font-bold tracking-wider">
                {t('group_detail.total_expenses', undefined, 'Total Expenses')}
              </span>
              <span className="text-xl font-extrabold tabular-nums drop-shadow-md text-emerald-300">
                ${(totalSpending || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MEMBERS ROW BAR with View Members Action */}
      <div className="px-4 py-3 bg-white dark:bg-neutral-800 border-b border-neutral-200/80 dark:border-neutral-700 flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1 pr-2">
          {group.members.map((member) => (
            <div key={member.id} className="flex items-center gap-1.5 shrink-0 bg-neutral-100 dark:bg-neutral-700 px-2.5 py-1 rounded-full border border-neutral-200/60 dark:border-neutral-600">
              <Avatar
                imageUrl={member.avatarUrl}
                name={member.name}
                initials={member.initials}
                size="xs"
              />
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                {member.name.split(' ')[0]}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onOpenMembers}
          id="btn-view-group-members-list"
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6552FF]/10 dark:bg-[#6552FF]/20 text-[#6552FF] dark:text-indigo-300 hover:bg-[#6552FF]/20 text-xs font-bold transition-all active:scale-95"
        >
          <Users className="w-3.5 h-3.5 stroke-[2]" />
          <span>Members</span>
        </button>
      </div>

      {/* 3. GROUP FINANCIAL SUMMARY TILES */}
      <div className="p-4 grid grid-cols-3 gap-2">
        <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400 block mb-0.5">
            {t('group_detail.your_balance', undefined, 'Your Balance')}
          </span>
          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
            +${(group.yourBalance || 33.60).toFixed(2)}
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400 block mb-0.5">
            {t('group_detail.you_spent', undefined, 'You Spent')}
          </span>
          <span className="text-sm font-extrabold text-neutral-900 dark:text-white tabular-nums">
            $176.62
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-center shadow-xs">
          <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 dark:text-neutral-400 block mb-0.5">
            {t('group_detail.settled', undefined, 'Settled')}
          </span>
          <span className="text-sm font-extrabold text-neutral-600 dark:text-neutral-300 tabular-nums">
            $120.00
          </span>
        </div>
      </div>

      {/* 4. SEGMENTED TABS */}
      <div className="px-4">
        <div className="flex p-1 rounded-2xl bg-neutral-200/70 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700">
          <button
            onClick={() => setActiveTab('expenses')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'expenses'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            {t('group_detail.tab_expenses', undefined, 'Expenses')} ({groupExpenses.length})
          </button>
          <button
            onClick={() => setActiveTab('balances')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'balances'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            {t('group_detail.tab_balances', undefined, 'Balances')}
          </button>
          <button
            onClick={() => setActiveTab('settle')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'settle'
                ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
            }`}
          >
            {t('group_detail.tab_settle', undefined, 'Settle Up')}
          </button>
        </div>
      </div>

      {/* 5. TAB CONTENT */}
      <div className="p-4">
        {activeTab === 'expenses' && (
          <div className="space-y-3">
            <div className="divide-y divide-neutral-100 dark:divide-neutral-700/80 bg-white dark:bg-neutral-800 rounded-3xl border border-neutral-200/80 dark:border-neutral-700 overflow-hidden shadow-sm">
              {groupExpenses.map((expense) => {
                const payer = group.members.find((m) => m.id === expense.paidById);
                const isYou = expense.paidById === 'user-nijat';

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
                          <span className="font-medium">{isYou ? t('group_detail.you_paid', undefined, 'You paid') : `${payer?.name.split(' ')[0]} ${t('group_detail.paid_by', undefined, 'paid')}`}</span>
                          <span>•</span>
                          <span>{new Date(expense.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </p>
                        {expense.note && (
                          <p className="text-[10px] text-neutral-400 italic mt-0.5 line-clamp-1">
                            "{expense.note}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-neutral-900 dark:text-white tabular-nums">
                        ${(expense.amount || 0).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-neutral-500 dark:text-neutral-400 tabular-nums">
                        {isYou ? (
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            {t('group_detail.you_lent', undefined, 'you lent')} ${((expense.amount || 0) - (expense.splits?.find(s => s.memberId === 'user-nijat')?.amount || 0)).toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400 font-bold">
                            {t('group_detail.your_share', undefined, 'your share')} ${(expense.splits?.find(s => s.memberId === 'user-nijat')?.amount || 0).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'balances' && (
          <div className="space-y-3">
            <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 space-y-3 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                {t('group_detail.pairwise_title', undefined, 'Pairwise Balances in')} {group.name}
              </h3>
              
              <div className="space-y-2.5">
                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200/60 dark:border-neutral-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Leyla Aliyeva" size="sm" />
                    <div>
                      <p className="text-xs font-bold text-neutral-900 dark:text-white">
                        Leyla {t('group_detail.owes_you', undefined, 'owes you')}
                      </p>
                      <p className="text-[10px] text-neutral-400">For Hotel Old City & Dinner</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      $18.00
                    </span>
                    <button
                      onClick={() => onSettleUp('user-leyla')}
                      className="px-3 py-1 rounded-full bg-[#6552FF]/10 hover:bg-[#6552FF] text-[#6552FF] dark:text-indigo-300 hover:text-white text-[11px] font-bold active:scale-95 transition-all"
                    >
                      {t('group_detail.settle_btn', undefined, 'Settle')}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200/60 dark:border-neutral-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Samir Hasanov" size="sm" />
                    <div>
                      <p className="text-xs font-bold text-neutral-900 dark:text-white">
                        Samir {t('group_detail.owes_you', undefined, 'owes you')}
                      </p>
                      <p className="text-[10px] text-neutral-400">For Boutique Hotel share</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      $42.10
                    </span>
                    <button
                      onClick={() => onSettleUp('user-samir')}
                      className="px-3 py-1 rounded-full bg-[#6552FF]/10 hover:bg-[#6552FF] text-[#6552FF] dark:text-indigo-300 hover:text-white text-[11px] font-bold active:scale-95 transition-all"
                    >
                      {t('group_detail.settle_btn', undefined, 'Settle')}
                    </button>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200/60 dark:border-neutral-700 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Avatar name="Arif Mammadov" size="sm" />
                    <div>
                      <p className="text-xs font-bold text-neutral-900 dark:text-white">
                        {t('group_detail.you_owe', undefined, 'You owe')} Arif
                      </p>
                      <p className="text-[10px] text-neutral-400">For Airport transfer</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                      $24.30
                    </span>
                    <button
                      onClick={() => onSettleUp('user-arif')}
                      className="px-3 py-1 rounded-full bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-300 text-[11px] font-bold active:scale-95 transition-all"
                    >
                      {t('group_detail.record_btn', undefined, 'Record')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settle' && (
          <div className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-center space-y-4 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {t('group_detail.record_settlement_title', undefined, 'Record a Settlement')}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
                {t('group_detail.record_settlement_desc', undefined, 'Balanzo records who paid whom so balances stay perfectly synchronized.')}
              </p>
            </div>

            <button
              onClick={() => onSettleUp()}
              className="w-full py-3 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] text-white text-xs font-bold shadow-md shadow-[#6552FF]/20 active:scale-95 transition-all"
            >
              {t('group_detail.record_group_settlement', undefined, 'Record Group Settlement')}
            </button>
          </div>
        )}
      </div>

      {/* 6. FLOATING DUAL ACTION BAR (Modern Minimal Redesign) */}
      <div className="sticky bottom-4 mx-4 z-20 flex items-center gap-2">
        <button
          onClick={onAddExpense}
          id="btn-group-add-expense"
          className="flex-1 py-3.5 px-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold shadow-md shadow-neutral-900/10 dark:shadow-black/30 hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{t('group_detail.add_expense', undefined, 'Add Expense')}</span>
        </button>

        <button
          onClick={() => onSettleUp()}
          id="btn-group-settle-up"
          className="py-3.5 px-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/90 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-extrabold shadow-xs hover:bg-neutral-50 dark:hover:bg-neutral-700/60 active:scale-98 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Zap className="w-4 h-4 text-[#6552FF] dark:text-indigo-400 stroke-[2.5]" />
          <span>{t('group_detail.settle_btn', undefined, 'Settle Up')}</span>
        </button>
      </div>
    </div>
  );
};

