import React, { useState } from 'react';
import { ArrowLeft, ArrowUpRight, ArrowDownLeft, Zap, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { PairwiseBalance, Member } from '../../types';
import { Avatar } from '../common/Avatar';
import { MOCK_MEMBERS } from '../../data/mockData';

interface BalancesScreenProps {
  onBack: () => void;
  onRecordSettlement: (fromUserId: string, toUserId: string, amount: number) => void;
}

export const BalancesScreen: React.FC<BalancesScreenProps> = ({
  onBack,
  onRecordSettlement,
}) => {
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

  return (
    <div className="space-y-4 px-4 pb-24 pt-1 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Balances
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Who owes whom across all groups
          </p>
        </div>
      </div>

      {/* Overview Card */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/30">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#9C5317] dark:text-amber-400 mb-1">
            <ArrowDownLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>You owe</span>
          </div>
          <div className="text-xl font-extrabold text-[#9C5317] dark:text-amber-300 tabular-nums">
            ${totalOwe.toFixed(2)}
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/30">
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#16A34A] dark:text-emerald-400 mb-1">
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Owed to you</span>
          </div>
          <div className="text-xl font-extrabold text-[#16A34A] dark:text-emerald-300 tabular-nums">
            ${totalOwed.toFixed(2)}
          </div>
        </div>
      </div>

      {/* Debt Simplification Nudge */}
      <div className="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-200/60 dark:border-indigo-900/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#6552FF]" />
          <div>
            <p className="text-xs font-bold text-neutral-900 dark:text-white">
              Debt Simplification Active
            </p>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
              Minimizes total payment hops across mutual groups
            </p>
          </div>
        </div>
        <button
          onClick={() => setUseSimplified(!useSimplified)}
          className="text-xs font-bold text-[#6552FF] hover:underline"
        >
          {useSimplified ? 'Simplified' : 'Raw'}
        </button>
      </div>

      {/* You Owe Section */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          You Owe
        </h2>
        <div className="space-y-2">
          {youOweList.map((item) => (
            <div
              key={item.toUser.id}
              className="p-3.5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={item.toUser.avatarUrl}
                  name={item.toUser.name}
                  initials={item.toUser.initials}
                  size="md"
                />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {item.toUser.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {item.context}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <div className="text-sm font-extrabold text-[#9C5317] dark:text-amber-400 tabular-nums">
                    ${item.amount.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-neutral-400">You owe</span>
                </div>
                <button
                  onClick={() => onRecordSettlement('user-nijat', item.toUser.id, item.amount)}
                  className="px-3 py-1.5 rounded-xl bg-[#6552FF] text-white text-xs font-bold shadow-sm active:scale-95 transition-all"
                >
                  Settle
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Owed To You Section */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Owed to You
        </h2>
        <div className="space-y-2">
          {owedToYouList.map((item) => (
            <div
              key={item.fromUser.id}
              className="p-3.5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={item.fromUser.avatarUrl}
                  name={item.fromUser.name}
                  initials={item.fromUser.initials}
                  size="md"
                />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {item.fromUser.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {item.context}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <div className="text-sm font-extrabold text-[#16A34A] dark:text-emerald-400 tabular-nums">
                    ${item.amount.toFixed(2)}
                  </div>
                  <span className="text-[10px] text-neutral-400">Owes you</span>
                </div>
                <button
                  onClick={() => onRecordSettlement(item.fromUser.id, 'user-nijat', item.amount)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-[#16A34A] text-xs font-bold active:scale-95 transition-all"
                >
                  Record
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reassurance statement */}
      <div className="p-3.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-center text-xs text-neutral-500 dark:text-neutral-400">
        <p className="font-semibold text-neutral-700 dark:text-neutral-300">
          Balanzo never moves money.
        </p>
        <p className="text-[11px] mt-0.5">
          Settling records that an external payment (cash, bank, or payment app) has been completed.
        </p>
      </div>
    </div>
  );
};
