import React, { useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Zap, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Wallet, 
  Plus, 
  Send, 
  TrendingUp,
  Scale
} from 'lucide-react';
import { PairwiseBalance, Member } from '../../types';
import { Avatar } from '../common/Avatar';
import { MOCK_MEMBERS } from '../../data/mockData';
import { useLanguage } from '../../i18n/LanguageContext';

interface BalancesScreenProps {
  onBack: () => void;
  onRecordSettlement: (fromUserId: string, toUserId: string, amount: number) => void;
  walletBalance?: number;
  onOpenAddFunds?: () => void;
}

export const BalancesScreen: React.FC<BalancesScreenProps> = ({
  onBack,
  onRecordSettlement,
  walletBalance = 425.50,
  onOpenAddFunds,
}) => {
  const { t } = useLanguage();
  const [useSimplified, setUseSimplified] = useState(true);

  // Balances
  const youOweList = [
    {
      toUser: MOCK_MEMBERS['user-arif'],
      amount: 24.30,
      context: 'Summer Weekend Lake Cabin',
    },
  ];

  const owedToYouList = [
    {
      fromUser: MOCK_MEMBERS['user-leyla'],
      amount: 18.00,
      context: 'Trip to Baku',
    },
    {
      fromUser: MOCK_MEMBERS['user-samir'],
      amount: 102.00,
      context: 'Thailand 2024 & Baku',
    },
  ];

  const totalOwe = youOweList.reduce((sum, item) => sum + item.amount, 0);
  const totalOwed = owedToYouList.reduce((sum, item) => sum + item.amount, 0);
  const netBalance = totalOwed - totalOwe;
  const isNetPositive = netBalance >= 0;

  return (
    <div className="space-y-4 px-4 pb-24 pt-1 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
            {t('balances.title', undefined, 'User Balances')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {t('balances.subtitle', undefined, 'Dedicated breakdown of all your active balances')}
          </p>
        </div>
      </div>

      {/* 1. DEDICATED TOTAL BALANCE HERO CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/90 dark:border-neutral-700/80 p-5 shadow-xs transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
            {t('home.total_balance', undefined, 'Net Balance Overview')}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-900/40">
            <TrendingUp className="w-3 h-3 stroke-[2.5]" />
            {isNetPositive ? 'Overall Owed' : 'Overall You Owe'}
          </span>
        </div>

        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl sm:text-4xl font-black tracking-tight tabular-nums ${
              isNetPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {isNetPositive ? '+' : '-'}${Math.abs(netBalance).toFixed(2)}
            </span>
            <span className="text-xs text-neutral-500 font-medium">
              across all active groups
            </span>
          </div>
        </div>

        {/* Breakdown Subcards (You Owe vs You Are Owed) */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* You Owe */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-700/80">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              <span>{t('balances.you_owe', undefined, 'You owe')}</span>
              <ArrowDownLeft className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 stroke-[2.5]" />
            </div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
              ${(totalOwe || 0).toFixed(2)}
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              to 1 friend
            </p>
          </div>

          {/* Owed to you */}
          <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/90 border border-neutral-200/80 dark:border-neutral-700/80">
            <div className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1">
              <span>{t('balances.owed_to_you', undefined, 'Owed to you')}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 stroke-[2.5]" />
            </div>
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
              ${(totalOwed || 0).toFixed(2)}
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 font-medium">
              from 2 friends
            </p>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED IN-APP WALLET & TOP-UP PANEL */}
      <div className="relative overflow-hidden rounded-3xl bg-neutral-900 dark:bg-neutral-800 text-white p-4.5 border border-neutral-800 dark:border-neutral-700 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 dark:bg-neutral-700 flex items-center justify-center text-white/90">
              <Wallet className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <span className="text-xs font-bold text-neutral-200">In-App Wallet Balance</span>
              <span className="text-[10px] text-neutral-400 block font-medium">Direct Settlement Liquidity</span>
            </div>
          </div>
          {onOpenAddFunds && (
            <button
              type="button"
              onClick={onOpenAddFunds}
              id="btn-balances-add-funds"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-neutral-100 text-neutral-900 hover:bg-neutral-100 text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Funds</span>
            </button>
          )}
        </div>

        <div className="flex items-baseline justify-between pt-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black tracking-tight tabular-nums text-white">
              ${(walletBalance || 0).toFixed(2)}
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">
              Available instantly
            </span>
          </div>
        </div>
      </div>

      {/* Debt Simplification Nudge */}
      <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/70 dark:border-indigo-800/40 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#6552FF] dark:text-indigo-400 shrink-0 stroke-[2]" />
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-white">
              {t('balances.simplification_active', undefined, 'Debt Simplification Active')}
            </p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
              {t('balances.simplification_desc', undefined, 'Minimizes total payment hops across mutual groups')}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setUseSimplified(!useSimplified)}
          className="text-xs font-bold text-[#6552FF] dark:text-indigo-300 hover:underline shrink-0"
        >
          {useSimplified ? t('balances.simplified_toggle', undefined, 'Simplified') : t('balances.raw_toggle', undefined, 'Raw')}
        </button>
      </div>

      {/* You Owe Section */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t('balances.you_owe', undefined, 'You Owe')}
        </h2>
        <div className="space-y-2">
          {youOweList.map((item) => (
            <div
              key={item.toUser.id}
              className="p-3.5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 flex items-center justify-between shadow-xs hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  imageUrl={item.toUser.avatarUrl}
                  name={item.toUser.name}
                  initials={item.toUser.initials}
                  size="md"
                />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {item.toUser.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                    {item.context}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <div className="text-sm font-black text-amber-600 dark:text-amber-400 tabular-nums">
                    ${(item.amount || 0).toFixed(2)}
                  </div>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                    {t('balances.you_owe', undefined, 'You owe')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRecordSettlement('user-nijat', item.toUser.id, item.amount)}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 text-xs font-bold shadow-xs active:scale-95 transition-all"
                >
                  {t('balances.settle_btn', undefined, 'Settle')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Owed To You Section */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t('balances.owed_to_you', undefined, 'Owed to You')}
        </h2>
        <div className="space-y-2">
          {owedToYouList.map((item) => (
            <div
              key={item.fromUser.id}
              className="p-3.5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 flex items-center justify-between shadow-xs hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  imageUrl={item.fromUser.avatarUrl}
                  name={item.fromUser.name}
                  initials={item.fromUser.initials}
                  size="md"
                />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {item.fromUser.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                    {item.context}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 tabular-nums">
                    ${(item.amount || 0).toFixed(2)}
                  </div>
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                    {t('group_detail.owes_you', undefined, 'Owes you')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onRecordSettlement(item.fromUser.id, 'user-nijat', item.amount)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold active:scale-95 transition-all"
                >
                  {t('group_detail.record_btn', undefined, 'Record')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reassurance statement */}
      <div className="p-3.5 rounded-2xl bg-neutral-100/90 dark:bg-neutral-800/90 border border-neutral-200/60 dark:border-neutral-700 text-center text-xs text-neutral-500 dark:text-neutral-400">
        <p className="font-bold text-neutral-800 dark:text-neutral-200">
          {t('settings.never_moves_money', undefined, 'Balanzo never moves money.')}
        </p>
        <p className="text-[11px] mt-0.5 font-medium">
          {t('settings.never_moves_money_desc', undefined, 'Settling records that an external payment (cash, bank, or payment app) has been completed.')}
        </p>
      </div>
    </div>
  );
};

