import React, { useState } from 'react';
import { ArrowLeft, Mail, KeyRound, CheckCircle2, ArrowRight, AlertCircle, RefreshCw } from 'lucide-react';
import { AuthScreenType } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface ForgotPasswordScreenProps {
  onNavigate: (view: AuthScreenType) => void;
  onCodeSent: (email: string) => void;
}

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({
  onNavigate,
  onCodeSent,
}) => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('mansimovnijat@gmail.com');
  const [isSent, setIsSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
      onCodeSent(email.trim());
    }, 600);
  };

  return (
    <div className="min-h-full flex flex-col justify-between px-5 pt-6 pb-6 animate-in fade-in duration-300">
      <div className="space-y-6">
        {/* Header navigation */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors cursor-pointer"
            aria-label="Back to login"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Account Recovery
          </span>
        </div>

        {/* Icon Header */}
        <div className="space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#6552FF] dark:text-indigo-400 flex items-center justify-center shadow-xs">
            <KeyRound className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
              {t('auth.reset_password_title', undefined, 'Forgot password?')}
            </h1>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-1 leading-relaxed">
              {t(
                'auth.reset_password_desc',
                undefined,
                "No worries! Enter your registered email address and we'll send you a 6-digit verification code to reset your password."
              )}
            </p>
          </div>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {t('auth.email_label', undefined, 'Email address')}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF] focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              id="btn-send-reset-code"
              className="w-full py-3.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-md active:scale-98 transition-all disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>{t('auth.send_reset_code', undefined, 'Send Verification Code')}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Verification code sent!</span>
              </div>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300/80 leading-relaxed">
                We have sent a 6-digit verification code to <strong className="font-bold">{email}</strong>. Please check your inbox.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('otp-verify')}
              id="btn-proceed-to-otp"
              className="w-full py-3.5 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer"
            >
              <span>Enter 6-Digit Code</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              type="button"
              onClick={() => setIsSent(false)}
              className="w-full py-2.5 text-center text-xs font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Use a different email address</span>
            </button>
          </div>
        )}
      </div>

      <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800/80 text-center">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          ← Back to Sign In
        </button>
      </div>
    </div>
  );
};
