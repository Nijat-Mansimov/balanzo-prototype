import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  Users, 
  Wallet, 
  ShieldCheck, 
  Zap, 
  Layers, 
  Globe, 
  Receipt, 
  CheckCircle2,
  UserPlus,
  LogIn,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  CreditCard,
  Building2,
  PieChart
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile, Friend, OnboardingData } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface OnboardingFlowProps {
  initialProfile?: UserProfile;
  friends?: Friend[];
  onComplete: (data: OnboardingData) => void;
  onChooseAuth?: (view: 'register' | 'login', data: OnboardingData) => void;
  onSkip?: (view?: 'register' | 'login') => void;
  isReplayMode?: boolean;
}

const STATIC_SLIDES = [
  {
    step: 1,
    badge: 'Welcome to Balanzo',
    title: 'Split Expenses.',
    highlight: 'Not Friendships.',
    description: 'The modern, transparent way to share trips, flats, dinners, and events without awkward calculations or lost receipts.',
    icon: Sparkles,
  },
  {
    step: 2,
    badge: 'Smart Math Engine',
    title: 'Debt Simplification.',
    highlight: 'Fewer Transactions.',
    description: 'Our optimization algorithm untangles group debts so everyone makes the absolute minimum number of payments to settle up.',
    icon: Zap,
  },
  {
    step: 3,
    badge: 'Versatile & Global',
    title: 'Personal & Business.',
    highlight: 'Multi-Currency Ready.',
    description: 'Switch between personal roommate ledgers and company travel expenses with real-time currency conversions and receipt management.',
    icon: Globe,
  },
  {
    step: 4,
    badge: 'Ready to Start',
    title: 'Take Control of',
    highlight: 'Shared Finances.',
    description: 'Join thousands of groups managing shared costs with complete clarity, privacy, and ease.',
    icon: ShieldCheck,
  },
];

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  initialProfile,
  onComplete,
  onChooseAuth,
  onSkip,
  isReplayMode = false,
}) => {
  const { t } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger confetti on the final slide
  useEffect(() => {
    if (step === 4 && canvasRef.current) {
      try {
        const myConfetti = confetti.create(canvasRef.current, {
          resize: true,
          useWorker: true,
        });
        myConfetti({
          particleCount: 70,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#6552FF', '#FF8A3D', '#10B981', '#6366F1', '#EC4899'],
        });
      } catch (e) {}
    }
  }, [step]);

  const handleNext = () => {
    if (step < 4) {
      setStep((s) => (s + 1) as any);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as any);
    }
  };

  const getFallbackData = (): OnboardingData => {
    return {
      name: initialProfile?.name || 'New Member',
      currency: initialProfile?.currency || 'USD ($)',
      avatarUrl: initialProfile?.avatarUrl,
      initials: initialProfile?.initials || 'NM',
      defaultSplitMethod: initialProfile?.defaultSplitMethod || 'equal',
    };
  };

  const handleSelectAuth = (authView: 'register' | 'login') => {
    const data = getFallbackData();
    if (onChooseAuth) {
      onChooseAuth(authView, data);
    } else {
      onComplete(data);
    }
  };

  return (
    <div className="relative h-full flex flex-col justify-between bg-white dark:bg-neutral-900 overflow-y-auto px-5 pt-4 pb-6 select-none">
      {/* Canvas for celebratory confetti on final slide */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-50 w-full h-full"
      />

      {/* Top Header Navigation & Progress Dots */}
      <div className="flex items-center justify-between py-2 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setStep(s as any)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                s === step
                  ? 'w-6 bg-[#6552FF] dark:bg-indigo-400'
                  : s < step
                  ? 'w-2.5 bg-neutral-400 dark:bg-neutral-600'
                  : 'w-2 bg-neutral-200 dark:bg-neutral-800'
              }`}
              aria-label={`Go to slide ${s}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {step < 4 && (
            <button
              type="button"
              onClick={() => handleSelectAuth('login')}
              id="btn-onboarding-top-login"
              className="text-xs font-bold text-[#6552FF] dark:text-indigo-400 hover:underline px-2 py-1 transition-colors cursor-pointer"
            >
              Log In
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onSkip) {
                onSkip();
              } else {
                handleSelectAuth('register');
              }
            }}
            id="btn-onboarding-skip"
            className="text-xs font-bold text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 px-2 py-1 rounded-lg transition-colors cursor-pointer"
          >
            {isReplayMode ? 'Close' : 'Skip'}
          </button>
        </div>
      </div>

      {/* Main Informative Slides Container */}
      <div className="my-auto py-3 animate-in fade-in duration-300">
        {/* SLIDE 1: EFFORTLESS BILL SPLITTING */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/70 text-[#6552FF] dark:text-indigo-400 flex items-center justify-center shadow-xs">
              <Sparkles className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6552FF] dark:text-indigo-400">
                Welcome to Balanzo
              </span>
              <h1 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
                Split expenses. <br />
                <span className="text-[#6552FF] dark:text-indigo-400">Not friendships.</span>
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium pt-0.5 leading-relaxed max-w-[340px]">
                The modern, transparent way to share trips, flats, dinners, and events without awkward calculations.
              </p>
            </div>

            {/* Static Visual Showcase Card */}
            <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-400 text-white flex items-center justify-center text-sm shadow-xs font-bold">
                    🏖️
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 dark:text-white">Summer Trip to Amalfi</h4>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-400">4 members • Total $1,280.00</p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                  Active
                </span>
              </div>

              <div className="p-2.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 text-[11px]">Villa Rental Deposit</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-neutral-900 dark:text-white text-xs">$640.00</span>
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">You are owed $160</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-1">
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-center">
                  <Users className="w-3.5 h-3.5 mx-auto text-indigo-500 mb-1" />
                  <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 block">Equal Splits</span>
                  <span className="text-[8px] text-neutral-400">Automatic</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-center">
                  <PieChart className="w-3.5 h-3.5 mx-auto text-amber-500 mb-1" />
                  <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 block">By Shares</span>
                  <span className="text-[8px] text-neutral-400">Custom ratios</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-center">
                  <TrendingUp className="w-3.5 h-3.5 mx-auto text-emerald-500 mb-1" />
                  <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 block">Live Balances</span>
                  <span className="text-[8px] text-neutral-400">Always synced</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 2: SMART DEBT SIMPLIFICATION */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/70 text-amber-500 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <Zap className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Algorithm Optimization
              </span>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
                Debt Simplification. <br />
                <span className="text-amber-500 dark:text-amber-400">Fewer Transfers.</span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium pt-0.5 leading-relaxed max-w-[340px]">
                Stop sending money back and forth. Balanzo mathematically collapses circular debts to minimal direct transfers.
              </p>
            </div>

            {/* Static Debt Simplification Visual Diagram */}
            <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between text-xs pb-1 border-b border-neutral-200/60 dark:border-neutral-700">
                <span className="font-bold text-neutral-700 dark:text-neutral-300">Smart Settlement Engine</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin duration-1000" />
                  Optimized
                </span>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-xs">
                      AM
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200">Alex Morgan</p>
                      <p className="text-[9px] text-neutral-400">Owes Leyla $40 & Arif $20</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-500" />
                  <div className="text-right">
                    <span className="text-xs font-black text-neutral-900 dark:text-white">$60.00</span>
                    <p className="text-[9px] text-emerald-600 font-bold">1 Direct Payment</p>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                  <p className="text-[10px] text-neutral-700 dark:text-neutral-300 font-medium leading-snug">
                    Reduces 5 complex group transactions into just 1 single payment!
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-center flex items-center justify-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300">1-Tap Settle</span>
                </div>
                <div className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-center flex items-center justify-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300">Proof Records</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 3: MULTI-CURRENCY & WORKSPACES */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
              <Globe className="w-6 h-6 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Global & Modular
              </span>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white leading-tight">
                Multi-Currency & <br />
                <span className="text-emerald-600 dark:text-emerald-400">Dual Workspaces.</span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium pt-0.5 leading-relaxed max-w-[340px]">
                Travel internationally without conversion confusion. Switch between Personal circles and Business expense logs instantly.
              </p>
            </div>

            {/* Static Workspace & Currency Feature Card */}
            <div className="p-4 rounded-3xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700/80 space-y-3 shadow-2xs">
              {/* Workspace Switcher Preview */}
              <div className="p-1 rounded-2xl bg-neutral-200/80 dark:bg-neutral-700 flex items-center gap-1">
                <div className="flex-1 py-1.5 px-2.5 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white flex items-center justify-center gap-1.5 shadow-2xs">
                  <Users className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-[11px] font-bold">Personal</span>
                </div>
                <div className="flex-1 py-1.5 px-2.5 rounded-xl text-neutral-600 dark:text-neutral-300 flex items-center justify-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Business</span>
                </div>
              </div>

              {/* Currency Cards */}
              <div className="p-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center">
                    $
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200">USD to EUR / AZN / GBP</p>
                    <p className="text-[9px] text-neutral-400">Live rate conversion supported</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">150+ Currencies</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-left">
                  <Receipt className="w-3.5 h-3.5 text-indigo-500 mb-1" />
                  <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 block">Receipt Attachments</span>
                  <span className="text-[9px] text-neutral-400">Attach photos & notes</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-left">
                  <Wallet className="w-3.5 h-3.5 text-amber-500 mb-1" />
                  <span className="text-[10px] font-bold text-neutral-800 dark:text-neutral-200 block">Wallet & Cards</span>
                  <span className="text-[9px] text-neutral-400">Track all methods</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SLIDE 4: GET STARTED / REGISTER OR LOGIN */}
        {step === 4 && (
          <div className="text-center space-y-4 py-1 animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 mx-auto rounded-3xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                You're All Set
              </span>
              <h2 className="text-2xl font-black tracking-tight text-neutral-900 dark:text-white">
                Welcome to Balanzo
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-[290px] mx-auto leading-relaxed">
                Create your account or log in to sync your groups, friends, and expenses across all your devices.
              </p>
            </div>

            {/* Quick Benefits Recap */}
            <div className="p-3.5 rounded-3xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200/80 dark:border-neutral-700 text-left space-y-2 shadow-2xs">
              <div className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="font-medium text-[11px]">Free unlimited group expense tracking</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="font-medium text-[11px]">Automatic debt simplification & instant settles</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-neutral-700 dark:text-neutral-300">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="font-medium text-[11px]">Personal & business workspace separation</span>
              </div>
            </div>

            {/* Choose Between Register & Login Actions */}
            <div className="pt-2 space-y-2.5">
              <button
                type="button"
                onClick={() => handleSelectAuth('register')}
                id="btn-onboarding-register"
                className="w-full py-3.5 px-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-between shadow-md shadow-neutral-900/10 hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-98 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4 text-[#6552FF] dark:text-indigo-500" />
                  <span>Create Account (Register)</span>
                </div>
                <ArrowRight className="w-4 h-4 stroke-[2.5] group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleSelectAuth('login')}
                id="btn-onboarding-login"
                className="w-full py-3.5 px-4 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white text-xs font-extrabold flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/60 active:scale-98 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <LogIn className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                  <span>Log In to Existing Account</span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </button>

              {isReplayMode && (
                <button
                  type="button"
                  onClick={() => onComplete(getFallbackData())}
                  id="btn-onboarding-finish-replay"
                  className="w-full py-2.5 text-center text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Return to Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Controls for Steps 1-3 */}
      {step < 4 && (
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2">
          {step > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="p-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer"
              aria-label="Previous step"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={handleNext}
            id="btn-onboarding-next"
            className="flex-1 py-3.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-md active:scale-98 transition-all cursor-pointer"
          >
            <span>Continue</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
};
