// Authentication utilities for local JWT-based auth
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  first_name: string
  last_name: string
  household_name?: string
}

export interface AuthResponse {
  access_token: string
  user: {
    id: string
    email: string
    first_name: string
    last_name: string
    role: string
    household_id: string
  }
}

export interface AuthUser {
  id: string
  email: string
  first_name: string
  last_name: string
  role: string
  household_id: string
}

// Token management
const TOKEN_KEY = 'hfp_access_token'
const USER_KEY = 'hfp_user'

export const authStorage = {
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(TOKEN_KEY)
  },
  
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(TOKEN_KEY, token)
  },
  
  getUser: (): AuthUser | null => {
    if (typeof window === 'undefined') return null
    const userStr = localStorage.getItem(USER_KEY)
    return userStr ? JSON.parse(userStr) : null
  },
  
  setUser: (user: AuthUser): void => {
    if (typeof window === 'undefined') return
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },
  
  clear: (): void => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  },
  
  isAuthenticated: (): boolean => {
    return !!authStorage.getToken()
  }
}

// Auth headers for authenticated requests
export const getAuthHeaders = (): HeadersInit => {
  const token = authStorage.getToken()
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  }
}

// Authentication API calls
export const authApi = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Login failed' }))
      throw new Error(error.message || 'Invalid credentials')
    }

    const data: AuthResponse = await response.json()
    
    // Store token and user info
    authStorage.setToken(data.access_token)
    authStorage.setUser(data.user)
    
    return data
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Registration failed' }))
      throw new Error(error.message || 'Registration failed')
    }

    const data: AuthResponse = await response.json()
    
    // Store token and user info
    authStorage.setToken(data.access_token)
    authStorage.setUser(data.user)
    
    return data
  },

  async getCurrentUser(): Promise<AuthUser> {
    const token = authStorage.getToken()
    if (!token) {
      throw new Error('Not authenticated')
    }

    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      // Token might be invalid/expired
      authStorage.clear()
      throw new Error('Session expired')
    }

    const user: AuthUser = await response.json()
    authStorage.setUser(user)
    
    return user
  },

  logout(): void {
    authStorage.clear()
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }
}
