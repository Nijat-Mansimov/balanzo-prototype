import React, { useState, useEffect } from 'react';
import { 
  Group, 
  Expense, 
  Friend, 
  AppNotification, 
  UserProfile, 
  WorkspaceType, 
  ActiveTab, 
  ScreenView,
  SettlementRecord
} from './types';
import { 
  INITIAL_GROUPS, 
  INITIAL_EXPENSES, 
  INITIAL_FRIENDS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_PROFILE,
  MOCK_MEMBERS
} from './data/mockData';
import { Header } from './components/common/Header';
import { BottomNavBar } from './components/common/BottomNavBar';
import { WorkspaceSwitcherModal } from './components/common/WorkspaceSwitcherModal';
import { CreateGroupModal } from './components/common/CreateGroupModal';
import { LanguageSwitcherModal } from './components/common/LanguageSwitcherModal';
import { HomeScreen } from './components/screens/HomeScreen';
import { GroupsScreen } from './components/screens/GroupsScreen';
import { GroupDetailScreen } from './components/screens/GroupDetailScreen';
import { AddExpenseFlow } from './components/screens/AddExpenseFlow';
import { BalancesScreen } from './components/screens/BalancesScreen';
import { SettlementScreen } from './components/screens/SettlementScreen';
import { FriendsScreen } from './components/screens/FriendsScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { PlanUsageScreen } from './components/screens/PlanUsageScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { DesignGalleryView } from './components/DesignGalleryView';
import { MobileFrame } from './components/MobileFrame';
import { useLanguage } from './i18n/LanguageContext';

