import { useQuery, useMutation, useQueryClient, type UseQueryOptions, type UseMutationOptions } from '@tanstack/react-query'
import { api } from '../api'
import { toast } from '@/components/ui/toast'
import type { 
  Account, 
  Transaction, 
  Category, 
  Goal, 
  Loan, 
  Household,
  User,
  ListParams,
  ApiResponse 
} from '../types'

// Query Keys
export const queryKeys = {
  accounts: ['accounts'] as const,
  account: (id: string) => ['accounts', id] as const,
  accountsSummary: ['accounts', 'summary'] as const,
  
  transactions: (params?: ListParams) => ['transactions', params] as const,
  transaction: (id: string) => ['transactions', id] as const,
  
  categories: ['categories'] as const,
  category: (id: string) => ['categories', id] as const,
  
  goals: ['goals'] as const,
  goal: (id: string) => ['goals', id] as const,
  
  loans: ['loans'] as const,
  loan: (id: string) => ['loans', id] as const,
  loanPayments: (loanId: string) => ['loans', loanId, 'payments'] as const,
  loanProjection: (loanId: string, extraPayment?: number) => ['loans', loanId, 'projection', extraPayment] as const,
  
  insights: ['insights'] as const,
  insight: (id: string) => ['insights', id] as const,
  insightsSummary: ['insights', 'summary'] as const,
  
  notifications: (params?: ListParams) => ['notifications', params] as const,
  notificationsUnread: ['notifications', 'unread'] as const,
  notificationsPreferences: ['notifications', 'preferences'] as const,
  
  simulations: (params?: ListParams) => ['simulations', params] as const,
  simulation: (id: string) => ['simulations', id] as const,
  
  households: ['households'] as const,
  household: (id: string) => ['households', id] as const,
  householdMembers: (householdId: string) => ['households', householdId, 'members'] as const,
  householdStats: (householdId: string) => ['households', householdId, 'stats'] as const,
  
  users: (params?: ListParams) => ['users', params] as const,
  user: (id: string) => ['users', id] as const,
  userMe: ['users', 'me'] as const,
}

// ====================
// ACCOUNTS HOOKS
// ====================

export function useAccounts(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.accounts,
    queryFn: async () => {
      const response = await api.accounts.list(params);
      // Backend returns paginated response: { accounts: [], total, page, totalPages }
      // Extract just the accounts array
      const paginatedData = response.data as any;
      return paginatedData?.accounts || [];
    },
  })
}

export function useAccount(id: string) {
  return useQuery({
    queryKey: queryKeys.account(id),
    queryFn: () => api.accounts.get(id).then(res => res.data),
    enabled: !!id,
  })
}

export function useAccountsSummary() {
  return useQuery({
    queryKey: queryKeys.accountsSummary,
    queryFn: () => api.accounts.summary().then(res => res.data),
  })
}

export function useCreateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.accounts.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      queryClient.invalidateQueries({ queryKey: queryKeys.accountsSummary })
      toast.success('Account created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create account')
    },
  })
}

export function useUpdateAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Account> }) => 
      api.accounts.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      queryClient.invalidateQueries({ queryKey: queryKeys.account(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.accountsSummary })
      toast.success('Account updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update account')
    },
  })
}

export function useDeleteAccount() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.accounts.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      queryClient.invalidateQueries({ queryKey: queryKeys.accountsSummary })
      toast.success('Account deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete account')
    },
  })
}

// ====================
// TRANSACTIONS HOOKS
// ====================

export function useTransactions(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.transactions(params),
    queryFn: () => api.transactions.list(params).then(res => res.data),
  })
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: queryKeys.transaction(id),
    queryFn: () => api.transactions.get(id).then(res => res.data),
    enabled: !!id,
  })
}

export function useCreateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.transactions.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      toast.success('Transaction created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create transaction')
    },
  })
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Transaction> }) => 
      api.transactions.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: queryKeys.transaction(variables.id) })
      toast.success('Transaction updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update transaction')
    },
  })
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.transactions.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: queryKeys.accounts })
      toast.success('Transaction deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete transaction')
    },
  })
}

// ====================
// CATEGORIES HOOKS
// ====================

export function useCategories() {
  return useQuery({
    queryKey: queryKeys.categories,
    queryFn: () => api.categories.list().then(res => res.data),
  })
}

export function useCategory(id: string) {
  return useQuery({
    queryKey: queryKeys.category(id),
    queryFn: () => api.categories.get(id).then(res => res.data),
    enabled: !!id,
  })
}

