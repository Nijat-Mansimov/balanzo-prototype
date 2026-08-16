import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserProfile, AuthScreenType } from '../../types';
import { CURRENT_USER } from '../../data/mockData';
import { useLanguage } from '../../i18n/LanguageContext';

interface LoginScreenProps {
  onLogin: (user: Partial<UserProfile>) => void;
  onNavigate: (view: AuthScreenType) => void;
  onOpenLanguageModal?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onNavigate,
  onOpenLanguageModal,
}) => {
  const { t, currentLanguageOption } = useLanguage();

  const [email, setEmail] = useState('mansimovnijat@gmail.com');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        id: 'user-nijat',
        name: 'Nijat Mansimov',
        email: email.trim(),
        initials: 'NM',
        currency: 'USD ($)',
        plan: 'free',
      });
    }, 600);
  };

  const handleQuickLogin = (name: string, emailAddr: string, initials: string) => {
    setEmail(emailAddr);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin({
        id: `user-${initials.toLowerCase()}`,
        name,
        email: emailAddr,
        initials,
        currency: 'USD ($)',
        plan: 'free',
      });
    }, 400);
  };

  return (
    <div className="min-h-full flex flex-col justify-between px-5 pt-8 pb-6 animate-in fade-in duration-300">
      <div className="space-y-6">
        {/* Top bar with language & brand tag */}
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
            {t('auth.welcome_back', undefined, 'Welcome back')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {t('auth.login_subtitle', undefined, 'Sign in to split bills, track balances and settle up')}
          </p>
        </div>

        {/* Demo Fast Login Switchers */}
        <div className="p-3 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#6552FF] dark:text-indigo-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Quick Demo Sign-In
            </span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400">1-click test</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickLogin('Nijat Mansimov', 'mansimovnijat@gmail.com', 'NM')}
              className="px-2 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-indigo-200/60 dark:border-indigo-800/80 text-[11px] font-bold text-neutral-800 dark:text-neutral-200 hover:border-[#6552FF] transition-all text-center truncate active:scale-95 shadow-2xs"
            >
              Nijat (You)
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('Arif Mammadov', 'arif.m@example.com', 'AM')}
              className="px-2 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[11px] font-bold text-neutral-800 dark:text-neutral-200 hover:border-[#6552FF] transition-all text-center truncate active:scale-95 shadow-2xs"
            >
              Arif M.
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('Leyla Aliyeva', 'leyla.a@example.com', 'LA')}
              className="px-2 py-1.5 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-[11px] font-bold text-neutral-800 dark:text-neutral-200 hover:border-[#6552FF] transition-all text-center truncate active:scale-95 shadow-2xs"
            >
              Leyla A.
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/80 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email Input */}
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

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {t('auth.password_label', undefined, 'Password')}
              </label>
              <button
                type="button"
                onClick={() => onNavigate('forgot-password')}
                className="text-[11px] font-bold text-[#6552FF] dark:text-indigo-400 hover:underline"
              >
                {t('auth.forgot_password', undefined, 'Forgot password?')}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="w-full pl-10 pr-10 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-[#6552FF] focus:ring-[#6552FF] border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-800"
              />
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                {t('auth.remember_me', undefined, 'Remember this device')}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            id="btn-auth-login"
            className="w-full py-3.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-md active:scale-98 transition-all disabled:opacity-70 cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{t('auth.sign_in', undefined, 'Sign In')}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </>
            )}
          </button>
        </form>

        {/* Social Auth Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
          </div>
          <span className="relative px-3 bg-white dark:bg-neutral-900 text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            {t('auth.or_continue_with', undefined, 'Or continue with')}
          </span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => handleQuickLogin('Google User', 'google.user@gmail.com', 'GU')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/70 text-xs font-bold text-neutral-800 dark:text-neutral-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleQuickLogin('Apple User', 'apple.user@icloud.com', 'AU')}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700/70 text-xs font-bold text-neutral-800 dark:text-neutral-200 transition-all active:scale-95 cursor-pointer shadow-2xs"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-2 .6-2.65 1.35-.57.66-.99 1.74-.86 2.76 1.01.08 2.01-.51 2.58-1.26z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>
      </div>

      {/* Footer Navigation to Register */}
      <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800/80 text-center">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {t('auth.no_account', undefined, "Don't have an account?")}{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="font-extrabold text-[#6552FF] dark:text-indigo-400 hover:underline cursor-pointer"
          >
            {t('auth.create_one', undefined, 'Sign up for free')}
          </button>
        </p>
      </div>
    </div>
  );
};
