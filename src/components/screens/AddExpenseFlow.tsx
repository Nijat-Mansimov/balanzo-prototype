import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Divide, 
  DollarSign, 
  Percent, 
  PieChart, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Group, Member, SplitMethodType, Expense, ExpenseSplit } from '../../types';
import { Avatar } from '../common/Avatar';
import { MemberMultiSelect } from '../common/MemberMultiSelect';
import { PayerSelector } from '../common/PayerSelector';
import { DatePicker } from '../common/DatePicker';
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

  const currentGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];
  const members = currentGroup?.members || [];

  // Step 1 Basics
  const [title, setTitle] = useState('Dinner at Port Cafe');
  const [amountStr, setAmountStr] = useState('97.20');
  const [paidById, setPaidById] = useState(members[0]?.id || 'user-nijat');
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('Seafood, pomegranate wine & dessert');
  const [category, setCategory] = useState<'food' | 'transport' | 'hotel' | 'entertainment' | 'groceries' | 'general'>('food');

  // Member participation in the split (defaults to all members of the group)
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(() => 
    (currentGroup?.members || []).map((m) => m.id)
  );

  // Step 2 Split Method
  const [splitMethod, setSplitMethod] = useState<SplitMethodType>('equal');

  // Custom split values per member
  const [customAmounts, setCustomAmounts] = useState<Record<string, string>>({});
  const [customPercentages, setCustomPercentages] = useState<Record<string, string>>({});
  const [customShares, setCustomShares] = useState<Record<string, string>>({});

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const parsedTotal = parseFloat(amountStr) || 0;

  // Initialize or re-sync member participation and defaults when group changes
  useEffect(() => {
    if (preselectedGroupId) {
      setSelectedGroupId(preselectedGroupId);
    } else if (!selectedGroupId && groups.length > 0) {
      setSelectedGroupId(groups[0].id);
    }
  }, [preselectedGroupId, groups]);

  // Whenever selected group changes, re-initialize participant lists & defaults
  useEffect(() => {
    if (currentGroup?.members) {
      const allIds = currentGroup.members.map((m) => m.id);
      setSelectedMemberIds(allIds);

      if (!allIds.includes(paidById)) {
        const defaultPayer = allIds.includes('user-nijat') ? 'user-nijat' : allIds[0] || '';
        setPaidById(defaultPayer);
      }

      const count = allIds.length || 1;
      const equalAmt = (parsedTotal / count).toFixed(2);
      const equalPct = (100 / count).toFixed(1);

      const initAmounts: Record<string, string> = {};
      const initPcts: Record<string, string> = {};
      const initShares: Record<string, string> = {};

      allIds.forEach((id) => {
        initAmounts[id] = equalAmt;
        initPcts[id] = equalPct;
        initShares[id] = '1';
      });

      setCustomAmounts(initAmounts);
      setCustomPercentages(initPcts);
      setCustomShares(initShares);
    }
  }, [selectedGroupId]);

  // Recalculate default exact and percentage shares when parsedTotal changes
  const distributeEvenly = () => {
    const selectedCount = selectedMemberIds.length;
    if (selectedCount === 0) return;

    const equalAmt = (parsedTotal / selectedCount).toFixed(2);
    const equalPct = (100 / selectedCount).toFixed(1);

    const nextAmounts: Record<string, string> = { ...customAmounts };
    const nextPcts: Record<string, string> = { ...customPercentages };
    const nextShares: Record<string, string> = { ...customShares };

    members.forEach((m) => {
      if (selectedMemberIds.includes(m.id)) {
        nextAmounts[m.id] = equalAmt;
        nextPcts[m.id] = equalPct;
        nextShares[m.id] = nextShares[m.id] || '1';
      } else {
        nextAmounts[m.id] = '0.00';
        nextPcts[m.id] = '0';
        nextShares[m.id] = '0';
      }
    });

    setCustomAmounts(nextAmounts);
    setCustomPercentages(nextPcts);
    setCustomShares(nextShares);
  };

  // Toggle member inclusion in split
  const handleToggleMember = (memberId: string) => {
    setSelectedMemberIds((prev) => {
      const isCurrentlySelected = prev.includes(memberId);
      let next: string[];
      if (isCurrentlySelected) {
        next = prev.filter((id) => id !== memberId);
      } else {
        next = [...prev, memberId];
      }

      if (next.length > 0) {
        const perPerson = (parsedTotal / next.length).toFixed(2);
        const perPct = (100 / next.length).toFixed(1);

        setCustomAmounts((old) => {
          const updated = { ...old };
          if (isCurrentlySelected) {
            updated[memberId] = '0.00';
          } else {
            updated[memberId] = perPerson;
          }
          return updated;
        });

        setCustomPercentages((old) => {
          const updated = { ...old };
          if (isCurrentlySelected) {
            updated[memberId] = '0';
          } else {
            updated[memberId] = perPct;
          }
          return updated;
        });

        setCustomShares((old) => ({
          ...old,
          [memberId]: isCurrentlySelected ? '0' : '1',
        }));
      }

      return next;
    });
  };

  // Calculate member splits based on split method and selected participants
  const calculateSplits = (): ExpenseSplit[] => {
    const participating = members.filter((m) => selectedMemberIds.includes(m.id));
    const count = participating.length;

    if (count === 0) {
      return members.map((m) => ({
        memberId: m.id,
        amount: 0,
        isPaid: m.id === paidById,
      }));
    }

    if (splitMethod === 'equal') {
      const perPerson = Math.round((parsedTotal / count) * 100) / 100;
      return members.map((m) => {
        const isSelected = selectedMemberIds.includes(m.id);
        return {
          memberId: m.id,
          amount: isSelected ? perPerson : 0,
          isPaid: m.id === paidById,
        };
      });
    }

    if (splitMethod === 'exact') {
      return members.map((m) => {
        const isSelected = selectedMemberIds.includes(m.id);
        const amt = isSelected ? (parseFloat(customAmounts[m.id] || '0') || 0) : 0;
        return {
          memberId: m.id,
          amount: amt,
          isPaid: m.id === paidById,
        };
      });
    }

    if (splitMethod === 'percentage') {
      return members.map((m) => {
        const isSelected = selectedMemberIds.includes(m.id);
        const pct = isSelected ? (parseFloat(customPercentages[m.id] || '0') || 0) : 0;
        const amt = isSelected ? Math.round(((parsedTotal * pct) / 100) * 100) / 100 : 0;
        return {
          memberId: m.id,
          amount: amt,
          percentage: isSelected ? pct : 0,
          isPaid: m.id === paidById,
        };
      });
    }

    // Shares
    const totalShares = members.reduce((acc, m) => {
      if (!selectedMemberIds.includes(m.id)) return acc;
      return acc + (parseFloat(customShares[m.id] || '1') || 1);
    }, 0);

    return members.map((m) => {
      const isSelected = selectedMemberIds.includes(m.id);
      if (!isSelected || totalShares <= 0) {
        return {
          memberId: m.id,
          amount: 0,
          shares: 0,
          isPaid: m.id === paidById,
        };
      }
      const share = parseFloat(customShares[m.id] || '1') || 1;
      const shareAmount = (parsedTotal * share) / totalShares;
      return {
        memberId: m.id,
        amount: Math.round(shareAmount * 100) / 100,
        shares: share,
        isPaid: m.id === paidById,
      };
    });
  };

  // Step 1 Validation
  const handleNextStep1 = () => {
    if (!title.trim()) {
      setValidationError(t('expense.validation_title', undefined, 'Please enter an expense title'));
      return;
    }
    if (parsedTotal <= 0) {
      setValidationError(t('expense.validation_amount', undefined, 'Please enter a valid amount greater than $0.00'));
      return;
    }
    if (selectedMemberIds.length === 0) {
      setValidationError('Please select at least 1 member to split this expense with');
      return;
    }
    setValidationError(null);
    setStep(2);
  };

  // Step 2 Validation
  const handleNextStep2 = () => {
    if (selectedMemberIds.length === 0) {
      setValidationError('Please select at least 1 member to share this expense');
      return;
    }

    const splits = calculateSplits();
    const sumSplits = splits.reduce((acc, s) => acc + s.amount, 0);

    if (splitMethod === 'exact') {
      const diff = Math.abs(sumSplits - parsedTotal);
      if (diff > 0.05) {
        setValidationError(`Exact amounts sum to $${sumSplits.toFixed(2)}, which doesn't match total $${parsedTotal.toFixed(2)}.`);
        return;
      }
    }

    if (splitMethod === 'percentage') {
      const totalPct = members.reduce((acc, m) => {
        if (!selectedMemberIds.includes(m.id)) return acc;
        return acc + (parseFloat(customPercentages[m.id] || '0') || 0);
      }, 0);
      if (Math.abs(totalPct - 100) > 0.5) {
        setValidationError(`Percentages sum to ${totalPct.toFixed(1)}%. Total must equal 100%.`);
        return;
      }
    }

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

  const payerMember = members.find((m) => m.id === paidById) || members[0] || {
    id: 'unknown',
    name: 'Payer',
    initials: 'P',
  };
  const calculatedSplits = calculateSplits();
  const sumOfShares = calculatedSplits.reduce((sum, s) => sum + s.amount, 0);

  const exactAllocated = selectedMemberIds.reduce((sum, id) => {
    return sum + (parseFloat(customAmounts[id] || '0') || 0);
  }, 0);
  const exactDiff = parsedTotal - exactAllocated;

  const percentageTotal = selectedMemberIds.reduce((sum, id) => {
    return sum + (parseFloat(customPercentages[id] || '0') || 0);
  }, 0);

  return (
    <div className="absolute inset-0 z-50 pointer-events-auto flex flex-col bg-neutral-50 dark:bg-neutral-900 overflow-y-auto animate-in slide-in-from-bottom-6 duration-300">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-30"
      />
      
      {/* Top Header */}
      <div className="sticky top-0 z-20 px-4 py-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border-b border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
        <button
          onClick={() => {
            if (step > 1 && step < 4) {
              setValidationError(null);
              setStep((s) => (s - 1) as any);
            } else {
              onClose();
            }
          }}
          className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 cursor-pointer transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {step < 4 && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-900 dark:text-white">
              {step === 1 
                ? t('expense.step1_title', undefined, 'Expense Details') 
                : step === 2 
                ? t('expense.step3_title', undefined, 'Split Options') 
                : t('expense.split_summary', undefined, 'Review Summary')}
            </span>
            <div className="flex gap-1 items-center">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    i === step 
                      ? 'w-5 bg-[#6552FF]' 
                      : i < step 
                      ? 'w-2 bg-[#6552FF]/60' 
                      : 'w-2 bg-neutral-200 dark:bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white px-2 py-1 cursor-pointer transition-colors"
        >
          {step === 4 ? t('btn.done', undefined, 'Done') : t('btn.cancel', undefined, 'Cancel')}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-4 max-w-lg mx-auto w-full pb-8">
        
        {/* ================= STEP 1: CLEAN & MINIMAL EXPENSE DETAILS ================= */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            
            {/* 1. Amount Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs text-center space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                {t('expense.input_amount', undefined, 'Expense Amount')}
              </span>
              
              <div className="flex items-center justify-center gap-1">
                <span className="text-3xl font-extrabold text-neutral-400 dark:text-neutral-500">$</span>
                <input
                  type="number"
                  step="0.01"
                  value={amountStr}
                  onChange={(e) => setAmountStr(e.target.value)}
                  placeholder="0.00"
                  id="input-expense-amount"
                  className="text-4xl font-black text-neutral-900 dark:text-white bg-transparent text-center focus:outline-none w-52 tabular-nums tracking-tight"
                  autoFocus
                />
              </div>

              <div className="pt-1">
                {selectedMemberIds.length > 0 ? (
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/40">
                    ~${((parsedTotal || 0) / (selectedMemberIds.length || 1)).toFixed(2)} / person ({selectedMemberIds.length} sharing)
                  </span>
                ) : (
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                    Select members below to split
                  </span>
                )}
              </div>
            </div>

            {/* Validation Error Alert */}
            {validationError && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center gap-2.5 text-xs font-semibold text-red-600 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{validationError}</span>
              </div>
            )}

            {/* 2. Group & Title Information Card */}
            <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3.5 shadow-xs">
              {/* Group Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                  {t('expense.select_group', undefined, 'Group')}
                </label>
                <select
                  value={selectedGroupId}
                  onChange={(e) => setSelectedGroupId(e.target.value)}
                  id="select-expense-group"
                  className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#6552FF]/30 focus:outline-none cursor-pointer"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} ({g.members.length} {t('groups.members_count', undefined, 'members')})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Quick Categories */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                  {t('expense.input_title', undefined, 'What was it for?')}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t('expense.input_title_placeholder', undefined, 'e.g. Dinner, Taxi, Hotel')}
                  id="input-expense-title"
                  className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-[#6552FF]/30 focus:outline-none"
                />

                {/* Quick Suggestion Pills */}
                <div className="flex gap-1.5 pt-1 overflow-x-auto no-scrollbar">
                  {[
                    { label: 'Dinner', cat: 'food' },
                    { label: 'Drinks', cat: 'food' },
                    { label: 'Taxi', cat: 'transport' },
                    { label: 'Hotel', cat: 'hotel' },
                    { label: 'Groceries', cat: 'groceries' },
                    { label: 'Tickets', cat: 'entertainment' },
                  ].map((item) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        setTitle(item.label);
                        setCategory(item.cat as any);
                      }}
                      className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-colors cursor-pointer border ${
                        title === item.label
                          ? 'bg-[#6552FF] text-white border-[#6552FF]'
                          : 'bg-neutral-50 dark:bg-neutral-900 border-neutral-200/70 dark:border-neutral-700/70 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Paid By Selector */}
            <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs">
              <PayerSelector
                members={members}
                paidById={paidById}
                onChange={setPaidById}
              />
            </div>

            {/* 4. Split Between - Clean Dropdown Multi-Select */}
            <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs">
              <MemberMultiSelect
                members={members}
                selectedMemberIds={selectedMemberIds}
                onChange={setSelectedMemberIds}
                paidById={paidById}
                totalAmount={parsedTotal}
                currencySymbol="$"
              />
            </div>

            {/* 5. Date & Memo Notes */}
            <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 shadow-xs space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <DatePicker
                  value={dateStr}
                  onChange={setDateStr}
                  label={t('expense.date', undefined, 'Date')}
                />
                <div className="space-y-1">
                  <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                    {t('expense.note', undefined, 'Note')}
                  </label>
                  <input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Optional memo"
                    className="w-full p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white placeholder-neutral-400"
                  />
                </div>
              </div>
            </div>

            {/* Next CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleNextStep1}
                id="btn-step1-next"
                className="w-full py-4 px-6 rounded-2xl bg-[#6552FF] hover:bg-[#533ffa] text-white text-sm font-extrabold shadow-lg shadow-[#6552FF]/25 hover:shadow-xl active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
              >
                <span>{t('btn.continue', undefined, 'Continue to Split Options')}</span>
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 2: SPLIT METHOD & MEMBER CUSTOMIZATION ================= */}
        {step === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
                {t('expense.step3_title', undefined, 'How would you like to split?')}
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Splitting ${(parsedTotal || 0).toFixed(2)} between {selectedMemberIds.length} selected members
              </p>
            </div>

            {validationError && (
              <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-300">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{validationError}</span>
              </div>
            )}

            {/* 4 Modern Selection Tiles */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Tile 1: Equal Split */}
              <button
                type="button"
                onClick={() => setSplitMethod('equal')}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  splitMethod === 'equal'
                    ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/10 ring-2 ring-[#6552FF]/30'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                    splitMethod === 'equal' ? 'bg-[#6552FF] text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
                  }`}>
                    <Divide className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  {splitMethod === 'equal' && (
                    <div className="w-5 h-5 rounded-full bg-[#6552FF] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                  {t('expense.split_equally', undefined, 'Equal Split')}
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  ${((parsedTotal || 0) / (selectedMemberIds.length || 1)).toFixed(2)} each ({selectedMemberIds.length} members)
                </p>
              </button>

              {/* Tile 2: Custom amounts */}
              <button
                type="button"
                onClick={() => {
                  setSplitMethod('exact');
                  distributeEvenly();
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  splitMethod === 'exact'
                    ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/10 ring-2 ring-[#6552FF]/30'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                    splitMethod === 'exact' ? 'bg-[#6552FF] text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
                  }`}>
                    <DollarSign className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  {splitMethod === 'exact' && (
                    <div className="w-5 h-5 rounded-full bg-[#6552FF] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                  {t('expense.split_exact', undefined, 'Exact Amounts')}
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Set manual $ amounts per person
                </p>
              </button>

              {/* Tile 3: By percentage */}
              <button
                type="button"
                onClick={() => {
                  setSplitMethod('percentage');
                  distributeEvenly();
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  splitMethod === 'percentage'
                    ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/10 ring-2 ring-[#6552FF]/30'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                    splitMethod === 'percentage' ? 'bg-[#6552FF] text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
                  }`}>
                    <Percent className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  {splitMethod === 'percentage' && (
                    <div className="w-5 h-5 rounded-full bg-[#6552FF] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                  {t('expense.split_percentage', undefined, 'Percentages')}
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Custom % split (sums to 100%)
                </p>
              </button>

              {/* Tile 4: By shares */}
              <button
                type="button"
                onClick={() => {
                  setSplitMethod('shares');
                  distributeEvenly();
                }}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  splitMethod === 'shares'
                    ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/10 ring-2 ring-[#6552FF]/30'
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                    splitMethod === 'shares' ? 'bg-[#6552FF] text-white' : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
                  }`}>
                    <PieChart className="w-4 h-4 stroke-[2.5]" />
                  </div>
                  {splitMethod === 'shares' && (
                    <div className="w-5 h-5 rounded-full bg-[#6552FF] text-white flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                  {t('expense.split_shares', undefined, 'By Shares')}
                </h3>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                  e.g. 1 share vs 2 shares
                </p>
              </button>
            </div>

            {/* MEMBER PARTICIPATION & SHARE CUSTOMIZATION SECTION */}
            <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3 shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-700/80">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-white">
                    Member Shares ({selectedMemberIds.length} of {members.length} participating)
                  </h4>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Customize exact amounts or toggle participation
                  </p>
                </div>

                <button
                  type="button"
                  onClick={distributeEvenly}
                  className="px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 text-[11px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  title="Reset to equal distribution"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Live allocation status strip for exact / percentage */}
              {splitMethod === 'exact' && (
                <div className={`p-2.5 rounded-2xl flex items-center justify-between text-xs font-bold ${
                  Math.abs(exactDiff) < 0.02
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
                }`}>
                  <span>Allocated: ${exactAllocated.toFixed(2)} of ${parsedTotal.toFixed(2)}</span>
                  <span>
                    {Math.abs(exactDiff) < 0.02 
                      ? '✓ Exact match' 
                      : exactDiff > 0 
                      ? `$${exactDiff.toFixed(2)} left` 
                      : `Over by $${Math.abs(exactDiff).toFixed(2)}`}
                  </span>
                </div>
              )}

              {splitMethod === 'percentage' && (
                <div className={`p-2.5 rounded-2xl flex items-center justify-between text-xs font-bold ${
                  Math.abs(percentageTotal - 100) < 0.2
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50'
                }`}>
                  <span>Total Percentage: {percentageTotal.toFixed(1)}%</span>
                  <span>{Math.abs(percentageTotal - 100) < 0.2 ? '✓ 100% Total' : `${(100 - percentageTotal).toFixed(1)}% remaining`}</span>
                </div>
              )}

              {/* Members List with Checkbox & Custom Inputs */}
              <div className="space-y-2">
                {members.map((member) => {
                  const isSelected = selectedMemberIds.includes(member.id);
                  const equalShare = isSelected ? (parsedTotal / (selectedMemberIds.length || 1)).toFixed(2) : '0.00';

                  return (
                    <div
                      key={member.id}
                      className={`p-3 rounded-2xl border transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-neutral-50 dark:bg-neutral-900/80 border-neutral-200/90 dark:border-neutral-700'
                          : 'bg-neutral-100/40 dark:bg-neutral-800/30 border-dashed border-neutral-200 dark:border-neutral-700/50 opacity-50'
                      }`}
                    >
                      {/* Left: Checkbox + Avatar + Name */}
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={() => handleToggleMember(member.id)}
                          className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-[#6552FF] text-white'
                              : 'border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        <Avatar
                          src={member.avatarUrl}
                          name={member.name}
                          initials={member.initials}
                          size="xs"
                        />

                        <div>
                          <span className="text-xs font-bold text-neutral-900 dark:text-white block truncate">
                            {member.name}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-medium">
                            {isSelected 
                              ? (member.id === paidById ? 'Paid upfront & in split' : 'Participating') 
                              : 'Excluded ($0.00)'}
                          </span>
                        </div>
                      </div>

                      {/* Right: Method-Specific Input / Display */}
                      <div className="flex items-center gap-2">
                        {/* 1. Equal Split View */}
                        {splitMethod === 'equal' && (
                          <div className="text-right">
                            <span className="text-xs font-extrabold text-neutral-900 dark:text-white tabular-nums">
                              ${equalShare}
                            </span>
                            <span className="text-[10px] text-neutral-400 block">
                              {isSelected ? 'equal share' : 'excluded'}
                            </span>
                          </div>
                        )}

                        {/* 2. Exact Custom Amount Input */}
                        {splitMethod === 'exact' && (
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-bold text-neutral-400">$</span>
                            <input
                              type="number"
                              step="0.01"
                              disabled={!isSelected}
                              value={isSelected ? customAmounts[member.id] || '' : '0.00'}
                              onChange={(e) =>
                                setCustomAmounts({
                                  ...customAmounts,
                                  [member.id]: e.target.value,
                                })
                              }
                              className="w-20 p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white text-right focus:ring-2 focus:ring-[#6552FF]/30 focus:outline-none tabular-nums disabled:opacity-50"
                            />
                          </div>
                        )}

                        {/* 3. Percentage Input */}
                        {splitMethod === 'percentage' && (
                          <div className="flex items-center gap-1.5 text-right">
                            <div className="flex items-center gap-0.5">
                              <input
                                type="number"
                                step="0.5"
                                disabled={!isSelected}
                                value={isSelected ? customPercentages[member.id] || '' : '0'}
                                onChange={(e) =>
                                  setCustomPercentages({
                                    ...customPercentages,
                                    [member.id]: e.target.value,
                                  })
                                }
                                className="w-14 p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-xs font-bold text-neutral-900 dark:text-white text-right focus:ring-2 focus:ring-[#6552FF]/30 focus:outline-none tabular-nums disabled:opacity-50"
                              />
                              <span className="text-xs font-bold text-neutral-400">%</span>
                            </div>
                            <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 tabular-nums min-w-[48px]">
                              ${(
                                ((parseFloat(customPercentages[member.id] || '0') || 0) * parsedTotal) /
                                100
                              ).toFixed(2)}
                            </span>
                          </div>
                        )}

                        {/* 4. Shares Stepper */}
                        {splitMethod === 'shares' && (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center rounded-xl bg-white dark:bg-neutral-800 p-0.5 border border-neutral-200 dark:border-neutral-600">
                              <button
                                type="button"
                                disabled={!isSelected}
                                onClick={() => {
                                  const currentVal = parseFloat(customShares[member.id] || '1') || 1;
                                  if (currentVal > 1) {
                                    setCustomShares({
                                      ...customShares,
                                      [member.id]: String(currentVal - 1),
                                    });
                                  }
                                }}
                                className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 disabled:opacity-30 cursor-pointer"
                              >
                                -
                              </button>

                              <span className="w-6 text-center text-xs font-bold text-neutral-900 dark:text-white tabular-nums">
                                {isSelected ? customShares[member.id] || '1' : '0'}
                              </span>

                              <button
                                type="button"
                                disabled={!isSelected}
                                onClick={() => {
                                  const currentVal = parseFloat(customShares[member.id] || '1') || 1;
                                  setCustomShares({
                                    ...customShares,
                                    [member.id]: String(currentVal + 1),
                                  });
                                }}
                                className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 disabled:opacity-30 cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 tabular-nums min-w-[48px] text-right">
                              ${(
                                (parsedTotal * (parseFloat(customShares[member.id] || '1') || 1)) /
                                (members.reduce((acc, m) => acc + (selectedMemberIds.includes(m.id) ? (parseFloat(customShares[m.id] || '1') || 1) : 0), 0) || 1)
                              ).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 2 Buttons */}
            <div className="pt-3 flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="py-3.5 px-5 rounded-2xl bg-neutral-200/80 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
              >
                {t('btn.back', undefined, 'Back')}
              </button>
              <button
                type="button"
                onClick={handleNextStep2}
                id="btn-step2-next"
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#6552FF] hover:bg-[#533ffa] text-white text-sm font-extrabold shadow-lg shadow-[#6552FF]/25 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
              >
                <span>{t('btn.continue', undefined, 'Review & Confirm')}</span>
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
                Split between {selectedMemberIds.length} of {members.length} members ({splitMethod})
              </p>
            </div>

            {/* Summary Card */}
            <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3.5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700/80">
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

              {/* Participating Members Breakdown */}
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
                    Participating Shares ({selectedMemberIds.length} members)
                  </span>
                  <span className="text-[11px] font-bold text-[#6552FF] dark:text-indigo-400 capitalize">
                    {splitMethod} split
                  </span>
                </div>

                <div className="space-y-1.5">
                  {calculatedSplits.filter(s => selectedMemberIds.includes(s.memberId)).map((split) => {
                    const member = members.find((m) => m.id === split.memberId);
                    return (
                      <div
                        key={split.memberId}
                        className="p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            src={member?.avatarUrl}
                            name={member?.name || ''}
                            initials={member?.initials}
                            size="xs"
                          />
                          <div>
                            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
                              {member?.name}
                            </span>
                            {split.memberId === paidById && (
                              <span className="text-[10px] text-[#6552FF] dark:text-indigo-400 font-semibold">Paid full cost upfront</span>
                            )}
                          </div>
                        </div>
                        <div className="text-xs font-bold text-neutral-900 dark:text-white tabular-nums">
                          ${(split.amount || 0).toFixed(2)}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Excluded Members list if any */}
                {members.some(m => !selectedMemberIds.includes(m.id)) && (
                  <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700/60">
                    <span className="text-[11px] font-medium text-neutral-400 block mb-1.5">
                      Excluded from this expense ({members.length - selectedMemberIds.length} members)
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {members.filter(m => !selectedMemberIds.includes(m.id)).map(m => (
                        <div key={m.id} className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-900 text-[11px] text-neutral-500 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800">
                          <span>{m.name.split(' ')[0]} ($0.00)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Total Check Verification */}
              <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-between text-xs">
                <span className="text-emerald-800 dark:text-emerald-300 font-bold">
                  TOTAL = SUM OF SHARES
                </span>
                <span className="font-extrabold tabular-nums text-emerald-900 dark:text-emerald-200">
                  ${(sumOfShares || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Final CTA */}
            <div className="pt-3 flex gap-2.5">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="py-3.5 px-5 rounded-2xl bg-neutral-200/80 dark:bg-neutral-800 hover:bg-neutral-300 text-neutral-800 dark:text-neutral-200 font-bold text-xs active:scale-95 transition-all cursor-pointer"
              >
                {t('btn.back', undefined, 'Back')}
              </button>
              <button
                type="button"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                id="btn-confirm-add-expense"
                className="flex-1 py-3.5 px-6 rounded-2xl bg-[#6552FF] hover:bg-[#533ffa] disabled:opacity-50 text-white text-sm font-extrabold shadow-lg shadow-[#6552FF]/25 active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t('expense.saving', undefined, 'Recording expense...')}</span>
                ) : (
                  <span>{t('expense.confirm_save', undefined, 'Record & Add Expense')}</span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ================= STEP 4: SUCCESS COMPLETION ================= */}
        {step === 4 && (
          <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                {t('expense.recorded_success', undefined, 'Expense Recorded')}
              </span>
              <h2 className="text-2xl font-black text-neutral-900 dark:text-white mt-1">
                {title}
              </h2>
              <p className="text-4xl font-black text-neutral-900 dark:text-white tabular-nums tracking-tight mt-2">
                ${(parsedTotal || 0).toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {t('expense.paid_by', undefined, 'Paid by')} {payerMember.name} • {currentGroup.name}
              </p>
            </div>

            <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/80 max-w-xs mx-auto text-left text-xs space-y-2 shadow-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Split:</span>
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {selectedMemberIds.length} of {members.length} members ({splitMethod})
                </span>
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
