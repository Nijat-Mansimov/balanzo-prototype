import React, { useState } from 'react';
import { UserPlus, Search, Mail, Shield, Check, X, ChevronRight } from 'lucide-react';
import { Friend } from '../../types';
import { Avatar } from '../common/Avatar';

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
  const [activeTab, setActiveTab] = useState<'friends' | 'requests' | 'blocked'>('friends');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const activeFriends = friends.filter((f) => f.status === 'active');
  const pendingRequests = friends.filter((f) => f.status !== 'active');

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
          <h1 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Friends
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {activeFriends.length} connected friends
          </p>
        </div>
        <button
          onClick={() => setIsAddModalOpen(true)}
          id="btn-add-friend"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#6552FF] text-white text-xs font-bold shadow-sm shadow-[#6552FF]/20 active:scale-95 transition-all"
        >
          <UserPlus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Friend</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex p-1 rounded-2xl bg-neutral-200/70 dark:bg-neutral-800 border border-neutral-300/40 dark:border-neutral-700">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'friends'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
          }`}
        >
          Friends ({activeFriends.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'requests'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
          }`}
        >
          Requests ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('blocked')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeTab === 'blocked'
              ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white shadow-sm'
              : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800'
          }`}
        >
          Blocked
        </button>
      </div>

      {/* Main Tab Content */}
      {activeTab === 'friends' && (
        <div className="space-y-2.5">
          {activeFriends.map((friend) => {
            const owesYou = friend.balanceWithYou > 0;
            const youOwe = friend.balanceWithYou < 0;

            return (
              <div
                key={friend.id}
                className="p-3.5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={friend.avatarUrl}
                    name={friend.name}
                    initials={friend.initials}
                    size="md"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                      {friend.name}
                    </h3>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {friend.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    {owesYou ? (
                      <>
                        <div className="text-xs font-extrabold text-[#16A34A] dark:text-emerald-400 tabular-nums">
                          +${friend.balanceWithYou.toFixed(2)}
                        </div>
                        <span className="text-[10px] text-neutral-400">owes you</span>
                      </>
                    ) : youOwe ? (
                      <>
                        <div className="text-xs font-extrabold text-[#9C5317] dark:text-amber-400 tabular-nums">
                          -${Math.abs(friend.balanceWithYou).toFixed(2)}
                        </div>
                        <span className="text-[10px] text-neutral-400">you owe</span>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-neutral-400">
                        settled
                      </span>
                    )}
                  </div>

                  {friend.balanceWithYou !== 0 && (
                    <button
                      onClick={() => onSettleFriend(friend.id)}
                      className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 text-neutral-700 dark:text-neutral-200 transition-colors"
                      title="Settle balance"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-2.5">
          {pendingRequests.map((friend) => (
            <div
              key={friend.id}
              className="p-3.5 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700/70 flex items-center justify-between shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Avatar
                  src={friend.avatarUrl}
                  name={friend.name}
                  initials={friend.initials}
                  size="md"
                />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 dark:text-white">
                    {friend.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    Connection invitation
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button className="p-2 rounded-xl bg-[#6552FF] text-white text-xs font-bold shadow-sm">
                  <Check className="w-4 h-4" />
                </button>
                <button className="p-2 rounded-xl bg-neutral-100 dark:bg-neutral-700 text-neutral-500 text-xs">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'blocked' && (
        <div className="p-8 rounded-3xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-center space-y-2">
          <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-700 text-neutral-400 flex items-center justify-center mx-auto">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
            No blocked users
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs mx-auto">
            When you block someone, they are removed from mutual expense visibility quietly.
          </p>
        </div>
      )}

      {/* Email-based Add Friend Modal */}
      {isAddModalOpen && (
        <div className="absolute inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full bg-white dark:bg-neutral-800 rounded-t-3xl p-5 shadow-2xl border-t border-neutral-200 dark:border-neutral-700 max-h-[85%] overflow-y-auto animate-in slide-in-from-bottom-5 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#6552FF]/10 text-[#6552FF] flex items-center justify-center">
                  <UserPlus className="w-4 h-4 stroke-[2.5]" />
                </div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-white">
                  Add Friend by Email
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendInvite} className="mt-4 space-y-3">
              <div>
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block mb-1">
                  Friend's Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="w-full pl-10 pr-3 py-3 rounded-2xl bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-xs font-medium text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6552FF]/30"
                  />
                </div>
                <p className="text-[11px] text-neutral-500 mt-1">
                  We'll send an invitation to connect on Balanzo.
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
                      <span>Invitation Sent!</span>
                    </>
                  ) : (
                    <span>Send Friend Request</span>
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
