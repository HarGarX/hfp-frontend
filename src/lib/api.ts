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
const MAX_RETRIES = 3
const RETRY_DELAY = 1000 // 1 second

// Sleep helper for retry delays
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Enhanced fetch wrapper with error handling and retry logic
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  retryCount = 0
): Promise<ApiResponse<T>> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT)

  try {
    const url = `${API_BASE_URL}${endpoint}`
    const config: RequestInit = {
      signal: controller.signal,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders(),
        ...options.headers,
      },
    }

    console.log(`[API] ${options.method || 'GET'} ${url}`)
    
    const response = await fetch(url, config)
    clearTimeout(timeoutId)

    // Handle rate limiting (429)
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After')
      const delay = retryAfter ? parseInt(retryAfter) * 1000 : RETRY_DELAY * Math.pow(2, retryCount)
      
      if (retryCount < MAX_RETRIES) {
        console.warn(`[API] Rate limited. Retrying after ${delay}ms...`)
        await sleep(delay)
        return apiRequest<T>(endpoint, options, retryCount + 1)
      }
      
      throw new Error('Rate limit exceeded. Please try again later.')
    }

    // Handle authentication errors
    if (response.status === 401) {
      // Clear auth token and redirect to login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
      throw new Error('Authentication required. Please log in.')
    }

    // Handle permission errors
    if (response.status === 403) {
      throw new Error('You do not have permission to perform this action.')
    }

    if (!response.ok) {
      const errorData: ApiError = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`,
        statusCode: response.status,
      }))
      
      // Retry on server errors (5xx) but not client errors (4xx)
      if (response.status >= 500 && retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount)
        console.warn(`[API] Server error. Retrying after ${delay}ms...`)
        await sleep(delay)
        return apiRequest<T>(endpoint, options, retryCount + 1)
      }
      
      throw new Error(errorData.message || `API request failed: ${response.status}`)
    }

    // NestJS returns data directly, not wrapped in ApiResponse
    const data: T = await response.json()
    return { data, success: true } as ApiResponse<T>
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      console.error(`[API Error] ${endpoint}:`, error.message)
      
      // Retry on network errors
      if (error.name === 'TypeError' && retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount)
        console.warn(`[API] Network error. Retrying after ${delay}ms...`)
        await sleep(delay)
        return apiRequest<T>(endpoint, options, retryCount + 1)
      }
      
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
      apiRequest<User>('/auth/me'),
    
    update: async (id: string, data: Partial<User>) =>
      apiRequest<User>(`/users/${id}`, {
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

    summary: async () =>
      apiRequest<any>('/accounts/summary'),
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
    list: async () =>
      apiRequest<Loan[]>('/loans'),
    
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

    // Payments
    getPayments: async (loanId: string) =>
      apiRequest<any[]>(`/loans/${loanId}/payments`),

    addPayment: async (loanId: string, data: { amount: number; payment_date: string; notes?: string }) =>
      apiRequest<any>(`/loans/${loanId}/payments`, {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    // Projection
    getProjection: async (loanId: string, extraPayment?: number) => {
      const query = extraPayment ? `?extra_payment=${extraPayment}` : ''
      return apiRequest<any>(`/loans/${loanId}/payoff-projection${query}`)
    },
  },

  // Insights endpoints
  insights: {
    list: async () =>
      apiRequest<any[]>('/insights'),

    get: async (id: string) =>
      apiRequest<any>(`/insights/${id}`),

    create: async (data: any) =>
      apiRequest<any>('/insights', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: async (id: string, data: any) =>
      apiRequest<any>(`/insights/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: async (id: string) =>
      apiRequest<void>(`/insights/${id}`, {
        method: 'DELETE',
      }),

    getSummary: async () =>
      apiRequest<{ total_insights: number; high_priority: number; medium_priority: number; low_priority: number; financial_health_score: number; last_generated?: string }>('/insights/summary'),

    acknowledge: async (id: string) =>
      apiRequest<void>(`/insights/${id}/acknowledge`, {
        method: 'POST',
      }),

    dismiss: async (id: string) =>
      apiRequest<void>(`/insights/${id}/dismiss`, {
        method: 'POST',
      }),
    
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
    list: async (params?: ListParams & { status?: 'READ' | 'UNREAD' }) => {
      const query = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) query.append(key, String(value))
        })
      }
      return apiRequest<any[]>(`/notifications/my?${query}`)
    },

    getUnreadCount: async () =>
      apiRequest<{ count: number }>('/notifications/unread-count'),
    
    markAsRead: async (id: string) =>
      apiRequest<void>(`/notifications/${id}/read`, {
        method: 'PATCH',
        body: JSON.stringify({}),
      }),
    
    markAllAsRead: async () =>
      apiRequest<void>('/notifications/read-all', {
        method: 'PATCH',
      }),

    delete: async (id: string) =>
      apiRequest<void>(`/notifications/${id}`, {
        method: 'DELETE',
      }),

    getPreferences: async () =>
      apiRequest<any>('/notification-preferences'),

    updatePreferences: async (data: any) =>
      apiRequest<any>('/notification-preferences', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
  },

  // Simulations endpoints
  simulations: {
    list: async (params?: ListParams) => {
      const query = new URLSearchParams()
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined) query.append(key, String(value))
        })
      }
      return apiRequest<any[]>(`/simulations?${query}`)
    },

    get: async (id: string) =>
      apiRequest<any>(`/simulations/${id}`),

    create: async (data: any) =>
      apiRequest<any>('/simulations', {
        method: 'POST',
        body: JSON.stringify(data),
      }),

    update: async (id: string, data: any) =>
      apiRequest<any>(`/simulations/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),

    delete: async (id: string) =>
      apiRequest<void>(`/simulations/${id}`, {
        method: 'DELETE',
      }),

    run: async (id: string, parameters?: any) =>
      apiRequest<any>(`/simulations/${id}/run`, {
        method: 'POST',
        body: JSON.stringify(parameters || {}),
      }),
  },

  // Households endpoints (extended)
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

    // Members management - NOT YET IMPLEMENTED IN BACKEND
    // TODO: Uncomment when backend implements these endpoints
    // getMembers: async (householdId: string) =>
    //   apiRequest<any[]>(`/households/${householdId}/members`),

    // addMember: async (householdId: string, data: { email: string; role: string }) =>
    //   apiRequest<any>(`/households/${householdId}/members`, {
    //     method: 'POST',
    //     body: JSON.stringify(data),
    //   }),

    // updateMemberRole: async (householdId: string, userId: string, role: string) =>
    //   apiRequest<any>(`/households/${householdId}/members/${userId}`, {
    //     method: 'PATCH',
    //     body: JSON.stringify({ role }),
    //   }),

    // removeMember: async (householdId: string, userId: string) =>
    //   apiRequest<void>(`/households/${householdId}/members/${userId}`, {
    //     method: 'DELETE',
    //   }),

    getStats: async (householdId: string) =>
      apiRequest<any>(`/households/${householdId}/stats`),
  },
}

export default api