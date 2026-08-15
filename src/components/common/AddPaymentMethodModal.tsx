import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Check, Sparkles, Plus, Lock } from 'lucide-react';
import { PaymentMethod } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface AddPaymentMethodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentMethodAdded: (pm: PaymentMethod) => void;
}

export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  isOpen,
  onClose,
  onPaymentMethodAdded,
}) => {
  const { t } = useLanguage();
  const [methodType, setMethodType] = useState<'card' | 'apple_pay' | 'google_pay' | 'bank'>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('Nijat Mansimov');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isDefault, setIsDefault] = useState(true);

  if (!isOpen) return null;

  // Format Card Number (adds space every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2, 4)}`;
    }
    setExpiry(raw);
  };

  // Detect card brand
  const getBrand = (): 'visa' | 'mastercard' | 'amex' => {
    const clean = cardNumber.replace(/\s/g, '');
    if (clean.startsWith('4')) return 'visa';
    if (clean.startsWith('5') || clean.startsWith('2')) return 'mastercard';
    if (clean.startsWith('3')) return 'amex';
    return 'visa';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newPm: PaymentMethod;
    if (methodType === 'card') {
      const cleanNumber = cardNumber.replace(/\s/g, '');
      const last4 = cleanNumber.length >= 4 ? cleanNumber.slice(-4) : '4242';
      const brand = getBrand();
      newPm = {
        id: `pm-${Date.now()}`,
        type: 'card',
        title: `${brand.toUpperCase()} ending in ${last4}`,
        last4,
        brand,
        expiry: expiry || '12/28',
        isDefault,
      };
    } else if (methodType === 'apple_pay') {
      newPm = {
        id: `pm-${Date.now()}`,
        type: 'apple_pay',
        title: 'Apple Pay',
        brand: 'apple',
        isDefault,
      };
    } else if (methodType === 'google_pay') {
      newPm = {
        id: `pm-${Date.now()}`,
        type: 'google_pay',
        title: 'Google Pay',
        brand: 'google',
        isDefault,
      };
    } else {
      newPm = {
        id: `pm-${Date.now()}`,
        type: 'bank',
        title: 'Instant Bank Debit (IBAN)',
        brand: 'bank',
        isDefault,
      };
    }

    onPaymentMethodAdded(newPm);
    onClose();
  };

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
            <div className="w-8 h-8 rounded-xl bg-[#6552FF]/10 text-[#6552FF] dark:text-indigo-300 flex items-center justify-center">
              <CreditCard className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Add Payment Method
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Encrypted & secure checkout
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

        {/* Method Type Selector */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <button
            type="button"
            onClick={() => setMethodType('card')}
            className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
              methodType === 'card'
                ? 'border-[#6552FF] bg-[#6552FF]/10 text-[#6552FF] dark:text-indigo-300 shadow-xs'
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700'
            }`}
          >
            <CreditCard className="w-4 h-4 stroke-[2]" />
            <span className="text-[11px]">Card</span>
          </button>

          <button
            type="button"
            onClick={() => setMethodType('apple_pay')}
            className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
              methodType === 'apple_pay'
                ? 'border-[#6552FF] bg-[#6552FF]/10 text-[#6552FF] dark:text-indigo-300 shadow-xs'
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700'
            }`}
          >
            <Sparkles className="w-4 h-4 stroke-[2]" />
            <span className="text-[11px]">Apple Pay</span>
          </button>

          <button
            type="button"
            onClick={() => setMethodType('bank')}
            className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 text-xs font-bold transition-all ${
              methodType === 'bank'
                ? 'border-[#6552FF] bg-[#6552FF]/10 text-[#6552FF] dark:text-indigo-300 shadow-xs'
                : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700'
            }`}
          >
            <Lock className="w-4 h-4 stroke-[2]" />
            <span className="text-[11px]">Bank Debit</span>
          </button>
        </div>

        {methodType === 'card' && (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
            {/* Visual Card Preview */}
            <div className="relative overflow-hidden rounded-2xl p-4 bg-gradient-to-tr from-neutral-900 via-indigo-950 to-neutral-800 text-white shadow-lg border border-white/10">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[11px] font-mono tracking-widest text-white/70 uppercase">
                  Balanzo Secure Pay
                </span>
                <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white/10">
                  {getBrand()}
                </span>
              </div>
              <div className="font-mono text-sm tracking-widest font-bold mb-4 text-white">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>
              <div className="flex items-end justify-between text-[11px]">
                <div>
                  <span className="text-[9px] text-white/60 block uppercase font-mono">Card Holder</span>
                  <span className="font-semibold">{cardHolder || 'FULL NAME'}</span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-white/60 block uppercase font-mono">Expires</span>
                  <span className="font-mono font-semibold">{expiry || 'MM/YY'}</span>
                </div>
              </div>
            </div>

            {/* Card Number Input */}
            <div>
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                Card Number
              </label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="4532 8201 9283 4242"
                required
                maxLength={19}
                className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-mono font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {/* Expiry */}
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Expiry (MM/YY)
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={handleExpiryChange}
                  placeholder="12/28"
                  required
                  maxLength={5}
                  className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-mono font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
                />
              </div>

              {/* CVC */}
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  CVC / CVV
                </label>
                <input
                  type="password"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value.slice(0, 4))}
                  placeholder="•••"
                  required
                  maxLength={4}
                  className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-mono font-bold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
                />
              </div>
            </div>

            {/* Card Holder Name */}
            <div>
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                Name on Card
              </label>
              <input
                type="text"
                value={cardHolder}
                onChange={(e) => setCardHolder(e.target.value)}
                placeholder="Nijat Mansimov"
                required
                className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
              />
            </div>

            {/* Set as Default Toggle */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-600">
              <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                Set as default payment method
              </span>
              <input
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="w-4 h-4 text-[#6552FF] rounded focus:ring-0"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] text-white text-xs font-bold shadow-md shadow-[#6552FF]/25 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Save Payment Method</span>
              </button>
            </div>
          </form>
        )}

        {methodType === 'apple_pay' && (
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-600 text-center">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-2">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                Apple Pay Quick Link
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                Authenticate with Face ID / Touch ID to instantly fund your wallet without entering card numbers.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-2xl bg-black dark:bg-white text-white dark:text-black text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Connect Apple Pay</span>
            </button>
          </div>
        )}

        {methodType === 'bank' && (
          <div className="mt-4 space-y-4">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-700/60 border border-neutral-200 dark:border-neutral-600 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                Direct SEPA / Bank Transfer
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1">
                Link your bank account directly via Open Banking for zero-fee top ups.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] text-white text-xs font-bold active:scale-95 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Connect Bank Account</span>
            </button>
          </div>
        )}

        <div className="mt-3 flex items-center justify-center gap-1 text-[10px] text-neutral-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>PCI-DSS Level 1 Encrypted & Secured</span>
        </div>
      </div>
    </div>
  );
};
