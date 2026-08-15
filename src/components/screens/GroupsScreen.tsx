import React, { useState } from 'react';
import { Plus, Compass, Home, Sparkles, ChevronRight, Users } from 'lucide-react';
import { Group } from '../../types';
import { AvatarStack } from '../common/AvatarStack';
import { useLanguage } from '../../i18n/LanguageContext';

interface GroupsScreenProps {
  groups: Group[];
  onSelectGroup: (groupId: string) => void;
  onCreateGroup: () => void;
}

export const GroupsScreen: React.FC<GroupsScreenProps> = ({
  groups,
  onSelectGroup,
  onCreateGroup,
}) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'trip' | 'home'>('all');

  const filteredGroups = groups.filter((g) => {
    if (filter === 'all') return true;
    return g.type === filter;
  });

  return (
    <div className="space-y-4 px-4 pb-20 pt-1 animate-in fade-in duration-300">
      {/* Header title & Create action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            {t('groups.title', undefined, 'Groups')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {groups.length} {t('groups.active_circles', undefined, 'active circles')}
          </p>
        </div>
        <button
          onClick={onCreateGroup}
          id="btn-create-group"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6552FF] text-white text-xs font-bold shadow-sm shadow-[#6552FF]/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{t('groups.create_group', undefined, 'New Group')}</span>
        </button>
      </div>

      {/* Segmented Filter Control */}
      <div className="flex p-1 rounded-2xl bg-neutral-200/70 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
          }`}
        >
          {t('groups.filter_all', undefined, 'All')} ({groups.length})
        </button>
        <button
          onClick={() => setFilter('trip')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filter === 'trip'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
          }`}
        >
          {t('groups.filter_trips', undefined, 'Trips')} ({groups.filter((g) => g.type === 'trip').length})
        </button>
        <button
          onClick={() => setFilter('home')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filter === 'home'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
          }`}
        >
          {t('groups.filter_home', undefined, 'Home & Shared')}
        </button>
      </div>

      {/* Groups List */}
      <div className="space-y-3.5">
        {filteredGroups.map((group) => {
          const isTrip = group.type === 'trip';
          const isPositive = (group.yourBalance || 0) >= 0;

          if (isTrip) {
            // Flagship Trip Card visual
            return (
              <div
                key={group.id}
                onClick={() => onSelectGroup(group.id)}
                className="relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all cursor-pointer group shadow-sm"
              >
                <div className="relative h-32 w-full overflow-hidden bg-neutral-900">
                  {group.coverImage ? (
                    <img
                      src={group.coverImage}
                      alt={group.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div
                      className="w-full h-full opacity-90"
                      style={{ background: group.coverGradient || '#6552FF' }}
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                  
                  {/* Destination & Inferred date range pill */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-[11px] font-semibold text-white border border-white/10 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-[#FF8A3D]" />
                      {group.inferredDestination}
                    </span>
                    <span className="text-[11px] text-white/90 font-medium px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm">
                      {group.inferredDateRange}
                    </span>
                  </div>

                  {/* Group Name & spending */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
                      {group.name}
                    </h3>
                    <p className="text-xs text-white/80">
                      ${group.totalExpenses?.toFixed(2)} {t('groups.total_spent', undefined, 'total expenses')}
                    </p>
                  </div>
                </div>

                <div className="p-3.5 flex items-center justify-between bg-white dark:bg-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <AvatarStack members={group.members} size="xs" max={4} />
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                      {group.members.length} {t('groups.members_count', undefined, 'members')}
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] text-neutral-400 font-medium">
                      {isPositive ? t('home.you_are_owed', undefined, 'You are owed') : t('home.you_owe', undefined, 'You owe')}
                    </div>
                    <div
                      className={`text-sm font-extrabold tabular-nums ${
                        isPositive
                          ? 'text-[#16A34A] dark:text-emerald-400'
                          : 'text-[#9C5317] dark:text-amber-400'
                      }`}
                    >
                      {isPositive ? '+' : ''}${Math.abs(group.yourBalance || 0).toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Compact Group Row for non-trips (Home, Flat, Roommates)
          return (
            <div
              key={group.id}
              onClick={() => onSelectGroup(group.id)}
              className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 hover:border-neutral-300 dark:hover:border-neutral-600 flex items-center justify-between cursor-pointer group shadow-sm transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-[#6552FF] flex items-center justify-center font-bold">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                    {group.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <AvatarStack members={group.members} size="xs" max={3} />
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      ${group.totalExpenses?.toFixed(2)} {t('groups.total_spent', undefined, 'total')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-400 font-medium block">
                    {t('activity.filter_all', undefined, 'Status')}
                  </span>
                  <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                    {t('settlement.settled_up', undefined, 'All settled')}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-[#6552FF] flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
              {t('groups.no_groups', undefined, 'No groups in this filter')}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
              {t('groups.no_groups_desc', undefined, 'Start your first group and make shared expenses effortless.')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
