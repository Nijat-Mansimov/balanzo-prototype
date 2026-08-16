import React, { useState } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, Check, AlertCircle, Sparkles } from 'lucide-react';
import { AuthScreenType, UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface ResetPasswordScreenProps {
  email: string;
  onNavigate: (view: AuthScreenType) => void;
  onPasswordResetSuccess: (user: Partial<UserProfile>) => void;
}

export const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({
  email,
  onNavigate,
  onPasswordResetSuccess,
}) => {
  const { t } = useLanguage();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Criteria
  const hasLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const isMatched = password.length > 0 && password === confirmPassword;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        onPasswordResetSuccess({
          email: email || 'mansimovnijat@gmail.com',
          name: 'Nijat Mansimov',
          initials: 'NM',
        });
      }, 1200);
    }, 600);
  };

  return (
    <div className="min-h-full flex flex-col justify-between px-5 pt-8 pb-6 animate-in fade-in duration-300">
      <div className="space-y-6">
        {/* Header Content */}
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-[#6552FF] dark:text-indigo-400 flex items-center justify-center shadow-xs">
            <Lock className="w-6 h-6 stroke-[2.2]" />
          </div>
          <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
            Set new password
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            Create a strong password for your Balanzo account
          </p>
        </div>

        {isSuccess ? (
          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-center space-y-3 animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-base font-black text-emerald-900 dark:text-emerald-200">
              Password Updated!
            </h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-400">
              Your password has been changed securely. Logging you in now...
            </p>
            <div className="pt-2">
              <div className="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF] focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF] focus:border-transparent transition-all"
                />
                {isMatched && (
                  <Check className="w-4 h-4 text-emerald-500 absolute right-3.5 top-3.5 stroke-[3]" />
                )}
              </div>
            </div>

            {/* Requirements Pills */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700 space-y-2">
              <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400 tracking-wider">
                Password Requirements
              </span>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className={`flex items-center gap-1.5 ${hasLength ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-neutral-400'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>8+ characters</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasNumber ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-neutral-400'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>1+ numbers</span>
                </div>
                <div className={`flex items-center gap-1.5 ${hasUpper ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-neutral-400'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Uppercase letter</span>
                </div>
                <div className={`flex items-center gap-1.5 ${isMatched ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-neutral-400'}`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Passwords match</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              id="btn-save-new-password"
              className="w-full py-3.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-md active:scale-98 transition-all disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Reset & Sign In</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        )}
      </div>

      <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800/80 text-center">
        <button
          type="button"
          onClick={() => onNavigate('login')}
          className="text-xs font-bold text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
        >
          ← Cancel and Sign In
        </button>
      </div>
    </div>
  );
};
