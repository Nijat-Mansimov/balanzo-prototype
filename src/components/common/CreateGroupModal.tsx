import React, { useState } from 'react';
import { X, Plus, Compass, Building2, Sparkle, Check, Search } from 'lucide-react';
import { Group, Member } from '../../types';
import { MOCK_MEMBERS } from '../../data/mockData';
import { Avatar } from './Avatar';
import { useLanguage } from '../../i18n/LanguageContext';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated: (newGroup: Group) => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onGroupCreated,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [type, setType] = useState<'trip' | 'home' | 'couple' | 'other'>('trip');
  const [currency, setCurrency] = useState('USD');
  const [memberSearch, setMemberSearch] = useState('');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([
    'user-nijat',
    'user-arif',
    'user-leyla',
  ]);

  if (!isOpen) return null;

  const allMembersList = Object.values(MOCK_MEMBERS);
  const filteredMembers = allMembersList.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearch.toLowerCase())
  );

  const handleToggleMember = (id: string) => {
    if (id === 'user-nijat') return; // Creator must stay
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter((mId) => mId !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
  };

  const handleSelectAll = () => {
    const allIds = allMembersList.map((m) => m.id);
    setSelectedMemberIds(allIds);
  };

  const handleClearAll = () => {
    setSelectedMemberIds(['user-nijat']);
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const groupMembers: Member[] = selectedMemberIds.map(
      (id) => MOCK_MEMBERS[id] || { id, name: 'Friend', email: '', initials: 'F' }
    );

    const gradients = [
      'linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)',
      'linear-gradient(135deg, #0EA5E9 0%, #2DD4BF 50%, #10B981 100%)',
      'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    ];

    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name,
      type,
      currency,
      createdAt: new Date().toISOString(),
      inferredDestination: type === 'trip' ? 'Trip Destination' : undefined,
      inferredDateRange: type === 'trip' ? 'Upcoming' : 'Ongoing',
      coverGradient: gradients[Math.floor(Math.random() * gradients.length)],
      totalExpenses: 0,
      yourBalance: 0,
      members: groupMembers,
    };

    onGroupCreated(newGroup);
    onClose();
  };

  return (
    <div 
      className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs overscroll-contain animate-in fade-in duration-200 pointer-events-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="w-full bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 max-h-[88%] overflow-y-auto overscroll-contain animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            {t('groups.create_group', undefined, 'Create New Group')}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors active:scale-95"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="mt-4 space-y-4">
          {/* Group Name */}
          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
              {t('groups.modal_name_label', undefined, 'Group Name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('groups.modal_name_placeholder', undefined, 'e.g. Barcelona 2026, Lake House')}
              required
              className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
            />
          </div>

          {/* Group Type */}
          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
              {t('groups.modal_type_label', undefined, 'Group Type')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'trip', label: t('groups.type_trip', undefined, 'Trip'), icon: Compass },
                { id: 'home', label: t('groups.type_home', undefined, 'Home'), icon: Building2 },
                { id: 'other', label: t('groups.type_other', undefined, 'Other'), icon: Sparkle },
              ].map((tItem) => {
                const Icon = tItem.icon;
                return (
                  <button
                    key={tItem.id}
                    type="button"
                    onClick={() => setType(tItem.id as any)}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                      type === tItem.id
                        ? 'border-[#6552FF] bg-[#6552FF]/10 text-[#6552FF] dark:text-indigo-300 shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2]" />
                    <span className="text-[11px] font-medium">{tItem.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Members Selection with Real-Time Search */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                {t('groups.modal_members_label', undefined, 'Select Friends / Members')} ({selectedMemberIds.length})
              </label>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="font-bold text-[#6552FF] dark:text-indigo-400 hover:underline"
                >
                  Select All
                </button>
                <span className="text-neutral-300 dark:text-neutral-600">|</span>
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Member Search Bar */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-400" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="Filter friends by name..."
                className="w-full pl-8 pr-7 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 border border-neutral-200/80 dark:border-neutral-600 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#6552FF]"
              />
              {memberSearch && (
                <button
                  type="button"
                  onClick={() => setMemberSearch('')}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar pr-0.5">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((m) => {
                  const isSelected = selectedMemberIds.includes(m.id);
                  const isYou = m.id === 'user-nijat';
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleToggleMember(m.id)}
                      className={`w-full p-2.5 rounded-xl border flex items-center justify-between transition-all ${
                        isSelected
                          ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/15 text-neutral-900 dark:text-white shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-700/40 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          imageUrl={m.avatarUrl}
                          name={m.name}
                          initials={m.initials}
                          size="xs"
                        />
                        <div className="text-left">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white block">
                            {m.name} {isYou && <span className="text-[10px] text-neutral-400 font-normal">(You)</span>}
                          </span>
                          <span className="text-[10px] text-neutral-400">{m.email}</span>
                        </div>
                      </div>
                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-[#6552FF] border-[#6552FF] text-white'
                            : 'border-neutral-300 dark:border-neutral-600'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="py-4 text-center text-xs text-neutral-400">
                  No friends found matching "{memberSearch}"
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] text-white text-xs font-bold shadow-md shadow-[#6552FF]/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>{t('groups.create_btn', undefined, 'Create Group')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