export default function App() {
  const { t } = useLanguage();

  // State
  const [workspace, setWorkspace] = useState<WorkspaceType>('personal');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [screenView, setScreenView] = useState<ScreenView>({ type: 'home' });

  // Data state
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);

  // Modals
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [preselectedGroupId, setPreselectedGroupId] = useState<string | undefined>(undefined);

  // Settlement flow params
  const [settlementParams, setSettlementParams] = useState<{
    fromUserId?: string;
    toUserId?: string;
    amount?: number;
    groupId?: string;
  } | null>(null);

  // Visual Theme & Showcase Modes
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isGalleryMode, setIsGalleryMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Synchronize active bottom tab when navigating
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'home') setScreenView({ type: 'home' });
    else if (tab === 'groups') setScreenView({ type: 'groups' });
    else if (tab === 'friends') setScreenView({ type: 'friends' });
    else if (tab === 'profile') setScreenView({ type: 'profile' });
  };

  const handleOpenAddExpense = (groupId?: string) => {
    setPreselectedGroupId(groupId || groups[0]?.id);
    setIsAddExpenseOpen(true);
  };

  const handleExpenseAdded = (newExpense: Expense) => {
    setExpenses((prev) => [newExpense, ...prev]);

    // Update group total
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === newExpense.groupId) {
          return {
            ...g,
            totalExpenses: (g.totalExpenses || 0) + newExpense.amount,
            yourBalance: (g.yourBalance || 0) + (newExpense.amount - (newExpense.splits.find(s => s.memberId === 'user-nijat')?.amount || 0)),
          };
        }
        return g;
      })
    );

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: `${newExpense.title} added`,
      body: `You recorded $${newExpense.amount.toFixed(2)} in ${groups.find(g => g.id === newExpense.groupId)?.name || 'group'}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'expense_added',
      workspaceContext: workspace,
      groupId: newExpense.groupId,
      expenseId: newExpense.id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleSettlementRecorded = (record: SettlementRecord) => {
    // Add settlement notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Settlement recorded',
      body: `Recorded $${record.amount.toFixed(2)} settlement between ${MOCK_MEMBERS[record.fromUserId]?.name || 'Member'} and ${MOCK_MEMBERS[record.toUserId]?.name || 'Member'}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'settlement_recorded',
      workspaceContext: workspace,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAddFriendEmail = (email: string) => {
    const newFriend: Friend = {
      id: `user-${Date.now()}`,
      name: email.split('@')[0],
      email,
      initials: email.slice(0, 2).toUpperCase(),
      balanceWithYou: 0,
      status: 'pending_sent',
    };
    setFriends((prev) => [newFriend, ...prev]);
  };

  const handleGroupCreated = (newGroup: Group) => {
    setGroups((prev) => [newGroup, ...prev]);
    setProfile((prev) => ({
      ...prev,
      groupsUsed: prev.groupsUsed + 1,
    }));
  };

  const handleResetData = () => {
    setGroups(INITIAL_GROUPS);
    setExpenses(INITIAL_EXPENSES);
    setFriends(INITIAL_FRIENDS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setProfile(INITIAL_PROFILE);
    setScreenView({ type: 'home' });
    setActiveTab('home');
  };

  const selectedGroup = groups.find(
    (g) => screenView.type === 'group-detail' && g.id === screenView.groupId
  ) || groups[0];

  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <MobileFrame
        currentScreen={screenView}
        onNavigate={setScreenView}
        onResetData={handleResetData}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isGalleryMode={isGalleryMode}
        onToggleGalleryMode={() => setIsGalleryMode(!isGalleryMode)}
        onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
      >
        {isGalleryMode ? (
          <DesignGalleryView
            onSwitchToInteractive={(screen) => {
              setIsGalleryMode(false);
              if (screen) setScreenView({ type: screen as any });
            }}
            isDark={isDarkMode}
          />
        ) : (
          <div className="flex-1 flex flex-col min-h-full">
            {/* Header (Top navigation on main tabs) */}
            {screenView.type !== 'group-detail' &&
              screenView.type !== 'plan-usage' &&
              screenView.type !== 'settings' && (
                <Header
                  workspace={workspace}
                  onOpenWorkspaceSwitcher={() => setIsWorkspaceModalOpen(true)}
                  onOpenNotifications={() => setScreenView({ type: 'notifications' })}
                  onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
                  unreadCount={unreadNotifCount}
                  showBack={screenView.type === 'notifications' || screenView.type === 'balances'}
                  title={
                    screenView.type === 'notifications'
                      ? t('notifications.title', undefined, 'Notifications')
                      : screenView.type === 'balances'
                      ? t('balances.title', undefined, 'Balances')
                      : undefined
                  }
                  onBack={() => setScreenView({ type: 'home' })}
                />
              )}

            {/* SCREEN CONTENT ROUTER */}
            <div className="flex-1">
              {screenView.type === 'home' && (
                <HomeScreen
                  groups={groups}
                  expenses={expenses}
                  workspace={workspace}
                  onOpenAddExpense={() => handleOpenAddExpense()}
                  onOpenSettleUp={() => setSettlementParams({})}
                  onOpenScanReceipt={() => setScreenView({ type: 'plan-usage' })}
                  onSelectGroup={(groupId) => {
                    if (groupId === 'all') handleTabChange('groups');
                    else setScreenView({ type: 'group-detail', groupId });
                  }}
                  onOpenPlanUsage={() => setScreenView({ type: 'plan-usage' })}
                  onOpenBalances={() => setScreenView({ type: 'balances' })}
                />
              )}

              {screenView.type === 'groups' && (
                <GroupsScreen
                  groups={groups}
                  onSelectGroup={(groupId) => setScreenView({ type: 'group-detail', groupId })}
                  onCreateGroup={() => setIsCreateGroupModalOpen(true)}
                />
              )}

              {screenView.type === 'group-detail' && (
                <GroupDetailScreen
                  group={selectedGroup}
                  expenses={expenses}
                  onBack={() => setScreenView({ type: 'groups' })}
                  onAddExpense={() => handleOpenAddExpense(selectedGroup.id)}
                  onSettleUp={(memberId) =>
                    setSettlementParams({
                      fromUserId: 'user-nijat',
                      toUserId: memberId || selectedGroup.members[1]?.id,
                      groupId: selectedGroup.id,
                    })
                  }
                  initialTab={screenView.initialTab}
                />
              )}

              {screenView.type === 'balances' && (
                <BalancesScreen
                  onBack={() => setScreenView({ type: 'home' })}
                  onRecordSettlement={(fromId, toId, amount) =>
                    setSettlementParams({ fromUserId: fromId, toUserId: toId, amount })
                  }
                />
              )}

              {screenView.type === 'friends' && (
                <FriendsScreen
                  friends={friends}
                  onAddFriendEmail={handleAddFriendEmail}
                  onSettleFriend={(friendId) =>
                    setSettlementParams({
                      fromUserId: 'user-nijat',
                      toUserId: friendId,
                    })
                  }
                />
              )}

              {screenView.type === 'notifications' && (
                <NotificationsScreen
                  notifications={notifications}
                  onBack={() => setScreenView({ type: 'home' })}
                  onSelectNotification={(notif) => {
                    setNotifications((prev) =>
                      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
                    );
                    if (notif.workspaceContext && notif.workspaceContext !== workspace) {
                      setWorkspace(notif.workspaceContext);
                    }
                    if (notif.groupId) {
                      setScreenView({ type: 'group-detail', groupId: notif.groupId });
                    }
                  }}
                  onMarkAllRead={() =>
                    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
                  }
                />
              )}

              {screenView.type === 'profile' && (
                <ProfileScreen
                  profile={profile}
                  onUpdateProfile={(updated) => setProfile((p) => ({ ...p, ...updated }))}
                  onOpenPlanUsage={() => setScreenView({ type: 'plan-usage' })}
                  onOpenSettings={() => setScreenView({ type: 'settings' })}
                  onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
                />
              )}

              {screenView.type === 'plan-usage' && (
                <PlanUsageScreen
                  profile={profile}
                  onBack={() => setScreenView({ type: 'profile' })}
                />
              )}

              {screenView.type === 'settings' && (
                <SettingsScreen 
                  onBack={() => setScreenView({ type: 'profile' })} 
                  onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
                />
              )}
            </div>

            {/* Bottom Nav Bar on primary root tabs */}
            {(screenView.type === 'home' ||
              screenView.type === 'groups' ||
              screenView.type === 'friends' ||
              screenView.type === 'profile') && (
              <BottomNavBar
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onOpenAddExpense={() => handleOpenAddExpense()}
                workspace={workspace}
              />
            )}

            {/* 3-Step Add Expense Wizard Flow */}
            {isAddExpenseOpen && (
              <AddExpenseFlow
                groups={groups}
                preselectedGroupId={preselectedGroupId}
                onClose={() => setIsAddExpenseOpen(false)}
                onExpenseAdded={handleExpenseAdded}
              />
            )}

            {/* Record Settlement Flow */}
            {settlementParams && (
              <SettlementScreen
                initialFromUserId={settlementParams.fromUserId || 'user-nijat'}
                initialToUserId={settlementParams.toUserId || 'user-arif'}
                initialAmount={settlementParams.amount || 24.30}
                onClose={() => setSettlementParams(null)}
                onSettlementRecorded={(record) => {
                  handleSettlementRecorded(record);
                  setSettlementParams(null);
                }}
              />
            )}

            {/* Workspace Switcher */}
            <WorkspaceSwitcherModal
              isOpen={isWorkspaceModalOpen}
              onClose={() => setIsWorkspaceModalOpen(false)}
              currentWorkspace={workspace}
              onSelectWorkspace={setWorkspace}
              onCreateOrgClick={() => {}}
            />

            {/* Create Group Modal */}
            <CreateGroupModal
              isOpen={isCreateGroupModalOpen}
              onClose={() => setIsCreateGroupModalOpen(false)}
              onGroupCreated={handleGroupCreated}
            />

            {/* Global Language Switcher Modal */}
            <LanguageSwitcherModal
              isOpen={isLanguageModalOpen}
              onClose={() => setIsLanguageModalOpen(false)}
            />
          </div>
        )}
      </MobileFrame>
    </div>
  );
}
