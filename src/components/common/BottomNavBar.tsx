import React from 'react';
import { LayoutGrid, Layers, Plus, Contact, UserCircle2 } from 'lucide-react';
import { ActiveTab, WorkspaceType } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenAddExpense: () => void;
  workspace: WorkspaceType;
  unreadNotifications?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onTabChange,
  onOpenAddExpense,
  workspace,
}) => {
  const { t } = useLanguage();

  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 pointer-events-auto px-3 pb-3 pt-1 bg-gradient-to-t from-neutral-100 via-neutral-100/95 to-transparent dark:from-neutral-900 dark:via-neutral-900/95">
      <nav
        aria-label="Bottom Navigation"
        className="flex items-center justify-around h-16 bg-white/95 dark:bg-neutral-800/95 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-700/60 rounded-3xl px-2 shadow-lg shadow-neutral-900/5 dark:shadow-black/25"
      >
        {/* Tab 1: Home */}
        <button
          type="button"
          onClick={() => onTabChange('home')}
          id="nav-tab-home"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all active:scale-95 cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#6552FF] dark:text-indigo-400 font-bold'
              : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
          aria-label="Home tab"
        >
          <LayoutGrid className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight font-medium">{t('nav.home', undefined, 'Home')}</span>
        </button>

        {/* Tab 2: Groups */}
        <button
          type="button"
          onClick={() => onTabChange('groups')}
          id="nav-tab-groups"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all active:scale-95 cursor-pointer ${
            activeTab === 'groups'
              ? 'text-[#6552FF] dark:text-indigo-400 font-bold'
              : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
          aria-label="Groups tab"
        >
          <Layers className={`w-5 h-5 transition-transform ${activeTab === 'groups' ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight font-medium">{t('nav.groups', undefined, 'Groups')}</span>
        </button>

        {/* Center: Redesigned Add Expense Action Button */}
        <div className="relative -top-3 flex items-center justify-center px-1">
          <button
            type="button"
            onClick={onOpenAddExpense}
            id="nav-btn-add-expense"
            className="group relative flex items-center justify-center w-13 h-13 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 shadow-lg shadow-neutral-900/30 dark:shadow-white/20 active:scale-90 hover:scale-105 transition-all focus:outline-none ring-4 ring-white dark:ring-neutral-900 cursor-pointer"
            aria-label="Add new expense"
            title={t('nav.add_expense', undefined, 'Add Expense')}
          >
            <Plus className="w-6 h-6 stroke-[2.5] group-hover:rotate-90 transition-transform duration-200" />
          </button>
        </div>

        {/* Tab 3: Friends */}
        <button
          type="button"
          onClick={() => onTabChange('friends')}
          id="nav-tab-friends"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all active:scale-95 cursor-pointer ${
            activeTab === 'friends'
              ? 'text-[#6552FF] dark:text-indigo-400 font-bold'
              : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
          aria-label="Friends tab"
        >
          <Contact className={`w-5 h-5 transition-transform ${activeTab === 'friends' ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight font-medium">{t('nav.friends', undefined, 'Friends')}</span>
        </button>

        {/* Tab 4: Profile */}
        <button
          type="button"
          onClick={() => onTabChange('profile')}
          id="nav-tab-profile"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all active:scale-95 cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#6552FF] dark:text-indigo-400 font-bold'
              : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
          aria-label="Profile tab"
        >
          <UserCircle2 className={`w-5 h-5 transition-transform ${activeTab === 'profile' ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight font-medium">{t('nav.profile', undefined, 'Profile')}</span>
        </button>
      </nav>
    </div>
  );
};
