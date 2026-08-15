import React, { useState } from 'react';
import { ArrowLeft, KeyRound, Shield, LogOut, Check, ChevronRight, X, ExternalLink, Globe } from 'lucide-react';
import { CURRENT_USER } from '../../data/mockData';
import { useLanguage } from '../../i18n/LanguageContext';

interface SettingsScreenProps {
  onBack: () => void;
  onOpenLanguageModal?: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ 
  onBack,
  onOpenLanguageModal,
}) => {
  const { t, currentLanguageOption } = useLanguage();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordLinkSent, setPasswordLinkSent] = useState(false);

  const handleSendResetLink = () => {
    setPasswordLinkSent(true);
    setTimeout(() => {
      setPasswordLinkSent(false);
      setIsPasswordModalOpen(false);
    }, 2000);
  };

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
            {t('settings.title', undefined, 'Settings & Security')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {t('settings.subtitle', undefined, 'Account access & platform trust')}
          </p>
        </div>
      </div>

      {/* Language Section */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t('settings.language_section', undefined, 'Language & Internationalization')}
        </h2>

        <div className="rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 overflow-hidden shadow-xs">
          <button
            onClick={onOpenLanguageModal}
            id="btn-settings-language"
            className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center text-base">
                {currentLanguageOption.flag}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                    {t('settings.current_language', undefined, 'Current Language')}
                  </span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#6552FF]/10 dark:bg-indigo-950 text-[#6552FF] dark:text-indigo-300 font-bold">
                    {currentLanguageOption.nativeName}
                  </span>
                </div>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                  {currentLanguageOption.name} ({currentLanguageOption.localeTag})
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-[#6552FF] dark:text-indigo-300 font-bold">
                {t('btn.edit', undefined, 'Edit')}
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t('settings.security_section', undefined, 'Security')}
        </h2>

        <div className="rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 overflow-hidden shadow-xs">
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                  {t('settings.change_password', undefined, 'Change Password')}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                  {t('settings.change_password_desc', undefined, 'Send reset link to your email')}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* Trust & Legal */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t('settings.trust_legal_section', undefined, 'Trust & Legal')}
        </h2>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-700/60 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 overflow-hidden shadow-xs">
          {/* Never moves money reassurance row */}
          <div className="p-4 space-y-1">
            <div className="flex items-center gap-2 text-xs font-bold text-neutral-900 dark:text-white">
              <Shield className="w-4 h-4 text-[#6552FF] dark:text-indigo-400" />
              <span>{t('settings.never_moves_money', undefined, 'Balanzo never moves money')}</span>
            </div>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed font-medium">
              {t('settings.never_moves_money_desc', undefined, 'Balanzo is an expense tracking and relationship management system. It does not hold, transfer, or process real funds. All payments occur externally.')}
            </p>
          </div>

          <div className="p-4 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-900 dark:text-white">
              {t('settings.privacy_terms', undefined, 'Privacy Policy & Terms')}
            </span>
            <ExternalLink className="w-4 h-4 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Session Actions */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {t('settings.session_section', undefined, 'Session')}
        </h2>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-700/60 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 overflow-hidden shadow-xs">
          <button
            onClick={() => {}}
            className="w-full p-4 flex items-center justify-between hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors text-left"
          >
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              {t('settings.log_out', undefined, 'Log out')}
            </span>
            <LogOut className="w-4 h-4 text-neutral-400" />
          </button>

          <button
            onClick={() => {}}
            className="w-full p-4 flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left text-red-600 dark:text-red-400"
          >
            <span className="text-xs font-bold">
              {t('settings.log_out_all', undefined, 'Log out of all devices')}
            </span>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {t('settings.change_password', undefined, 'Change Password')}
              </h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
                {t('settings.reset_link_intro', undefined, "We'll send a link to")} <strong className="text-neutral-900 dark:text-white">{CURRENT_USER.email}</strong> {t('settings.reset_link_outro', undefined, "to set a new password.")}
              </p>

              {passwordLinkSent ? (
                <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>{t('settings.reset_sent_success', undefined, 'Password reset link sent to your email!')}</span>
                </div>
              ) : (
                <button
                  onClick={handleSendResetLink}
                  className="w-full py-3 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] text-white text-xs font-bold shadow-md active:scale-95 transition-all"
                >
                  {t('settings.send_reset_link', undefined, 'Send Reset Link')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
