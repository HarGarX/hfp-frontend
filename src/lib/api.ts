import { getAuthHeaders } from './auth'

import type {
  ApiResponse,
  ApiError,
  User,
  Household,
  Account,
  Transaction,
  Category,
  Goal,
  Loan,
  OnboardingStatus,
  OnboardingStartRequest,
  OnboardingMemberRequest,
  CreateAccountRequest,
  CreateTransactionRequest,
  CreateGoalRequest,
  ListParams,
} from './types'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10)

// Enhanced fetch wrapper with error handling
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      signal: controller.signal,
      ...options,
      headers: {
        ...getAuthHeaders(),
        ...options.headers,
      },
    }

    console.log(`[API] ${options.method || 'GET'} ${url}`)
    
    const response = await fetch(url, config)
    clearTimeout(timeoutId)

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      }))
      
      throw new Error(errorData.message || `API request failed: ${response.status}`)
    }

    const data: ApiResponse<T> = await response.json()
    return data
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      console.error(`[API Error] ${endpoint}:`, error.message)
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout - please try again')
      }
      
      throw error
    }
    
    throw new Error('An unexpected error occurred')
  }
}

// API client object with all endpoints
export const api = {
  // Onboarding endpoints
  onboarding: {
    start: async (data: OnboardingStartRequest) =>
      apiRequest<{ household: Household; user: User }>('/onboarding/start', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    addMember: async (data: OnboardingMemberRequest) =>
      apiRequest<User>('/onboarding/members', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    assignRoles: async (assignments: { userId: string; role: string }[]) =>
      apiRequest<{ updated: number }>('/onboarding/roles', {
        method: 'POST',
        body: JSON.stringify({ assignments }),
      }),
    
    getStatus: async () =>
      apiRequest<OnboardingStatus>('/onboarding/status'),
    
    complete: async () =>
      apiRequest<{ success: boolean }>('/onboarding/complete', {
        method: 'POST',
      }),
  },

  // User endpoints
  users: {
    list: async (params?: ListParams) => {
      const query = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) query.append(key, String(value))
        })
      }
      return apiRequest<User[]>(`/users?${query}`)
    },
    
    get: async (id: string) =>
      apiRequest<User>(`/users/${id}`),
    
    me: async () =>
      apiRequest<User>('/users/me'),
    
    update: async (id: string, data: Partial<User>) =>
      apiRequest<User>(`/users/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Household endpoints
  households: {
    list: async () =>
      apiRequest<Household[]>('/households'),
    
    get: async (id: string) =>
      apiRequest<Household>(`/households/${id}`),
    
    update: async (id: string, data: Partial<Household>) =>
      apiRequest<Household>(`/households/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Account endpoints
  accounts: {
    list: async (params?: ListParams) => {
      const query = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) query.append(key, String(value))
        })
      }
      return apiRequest<Account[]>(`/accounts?${query}`)
    },
    
    get: async (id: string) =>
      apiRequest<Account>(`/accounts/${id}`),
    
    create: async (data: CreateAccountRequest) =>
      apiRequest<Account>('/accounts', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: async (id: string, data: Partial<Account>) =>
      apiRequest<Account>(`/accounts/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    
    delete: async (id: string) =>
      apiRequest<void>(`/accounts/${id}`, {
        method: 'DELETE',
      }),
  },

  // Transaction endpoints
  transactions: {
    list: async (params?: ListParams) => {
      const query = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) query.append(key, String(value))
        })
      }
      return apiRequest<Transaction[]>(`/transactions?${query}`)
    },
    
    get: async (id: string) =>
      apiRequest<Transaction>(`/transactions/${id}`),
    
    create: async (data: CreateTransactionRequest) =>
      apiRequest<Transaction>('/transactions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: async (id: string, data: Partial<Transaction>) =>
      apiRequest<Transaction>(`/transactions/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    
    delete: async (id: string) =>
      apiRequest<void>(`/transactions/${id}`, {
        method: 'DELETE',
      }),
  },

  // Category endpoints
  categories: {
    list: async () =>
      apiRequest<Category[]>('/categories'),
    
    get: async (id: string) =>
      apiRequest<Category>(`/categories/${id}`),
    
    create: async (data: Partial<Category>) =>
      apiRequest<Category>('/categories', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: async (id: string, data: Partial<Category>) =>
      apiRequest<Category>(`/categories/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    
    delete: async (id: string) =>
      apiRequest<void>(`/categories/${id}`, {
        method: 'DELETE',
      }),
  },

  // Goal endpoints
  goals: {
    list: async (params?: ListParams) => {
      const query = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) query.append(key, String(value))
        })
      }
      return apiRequest<Goal[]>(`/goals?${query}`)
    },
    
    get: async (id: string) =>
      apiRequest<Goal>(`/goals/${id}`),
    
    create: async (data: CreateGoalRequest) =>
      apiRequest<Goal>('/goals', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: async (id: string, data: Partial<Goal>) =>
      apiRequest<Goal>(`/goals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    
    delete: async (id: string) =>
      apiRequest<void>(`/goals/${id}`, {
        method: 'DELETE',
      }),
  },

  // Loan endpoints
  loans: {
    list: async (params?: ListParams) => {
      const query = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) query.append(key, String(value))
        })
      }
      return apiRequest<Loan[]>(`/loans?${query}`)
    },
    
    get: async (id: string) =>
      apiRequest<Loan>(`/loans/${id}`),
    
    create: async (data: Partial<Loan>) =>
      apiRequest<Loan>('/loans', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    update: async (id: string, data: Partial<Loan>) =>
      apiRequest<Loan>(`/loans/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    
    delete: async (id: string) =>
      apiRequest<void>(`/loans/${id}`, {
        method: 'DELETE',
      }),
  },

  // Insights endpoints
  insights: {
    getOverview: async () =>
      apiRequest<{
        totalIncome: number
        totalExpenses: number
        netWorth: number
        monthlyTrend: { month: string; income: number; expenses: number }[]
        topCategories: { category: string; amount: number; percentage: number }[]
      }>('/insights/overview'),
    
    getSpendingTrends: async (period: '30d' | '90d' | '1y' = '30d') =>
      apiRequest<any>(`/insights/spending-trends?period=${period}`),
    
    getCashFlow: async () =>
      apiRequest<any>('/insights/cash-flow'),
  },

  // Notifications endpoints
  notifications: {
    list: async (params?: ListParams) => {
      const query = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) query.append(key, String(value))
        })
      }
      return apiRequest<any[]>(`/notifications?${query}`)
    },
    
    markAsRead: async (id: string) =>
      apiRequest<void>(`/notifications/${id}/read`, {
        method: 'PATCH',
      }),
    
    markAllAsRead: async () =>
      apiRequest<void>('/notifications/read-all', {
        method: 'PATCH',
      }),
  },
}

export default api