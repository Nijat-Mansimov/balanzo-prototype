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
  SettlementRecord,
  PaymentMethod,
  Member,
  OnboardingData
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
import { GroupMembersModal } from './components/common/GroupMembersModal';
import { LanguageSwitcherModal } from './components/common/LanguageSwitcherModal';
import { AddFundsModal } from './components/common/AddFundsModal';
import { AddPaymentMethodModal } from './components/common/AddPaymentMethodModal';
import { HomeScreen } from './components/screens/HomeScreen';
import { GroupsScreen } from './components/screens/GroupsScreen';
import { GroupDetailScreen } from './components/screens/GroupDetailScreen';
import { AddExpenseFlow } from './components/screens/AddExpenseFlow';
import { BalancesScreen } from './components/screens/BalancesScreen';
import { AnalyticsScreen } from './components/screens/AnalyticsScreen';
import { SettlementScreen } from './components/screens/SettlementScreen';
import { FriendsScreen } from './components/screens/FriendsScreen';
import { NotificationsScreen } from './components/screens/NotificationsScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { PlanUsageScreen } from './components/screens/PlanUsageScreen';
import { SettingsScreen } from './components/screens/SettingsScreen';
import { AuthFlow } from './components/auth/AuthFlow';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { DesignGalleryView } from './components/DesignGalleryView';
import { MobileFrame } from './components/MobileFrame';
import { useLanguage } from './i18n/LanguageContext';

