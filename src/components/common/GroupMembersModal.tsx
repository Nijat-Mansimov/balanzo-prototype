import React, { useState } from 'react';
import { X, Search, Users, Shield, UserPlus, Mail, Check, DollarSign } from 'lucide-react';
import { Group, Member, Friend } from '../../types';
import { Avatar } from './Avatar';
import { useLanguage } from '../../i18n/LanguageContext';

interface GroupMembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: Group;
  friends: Friend[];
  onAddMemberToGroup: (groupId: string, member: Member) => void;
}

export const GroupMembersModal: React.FC<GroupMembersModalProps> = ({
  isOpen,
  onClose,
  group,
  friends,
  onAddMemberToGroup,
}) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [isInviteMode, setIsInviteMode] = useState(false);
  const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([]);
  const [addedSuccess, setAddedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentMemberIds = new Set(group.members.map((m) => m.id));

  // Filter current group members
  const filteredMembers = group.members.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Available friends not in this group yet
  const availableFriends = friends.filter((f) => !currentMemberIds.has(f.id));
  const filteredAvailableFriends = availableFriends.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSelectedFriends = () => {
    selectedFriendIds.forEach((id) => {
      const friend = friends.find((f) => f.id === id);
      if (friend) {
        onAddMemberToGroup(group.id, {
          id: friend.id,
          name: friend.name,
          email: friend.email,
          avatarUrl: friend.avatarUrl,
          initials: friend.initials,
          role: 'member',
        });
      }
    });
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
      setIsInviteMode(false);
      setSelectedFriendIds([]);
    }, 800);
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs overscroll-contain animate-in fade-in duration-200 pointer-events-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 max-h-[90%] flex flex-col overscroll-contain animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#6552FF]/10 text-[#6552FF] dark:text-indigo-300 flex items-center justify-center">
              <Users className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                {isInviteMode ? 'Add Members to Group' : `${group.name} Members`}
              </h2>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {group.members.length} active participants
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {!isInviteMode && (
              <button
                onClick={() => {
                  setIsInviteMode(true);
                  setSearchQuery('');
                }}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center transition-all active:scale-95"
                title="Invite Member"
              >
                <UserPlus className="w-4 h-4 stroke-[2]" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors active:scale-95"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search Filter Bar */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isInviteMode ? "Search friends to add..." : "Search members by name or email..."}
            className="w-full pl-9 pr-8 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-700/80 border border-neutral-200/80 dark:border-neutral-600 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Member List */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-2 max-h-[50vh] pr-0.5">
          {!isInviteMode ? (
            // Current Members View
            filteredMembers.length > 0 ? (
              filteredMembers.map((member) => {
                const isYou = member.id === 'user-nijat';
                return (
                  <div
                    key={member.id}
                    className="p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-750/70 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-700 flex items-center justify-between hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={member.name}
                        initials={member.initials}
                        imageUrl={member.avatarUrl}
                        size="md"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white">
                            {member.name}
                          </span>
                          {isYou && (
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-[#6552FF]/10 text-[#6552FF] dark:text-indigo-300">
                              You
                            </span>
                          )}
                          {member.role === 'admin' && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              <Shield className="w-2.5 h-2.5 stroke-[2.5]" />
                              Admin
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                          {member.email}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200/60 dark:border-emerald-900/40">
                        Active
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center text-xs text-neutral-400">
                No members match "{searchQuery}"
              </div>
            )
          ) : (
            // Invite Available Friends View
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-500 mb-2 px-1">
                <span>Select from friends ({filteredAvailableFriends.length})</span>
                {selectedFriendIds.length > 0 && (
                  <span className="text-[#6552FF] dark:text-indigo-400">
                    {selectedFriendIds.length} selected
                  </span>
                )}
              </div>

              {filteredAvailableFriends.length > 0 ? (
                filteredAvailableFriends.map((friend) => {
                  const isSelected = selectedFriendIds.includes(friend.id);
                  return (
                    <button
                      key={friend.id}
                      type="button"
                      onClick={() => {
                        setSelectedFriendIds((prev) =>
                          isSelected ? prev.filter((id) => id !== friend.id) : [...prev, friend.id]
                        );
                      }}
                      className={`w-full mb-1.5 p-3 rounded-2xl border flex items-center justify-between transition-all text-left ${
                        isSelected
                          ? 'border-[#6552FF] bg-[#6552FF]/5 dark:bg-[#6552FF]/15 text-neutral-900 dark:text-white'
                          : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-700/50 hover:bg-neutral-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={friend.name}
                          initials={friend.initials}
                          imageUrl={friend.avatarUrl}
                          size="md"
                        />
                        <div>
                          <p className="text-xs font-bold text-neutral-900 dark:text-white">
                            {friend.name}
                          </p>
                          <p className="text-[11px] text-neutral-400">{friend.email}</p>
                        </div>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
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
                <div className="py-8 text-center text-xs text-neutral-400">
                  {friends.length === 0
                    ? 'No friends available to add'
                    : 'All your friends are already in this group!'}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-700 mt-2">
          {isInviteMode ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsInviteMode(false);
                  setSelectedFriendIds([]);
                }}
                className="flex-1 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-700 text-xs font-bold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200"
              >
                Back to Members
              </button>
              <button
                type="button"
                disabled={selectedFriendIds.length === 0 || addedSuccess}
                onClick={handleAddSelectedFriends}
                className="flex-1 py-2.5 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-[#6552FF]/25 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                {addedSuccess ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 stroke-[2]" />
                    <span>Add {selectedFriendIds.length} Members</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsInviteMode(true);
                setSearchQuery('');
              }}
              className="w-full py-2.5 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] text-white text-xs font-bold shadow-md shadow-[#6552FF]/25 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4 stroke-[2]" />
              <span>Add New Member to Group</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
