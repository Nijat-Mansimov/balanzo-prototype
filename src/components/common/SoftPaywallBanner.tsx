import React, { useState } from 'react';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface SoftPaywallBannerProps {
  onSeePlans: () => void;
  message?: string;
  className?: string;
}

export const SoftPaywallBanner: React.FC<SoftPaywallBannerProps> = ({
  onSeePlans,
  message,
  className = '',
}) => {
  const { t } = useLanguage();
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const displayMessage = message || t('plan.reached_limit', undefined, "You're using all 3 groups on the Free plan. Premium removes the limit.");

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6552FF]/10 via-purple-500/10 to-amber-500/10 border border-[#6552FF]/20 p-3.5 flex items-start gap-3 transition-all ${className}`}
    >
      <div className="p-1.5 rounded-xl bg-[#6552FF]/20 text-[#6552FF] dark:text-purple-300 shrink-0 mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="flex-1 pr-6">
        <p className="text-xs font-semibold text-neutral-900 dark:text-white leading-snug">
          {displayMessage}
        </p>
        <button
          onClick={onSeePlans}
          className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-bold text-[#6552FF] dark:text-indigo-400 hover:underline"
        >
          {t('plan.see_plans', undefined, 'See plans & usage')}
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      <button
        onClick={() => setIsDismissed(true)}
        className="absolute top-3 right-3 p-1 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