export function useCreateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.categories.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
      toast.success('Category created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create category')
    },
  })
}

export function useUpdateCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Category> }) => 
      api.categories.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
      queryClient.invalidateQueries({ queryKey: queryKeys.category(variables.id) })
      toast.success('Category updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update category')
    },
  })
}

export function useDeleteCategory() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.categories.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
      toast.success('Category deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete category')
    },
  })
}

// ====================
// GOALS HOOKS
// ====================

export function useGoals(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.goals,
    queryFn: () => api.goals.list(params).then(res => res.data),
  })
}

export function useGoal(id: string) {
  return useQuery({
    queryKey: queryKeys.goal(id),
    queryFn: () => api.goals.get(id).then(res => res.data),
    enabled: !!id,
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.goals.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals })
      toast.success('Goal created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create goal')
    },
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Goal> }) => 
      api.goals.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals })
      queryClient.invalidateQueries({ queryKey: queryKeys.goal(variables.id) })
      toast.success('Goal updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update goal')
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.goals.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.goals })
      toast.success('Goal deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete goal')
    },
  })
}

// ====================
// LOANS HOOKS
// ====================

export function useLoans() {
  return useQuery({
    queryKey: queryKeys.loans,
    queryFn: () => api.loans.list().then(res => res.data),
  })
}

export function useLoan(id: string) {
  return useQuery({
    queryKey: queryKeys.loan(id),
    queryFn: () => api.loans.get(id).then(res => res.data),
    enabled: !!id,
  })
}

export function useLoanPayments(loanId: string) {
  return useQuery({
    queryKey: queryKeys.loanPayments(loanId),
    queryFn: () => api.loans.getPayments(loanId).then(res => res.data),
    enabled: !!loanId,
  })
}

export function useLoanProjection(loanId: string, extraPayment?: number) {
  return useQuery({
    queryKey: queryKeys.loanProjection(loanId, extraPayment),
    queryFn: () => api.loans.getProjection(loanId, extraPayment).then(res => res.data),
    enabled: !!loanId,
  })
}

export function useCreateLoan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.loans.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans })
      toast.success('Loan created successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create loan')
    },
  })
}

export function useUpdateLoan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Loan> }) => 
      api.loans.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans })
      queryClient.invalidateQueries({ queryKey: queryKeys.loan(variables.id) })
      toast.success('Loan updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update loan')
    },
  })
}

export function useDeleteLoan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.loans.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans })
      toast.success('Loan deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete loan')
    },
  })
}

export function useAddLoanPayment() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ loanId, data }: { loanId: string; data: any }) => 
      api.loans.addPayment(loanId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.loans })
      queryClient.invalidateQueries({ queryKey: queryKeys.loan(variables.loanId) })
      queryClient.invalidateQueries({ queryKey: queryKeys.loanPayments(variables.loanId) })
      toast.success('Payment added successfully')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add payment')
    },
  })
}

// ====================
// INSIGHTS HOOKS
// ====================

export function useInsights() {
  return useQuery({
    queryKey: queryKeys.insights,
    queryFn: () => api.insights.list().then(res => res.data),
  })
}

export function useInsight(id: string) {
  return useQuery({
    queryKey: queryKeys.insight(id),
    queryFn: () => api.insights.get(id).then(res => res.data),
    enabled: !!id,
  })
}

export function useInsightsSummary() {
  return useQuery({
    queryKey: queryKeys.insightsSummary,
    queryFn: () => api.insights.getSummary().then(res => res.data),
  })
}

export function useAcknowledgeInsight() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.insights.acknowledge,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.insights })
      queryClient.invalidateQueries({ queryKey: queryKeys.insightsSummary })
      toast.success('Insight acknowledged')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to acknowledge insight')
    },
  })
}

export function useDismissInsight() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.insights.dismiss,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.insights })
      queryClient.invalidateQueries({ queryKey: queryKeys.insightsSummary })
      toast.success('Insight dismissed')
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to dismiss insight')
    },
  })
}

// ====================
// NOTIFICATIONS HOOKS
// ====================

export function useNotifications(params?: ListParams & { status?: 'READ' | 'UNREAD' }) {
  return useQuery({
    queryKey: queryKeys.notifications(params),
    queryFn: () => api.notifications.list(params).then(res => res.data),
  })
}

export function useNotificationsUnreadCount() {
  return useQuery({
    queryKey: queryKeys.notificationsUnread,
    queryFn: () => api.notifications.getUnreadCount().then(res => res.data),
  })
}

