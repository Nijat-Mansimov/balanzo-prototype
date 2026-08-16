import React, { useState } from 'react';
import { UserPlus, Search, Mail, Shield, Check, X, ChevronRight, ArrowRightLeft, DollarSign } from 'lucide-react';
import { Friend } from '../../types';
import { Avatar } from '../common/Avatar';
import { useLanguage } from '../../i18n/LanguageContext';

interface FriendsScreenProps {
  friends: Friend[];
  onAddFriendEmail: (email: string) => void;
  onSettleFriend: (friendId: string) => void;
}

export const FriendsScreen: React.FC<FriendsScreenProps> = ({
  friends,
  onAddFriendEmail,
  onSettleFriend,
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'blocked'>('friends');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const activeFriends = friends.filter((f) => f.status === 'active');
  const pendingRequests = friends.filter((f) => f.status !== 'active');

  const filteredActiveFriends = activeFriends.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !inviteEmail.includes('@')) return;
    onAddFriendEmail(inviteEmail);
    setInviteSent(true);
    setTimeout(() => {
      setInviteSent(false);
      setIsAddModalOpen(false);
      setInviteEmail('');
    }, 1200);
  };

  return (
    <div className="space-y-4 px-4 pb-24 pt-1 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
            {t('friends.title', undefined, 'Friends')}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
            {activeFriends.length} {t('friends.connected_friends', undefined, 'connected friends')}
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          id="btn-add-friend"
          className="w-10 h-10 -mr-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center active:scale-90 transition-all"
          aria-label={t('friends.add_friend', undefined, 'Add Friend')}
          title={t('friends.add_friend', undefined, 'Add Friend')}
        >
          <UserPlus className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 rounded-2xl bg-neutral-200/70 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'friends'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          {t('friends.tab_friends', undefined, 'Friends')} ({activeFriends.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'requests'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          {t('friends.tab_requests', undefined, 'Requests')} ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('blocked')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'blocked'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
          }`}
        >
          {t('friends.tab_blocked', undefined, 'Blocked')}
        </button>
      </div>

      {/* Search Filter for Friends */}
      {activeTab === 'friends' && (
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends by name or email..."
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
      )}

      {/* Main Tab Content */}
      {activeTab === 'friends' && (
        <div className="space-y-2.5">
          {filteredActiveFriends.length > 0 ? (
            filteredActiveFriends.map((friend) => {
              const owesYou = friend.balanceWithYou > 0;
              const youOwe = friend.balanceWithYou < 0;

              return (
                <div
                  key={friend.id}
                  className="p-3.5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 flex items-center justify-between shadow-xs hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar
                      imageUrl={friend.avatarUrl}
                      name={friend.name}
                      initials={friend.initials}
                      size="md"
                    />
                    <div>
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                        {friend.name}
                      </h3>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                        {friend.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <div className="text-right">
                      {owesYou ? (
                        <>
                          <div className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                            +${(friend.balanceWithYou || 0).toFixed(2)}
                          </div>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                            {t('friends.owes_you', undefined, 'owes you')}
                          </span>
                        </>
                      ) : youOwe ? (
                        <>
                          <div className="text-xs font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                            -${Math.abs(friend.balanceWithYou || 0).toFixed(2)}
                          </div>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                            {t('friends.you_owe', undefined, 'you owe')}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-neutral-400 dark:text-neutral-500">
                          {t('friends.settled', undefined, 'settled')}
                        </span>
                      )}
                    </div>

                    {friend.balanceWithYou !== 0 && (
                      <button
                        onClick={() => onSettleFriend(friend.id)}
                        className="px-2.5 py-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 text-xs font-bold transition-colors flex items-center gap-1 active:scale-95"
                        title="Settle balance"
                      >
                        <span>Settle</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-xs text-neutral-400">
              No friends found matching "{searchQuery}"
            </div>
          )}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-2.5">
          {pendingRequests.map((friend) => (
            <div
              key={friend.id}
              className="p-3.5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700 flex items-center justify-between shadow-xs"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  imageUrl={friend.avatarUrl}
                  name={friend.name}
                  initials={friend.initials}
                  size="md"
                />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {friend.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
                    {t('friends.connection_invitation', undefined, 'Connection invitation')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button className="p-2 rounded-xl bg-[#6552FF] text-white text-xs font-bold shadow-sm active:scale-95">
                  <Check className="w-4 h-4 stroke-[2.5]" />
                </button>
                <button className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-300 text-xs active:scale-95">
                  <X className="w-4 h-4 stroke-[2]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'blocked' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-700 text-neutral-400 flex items-center justify-center mx-auto">
            <Shield className="w-5 h-5 stroke-[2]" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            {t('friends.no_blocked_title', undefined, 'No blocked users')}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
            {t('friends.no_blocked_desc', undefined, 'When you block someone, they are removed from mutual expense visibility quietly.')}
          </p>
        </div>
      )}

      {/* Email-based Add Friend Modal */}
      {isAddModalOpen && (
        <div 
          className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs overscroll-contain animate-in fade-in duration-200 pointer-events-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAddModalOpen(false);
          }}
        >
          <div 
            className="w-full bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 max-h-[85%] overflow-y-auto overscroll-contain animate-in slide-in-from-bottom-5 duration-200 pointer-events-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 stroke-[2]" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  {t('friends.modal_title', undefined, 'Add Friend by Email')}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
              >
                <X className="w-5 h-5 stroke-[2]" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  {t('friends.modal_email_label', undefined, "Friend's Email Address")}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder={t('friends.modal_email_placeholder', undefined, 'name@example.com')}
                    required
                    className="w-full pl-10 pr-3 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-semibold text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 font-medium">
                  {t('friends.modal_desc', undefined, "We'll send an invitation to connect on Balanzo.")}
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={inviteSent}
                  className="w-full py-3 rounded-2xl bg-[#6552FF] hover:bg-[#513EE8] text-white text-xs font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {inviteSent ? (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{t('friends.modal_sent_success', undefined, 'Invitation Sent!')}</span>
                    </>
                  ) : (
                    <span>{t('friends.modal_send_btn', undefined, 'Send Friend Request')}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

