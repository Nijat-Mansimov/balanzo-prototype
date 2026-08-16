import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Check, AlertCircle, Sparkles, Globe } from 'lucide-react';
import { UserProfile, AuthScreenType } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface RegisterScreenProps {
  initialData?: { name?: string; currency?: string; avatarUrl?: string; initials?: string };
  onRegister: (newUser: Partial<UserProfile>) => void;
  onNavigate: (view: AuthScreenType) => void;
  onOpenLanguageModal?: () => void;
}

const POPULAR_CURRENCIES = [
  { code: 'USD ($)', symbol: '$', label: 'US Dollar' },
  { code: 'EUR (€)', symbol: '€', label: 'Euro' },
  { code: 'GBP (£)', symbol: '£', label: 'British Pound' },
  { code: 'AZN (₼)', symbol: '₼', label: 'Azerbaijani Manat' },
  { code: 'JPY (¥)', symbol: '¥', label: 'Japanese Yen' },
  { code: 'CAD (C$)', symbol: 'C$', label: 'Canadian Dollar' },
];

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  initialData,
  onRegister,
  onNavigate,
  onOpenLanguageModal,
}) => {
  const { t, currentLanguageOption } = useLanguage();

  const [name, setName] = useState(initialData?.name || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState(initialData?.currency || 'USD ($)');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Password strength calculation
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const strengthScore = [hasMinLength, hasNumber, hasUpper, hasSymbol].filter(Boolean).length;
  const strengthLabels = ['Too weak', 'Weak', 'Good', 'Strong'];
  const strengthColors = ['bg-neutral-200 dark:bg-neutral-700', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setError('Please accept the Terms of Service & Privacy Policy to continue.');
      return;
    }

    setIsLoading(true);

    const initials = name
      .trim()
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase() || 'US';

    setTimeout(() => {
      setIsLoading(false);
      onRegister({
        id: `user-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        initials,
        currency,
        plan: 'free',
        groupsUsed: 0,
        groupsLimit: 3,
        walletBalance: 0,
      });
    }, 700);
  };

  return (
    <div className="min-h-full flex flex-col justify-between px-5 pt-8 pb-6 animate-in fade-in duration-300">
      <div className="space-y-5">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6552FF] text-white flex items-center justify-center font-black text-sm shadow-md shadow-indigo-500/20">
              B
            </div>
            <span className="text-base font-black tracking-tight text-neutral-900 dark:text-white">
              Balanzo
            </span>
          </div>

          {onOpenLanguageModal && (
            <button
              type="button"
              onClick={onOpenLanguageModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              <span>{currentLanguageOption.flag}</span>
              <span className="text-[11px]">{currentLanguageOption.localeTag.toUpperCase()}</span>
            </button>
          )}
        </div>

        {/* Header Greeting */}
        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            {t('auth.create_account', undefined, 'Create account')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {t('auth.register_subtitle', undefined, 'Start splitting group bills with zero awkwardness')}
          </p>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              {t('auth.full_name', undefined, 'Full Name')}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              {t('auth.email_label', undefined, 'Email address')}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Base Currency Picker */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              {t('auth.primary_currency', undefined, 'Primary Currency')}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {POPULAR_CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  type="button"
                  onClick={() => setCurrency(curr.code)}
                  className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer ${
                    currency === curr.code
                      ? 'bg-[#6552FF]/10 dark:bg-[#6552FF]/20 border-[#6552FF] text-[#6552FF] dark:text-indigo-300'
                      : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  <span className="font-extrabold">{curr.symbol}</span>
                  <span>{curr.code.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              {t('auth.password_label', undefined, 'Password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6+ characters"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength meter bar */}
            {password.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-neutral-400 font-bold">
                  <span>Strength</span>
                  <span>{strengthLabels[strengthScore - 1] || 'Too weak'}</span>
                </div>
                <div className="grid grid-cols-4 gap-1 h-1.5">
                  {[0, 1, 2, 3].map((idx) => (
                    <div
                      key={idx}
                      className={`rounded-full transition-colors ${
                        idx < strengthScore
                          ? strengthColors[strengthScore - 1] || 'bg-amber-500'
                          : 'bg-neutral-200 dark:bg-neutral-700'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              {t('auth.confirm_password', undefined, 'Confirm Password')}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF] focus:border-transparent transition-all"
              />
              {confirmPassword.length > 0 && confirmPassword === password && (
                <Check className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3 stroke-[3]" />
              )}
            </div>
          </div>

          {/* Terms checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-[#6552FF] focus:ring-[#6552FF] border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800"
            />
            <span className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-tight">
              I agree to Balanzo's{' '}
              <span className="text-[#6552FF] dark:text-indigo-400 font-bold">Terms of Service</span> and{' '}
              <span className="text-[#6552FF] dark:text-indigo-400 font-bold">Privacy Policy</span>.
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            id="btn-auth-register"
            className="w-full py-3.5 mt-2 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-md active:scale-98 transition-all disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{t('auth.continue_onboarding', undefined, 'Create Account & Continue')}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Footer Navigation to Login */}
      <div className="pt-5 border-t border-neutral-100 dark:border-neutral-800/80 text-center">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {t('auth.already_have_account', undefined, 'Already have an account?')}{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-extrabold text-[#6552FF] dark:text-indigo-400 hover:underline cursor-pointer"
          >
            {t('auth.sign_in', undefined, 'Sign In')}
          </button>
        </p>
      </div>
    </div>
  );
};
