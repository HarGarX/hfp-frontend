// API Types and Interfaces
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  pagination?: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiError {
  message: string
  statusCode: number
  error?: string
  details?: any[]
}

export interface BaseEntity {
  id: string
  created_at: string
  updated_at: string
  deleted_at?: string
}

// User Types
export interface User extends BaseEntity {
  email: string
  username: string
  first_name: string
  last_name: string
  role: 'ADMIN' | 'HOUSEHOLD_ADMIN' | 'HOUSEHOLD_MEMBER' | 'HOUSEHOLD_VIEWER'
  is_active: boolean
  email_verified: boolean
  household_id: string
  last_login?: string
}

// Household Types
export interface Household extends BaseEntity {
  name: string
  description?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  country: string
  default_currency: string
  member_count: number
  total_income: number
  total_expenses: number
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
}

// Account Types
export interface Account extends BaseEntity {
  household_id: string
  name: string
  account_type: 'checking' | 'savings' | 'credit_card' | 'investment' | 'cash' | 'loan' | 'business' | 'other'
  bank_name?: string
  account_number?: string
  current_balance: number
  available_balance?: number
  currency: string
  status: 'active' | 'inactive' | 'closed' | 'suspended'
  is_active: boolean
  last_synced_at?: string
  external_provider?: string
}

// Transaction Types
export interface Transaction extends BaseEntity {
  household_id: string
  account_id: string
  category_id?: string
  amount: number
  currency: string
  description: string
  date: string
  transaction_type: 'income' | 'expense' | 'transfer'
  status: 'PENDING' | 'COMPLETED' | 'CANCELLED'
  merchant?: string
  notes?: string
  transfer_account_id?: string
  tags?: string[]
}

// Category Types
export interface Category extends BaseEntity {
  household_id: string
  name: string
  category_type: 'expense' | 'income' | 'transfer'
  description?: string
  color?: string
  icon?: string
  parent_id?: string
  is_system: boolean
  transaction_count: number
  total_amount: number
}

// Goal Types
export interface Goal extends BaseEntity {
  household_id: string
  name: string
  goal_type: 'savings' | 'debt_payoff' | 'emergency_fund' | 'investment' | 'purchase' | 'vacation' | 'custom'
  description?: string
  target_amount: number
  current_amount: number
  target_date: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'ACTIVE' | 'COMPLETED' | 'PAUSED'
  category?: string
}

// Loan Types
export interface Loan extends BaseEntity {
  household_id: string
  name: string
  description?: string
  type: 'BNPL' | 'PERSONAL' | 'MORTGAGE' | 'AUTO' | 'STUDENT' | 'CREDIT_CARD' | 'OTHER'
  status: 'ACTIVE' | 'PAID_OFF' | 'DEFAULTED' | 'CLOSED'
  principal_amount: number
  current_balance: number
  interest_rate: number
  payment_amount?: number
  payment_frequency?: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'YEARLY'
  start_date?: string
  end_date?: string
  next_payment_date?: string
  lender?: string
  account_number?: string
  minimum_payment?: number
  due_date?: string
  provider_name?: string
  loan_type?: string
}

// Onboarding Types
export interface OnboardingStatus {
  user_id: string
  step: string
  completed: boolean
  data?: Record<string, any>
}

// Combined onboarding data interface
export interface OnboardingData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
  };
  household: {
    name: string;
    type: 'family' | 'couple' | 'single' | 'roommates';
    currency: string;
    timezone: string;
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
    monthlyIncome?: number;
    monthlyExpenses?: number;
    financialGoals?: string[];
  };
  members?: Array<{
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin' | 'member' | 'viewer';
  }>;
  roles?: Array<{
    userId: string;
    role: string;
  }>;
}

export interface OnboardingStartRequest {
  household: {
    name: string
    address?: string
    city?: string
    state?: string
    zip_code?: string
    country: string
    default_currency: string
  }
  user: {
    email: string
    first_name: string
    last_name: string
    username?: string
  }
}

export interface OnboardingMemberRequest {
  email: string
  first_name: string
  last_name: string
  role: 'HOUSEHOLD_ADMIN' | 'HOUSEHOLD_MEMBER' | 'HOUSEHOLD_VIEWER'
}

// API Request Types
export interface CreateAccountRequest {
  name: string
  account_type: Account['account_type']
  bank_name?: string
  balance: number
  currency: string
}

export interface CreateTransactionRequest {
  account_id: string
  category_id?: string
  amount: number
  currency: string
  description: string
  date: string
  transaction_type: Transaction['transaction_type']
  merchant?: string
  notes?: string
  transfer_account_id?: string
  tags?: string[]
}

export interface CreateGoalRequest {
  name: string
  goal_type: Goal['goal_type']
  description?: string
  target_amount: number
  target_date: string
  priority: Goal['priority']
}

// Pagination and Filtering
export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
}

export interface FilterParams {
  startDate?: string
  endDate?: string
  category?: string
  accountId?: string
  minAmount?: number
  maxAmount?: number
  status?: string
  search?: string
}

export type ListParams = PaginationParams & FilterParams