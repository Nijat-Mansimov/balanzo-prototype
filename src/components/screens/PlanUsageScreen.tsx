import React from 'react';
import { ArrowLeft, Check, Sparkles, X, Shield, Zap, Info } from 'lucide-react';
import { UserProfile } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface PlanUsageScreenProps {
  profile: UserProfile;
  onBack: () => void;
}

export const PlanUsageScreen: React.FC<PlanUsageScreenProps> = ({
  profile,
  onBack,
}) => {
  const { t } = useLanguage();
  const groupsUsed = profile.groupsUsed; // 3
  const groupsLimit = profile.groupsLimit; // 3
  const isAtLimit = groupsUsed >= groupsLimit;

  return (
    <div className="space-y-4 px-4 pb-24 pt-1 animate-in fade-in duration-300">
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200"
          aria-label="Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
            {t('plan.title', undefined, 'Plan & Usage')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {t('plan.subtitle', undefined, 'Personal entitlement status')}
          </p>
        </div>
      </div>

      {/* 1. METERED USAGE CARD */}
      <div className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-neutral-500 dark:text-neutral-400">
              {t('plan.current_plan', undefined, 'Current Plan')}
            </span>
            <h2 className="text-base font-black text-neutral-900 dark:text-white">
              {t('plan.free_plan', undefined, 'Free Plan')}
            </h2>
          </div>
          <span className="px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-700 text-xs font-bold text-neutral-800 dark:text-neutral-200">
            $0 / month
          </span>
        </div>

        {/* Meter bar */}
        <div className="space-y-1.5 pt-2">
          <div className="flex justify-between text-xs font-bold text-neutral-700 dark:text-neutral-200">
            <span>{t('plan.groups_entitlement', undefined, 'Groups Entitlement')}</span>
            <span className="tabular-nums">
              {groupsUsed} / {groupsLimit} {t('plan.groups_used', undefined, 'groups used')}
            </span>
          </div>

          <div className="w-full h-3 rounded-full bg-neutral-100 dark:bg-neutral-700 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                isAtLimit ? 'bg-[#9C5317] dark:bg-amber-500' : 'bg-[#6552FF]'
              }`}
              style={{ width: `${Math.min((groupsUsed / groupsLimit) * 100, 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 pt-0.5 font-medium">
            {isAtLimit
              ? t('plan.reached_limit', undefined, "You've reached the 3-group limit on Free. Premium removes the limit.")
              : `${groupsLimit - groupsUsed} ${t('plan.groups_remaining', undefined, 'groups remaining on Free plan.')}`}
          </p>
        </div>
      </div>

      {/* 2. PLANS COMPARISON */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t('plan.available_upgrades', undefined, 'Available Upgrades')}
        </h3>

        {/* Premium Plan Card */}
        <div className="relative overflow-hidden p-5 rounded-3xl bg-white dark:bg-neutral-800 border-2 border-[#6552FF]/50 shadow-xs">
          <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#6552FF] text-white text-[10px] font-extrabold">
            {t('plan.popular_badge', undefined, 'POPULAR')}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-[#6552FF] dark:text-indigo-400" />
            <h4 className="text-sm font-black text-neutral-900 dark:text-white">
              {t('plan.premium_title', undefined, 'Balanzo Premium')}
            </h4>
          </div>

          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums">
              {t('plan.premium_price', undefined, '$4.99')}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{t('plan.premium_period', undefined, '/ month or $39.99/year')}</span>
          </div>

          <div className="space-y-2 mb-4 text-xs text-neutral-600 dark:text-neutral-300 font-medium">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t('plan.unlimited_groups', undefined, 'Unlimited shared & trip groups')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t('plan.receipt_ocr', undefined, 'Smart receipt scanning OCR')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>{t('plan.currency_conversion', undefined, 'Multiple currency conversion')}</span>
            </div>
          </div>

          <button
            disabled
            className="w-full py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 text-xs font-bold cursor-default"
          >
            {t('plan.coming_soon', undefined, 'Coming soon to app')}
          </button>
        </div>

        {/* Trip Pass Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 shadow-xs">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-neutral-700 dark:text-neutral-200 stroke-[2]" />
            <h4 className="text-sm font-black text-neutral-900 dark:text-white">
              {t('plan.trip_pass_title', undefined, 'Trip Pass')}
            </h4>
          </div>

          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-2xl font-black text-neutral-900 dark:text-white tabular-nums">
              {t('plan.trip_pass_price', undefined, '$4.99')}
            </span>
            <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">{t('plan.trip_pass_period', undefined, 'one-time')}</span>
          </div>

          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4 font-medium">
            {t('plan.trip_pass_desc', undefined, 'Unlocks 1 single unlimited trip group forever with all receipt OCR capabilities included.')}
          </p>

          <button
            disabled
            className="w-full py-3 rounded-2xl bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 text-xs font-bold cursor-default"
          >
            {t('plan.coming_soon', undefined, 'Coming soon to app')}
          </button>
        </div>
      </div>
    </div>
  );
};
