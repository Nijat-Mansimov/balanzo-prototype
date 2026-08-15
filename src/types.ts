export type SplitMethodType = 'equal' | 'exact' | 'percentage' | 'shares';

export type WorkspaceType = 'personal' | 'organization';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  initials: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  role?: 'admin' | 'member';
}

export interface ExpenseSplit {
  memberId: string;
  amount: number;
  percentage?: number;
  shares?: number;
  isPaid?: boolean;
}

export interface Expense {
  id: string;
  groupId: string;
  title: string;
  amount: number;
  currency: string;
  paidById: string;
  date: string; // ISO or formatted
  splitMethod: SplitMethodType;
  splits: ExpenseSplit[];
  category?: 'food' | 'transport' | 'hotel' | 'entertainment' | 'groceries' | 'general';
  note?: string;
  createdAt: string;
}

export interface Group {
  id: string;
  name: string;
  type: 'trip' | 'home' | 'couple' | 'other';
  currency: string;
  members: Member[];
  createdAt: string;
  // Inferred visual attributes for flagship presentation
  inferredDestination?: string;
  inferredDateRange?: string;
  coverGradient?: string;
  coverImage?: string;
  totalExpenses?: number;
  yourBalance?: number; // positive = owed to you, negative = you owe
}

export interface PairwiseBalance {
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  groupId?: string;
}

export interface SettlementRecord {
  id: string;
  groupId?: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
  currency: string;
  date: string;
  note?: string;
  recordedById: string;
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  balanceWithYou: number; // positive: owes you, negative: you owe
  status: 'active' | 'pending_received' | 'pending_sent';
}

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  type: 'expense_added' | 'settlement_recorded' | 'group_invite' | 'friend_request' | 'reminder';
  workspaceContext?: WorkspaceType;
  organizationName?: string;
  groupId?: string;
  expenseId?: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'apple_pay' | 'google_pay' | 'bank';
  title: string;
  last4?: string;
  brand?: 'visa' | 'mastercard' | 'amex' | 'apple' | 'google' | 'bank';
  expiry?: string;
  isDefault?: boolean;
}

export interface WalletTransaction {
  id: string;
  type: 'topup' | 'settlement_payout' | 'expense_payment';
  amount: number;
  currency: string;
  date: string;
  title: string;
  paymentMethodTitle?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  currency: string;
  timezone: string;
  locale: string;
  plan: 'free' | 'premium' | 'trip_pass';
  groupsUsed: number;
  groupsLimit: number;
  walletBalance: number;
}

export type ActiveTab = 'home' | 'groups' | 'friends' | 'profile';

export type ScreenView = 
  | { type: 'home' }
  | { type: 'groups' }
  | { type: 'analytics' }
  | { type: 'group-detail'; groupId: string; initialTab?: 'expenses' | 'balances' | 'settle' | 'activity' }
  | { type: 'add-expense'; preselectedGroupId?: string }
  | { type: 'balances'; groupId?: string }
  | { type: 'settlement'; fromUserId?: string; toUserId?: string; initialAmount?: number; groupId?: string }
  | { type: 'friends' }
  | { type: 'notifications' }
  | { type: 'profile' }
  | { type: 'settings' }
  | { type: 'plan-usage' }
  | { type: 'create-group' };
