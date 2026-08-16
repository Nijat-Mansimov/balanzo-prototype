import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ShieldCheck, ArrowRight, RefreshCw, CheckCircle, Sparkles } from 'lucide-react';
import { AuthScreenType } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface OtpVerifyScreenProps {
  email: string;
  onNavigate: (view: AuthScreenType) => void;
  onVerified: () => void;
}

export const OtpVerifyScreen: React.FC<OtpVerifyScreenProps> = ({
  email,
  onNavigate,
  onVerified,
}) => {
  const { t } = useLanguage();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);
    setError(null);

    // Auto move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newDigits = pastedData.split('').concat(Array(6).fill('')).slice(0, 6);
      setDigits(newDigits);
      inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
    }
  };

  const handleFillDemo = () => {
    setDigits(['1', '2', '3', '4', '5', '6']);
  };

  const handleVerify = () => {
    const code = digits.join('');
    if (code.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onVerified();
    }, 600);
  };

  const handleResend = () => {
    setTimer(45);
    setError(null);
  };

  const isComplete = digits.every((d) => d !== '');

  return (
    <div className="min-h-full flex flex-col justify-between px-5 pt-6 pb-6 animate-in fade-in duration-300">
      <div className="space-y-6">
        {/* Top bar */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('forgot-password')}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Security Code
          </span>
        </div>

        {/* Header Content */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#6552FF] dark:text-indigo-400 flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            Verify code
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium leading-relaxed">
            Enter the 6-digit code sent to <strong className="text-neutral-900 dark:text-white">{email || 'your email'}</strong>
          </p>
        </div>

        {/* Demo Fast Fill Pill */}
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-100/80 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
          <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#6552FF]" /> Demo OTP: 123456
          </span>
          <button
            type="button"
            onClick={handleFillDemo}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-neutral-700 text-[#6552FF] dark:text-indigo-300 text-[10px] font-extrabold border border-indigo-200 dark:border-neutral-600 shadow-2xs hover:bg-indigo-50 active:scale-95 transition-all cursor-pointer"
          >
            Auto-fill
          </button>
        </div>

        {/* 6 Digit Inputs */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-1.5" onPaste={handlePaste}>
            {digits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-11 h-13 text-center text-lg font-black rounded-2xl border transition-all focus:outline-none focus:ring-2 focus:ring-[#6552FF] ${
                  digit
                    ? 'bg-white dark:bg-neutral-800 border-[#6552FF] text-neutral-900 dark:text-white shadow-xs'
                    : 'bg-neutral-50 dark:bg-neutral-800/60 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
              />
            ))}
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-600 dark:text-red-400 text-center">
              {error}
            </p>
          )}

          {/* Action button */}
          <button
            type="button"
            onClick={handleVerify}
            disabled={!isComplete || isVerifying}
            id="btn-verify-otp-submit"
            className="w-full py-3.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-md active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isVerifying ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>Verify & Continue</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </div>

        {/* Resend timer */}
        <div className="text-center pt-2">
          {timer > 0 ? (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
              Resend code in <strong className="text-neutral-800 dark:text-neutral-200 tabular-nums">{timer}s</strong>
            </p>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="text-xs font-extrabold text-[#6552FF] dark:text-indigo-400 hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Resend verification code</span>
            </button>
          )}
        </div>
      </div>

      <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800/80 text-center">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          ← Return to Sign In
        </button>
      </div>
    </div>
  );
};