export default function App() {
  const { t } = useLanguage();

  // Authentication & First-time Onboarding detection
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('balanzo_is_authenticated') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean>(() => {
    try {
      return localStorage.getItem('balanzo_has_seen_onboarding') === 'true';
    } catch (e) {
      return false;
    }
  });

  // Screen router:
  // 1. If user is authenticated, take them directly to the main app ('home')
  // 2. If user is NOT authenticated:
  //    - If first-time user (has not seen onboarding), show 'onboarding'
  //    - If returning/previously registered user who logged out, show 'auth' (login)
  const [screenView, setScreenView] = useState<ScreenView>(() => {
    try {
      const isAuth = localStorage.getItem('balanzo_is_authenticated') === 'true';
      if (isAuth) {
        return { type: 'home' };
      }
      const hasSeen = localStorage.getItem('balanzo_has_seen_onboarding') === 'true';
      if (hasSeen) {
        return { type: 'auth', authView: 'login', initialView: 'login' };
      }
      // Brand new user opening app for the first time
      return { type: 'onboarding' };
    } catch (e) {
      return { type: 'onboarding' };
    }
  });

  const [pendingOnboardingData, setPendingOnboardingData] = useState<OnboardingData | null>(null);

  // State
  const [workspace, setWorkspace] = useState<WorkspaceType>('personal');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Data state
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [expenses, setExpenses] = useState<Expense[]>(INITIAL_EXPENSES);
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const savedProfile = localStorage.getItem('balanzo_user_profile');
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
    } catch (e) {}
    return INITIAL_PROFILE;
  });
  const [walletBalance, setWalletBalance] = useState<number>(425.50);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm-1',
      type: 'card',
      title: 'Visa ending in 4242',
      last4: '4242',
      brand: 'visa',
      expiry: '09/27',
      isDefault: true,
    },
    {
      id: 'pm-2',
      type: 'apple_pay',
      title: 'Apple Pay',
      brand: 'apple',
      isDefault: false,
    },
  ]);

  // Modals
  const [isWorkspaceModalOpen, setIsWorkspaceModalOpen] = useState(false);
  const [isCreateGroupModalOpen, setIsCreateGroupModalOpen] = useState(false);
  const [isGroupMembersModalOpen, setIsGroupMembersModalOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isAddPaymentMethodModalOpen, setIsAddPaymentMethodModalOpen] = useState(false);
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
    const targetGroup = groupId || groups[0]?.id;
    setPreselectedGroupId(targetGroup);
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
      body: `You recorded $${(newExpense.amount || 0).toFixed(2)} in ${groups.find(g => g.id === newExpense.groupId)?.name || 'group'}.`,
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
      body: `Recorded $${(record.amount || 0).toFixed(2)} settlement between ${MOCK_MEMBERS[record.fromUserId]?.name || 'Member'} and ${MOCK_MEMBERS[record.toUserId]?.name || 'Member'}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'settlement_recorded',
      workspaceContext: workspace,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleOnboardingChooseAuth = (view: 'register' | 'login', data: OnboardingData) => {
    setHasSeenOnboarding(true);
    try {
      localStorage.setItem('balanzo_has_seen_onboarding', 'true');
    } catch (e) {}

    setPendingOnboardingData(data);
    setProfile((prev) => ({
      ...prev,
      name: data.name || prev.name,
      currency: data.currency || prev.currency,
      avatarUrl: data.avatarUrl || prev.avatarUrl,
      initials: data.initials || prev.initials,
      defaultSplitMethod: data.defaultSplitMethod || prev.defaultSplitMethod,
    }));

    setScreenView({ type: 'auth', authView: view, initialView: view });
  };

  const handleOnboardingSkip = (view: 'register' | 'login' = 'register') => {
    setHasSeenOnboarding(true);
    try {
      localStorage.setItem('balanzo_has_seen_onboarding', 'true');
    } catch (e) {}
    setScreenView({ type: 'auth', authView: view, initialView: view });
  };

  const handleOnboardingComplete = (onboardingData: OnboardingData) => {
    setHasSeenOnboarding(true);
    try {
      localStorage.setItem('balanzo_has_seen_onboarding', 'true');
    } catch (e) {}

    setProfile((prev) => {
      const updated = {
        ...prev,
        name: onboardingData.name || prev.name,
        currency: onboardingData.currency || prev.currency,
        avatarUrl: onboardingData.avatarUrl || prev.avatarUrl,
        initials: onboardingData.initials || prev.initials,
        defaultSplitMethod: onboardingData.defaultSplitMethod || prev.defaultSplitMethod,
      };
      try {
        localStorage.setItem('balanzo_user_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    if (onboardingData.initialGroup) {
      const newGroupMembers = [
        {
          id: profile.id || 'user-nijat',
          name: onboardingData.name || profile.name,
          avatarUrl: onboardingData.avatarUrl || profile.avatarUrl,
          initials: onboardingData.initials || profile.initials,
          role: 'admin' as const,
          email: profile.email,
        },
        ...onboardingData.initialGroup.invitedFriendIds.map((fId) => {
          const f = friends.find((fr) => fr.id === fId);
          return {
            id: f?.id || fId,
            name: f?.name || 'Friend',
            avatarUrl: f?.avatarUrl,
            initials: f?.initials || 'FR',
            role: 'member' as const,
            email: f?.email || `${fId}@example.com`,
          };
        }),
      ];

      const starterGroup: Group = {
        id: `group-${Date.now()}`,
        name: onboardingData.initialGroup.name,
        type: onboardingData.initialGroup.type,
        currency: onboardingData.currency || profile.currency || 'USD ($)',
        members: newGroupMembers,
        totalExpenses: 0,
        yourBalance: 0,
        createdAt: new Date().toISOString(),
        inferredDateRange: 'Active Now',
        coverGradient: 'from-violet-600 via-indigo-600 to-purple-800',
      };
      setGroups((prev) => [starterGroup, ...prev]);
    }

    // If already authenticated (e.g. tour replay), return to home; otherwise direct to auth
    if (isAuthenticated) {
      setScreenView({ type: 'home' });
      setActiveTab('home');
    } else {
      setScreenView({ type: 'auth', authView: 'register', initialView: 'register' });
    }
  };

  const handleLoginSuccess = (loggedInUser: Partial<UserProfile>) => {
    setIsAuthenticated(true);
    setHasSeenOnboarding(true);
    try {
      localStorage.setItem('balanzo_is_authenticated', 'true');
      localStorage.setItem('balanzo_has_seen_onboarding', 'true');
    } catch (e) {}

    setProfile((prev) => {
      const updated = { ...prev, ...loggedInUser };
      try {
        localStorage.setItem('balanzo_user_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setScreenView({ type: 'home' });
    setActiveTab('home');
  };

  const handleRegisterSuccess = (newUser: Partial<UserProfile>) => {
    setIsAuthenticated(true);
    setHasSeenOnboarding(true);
    try {
      localStorage.setItem('balanzo_is_authenticated', 'true');
      localStorage.setItem('balanzo_has_seen_onboarding', 'true');
    } catch (e) {}

    if (pendingOnboardingData?.initialGroup) {
      const newGroupMembers = [
        {
          id: newUser.id || 'user-new',
          name: newUser.name || profile.name,
          avatarUrl: newUser.avatarUrl || profile.avatarUrl,
          initials: newUser.initials || profile.initials,
          role: 'admin' as const,
          email: newUser.email || profile.email,
        },
        ...pendingOnboardingData.initialGroup.invitedFriendIds.map((fId) => {
          const f = friends.find((fr) => fr.id === fId);
          return {
            id: f?.id || fId,
            name: f?.name || 'Friend',
            avatarUrl: f?.avatarUrl,
            initials: f?.initials || 'FR',
            role: 'member' as const,
            email: f?.email || `${fId}@example.com`,
          };
        }),
      ];

      const starterGroup: Group = {
        id: `group-${Date.now()}`,
        name: pendingOnboardingData.initialGroup.name,
        type: pendingOnboardingData.initialGroup.type,
        currency: newUser.currency || pendingOnboardingData.currency || 'USD ($)',
        members: newGroupMembers,
        totalExpenses: 0,
        yourBalance: 0,
        createdAt: new Date().toISOString(),
        inferredDateRange: 'Active Now',
        coverGradient: 'from-violet-600 via-indigo-600 to-purple-800',
      };
      setGroups((prev) => [starterGroup, ...prev]);
    }

    setProfile((prev) => {
      const updated = { ...prev, ...newUser };
      try {
        localStorage.setItem('balanzo_user_profile', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    setScreenView({ type: 'home' });
    setActiveTab('home');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.setItem('balanzo_is_authenticated', 'false');
    } catch (e) {}
    setScreenView({ type: 'auth', authView: 'login', initialView: 'login' });
  };

  const handleResetDemoFirstTime = () => {
    setIsAuthenticated(false);
    setHasSeenOnboarding(false);
    setPendingOnboardingData(null);
    try {
      localStorage.removeItem('balanzo_is_authenticated');
      localStorage.removeItem('balanzo_has_seen_onboarding');
      localStorage.removeItem('balanzo_user_profile');
    } catch (e) {}
    setScreenView({ type: 'onboarding' });
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

  const handleAddMemberToGroup = (groupId: string, newMember: Member) => {
    setGroups((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          if (g.members.some((m) => m.id === newMember.id)) return g;
          return {
            ...g,
            members: [...g.members, newMember],
          };
        }
        return g;
      })
    );

    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Member Added',
      body: `${newMember.name} joined ${groups.find((g) => g.id === groupId)?.name || 'group'}.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'expense_added',
      workspaceContext: workspace,
      groupId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleAddFunds = (amount: number) => {
    setWalletBalance((prev) => prev + (amount || 0));
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: 'Wallet Funded',
      body: `$${(amount || 0).toFixed(2)} added to your Balanzo Wallet.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'settlement_recorded',
      workspaceContext: workspace,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handlePaymentMethodAdded = (pm: PaymentMethod) => {
    setPaymentMethods((prev) => {
      if (pm.isDefault) {
        return [pm, ...prev.map((p) => ({ ...p, isDefault: false }))];
      }
      return [pm, ...prev];
    });
  };

  const handleResetData = () => {
    setGroups(INITIAL_GROUPS);
    setExpenses(INITIAL_EXPENSES);
    setFriends(INITIAL_FRIENDS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setProfile(INITIAL_PROFILE);
    setWalletBalance(425.50);
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
        hasActiveModal={
          isWorkspaceModalOpen ||
          isCreateGroupModalOpen ||
          isGroupMembersModalOpen ||
          isAddExpenseOpen ||
          isLanguageModalOpen ||
          isAddFundsModalOpen ||
          isAddPaymentMethodModalOpen ||
          settlementParams !== null
        }
        modals={
          <>
            {/* Group Members Modal */}
            {isGroupMembersModalOpen && (
              <GroupMembersModal
                isOpen={isGroupMembersModalOpen}
                onClose={() => setIsGroupMembersModalOpen(false)}
                group={selectedGroup}
                friends={friends}
                onAddMemberToGroup={handleAddMemberToGroup}
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

            {/* Add Funds Modal */}
            <AddFundsModal
              isOpen={isAddFundsModalOpen}
              onClose={() => setIsAddFundsModalOpen(false)}
              currentBalance={walletBalance}
              paymentMethods={paymentMethods}
              onAddFunds={handleAddFunds}
              onOpenAddPaymentMethod={() => {
                setIsAddFundsModalOpen(false);
                setIsAddPaymentMethodModalOpen(true);
              }}
            />

            {/* Add Payment Method Modal */}
            <AddPaymentMethodModal
              isOpen={isAddPaymentMethodModalOpen}
              onClose={() => setIsAddPaymentMethodModalOpen(false)}
              onPaymentMethodAdded={handlePaymentMethodAdded}
            />
          </>
        }
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
              screenView.type !== 'settings' &&
              screenView.type !== 'add-expense' &&
              screenView.type !== 'auth' &&
              screenView.type !== 'onboarding' && (
                <Header
                  workspace={workspace}
                  onOpenWorkspaceSwitcher={() => setIsWorkspaceModalOpen(true)}
                  onOpenNotifications={() => setScreenView({ type: 'notifications' })}
                  unreadCount={unreadNotifCount}
                  showBack={
                    screenView.type === 'notifications' ||
                    screenView.type === 'balances' ||
                    screenView.type === 'analytics' ||
                    screenView.type === 'friends'
                  }
                  title={
                    screenView.type === 'notifications'
                      ? t('notifications.title', undefined, 'Notifications')
                      : screenView.type === 'balances'
                      ? t('balances.title', undefined, 'Balances & Wallet')
                      : screenView.type === 'analytics'
                      ? 'Expense Analytics'
                      : undefined
                  }
                  onBack={() => {
                    if (screenView.type === 'analytics') {
                      setScreenView({ type: 'profile' });
                    } else {
                      setScreenView({ type: 'home' });
                    }
                  }}
                />
              )}

            {/* SCREEN CONTENT ROUTER */}
            <div className="flex-1">
              {screenView.type === 'auth' && (
                <AuthFlow
                  initialView={screenView.authView || screenView.initialView || 'login'}
                  initialData={
                    pendingOnboardingData
                      ? {
                          name: pendingOnboardingData.name,
                          currency: pendingOnboardingData.currency,
                          avatarUrl: pendingOnboardingData.avatarUrl,
                          initials: pendingOnboardingData.initials,
                        }
                      : undefined
                  }
                  onLogin={handleLoginSuccess}
                  onRegister={handleRegisterSuccess}
                  onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
                />
              )}

              {screenView.type === 'onboarding' && (
                <OnboardingFlow
                  initialProfile={profile}
                  friends={friends}
                  isReplayMode={isAuthenticated}
                  onChooseAuth={handleOnboardingChooseAuth}
                  onComplete={handleOnboardingComplete}
                  onSkip={handleOnboardingSkip}
                />
              )}

              {screenView.type === 'home' && (
                <HomeScreen
                  groups={groups}
                  expenses={expenses}
                  workspace={workspace}
                  walletBalance={walletBalance}
                  onOpenAddExpense={() => handleOpenAddExpense()}
                  onOpenSettleUp={() => setSettlementParams({})}
                  onOpenScanReceipt={() => setScreenView({ type: 'plan-usage' })}
                  onSelectGroup={(groupId) => {
                    if (groupId === 'all') handleTabChange('groups');
                    else setScreenView({ type: 'group-detail', groupId });
                  }}
                  onOpenPlanUsage={() => setScreenView({ type: 'plan-usage' })}
                  onOpenBalances={() => setScreenView({ type: 'balances' })}
                  onOpenAnalytics={() => setScreenView({ type: 'analytics' })}
                  onOpenAddFunds={() => setIsAddFundsModalOpen(true)}
                  onOpenAddPaymentMethod={() => setIsAddPaymentMethodModalOpen(true)}
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
                  onOpenMembers={() => setIsGroupMembersModalOpen(true)}
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

              {screenView.type === 'analytics' && (
                <AnalyticsScreen
                  expenses={expenses}
                  groups={groups}
                  onOpenAddExpense={() => handleOpenAddExpense()}
                  onOpenBalances={() => setScreenView({ type: 'balances' })}
                />
              )}

              {screenView.type === 'add-expense' && (
                <AddExpenseFlow
                  groups={groups}
                  preselectedGroupId={screenView.preselectedGroupId || preselectedGroupId}
                  onClose={() => {
                    setActiveTab('home');
                    setScreenView({ type: 'home' });
                  }}
                  onExpenseAdded={(newExp) => {
                    handleExpenseAdded(newExp);
                    setActiveTab('home');
                    setScreenView({ type: 'home' });
                  }}
                />
              )}

              {screenView.type === 'balances' && (
                <BalancesScreen
                  walletBalance={walletBalance}
                  onBack={() => setScreenView({ type: 'home' })}
                  onRecordSettlement={(fromId, toId, amount) =>
                    setSettlementParams({ fromUserId: fromId, toUserId: toId, amount })
                  }
                  onOpenAddFunds={() => setIsAddFundsModalOpen(true)}
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
                  walletBalance={walletBalance}
                  onUpdateProfile={(updated) => {
                    setProfile((p) => {
                      const updatedProfile = { ...p, ...updated };
                      try {
                        localStorage.setItem('balanzo_user_profile', JSON.stringify(updatedProfile));
                      } catch (e) {}
                      return updatedProfile;
                    });
                  }}
                  onOpenPlanUsage={() => setScreenView({ type: 'plan-usage' })}
                  onOpenSettings={() => setScreenView({ type: 'settings' })}
                  onOpenAnalytics={() => setScreenView({ type: 'analytics' })}
                  onOpenLanguageModal={() => setIsLanguageModalOpen(true)}
                  onOpenAddFunds={() => setIsAddFundsModalOpen(true)}
                  onOpenAddPaymentMethod={() => setIsAddPaymentMethodModalOpen(true)}
                  onLogout={handleLogout}
                  onReplayOnboarding={() => setScreenView({ type: 'onboarding' })}
                  onOpenAuth={(view) => setScreenView({ type: 'auth', authView: view, initialView: view })}
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
                  onLogout={handleLogout}
                  onResetFirstTime={handleResetDemoFirstTime}
                  onReplayOnboarding={() => setScreenView({ type: 'onboarding' })}
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
          </div>
        )}
      </MobileFrame>
    </div>
  );
}
