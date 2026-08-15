import React, { useState } from 'react';
import { X, Plus, Compass, Home, Calendar, Users, Sparkles, Check } from 'lucide-react';
import { Group, Member } from '../../types';
import { CURRENT_USER, MOCK_MEMBERS } from '../../data/mockData';
import { Avatar } from './Avatar';

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
  const [name, setName] = useState('');
  const [type, setType] = useState<'trip' | 'home' | 'couple' | 'other'>('trip');
  const [currency, setCurrency] = useState('USD');
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([
    'user-nijat',
    'user-arif',
    'user-leyla',
  ]);

  if (!isOpen) return null;

  const handleToggleMember = (id: string) => {
    if (id === 'user-nijat') return; // Creator must stay
    if (selectedMemberIds.includes(id)) {
      setSelectedMemberIds(selectedMemberIds.filter((mId) => mId !== id));
    } else {
      setSelectedMemberIds([...selectedMemberIds, id]);
    }
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
    <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 max-h-[90%] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
          <h2 className="text-base font-bold text-neutral-900 dark:text-white">
            Create New Group
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="mt-4 space-y-4">
          {/* Group Name */}
          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
              Group Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Barcelona 2026, Lake House"
              required
              className="w-full p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
            />
          </div>

          {/* Group Type */}
          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
              Group Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'trip', label: 'Trip & Travel', icon: Compass },
                { id: 'home', label: 'Home & Flat', icon: Home },
                { id: 'other', label: 'Event / Other', icon: Calendar },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id as any)}
                    className={`p-2.5 rounded-2xl border flex items-center gap-2 text-xs font-semibold transition-all ${
                      type === t.id
                        ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/10 text-[#6552FF] dark:text-white'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Members Selection */}
          <div>
            <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
              Select Initial Members ({selectedMemberIds.length})
            </label>
            <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
              {Object.values(MOCK_MEMBERS).map((m) => {
                const isSelected = selectedMemberIds.includes(m.id);
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleToggleMember(m.id)}
                    className={`w-full p-2 rounded-xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#6552FF] bg-[#6552FF]/5 text-neutral-900 dark:text-white'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Avatar
                        src={m.avatarUrl}
                        name={m.name}
                        initials={m.initials}
                        size="xs"
                      />
                      <span className="text-xs font-semibold">{m.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#6552FF]" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] text-white text-xs font-bold shadow-lg shadow-[#6552FF]/30 active:scale-95 transition-all"
            >
              Create Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
