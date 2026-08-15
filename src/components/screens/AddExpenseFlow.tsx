import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  ChevronRight, 
  Sparkles, 
  DollarSign, 
  Users, 
  PieChart, 
  Percent, 
  Divide, 
  CheckCircle2, 
  Utensils, 
  Car, 
  Building, 
  Ticket, 
  ShoppingBag, 
  Calendar,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Group, Member, SplitMethodType, Expense } from '../../types';
import { Avatar } from '../common/Avatar';
import { useLanguage } from '../../i18n/LanguageContext';

interface AddExpenseFlowProps {
  groups: Group[];
  preselectedGroupId?: string;
  onClose: () => void;
  onExpenseAdded: (newExpense: Expense) => void;
}

export const AddExpenseFlow: React.FC<AddExpenseFlowProps> = ({
  groups,
  preselectedGroupId,
  onClose,
  onExpenseAdded,
}) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    preselectedGroupId || groups[0]?.id || ''
  );

  useEffect(() => {
    if (preselectedGroupId) {
      setSelectedGroupId(preselectedGroupId);
    } else if (!selectedGroupId && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
  }, [preselectedGroupId, groups]);
  
  // Step 1 Basics
  const [title, setTitle] = useState('Dinner at Port Cafe');
  const [amountStr, setAmountStr] = useState('97.20');
  const [paidById, setPaidById] = useState('user-nijat');
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('Seafood, pomegranate wine & dessert');
  const [category, setCategory] = useState<'food' | 'transport' | 'hotel' | 'entertainment' | 'groceries' | 'general'>('food');

  // Step 2 Split Method
  const [splitMethod, setSplitMethod] = useState<SplitMethodType>('equal');

  // Custom split values per member
  const currentGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const members = currentGroup?.members || [];

  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({
    'user-nijat': '24.30',
    'user-arif': '24.30',
    'user-leyla': '24.30',
    'user-samir': '24.30',
  });

  const [customPercentages, setCustomPercentages] = useState<Record<string, string>>({
    'user-nijat': '25',
    'user-arif': '25',
    'user-leyla': '25',
    'user-samir': '25',
  });

  const [customShares, setCustomShares] = useState<Record<string, string>>({
    'user-nijat': '1',
    'user-arif': '1',
    'user-leyla': '1',
    'user-samir': '1',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const parsedTotal = parseFloat(amountStr) || 0;

  // Calculate member splits based on split method
  const calculateSplits = () => {
    if (splitMethod === 'equal') {
      const perPerson = members.length > 0 ? parsedTotal / members.length : 0;
      return members.map((m) => ({
        memberId: m.id,
        amount: Math.round(perPerson * 100) / 100,
        isPaid: m.id === paidById,
      }));
    }
    if (splitMethod === 'exact') {
      return members.map((m) => ({
        memberId: m.id,
        amount: parseFloat(customAmounts[m.id] || '0') || 0,
        isPaid: m.id === paidById,
      }));
    }
    if (splitMethod === 'percentage') {
      return members.map((m) => {
        const pct = parseFloat(customPercentages[m.id] || '0') || 0;
        return {
          memberId: m.id,
          amount: Math.round(((parsedTotal * pct) / 100) * 100) / 100,
          percentage: pct,
          isPaid: m.id === paidById,
        };
      });
    }
    // Shares
    const totalShares = members.reduce((acc, m) => acc + (parseFloat(customShares[m.id] || '1') || 1), 0);
    return members.map((m) => {
      const share = parseFloat(customShares[m.id] || '1') || 1;
      const shareAmount = totalShares > 0 ? (parsedTotal * share) / totalShares : 0;
      return {
        memberId: m.id,
        amount: Math.round(shareAmount * 100) / 100,
        shares: share,
        isPaid: m.id === paidById,
      };
    });
  };

  const handleNextStep1 = () => {
    if (!title.trim()) {
      setValidationError(t('expense.validation_title', undefined, 'Please enter an expense title'));
      return;
    }
    if (parsedTotal <= 0) {
      setValidationError(t('expense.validation_amount', undefined, 'Please enter a valid amount greater than $0.00'));
      return;
    }
    setValidationError(null);
    setStep(2);
  };

  const handleNextStep2 = () => {
    setValidationError(null);
    setStep(3);
  };

  const handleFinalSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newExpense: Expense = {
        id: `exp-${Date.now()}`,
        groupId: selectedGroupId,
        title,
        amount: parsedTotal,
        currency: 'USD',
        paidById,
        date: new Date(dateStr).toISOString(),
        splitMethod,
        category,
        note,
        createdAt: new Date().toISOString(),
        splits: calculateSplits(),
      };

      onExpenseAdded(newExpense);
      setIsSubmitting(false);
      setStep(4);

      // Trigger celebratory confetti strictly within mobile canvas
      setTimeout(() => {
        try {
          if (canvasRef.current) {
            const myConfetti = confetti.create(canvasRef.current, {
              resize: true,
              useWorker: true,
            });
            myConfetti({
              particleCount: 80,
              spread: 60,
              origin: { y: 0.45 },
              colors: ['#6552FF', '#FF8A3D', '#22C55E', '#16A34A'],
            });
          }
        } catch (e) {
          // Fallback gracefully
        }
      }, 50);
    }, 450);
  };

  const payerMember = members.find((m) => m.id === paidById) || members[0];
  const calculatedSplits = calculateSplits();
  const sumOfShares = calculatedSplits.reduce((sum, s) => sum + s.amount, 0);

  return (
    <div className="absolute inset-0 z-50 pointer-events-auto flex flex-col bg-white dark:bg-neutral-900 overflow-y-auto animate-in slide-in-from-bottom-6 duration-300">
      {/* Scoped confetti canvas inside phone bounds */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />
      {/* Top Header with Steps */}
      <div className="sticky top-0 z-20 px-4 py-3 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <button
          onClick={() => {
            if (step > 1 && step < 4) setStep((s) => (s - 1) as any);
            else onClose();
          }}
          className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {step < 4 && (
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-neutral-900 dark:text-white">
              {step === 1 ? t('expense.step1_title', undefined, 'Expense Details') : step === 2 ? t('expense.step2_title', undefined, 'Who Paid?') : t('expense.step3_title', undefined, 'How to Split?')}
            </span>
            <div className="flex gap-1 ml-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-4 h-1.5 rounded-full transition-colors ${
                    i <= step ? 'bg-[#6552FF]' : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white px-2 py-1 cursor-pointer"
        >
          {step === 4 ? t('btn.done', undefined, 'Done') : t('btn.cancel', undefined, 'Cancel')}
        </button>
      </div>

      {/* Main Flow Body */}
      <div className="flex-1 p-4 max-w-lg mx-auto w-full pb-8">
        {/* ================= STEP 1: BASICS ================= */}
        {step === 1 && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Hero Amount Input */}
            <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                {t('expense.input_amount', undefined, 'Amount')}
              </span>
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-extrabold text-neutral-400">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0.00"
                  id="input-expense-amount"
                  className="text-4xl font-extrabold text-neutral-900 dark:text-white bg-transparent text-center focus:outline-none w-48 tabular-nums tracking-tight"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-2">
                {t('home.balanzo_reassurance', undefined, 'Balanzo calculates precise shares automatically')}
              </p>
            </div>

            {validationError && (
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Group Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {t('expense.select_group', undefined, 'Group')}
              </label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                id="select-expense-group"
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-semibold text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#6552FF]/30 focus:outline-none"
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} ({g.members.length} {t('groups.members_count', undefined, 'members')})
                  </option>
                ))}
              </select>
            </div>

            {/* Title & Quick Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {t('expense.input_title', undefined, 'Expense Title')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('expense.input_title_placeholder', undefined, 'e.g. Dinner, Taxi, Hotel')}
                id="input-expense-title"
                className="w-full p-3.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-sm font-medium text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#6552FF]/30 focus:outline-none"
              />

              {/* Quick suggestions */}
              <div className="flex gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                {[
                  { label: 'Dinner', cat: 'food' },
                  { label: 'Taxi', cat: 'transport' },
                  { label: 'Hotel', cat: 'hotel' },
                  { label: 'Groceries', cat: 'groceries' },
                  { label: 'Museum', cat: 'entertainment' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setTitle(item.label);
                      setCategory(item.cat as any);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-colors ${
                      title === item.label
                        ? 'bg-[#6552FF] text-white'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Paid By Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {t('expense.step2_title', undefined, 'Paid By')}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {members.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    onClick={() => setPaidById(member.id)}
                    className={`p-3 rounded-2xl border flex items-center gap-2.5 text-left transition-all ${
                      paidById === member.id
                        ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/10 text-neutral-900 dark:text-white font-bold'
                        : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <Avatar
                      src={member.avatarUrl}
                      name={member.name}
                      initials={member.initials}
                      size="xs"
                    />
                    <span className="text-xs truncate">{member.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Note */}
            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  {t('expense.date', undefined, 'Date')}
                </label>
                <input
                  type="date"
                  value={dateStr}
                  onChange={(e) => setDateStr(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  {t('expense.note', undefined, 'Note (Optional)')}
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add details"
                  className="w-full p-3 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white"
                />
              </div>
            </div>

            {/* Next CTA */}
            <div className="pt-4">
              <button
                type="button"
                onClick={handleNextStep1}
                id="btn-step1-next"
                className="w-full py-4 px-6 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-sm font-extrabold shadow-lg shadow-neutral-950/15 dark:shadow-white/10 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{t('btn.continue', undefined, 'Continue to Split')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SPLIT METHOD ================= */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {t('expense.step3_title', undefined, 'How would you like to split?')}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {t('expense.step3_subtitle', undefined, 'Choose the calculation method')} for ${(parsedTotal || 0).toFixed(2)}
              </p>
            </div>

            {/* 4 Distinct Modern Selection Tiles */}
            <div className="space-y-2.5">
              {/* Tile 1: Equal Split */}
              <button
                type="button"
                onClick={() => setSplitMethod('equal')}
                className={`w-full p-4 rounded-3xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  splitMethod === 'equal'
                    ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/10 ring-1 ring-[#6552FF]'
                    : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${
                    splitMethod === 'equal' ? 'bg-[#6552FF] text-white' : 'bg-indigo-50 dark:bg-indigo-950 text-[#6552FF]'
                  }`}>
                    <Divide className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {t('expense.split_equally', undefined, 'Equal split')}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {t('expense.split_summary', undefined, 'Split equally')} (${((parsedTotal || 0) / (members.length || 1)).toFixed(2)} {t('expense.split_each', undefined, 'each')})
                    </p>
                  </div>
                </div>
                {splitMethod === 'equal' && (
                  <div className="w-6 h-6 rounded-full bg-[#6552FF] text-white flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>

              {/* Tile 2: Custom amounts */}
              <button
                type="button"
                onClick={() => setSplitMethod('exact')}
                className={`w-full p-4 rounded-3xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  splitMethod === 'exact'
                    ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/10 ring-1 ring-[#6552FF]'
                    : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${
                    splitMethod === 'exact' ? 'bg-[#6552FF] text-white' : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-600'
                  }`}>
                    <DollarSign className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {t('expense.split_exact', undefined, 'Custom amounts')}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Set different exact amounts per member manually
                    </p>
                  </div>
                </div>
                {splitMethod === 'exact' && (
                  <div className="w-6 h-6 rounded-full bg-[#6552FF] text-white flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>

              {/* Tile 3: By percentage */}
              <button
                type="button"
                onClick={() => setSplitMethod('percentage')}
                className={`w-full p-4 rounded-3xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  splitMethod === 'percentage'
                    ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/10 ring-1 ring-[#6552FF]'
                    : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${
                    splitMethod === 'percentage' ? 'bg-[#6552FF] text-white' : 'bg-amber-50 dark:bg-amber-950 text-amber-600'
                  }`}>
                    <Percent className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {t('expense.split_percentage', undefined, 'By percentage')}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Split by custom percentages (total must equal 100%)
                    </p>
                  </div>
                </div>
                {splitMethod === 'percentage' && (
                  <div className="w-6 h-6 rounded-full bg-[#6552FF] text-white flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>

              {/* Tile 4: By shares */}
              <button
                type="button"
                onClick={() => setSplitMethod('shares')}
                className={`w-full p-4 rounded-3xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  splitMethod === 'shares'
                    ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/10 ring-1 ring-[#6552FF]'
                    : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold ${
                    splitMethod === 'shares' ? 'bg-[#6552FF] text-white' : 'bg-purple-50 dark:bg-purple-950 text-purple-600'
                  }`}>
                    <PieChart className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                      {t('expense.split_shares', undefined, 'By shares')}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Split by proportional shares or units (e.g. 2 shares for couples)
                    </p>
                  </div>
                </div>
                {splitMethod === 'shares' && (
                  <div className="w-6 h-6 rounded-full bg-[#6552FF] text-white flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            </div>

            {/* Next CTA */}
            <div className="pt-4 flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-4 px-5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
              >
                {t('btn.back', undefined, 'Back')}
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                id="btn-step2-next"
                className="flex-1 py-4 px-6 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-sm font-extrabold shadow-lg shadow-neutral-950/15 dark:shadow-white/10 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>{t('btn.continue', undefined, 'Review & Confirm')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 3: REVIEW & SUMMARY ================= */}
        {step === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {t('expense.split_summary', undefined, 'Review Expense')}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {t('expense.step4_subtitle', undefined, 'Confirm breakdown before recording')}
              </p>
            </div>

            {/* Summary Card */}
            <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-neutral-700/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    {currentGroup.name}
                  </span>
                  <h3 className="text-base font-extrabold text-neutral-900 dark:text-white">
                    {title}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    {t('expense.paid_by', undefined, 'Paid by')} <strong className="text-neutral-800 dark:text-neutral-200">{payerMember.name}</strong> • {dateStr}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400">
                    {t('expense.total', undefined, 'Total')}
                  </span>
                  <div className="text-xl font-black text-neutral-900 dark:text-white tabular-nums">
                    ${(parsedTotal || 0).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Each Member Pays breakdown */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
                  {t('expense.split_summary', undefined, 'Individual Shares')} ({splitMethod})
                </span>

                <div className="space-y-1.5">
                  {calculatedSplits.map((split) => {
                    const member = members.find((m) => m.id === split.memberId);
                    return (
                      <div
                        key={split.memberId}
                        className="p-2.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            src={member?.avatarUrl}
                            name={member?.name || ''}
                            initials={member?.initials}
                            size="xs"
                          />
                          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                            {member?.name}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-white tabular-nums">
                          ${(split.amount || 0).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Total Check Verification */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  TOTAL = SUM OF SHARES
                </span>
                <span className="font-extrabold tabular-nums text-emerald-900 dark:text-emerald-200">
                  ${(sumOfShares || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Final CTA */}
            <div className="pt-4 flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-4 px-5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
              >
                {t('btn.back', undefined, 'Back')}
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                id="btn-confirm-add-expense"
                className="flex-1 py-4 px-6 rounded-2xl bg-[#6552FF] hover:bg-[#523EFA] disabled:opacity-50 text-white text-sm font-extrabold shadow-lg shadow-[#6552FF]/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t('expense.saving', undefined, 'Recording expense...')}</span>
                ) : (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>{t('expense.confirm_save', undefined, 'Record & Add Expense')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SUCCESS COMPLETION ================= */}
        {step === 4 && (
          <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t('expense.recorded_success', undefined, 'Expense Recorded')}
              </span>
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                {title}
              </h2>
              <p className="text-4xl font-extrabold text-neutral-900 dark:text-white tabular-nums tracking-tight mt-2">
                ${(parsedTotal || 0).toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {t('expense.paid_by', undefined, 'Paid by')} {payerMember.name} • {currentGroup.name}
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 max-w-xs mx-auto text-left text-xs space-y-1.5">
              <div className="flex justify-between text-neutral-500">
                <span>{t('expense.step3_title', undefined, 'Split method')}:</span>
                <span className="font-semibold text-neutral-900 dark:text-white capitalize">{splitMethod}</span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>{t('group_detail.your_share', undefined, 'Your calculated share')}:</span>
                <span className="font-semibold text-neutral-900 dark:text-white tabular-nums">
                  ${(calculatedSplits.find((s) => s.memberId === 'user-nijat')?.amount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-500">
                <span>Status:</span>
                <span className="font-semibold text-emerald-600">{t('expense.step4_subtitle', undefined, 'Saved to group balances')}</span>
              </div>
            </div>

            <div className="pt-4 space-y-2.5 max-w-xs mx-auto">
              <button
                type="button"
                onClick={onClose}
                id="btn-success-view-group"
                className="w-full py-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-sm font-extrabold shadow-lg shadow-neutral-950/15 dark:shadow-white/10 active:scale-[0.98] transition-all cursor-pointer"
              >
                {t('expense.view_group_summary', undefined, 'Done')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
