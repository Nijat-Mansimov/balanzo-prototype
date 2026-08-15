import React, { useState } from 'react';
import { X, Plus, Wallet, Check, Sparkles, CreditCard, ChevronRight, ShieldCheck } from 'lucide-react';
import { PaymentMethod } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface AddFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
  paymentMethods: PaymentMethod[];
  onAddFunds: (amount: number, paymentMethodId: string) => void;
  onOpenAddPaymentMethod: () => void;
}

export const AddFundsModal: React.FC<AddFundsModalProps> = ({
  isOpen,
  onClose,
  currentBalance,
  paymentMethods,
  onAddFunds,
  onOpenAddPaymentMethod,
}) => {
  const { t } = useLanguage();
  const [selectedAmount, setSelectedAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedPmId, setSelectedPmId] = useState<string>(
    paymentMethods.find((p) => p.isDefault)?.id || paymentMethods[0]?.id || ''
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [20, 50, 100, 200];
  const effectiveAmount = isCustom ? (parseFloat(customAmount) || 0) : selectedAmount;

  const handleTopUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount <= 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onAddFunds(effectiveAmount, selectedPmId);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1200);
    }, 600);
  };

  const activeMethod = paymentMethods.find((pm) => pm.id === selectedPmId) || paymentMethods[0];

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs overscroll-contain animate-in fade-in duration-200 pointer-events-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 max-h-[90%] overflow-y-auto overscroll-contain animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Wallet className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Add Funds to Balanzo Wallet
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Current Balance: ${(currentBalance || 0).toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="py-10 text-center space-y-3 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/30">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">
              Funds Added Successfully!
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              ${(effectiveAmount || 0).toFixed(2)} added to your in-app balance.
            </p>
            <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
              New Balance: ${((currentBalance || 0) + (effectiveAmount || 0)).toFixed(2)}
            </div>
          </div>
        ) : (
          <form onSubmit={handleTopUp} className="mt-4 space-y-4">
            {/* Amount Presets */}
            <div>
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-2">
                Select Top-Up Amount
              </label>
              <div className="grid grid-cols-4 gap-2">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => {
                      setSelectedAmount(amt);
                      setIsCustom(false);
                    }}
                    className={`py-3 rounded-2xl border text-xs font-extrabold transition-all ${
                      !isCustom && selectedAmount === amt
                        ? 'border-[#6552FF] bg-[#6552FF] text-white shadow-md shadow-[#6552FF]/25 scale-102'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 bg-neutral-50 dark:bg-neutral-700/50 hover:bg-neutral-100'
                    }`}
                  >
                    +${amt}
                  </button>
                ))}
              </div>

              {/* Custom Amount Option */}
              <div className="mt-2.5">
                <div
                  onClick={() => setIsCustom(true)}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    isCustom
                      ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/10'
                      : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/50'
                  }`}
                >
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    Custom Amount
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-bold text-neutral-500">$</span>
                    <input
                      type="number"
                      min="1"
                      step="any"
                      placeholder="0.00"
                      value={customAmount}
                      onFocus={() => setIsCustom(true)}
                      onChange={(e) => {
                        setIsCustom(true);
                        setCustomAmount(e.target.value);
                      }}
                      className="w-24 bg-transparent font-bold text-sm text-neutral-900 dark:text-white text-right focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  Pay With
                </label>
                <button
                  type="button"
                  onClick={onOpenAddPaymentMethod}
                  className="text-xs font-bold text-[#6552FF] dark:text-indigo-400 flex items-center gap-0.5 hover:underline"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                {paymentMethods.map((pm) => {
                  const isSelected = selectedPmId === pm.id;
                  return (
                    <button
                      key={pm.id}
                      type="button"
                      onClick={() => setSelectedPmId(pm.id)}
                      className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all text-left ${
                        isSelected
                          ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/15 text-neutral-900 dark:text-white shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-neutral-800 dark:text-neutral-200">
                          {pm.type === 'apple_pay' ? (
                            <Sparkles className="w-4 h-4" />
                          ) : (
                            <CreditCard className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-neutral-900 dark:text-white">
                            {pm.title}
                          </p>
                          {pm.expiry && (
                            <p className="text-[10px] text-neutral-400 font-mono">
                              Exp: {pm.expiry}
                            </p>
                          )}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#6552FF] stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Summary Preview */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 space-y-1 text-xs">
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                <span>Top-Up Amount</span>
                <span className="font-bold text-neutral-900 dark:text-white">${(effectiveAmount || 0).toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-neutral-500 dark:text-neutral-400">
                <span>Payment Fee</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">$0.00 (Free)</span>
              </div>
              <div className="flex items-center justify-between pt-1.5 border-t border-neutral-200 dark:border-neutral-600 font-bold text-neutral-900 dark:text-white">
                <span>New Wallet Balance</span>
                <span className="text-emerald-600 dark:text-emerald-400 tabular-nums">
                  ${((currentBalance || 0) + (effectiveAmount || 0)).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Top Up Submit Button */}
            <button
              type="submit"
              disabled={effectiveAmount <= 0 || isProcessing}
              className="w-full py-3.5 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#6552FF]/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Add ${(effectiveAmount || 0).toFixed(2)} Instantly</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Zero fee instant balance replenishment</span>
        </div>
      </div>
    </div>
  );
};
