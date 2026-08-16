import React, { useState } from 'react';
import { Plus, Compass, Building2, ChevronRight, Users, Search, X } from 'lucide-react';
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
  const [searchQuery, setSearchQuery] = useState('');

  const filteredGroups = groups.filter((g) => {
    const matchesFilter = filter === 'all' || g.type === filter;
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.inferredDestination && g.inferredDestination.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4 px-4 pb-20 pt-1 animate-in fade-in duration-300">
      {/* Header title & Modern Minimal Create Group Action */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
            {t('groups.title', undefined, 'Groups')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {groups.length} {t('groups.active_circles', undefined, 'active circles')}
          </p>
        </div>

        <button
          onClick={onCreateGroup}
          id="btn-create-group"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-xs active:scale-95 transition-all cursor-pointer"
          aria-label={t('groups.create_group', undefined, 'Create New Group')}
          title={t('groups.create_group', undefined, 'Create New Group')}
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>{t('groups.create_group', undefined, 'New Group')}</span>
        </button>
      </div>

      {/* Search Filter for Groups */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search groups or destinations..."
          className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 text-xs font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30 shadow-xs"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Segmented Filter Control */}
      <div className="flex p-1 rounded-2xl bg-neutral-200/70 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700">
        <button
          onClick={() => setFilter('all')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filter === 'all'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          {t('groups.filter_all', undefined, 'All')} ({groups.length})
        </button>
        <button
          onClick={() => setFilter('trip')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filter === 'trip'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          {t('groups.filter_trips', undefined, 'Trips')} ({groups.filter((g) => g.type === 'trip').length})
        </button>
        <button
          onClick={() => setFilter('home')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            filter === 'home'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-xs'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
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
                className="relative overflow-hidden rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all cursor-pointer group shadow-xs"
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
                      <Compass className="w-3.5 h-3.5 text-neutral-200 stroke-[2]" />
                      {group.inferredDestination}
                    </span>
                    <span className="text-[11px] text-white/90 font-medium px-2 py-0.5 rounded-md bg-black/40 backdrop-blur-sm">
                      {group.inferredDateRange}
                    </span>
                  </div>

                  {/* Group Name & spending */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-lg font-black text-white tracking-tight leading-tight">
                      {group.name}
                    </h3>
                    <p className="text-xs text-white/80 font-medium">
                      ${(group.totalExpenses || 0).toFixed(2)} {t('groups.total_spent', undefined, 'total expenses')}
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
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                      {isPositive ? t('home.you_are_owed', undefined, 'You are owed') : t('home.you_owe', undefined, 'You owe')}
                    </div>
                    <div
                      className={`text-sm font-black tabular-nums ${
                        isPositive
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
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
              className="p-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 flex items-center justify-between cursor-pointer group shadow-xs transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                    {group.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <AvatarStack members={group.members} size="xs" max={3} />
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                      ${(group.totalExpenses || 0).toFixed(2)} {t('groups.total_spent', undefined, 'total')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="text-right">
                  <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium block">
                    {t('activity.filter_all', undefined, 'Status')}
                  </span>
                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    {t('settlement.settled_up', undefined, 'All settled')}
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          );
        })}

        {filteredGroups.length === 0 && (
          <div className="text-center py-12 px-4 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 stroke-[2]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                {t('groups.no_groups', undefined, 'No groups found')}
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-xs mx-auto">
                {t('groups.no_groups_desc', undefined, 'Start your first group and make shared expenses effortless.')}
              </p>
            </div>
            <button
              onClick={onCreateGroup}
              id="btn-create-first-group"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-950 text-xs font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>{t('groups.create_group', undefined, 'Create Group')}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

