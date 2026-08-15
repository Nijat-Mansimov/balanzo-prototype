import React from 'react';
import { Bell, ChevronDown, ArrowLeft, ShieldCheck } from 'lucide-react';
import { WorkspaceType, ScreenView } from '../../types';
import { Avatar } from './Avatar';
import { CURRENT_USER } from '../../data/mockData';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  workspace: WorkspaceType;
  onOpenWorkspaceSwitcher: () => void;
  onOpenNotifications: () => void;
  unreadCount?: number;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  workspace,
  onOpenWorkspaceSwitcher,
  onOpenNotifications,
  unreadCount = 2,
  rightAction,
}) => {
  return (
    <header className="sticky top-0 z-30 pt-2 pb-3 px-4 bg-neutral-100/90 dark:bg-neutral-900/90 backdrop-blur-md transition-colors">
      <div className="flex items-center justify-between min-h-[44px]">
        {showBack ? (
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              id="btn-header-back"
              className="p-2 -ml-2 rounded-full hover:bg-neutral-200/70 dark:hover:bg-neutral-800 transition-colors active:scale-95 text-neutral-800 dark:text-neutral-100"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.2]" />
            </button>
            {title && (
              <div>
                <h1 className="text-lg font-bold text-neutral-900 dark:text-white leading-tight tracking-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    {subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Avatar
              src={CURRENT_USER.avatarUrl}
              name={CURRENT_USER.name}
              initials={CURRENT_USER.initials}
              size="sm"
            />
            <div>
              <button
                onClick={onOpenWorkspaceSwitcher}
                id="btn-workspace-switcher"
                className="flex items-center gap-1.5 px-2 py-0.5 -ml-1 rounded-full hover:bg-neutral-200/60 dark:hover:bg-neutral-800 text-left transition-colors group"
                aria-label="Switch workspace"
              >
                <span className="text-xs font-semibold text-neutral-900 dark:text-white flex items-center gap-1">
                  {workspace === 'personal' ? (
                    'Personal'
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Nomad Collective B2B
                    </>
                  )}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-transform group-active:translate-y-0.5" />
              </button>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium leading-none px-1">
                {CURRENT_USER.name.split(' ')[0]}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          {rightAction ? (
            rightAction
          ) : (
            <button
              onClick={onOpenNotifications}
              id="btn-header-notifications"
              className="relative p-2.5 rounded-full hover:bg-neutral-200/70 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition-colors active:scale-95"
              aria-label="Open notifications"
            >
              <Bell className="w-5 h-5 stroke-[2]" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#6552FF] ring-2 ring-white dark:ring-neutral-900 animate-pulse" />
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
