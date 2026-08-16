import React, { useState } from 'react';
import { 
  Camera, 
  ChevronRight, 
  Globe, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Settings, 
  ShieldCheck, 
  Check, 
  X, 
  Upload, 
  Trash2,
  AlertCircle,
  CreditCard,
  Wallet,
  Plus,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { UserProfile } from '../../types';
import { Avatar } from '../common/Avatar';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageCode } from '../../i18n/translations';

interface ProfileScreenProps {
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onOpenPlanUsage: () => void;
  onOpenSettings: () => void;
  onOpenAnalytics?: () => void;
  onOpenLanguageModal?: () => void;
  onOpenAddPaymentMethod?: () => void;
  onOpenAddFunds?: () => void;
  onLogout?: () => void;
  onReplayOnboarding?: () => void;
  onOpenAuth?: () => void;
  walletBalance?: number;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  onUpdateProfile,
  onOpenPlanUsage,
  onOpenSettings,
  onOpenAnalytics,
  onOpenLanguageModal,
  onOpenAddPaymentMethod,
  onOpenAddFunds,
  onLogout,
  onReplayOnboarding,
  onOpenAuth,
  walletBalance = 425.50,
}) => {
  const { t, language, setLanguage, languages, currentLanguageOption } = useLanguage();
  const [isPhotoSheetOpen, setIsPhotoSheetOpen] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  // Pickers modal states
  const [activePicker, setActivePicker] = useState<'currency' | 'timezone' | 'locale' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const currencies = [
    { code: 'USD ($)', name: 'United States Dollar' },
    { code: 'EUR (€)', name: 'Euro' },
    { code: 'AZN (₼)', name: 'Azerbaijani Manat' },
    { code: 'GBP (£)', name: 'British Pound' },
    { code: 'CAD ($)', name: 'Canadian Dollar' },
    { code: 'AUD ($)', name: 'Australian Dollar' },
    { code: 'JPY (¥)', name: 'Japanese Yen' },
    { code: 'CHF (Fr)', name: 'Swiss Franc' },
    { code: 'TRY (₺)', name: 'Turkish Lira' },
    { code: 'RUB (₽)', name: 'Russian Ruble' },
  ];

  const timezones = [
    { code: 'Asia/Baku (GMT+4)', name: 'Azerbaijan Standard Time' },
    { code: 'America/New_York (EST)', name: 'Eastern Standard Time' },
    { code: 'Europe/London (GMT+0)', name: 'Greenwich Mean Time' },
    { code: 'Europe/Paris (CET)', name: 'Central European Time' },
    { code: 'Europe/Berlin (CET)', name: 'Central European Time' },
    { code: 'Europe/Madrid (CET)', name: 'Central European Time' },
    { code: 'Europe/Istanbul (GMT+3)', name: 'Turkey Time' },
    { code: 'Europe/Moscow (MSK)', name: 'Moscow Standard Time' },
    { code: 'Asia/Dubai (GMT+4)', name: 'Gulf Standard Time' },
    { code: 'Asia/Tokyo (JST)', name: 'Japan Standard Time' },
    { code: 'America/Los_Angeles (PST)', name: 'Pacific Standard Time' },
  ];

  const locales = languages.map(lang => ({
    code: `${lang.localeTag} (${lang.nativeName})`,
    name: `${lang.name} • ${lang.flag}`,
    langCode: lang.code,
    flag: lang.flag,
    nativeName: lang.nativeName,
  }));

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhotoError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Photos must be under 5MB');
      return;
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setPhotoError('Only JPEG, PNG, and WebP photos are supported');
      return;
    }

    const url = URL.createObjectURL(file);
    onUpdateProfile({ avatarUrl: url });
    setIsPhotoSheetOpen(false);
  };

  const handleRemovePhoto = () => {
    onUpdateProfile({ avatarUrl: undefined });
    setIsPhotoSheetOpen(false);
  };

  return (
    <div className="space-y-4 px-4 pb-24 pt-1 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-center relative shadow-xs">
        <div className="relative inline-block mx-auto mb-3">
          <Avatar
            imageUrl={profile.avatarUrl}
            name={profile.name}
            initials={profile.initials}
            size="xl"
          />
          <button
            onClick={() => setIsPhotoSheetOpen(true)}
            id="btn-edit-avatar"
            className="absolute bottom-0 right-0 p-2 rounded-full bg-[#6552FF] text-white shadow-md active:scale-95 transition-transform"
            aria-label={t('profile.change_photo', undefined, 'Change photo')}
          >
            <Camera className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        </div>

        <h1 className="text-lg font-black text-neutral-900 dark:text-white">
          {profile.name}
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
          {profile.email}
        </p>

        {/* Plan Pill */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/60 dark:border-indigo-800/40 text-xs font-bold text-[#6552FF] dark:text-indigo-300">
          <Sparkles className="w-3.5 h-3.5 stroke-[2]" />
          <span>{t('profile.free_plan_badge', undefined, 'Free Plan')} ({profile.groupsUsed}/{profile.groupsLimit} {t('profile.groups_count', undefined, 'groups')})</span>
        </div>
      </div>

      {/* Wallet & Payment Methods Section */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Wallet & Payments
        </h2>

        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
                <Wallet className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  In-App Balance
                </span>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                  ${walletBalance.toFixed(2)} USD
                </span>
              </div>
            </div>
            {onOpenAddFunds && (
              <button
                onClick={onOpenAddFunds}
                id="btn-profile-add-funds"
                className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Funds</span>
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
                <CreditCard className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  Payment Methods
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                  Visa •••• 4242 (Default)
                </span>
              </div>
            </div>
            {onOpenAddPaymentMethod && (
              <button
                onClick={onOpenAddPaymentMethod}
                id="btn-profile-add-card"
                className="px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-900 dark:text-white text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Method</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Account Info Section */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t('profile.account_info', undefined, 'Account Information')}
        </h2>

        <div className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 space-y-3 shadow-xs">
          {/* Display Name */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {t('profile.display_name', undefined, 'Display Name')}
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => onUpdateProfile({ name: e.target.value })}
              className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-semibold text-neutral-900 dark:text-white focus:ring-2 focus:ring-[#6552FF]/30 outline-none"
            />
          </div>

          {/* Read Only Email with caption */}
          <div className="space-y-1 pt-1 border-t border-neutral-100 dark:border-neutral-700/80">
            <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              {t('profile.email_address', undefined, 'Email Address')}
            </label>
            <div className="p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 flex items-center justify-between text-xs font-semibold text-neutral-700 dark:text-neutral-200">
              <span>{profile.email}</span>
              <span className="text-[10px] font-medium text-neutral-400">Read-only</span>
            </div>
            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 italic">
              {t('profile.contact_support', undefined, 'Contact support to change your email')}
            </p>
          </div>
        </div>
      </div>

      {/* Preferences Section (Searchable Pickers) */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t('profile.regional_preferences', undefined, 'Regional Preferences')}
        </h2>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-700/60 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 overflow-hidden shadow-sm">
          {/* Currency */}
          <button
            onClick={() => setActivePicker('currency')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
                <DollarSign className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  {t('profile.primary_currency', undefined, 'Primary Currency')}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {profile.currency}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          {/* Timezone */}
          <button
            onClick={() => setActivePicker('timezone')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
                <Clock className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  {t('profile.timezone', undefined, 'Timezone')}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {profile.timezone}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          {/* Locale / Language */}
          <button
            onClick={() => {
              if (onOpenLanguageModal) {
                onOpenLanguageModal();
              } else {
                setActivePicker('locale');
              }
            }}
            id="btn-profile-language"
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center text-base">
                {currentLanguageOption.flag}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                    {t('profile.language_locale', undefined, 'Language & Region')}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#6552FF]/10 text-[#6552FF] dark:text-indigo-300 font-bold">
                    {currentLanguageOption.nativeName}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500">
                  {currentLanguageOption.name} • {currentLanguageOption.localeTag}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#6552FF] font-semibold hidden sm:inline">
                {t('profile.change_language', undefined, 'Change')}
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Analytics & Reports Section */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          Analytics & Insights
        </h2>

        <div className="rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 overflow-hidden shadow-xs">
          <button
            type="button"
            onClick={onOpenAnalytics}
            id="btn-profile-open-analytics"
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
                <BarChart3 className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                    Expense Analytics
                  </span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold">
                    Monthly Breakdown
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Spending trends, category charts & cash flow
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Plan & Settings Navigation */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t('profile.management', undefined, 'Management')}
        </h2>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-700/60 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 overflow-hidden shadow-sm">
          <button
            onClick={onOpenPlanUsage}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
                <Sparkles className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  {t('profile.plan_usage', undefined, 'Plan & Group Limits')}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {profile.groupsUsed} of {profile.groupsLimit} {t('profile.groups_count', undefined, 'groups')} • {t('profile.free_plan_badge', undefined, 'Free Plan')}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={onOpenSettings}
            className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center justify-center">
                <Settings className="w-4 h-4 stroke-[2]" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  {t('profile.settings_security', undefined, 'Settings & Security')}
                </span>
                <span className="text-[11px] text-neutral-500">
                  {t('profile.settings_desc', undefined, 'Password, Privacy & Terms')}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          {onReplayOnboarding && (
            <button
              onClick={onReplayOnboarding}
              id="btn-profile-replay-onboarding"
              className="w-full p-3.5 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 stroke-[2]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                    {t('profile.onboarding_tour', undefined, 'Onboarding & App Tour')}
                  </span>
                  <span className="text-[11px] text-neutral-500">
                    Feature overview, preferences & circles
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </button>
          )}

          {onLogout && (
            <button
              onClick={onLogout}
              id="btn-profile-logout"
              className="w-full p-3.5 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <span className="text-xs font-bold text-red-600 dark:text-red-400 block">
                    {t('settings.log_out', undefined, 'Log out / Switch account')}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Switch to another user or sign in
                  </span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Avatar Photo Bottom Sheet */}
      {isPhotoSheetOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {t('profile.change_photo', undefined, 'Profile Photo')}
              </h3>
              <button
                onClick={() => setIsPhotoSheetOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {photoError && (
              <div className="mt-3 p-3 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 flex items-center gap-2 text-xs font-semibold text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{photoError}</span>
              </div>
            )}

            <div className="mt-4 space-y-2">
              <label className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-700/40 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors text-xs font-bold text-neutral-900 dark:text-white">
                <Camera className="w-4 h-4 text-[#6552FF]" />
                <span>{t('profile.take_photo', undefined, 'Take Photo')}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  capture="environment"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>

              <label className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-700/40 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer transition-colors text-xs font-bold text-neutral-900 dark:text-white">
                <Upload className="w-4 h-4 text-[#6552FF]" />
                <span>{t('profile.choose_library', undefined, 'Choose from Library')}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>

              {profile.avatarUrl && (
                <button
                  onClick={handleRemovePhoto}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/20 hover:bg-red-100 text-xs font-bold text-red-600 dark:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>{t('profile.remove_photo', undefined, 'Remove Current Photo')}</span>
                </button>
              )}
            </div>

            <p className="text-[10px] text-neutral-400 text-center mt-3">
              Supported: JPEG, PNG, WebP (Max 5MB)
            </p>
          </div>
        </div>
      )}

      {/* Searchable Pickers Modal */}
      {activePicker && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-h-[85%] bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 flex flex-col animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white capitalize">
                {activePicker === 'locale' 
                  ? t('profile.select_language', undefined, 'Select Language') 
                  : `Select ${activePicker}`}
              </h3>
              <button
                onClick={() => {
                  setActivePicker(null);
                  setSearchQuery('');
                }}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`${t('btn.search', undefined, 'Search')} ${activePicker}...`}
                className="w-full p-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar">
              {(activePicker === 'currency'
                ? currencies
                : activePicker === 'timezone'
                ? timezones
                : locales
              )
                .filter((item) =>
                  item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  item.code.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((item) => {
                  const isCurrent = activePicker === 'locale' 
                    ? (item as any).langCode === language 
                    : profile[activePicker!] === item.code;

                  return (
                    <button
                      key={item.code}
                      onClick={() => {
                        if (activePicker === 'locale') {
                          const langCode = (item as any).langCode as LanguageCode;
                          if (langCode) {
                            setLanguage(langCode);
                          }
                          onUpdateProfile({ locale: item.code });
                        } else {
                          onUpdateProfile({ [activePicker!]: item.code });
                        }
                        setActivePicker(null);
                        setSearchQuery('');
                      }}
                      className={`w-full p-3 rounded-2xl flex items-center justify-between border transition-all text-left ${
                        isCurrent
                          ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/15'
                          : 'border-neutral-100 dark:border-neutral-700/50 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {activePicker === 'locale' && (
                          <span className="text-xl">{(item as any).flag}</span>
                        )}
                        <div>
                          <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                            {(item as any).nativeName || item.code}
                          </span>
                          <span className="text-[11px] text-neutral-500">
                            {item.name}
                          </span>
                        </div>
                      </div>
                      {isCurrent && (
                        <div className="w-5 h-5 rounded-full bg-[#6552FF] text-white flex items-center justify-center">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
