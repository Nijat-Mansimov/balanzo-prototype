import React, { useState } from 'react';
import { Globe, Check, X, Search, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { LanguageCode } from '../../i18n/translations';

interface LanguageSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLanguage?: (code: LanguageCode) => void;
}

export const LanguageSwitcherModal: React.FC<LanguageSwitcherModalProps> = ({
  isOpen,
  onClose,
  onSelectLanguage,
}) => {
  const { language, setLanguage, languages, t } = useLanguage();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredLanguages = languages.filter(
    (lang) =>
      lang.name.toLowerCase().includes(search.toLowerCase()) ||
      lang.nativeName.toLowerCase().includes(search.toLowerCase()) ||
      lang.code.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (code: LanguageCode) => {
    setLanguage(code);
    if (onSelectLanguage) {
      onSelectLanguage(code);
    }
    setTimeout(() => {
      onClose();
    }, 150);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-h-[85%] bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 flex flex-col animate-in slide-in-from-bottom-5 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-[#6552FF] flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {t('profile.select_language', undefined, 'Select Language')}
              </h3>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                {t('settings.language_section', undefined, 'Language & Internationalization')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-700"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="my-3 relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('btn.search', undefined, 'Search') + '...'}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
          />
        </div>

        {/* Languages List */}
        <div className="flex-1 overflow-y-auto space-y-1.5 no-scrollbar pr-0.5">
          {filteredLanguages.map((lang) => {
            const isSelected = lang.code === language;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                id={`btn-lang-${lang.code}`}
                className={`w-full p-3 rounded-2xl flex items-center justify-between border transition-all text-left ${
                  isSelected
                    ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/15 ring-1 ring-[#6552FF]/30'
                    : 'border-neutral-200/80 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl leading-none">{lang.flag}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-neutral-900 dark:text-white">
                        {lang.nativeName}
                      </span>
                      {isSelected && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#6552FF] text-white font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {lang.name} • {lang.localeTag}
                    </span>
                  </div>
                </div>

                {isSelected ? (
                  <div className="w-6 h-6 rounded-full bg-[#6552FF] text-white flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full border border-neutral-300 dark:border-neutral-600" />
                )}
              </button>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-700/60 flex items-center justify-between text-[11px] text-neutral-500">
          <div className="flex items-center gap-1.5 text-neutral-400">
            <Sparkles className="w-3.5 h-3.5 text-[#6552FF]" />
            <span>Instant sync across all screens</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
          >
            {t('btn.done', undefined, 'Done')}
          </button>
        </div>
      </div>
    </div>
  );
};
