import React from 'react';
import { ArrowLeft, Bell, Check, Building2, Compass, Receipt, Zap, UserPlus } from 'lucide-react';
import { AppNotification, WorkspaceType } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';

interface NotificationsScreenProps {
  notifications: AppNotification[];
  onBack: () => void;
  onSelectNotification: (notif: AppNotification) => void;
  onMarkAllRead: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  onBack,
  onSelectNotification,
  onMarkAllRead,
}) => {
  const { t } = useLanguage();

  const getIcon = (type: string) => {
    switch (type) {
      case 'expense_added':
        return <Receipt className="w-4 h-4 text-[#6552FF]" />;
      case 'settlement_recorded':
        return <Zap className="w-4 h-4 text-emerald-600" />;
      case 'friend_request':
        return <UserPlus className="w-4 h-4 text-amber-500" />;
      default:
        return <Bell className="w-4 h-4 text-neutral-500" />;
    }
  };

  return (
    <div className="space-y-4 px-4 pb-24 pt-1 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {t('notifications.title', undefined, 'Notifications')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {t('notifications.subtitle', undefined, 'Global updates across all workspaces')}
          </p>
        </div>
        <button
          onClick={onMarkAllRead}
          className="text-xs font-bold text-[#6552FF] hover:underline"
        >
          {t('notifications.mark_all_read', undefined, 'Mark all read')}
        </button>
      </div>

      <div className="space-y-2.5">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            {t('notifications.no_notifications', undefined, 'No new notifications')}
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => onSelectNotification(notif)}
              className={`p-3.5 rounded-3xl border transition-all cursor-pointer shadow-sm ${
                !notif.isRead
                  ? 'bg-white dark:bg-neutral-800 border-[#6552FF]/30 dark:border-[#6552FF]/40 ring-1 ring-[#6552FF]/10'
                  : 'bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200/80 dark:border-neutral-700/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-2xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {notif.title}
                    </h3>
                    <span className="text-[10px] text-neutral-400">
                      {notif.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5 leading-snug">
                    {notif.body}
                  </p>

                  {/* Organization or Group context badge */}
                  {notif.workspaceContext === 'organization' && (
                    <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <Building2 className="w-3 h-3" />
                      <span>{notif.organizationName || 'Nomad Collective'}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