export function useNotificationsPreferences() {
  return useQuery({
    queryKey: queryKeys.notificationsPreferences,
    queryFn: () => api.notifications.getPreferences().then(res => res.data),
  })
}

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.notifications.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() })
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationsUnread })
    },
  })
}

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.notifications.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() })
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationsUnread })
    },
  })
}

export function useDeleteNotification() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.notifications.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications() })
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationsUnread })
    },
  })
}

export function useUpdateNotificationsPreferences() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.notifications.updatePreferences,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notificationsPreferences })
    },
  })
}

// ====================
// SIMULATIONS HOOKS
// ====================

export function useSimulations(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.simulations(params),
    queryFn: () => api.simulations.list(params).then(res => res.data),
  })
}

export function useSimulation(id: string) {
  return useQuery({
    queryKey: queryKeys.simulation(id),
    queryFn: () => api.simulations.get(id).then(res => res.data),
    enabled: !!id,
  })
}

export function useCreateSimulation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.simulations.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.simulations() })
    },
  })
}

export function useUpdateSimulation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      api.simulations.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.simulations() })
      queryClient.invalidateQueries({ queryKey: queryKeys.simulation(variables.id) })
    },
  })
}

export function useDeleteSimulation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: api.simulations.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.simulations() })
    },
  })
}

export function useRunSimulation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, parameters }: { id: string; parameters?: any }) => 
      api.simulations.run(id, parameters),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.simulations() })
      queryClient.invalidateQueries({ queryKey: queryKeys.simulation(variables.id) })
    },
  })
}

// ====================
// HOUSEHOLDS HOOKS
// ====================

export function useHouseholds() {
  return useQuery({
    queryKey: queryKeys.households,
    queryFn: () => api.households.list().then(res => res.data),
  })
}

export function useHousehold(id: string) {
  return useQuery({
    queryKey: queryKeys.household(id),
    queryFn: () => api.households.get(id).then(res => res.data),
    enabled: !!id,
  })
}

// TODO: Uncomment when backend implements household members endpoints
// export function useHouseholdMembers(householdId: string) {
//   return useQuery({
//     queryKey: queryKeys.householdMembers(householdId),
//     queryFn: () => api.households.getMembers(householdId).then(res => res.data),
//     enabled: !!householdId,
//   })
// }

export function useHouseholdStats(householdId: string) {
  return useQuery({
    queryKey: queryKeys.householdStats(householdId),
    queryFn: () => api.households.getStats(householdId).then(res => res.data),
    enabled: !!householdId,
  })
}

export function useUpdateHousehold() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Household> }) => 
      api.households.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.households })
      queryClient.invalidateQueries({ queryKey: queryKeys.household(variables.id) })
    },
  })
}

// TODO: Uncomment when backend implements household members endpoints
// export function useAddHouseholdMember() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: ({ householdId, data }: { householdId: string; data: any }) => 
//       api.households.addMember(householdId, data),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.householdMembers(variables.householdId) })
//       queryClient.invalidateQueries({ queryKey: queryKeys.household(variables.householdId) })
//     },
//   })
// }

// export function useUpdateHouseholdMemberRole() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: ({ householdId, userId, role }: { householdId: string; userId: string; role: string }) => 
//       api.households.updateMemberRole(householdId, userId, role),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.householdMembers(variables.householdId) })
//     },
//   })
// }

// export function useRemoveHouseholdMember() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: ({ householdId, userId }: { householdId: string; userId: string }) => 
//       api.households.removeMember(householdId, userId),
//     onSuccess: (_, variables) => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.householdMembers(variables.householdId) })
//       queryClient.invalidateQueries({ queryKey: queryKeys.household(variables.householdId) })
//     },
//   })
// }

// ====================
// USERS HOOKS
// ====================

export function useUsers(params?: ListParams) {
  return useQuery({
    queryKey: queryKeys.users(params),
    queryFn: () => api.users.list(params).then(res => res.data),
  })
}

export function useUser(id: string) {
  return useQuery({
    queryKey: queryKeys.user(id),
    queryFn: () => api.users.get(id).then(res => res.data),
    enabled: !!id,
  })
}

export function useMe() {
  return useQuery({
    queryKey: queryKeys.userMe,
    queryFn: () => api.users.me().then(res => res.data),
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => 
      api.users.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users() })
      queryClient.invalidateQueries({ queryKey: queryKeys.user(variables.id) })
      queryClient.invalidateQueries({ queryKey: queryKeys.userMe })
    },
  })
}
