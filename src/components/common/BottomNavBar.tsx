import React from 'react';
import { Home, Users, Plus, UserCheck, User, Compass } from 'lucide-react';
import { ActiveTab, WorkspaceType } from '../../types';

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
  return (
    <div className="sticky bottom-0 left-0 right-0 z-30 pointer-events-auto px-4 pb-4 pt-1 bg-gradient-to-t from-neutral-100 via-neutral-100/95 to-transparent dark:from-neutral-900 dark:via-neutral-900/95">
      <nav
        aria-label="Bottom Navigation"
        className="flex items-center justify-around h-16 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-700/60 rounded-3xl px-3 shadow-lg shadow-neutral-900/5 dark:shadow-black/20"
      >
        {/* Tab 1: Home */}
        <button
          onClick={() => onTabChange('home')}
          id="nav-tab-home"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all active:scale-95 ${
            activeTab === 'home'
              ? 'text-[#6552FF] font-semibold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
          aria-label="Home tab"
        >
          <Home className={`w-5 h-5 transition-transform ${activeTab === 'home' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Home</span>
        </button>

        {/* Tab 2: Groups */}
        <button
          onClick={() => onTabChange('groups')}
          id="nav-tab-groups"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all active:scale-95 ${
            activeTab === 'groups'
              ? 'text-[#6552FF] font-semibold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
          aria-label="Groups tab"
        >
          <Users className={`w-5 h-5 transition-transform ${activeTab === 'groups' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Groups</span>
        </button>

        {/* Center: Add Expense Action */}
        <div className="relative -top-2 flex items-center justify-center px-1">
          <button
            onClick={onOpenAddExpense}
            id="nav-btn-add-expense"
            className="flex items-center justify-center w-12 h-12 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] text-white shadow-md shadow-[#6552FF]/40 active:scale-90 transition-all focus:outline-none focus:ring-2 focus:ring-[#6552FF]/50"
            aria-label="Add new expense"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>

        {/* Tab 4: Friends (or Members) */}
        <button
          onClick={() => onTabChange('friends')}
          id="nav-tab-friends"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all active:scale-95 ${
            activeTab === 'friends'
              ? 'text-[#6552FF] font-semibold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
          aria-label="Friends tab"
        >
          <UserCheck className={`w-5 h-5 transition-transform ${activeTab === 'friends' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Friends</span>
        </button>

        {/* Tab 5: Profile */}
        <button
          onClick={() => onTabChange('profile')}
          id="nav-tab-profile"
          className={`flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all active:scale-95 ${
            activeTab === 'profile'
              ? 'text-[#6552FF] font-semibold'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
          aria-label="Profile tab"
        >
          <User className={`w-5 h-5 transition-transform ${activeTab === 'profile' ? 'scale-110 stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Profile</span>
        </button>
      </nav>
    </div>
  );
};
