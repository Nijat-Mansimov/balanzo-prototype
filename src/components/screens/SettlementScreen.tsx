import React, { useState, useRef } from 'react';
import { ArrowLeft, Check, Zap, ShieldCheck, DollarSign, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Member, SettlementRecord } from '../../types';
import { Avatar } from '../common/Avatar';
import { MOCK_MEMBERS } from '../../data/mockData';
import { useLanguage } from '../../i18n/LanguageContext';

interface SettlementScreenProps {
  onClose: () => void;
  onSettlementRecorded: (record: SettlementRecord) => void;
  initialFromUserId?: string;
  initialToUserId?: string;
  initialAmount?: number;
}

export const SettlementScreen: React.FC<SettlementScreenProps> = ({
  onClose,
  onSettlementRecorded,
  initialFromUserId = 'user-nijat',
  initialToUserId = 'user-arif',
  initialAmount = 24.30,
}) => {
  const { t } = useLanguage();
  const [fromUserId, setFromUserId] = useState(initialFromUserId);
  const [toUserId, setToUserId] = useState(initialToUserId);
  const [amountStr, setAmountStr] = useState(initialAmount.toString());
  const [note, setNote] = useState('Paid via Bank Transfer');
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [isDone, setIsDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const membersList = Object.values(MOCK_MEMBERS);
  const fromUser = MOCK_MEMBERS[fromUserId] || membersList[0];
  const toUser = MOCK_MEMBERS[toUserId] || membersList[1];

  const handleRecord = () => {
    const record: SettlementRecord = {
      id: `set-${Date.now()}`,
      fromUserId,
      toUserId,
      amount: parseFloat(amountStr) || 0,
      currency: 'USD',
      date: new Date(dateStr).toISOString(),
      note,
      recordedById: 'user-nijat',
    };

    onSettlementRecorded(record);
    setIsDone(true);

    setTimeout(() => {
      try {
        if (canvasRef.current) {
          const myConfetti = confetti.create(canvasRef.current, {
            resize: true,
            useWorker: true,
          });
          myConfetti({
            particleCount: 65,
            spread: 55,
            origin: { y: 0.45 },
            colors: ['#22C55E', '#6552FF', '#FF8A3D'],
          });
        }
      } catch (e) {}
    }, 50);
  };

  return (
    <div className="absolute inset-0 z-50 pointer-events-auto flex flex-col bg-white dark:bg-neutral-900 overflow-y-auto animate-in slide-in-from-bottom-6 duration-300">
      {/* Scoped confetti canvas within phone boundaries */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />
      {/* Header */}
      <div className="sticky top-0 z-20 px-4 py-3 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <button
          onClick={onClose}
          className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
          {t('settle.title', undefined, 'Record Settlement')}
        </h2>
        <button
          onClick={onClose}
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white px-2 py-1"
        >
          {isDone ? t('btn.done', undefined, 'Done') : t('btn.cancel', undefined, 'Cancel')}
        </button>
      </div>

      <div className="flex-1 p-4 max-w-md mx-auto w-full">
        {!isDone ? (
          <div className="space-y-4">
            {/* Hero Amount */}
            <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                {t('settle.amount_label', undefined, 'Settlement Amount')}
              </span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-extrabold text-neutral-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  id="input-settlement-amount"
                  className="text-4xl font-extrabold text-neutral-900 dark:text-white bg-transparent text-center focus:outline-none w-48 tabular-nums tracking-tight"
                />
              </div>
            </div>

            {/* Payer & Receiver Pair */}
            <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  {t('settle.who_paid', undefined, 'Who Paid? (Payer)')}
                </label>
                <select
                  value={fromUserId}
                  onChange={(e) => setFromUserId(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-semibold text-neutral-900 dark:text-white"
                >
                  {membersList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-center -my-1">
                <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center font-bold">
                  ↓
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  {t('settle.who_received', undefined, 'Who Received? (Recipient)')}
                </label>
                <select
                  value={toUserId}
                  onChange={(e) => setToUserId(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-semibold text-neutral-900 dark:text-white"
                >
                  {membersList.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Note & Date */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  {t('settle.note', undefined, 'Payment Method Note')}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Cash, Bank Transfer"
                  className="w-full p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  {t('settle.date', undefined, 'Date')}
                </label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            {/* Reassurance Banner */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 flex items-start gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
              <ShieldCheck className="w-5 h-5 text-[#6552FF] dark:text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-neutral-900 dark:text-white">
                  {t('settings.never_moves_money', undefined, 'Balanzo records who owes whom.')}
                </p>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5 leading-relaxed font-medium">
                  {t('settings.never_moves_money_desc', undefined, 'Recording a settlement updates group balances without moving funds through our system.')}
                </p>
              </div>
            </div>

            {/* Record CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRecord}
                id="btn-confirm-record-settlement"
                className="w-full py-3.5 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] text-white text-sm font-bold shadow-lg shadow-[#6552FF]/30 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>{t('settle.confirm', undefined, 'Record Settlement')}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Settlement Confirmation state */
          <div className="py-10 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t('settle.success_title', undefined, 'Settlement Recorded')}
              </span>
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                ${parseFloat(amountStr || '0').toFixed(2)}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {fromUser.name} → {toUser.name}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 max-w-xs mx-auto text-xs text-left space-y-1">
              <p className="text-neutral-500">{t('settle.method', undefined, 'Method')}: <strong className="text-neutral-900 dark:text-white">{note}</strong></p>
              <p className="text-neutral-500">{t('settle.date', undefined, 'Date')}: <strong className="text-neutral-900 dark:text-white">{dateStr}</strong></p>
              <p className="text-emerald-600 font-semibold mt-1">{t('settle.success_desc', undefined, 'Balances synchronized')} 🎉</p>
            </div>

            <button
              onClick={onClose}
              className="w-full max-w-xs mx-auto py-3.5 rounded-2xl bg-[#6552FF] text-white text-sm font-bold shadow-lg shadow-[#6552FF]/30 active:scale-95 transition-all"
            >
              {t('btn.done', undefined, 'Done')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
