'use client';

import React from 'react';
import { Wallet, TrendingUp, TrendingDown, CreditCard, Target, BarChart3, PieChart, DollarSign } from 'lucide-react';
import { 
  Card,
  CardContent,
} from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { 
  useAccounts, 
  useTransactions, 
  useGoals,
  useCategories
} from '@/lib/hooks/useApi';
import { PageLoader } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { SpendingOverTimeChart } from '@/components/charts/SpendingOverTimeChart';
import { ExpensesByCategoryChart } from '@/components/charts/ExpensesByCategoryChart';
import type { Account, Transaction, Category } from '@/lib/types';
import { format, subDays, isAfter } from 'date-fns';

export default function DashboardPage() {
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions({ limit: 100 });
  const { data: goals = [], isLoading: goalsLoading } = useGoals({ limit: 5 });
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  const isLoading = accountsLoading || transactionsLoading || goalsLoading || categoriesLoading;

  if (isLoading) return <PageLoader />;

  // Calculate stats
  const totalBalance = accounts.reduce((sum: number, account: Account) => 
    sum + (Number(account.current_balance) || 0), 0);

  const activeAccounts = accounts.filter((acc: Account) => acc.is_active).length;

  // Last 30 days transactions
  const last30Days = subDays(new Date(), 30);
  const recentTransactions = transactions.filter((t: Transaction) => 
    isAfter(new Date(t.date), last30Days)
  );

  const monthlyIncome = recentTransactions
    .filter((t: Transaction) => t.transaction_type === 'income')
    .reduce((sum: number, t: Transaction) => sum + (Number(t.amount) || 0), 0);

  const monthlyExpenses = recentTransactions
    .filter((t: Transaction) => t.transaction_type === 'expense')
    .reduce((sum: number, t: Transaction) => sum + (Number(t.amount) || 0), 0);

  const netBalance = monthlyIncome - monthlyExpenses;

  // Top spending categories
  const categorySpending = recentTransactions
    .filter((t: Transaction) => t.transaction_type === 'expense' && t.category_id)
    .reduce((acc: Record<string, { name: string; amount: number; icon?: string; color?: string }>, t: Transaction) => {
      const category = categories.find((c: Category) => c.id === t.category_id);
      const categoryId = t.category_id!;
      
      if (!acc[categoryId]) {
        acc[categoryId] = {
          name: category?.name || 'Unknown',
          icon: category?.icon,
          color: category?.color,
          amount: 0
        };
      }
      acc[categoryId].amount += Number(t.amount) || 0;
      return acc;
    }, {});

  const topCategories = Object.values(categorySpending)
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  // Recent transactions for display
  const recentTransactionsList = transactions.slice(0, 8);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Your financial overview and insights
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Balance
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(totalBalance)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    {activeAccounts} active accounts
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monthly Income
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(monthlyIncome)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Last 30 days
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-950/50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Monthly Expenses
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(monthlyExpenses)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Last 30 days
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-950/50 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Net Balance
                  </p>
                  <p className={`mt-2 text-3xl font-bold ${netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {formatCurrency(netBalance)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Income - Expenses
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 ${netBalance >= 0 ? 'bg-green-100 dark:bg-green-950/50' : 'bg-red-100 dark:bg-red-950/50'} rounded-xl flex items-center justify-center`}>
                    <DollarSign className={`w-6 h-6 ${netBalance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <SpendingOverTimeChart transactions={transactions} />
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <ExpensesByCategoryChart transactions={transactions} categories={categories} />
            </CardContent>
          </Card>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Transactions - 2 columns */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Recent Transactions
                  </h2>
                  <a 
                    href="/transactions" 
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    View All →
                  </a>
                </div>

                {recentTransactionsList.length === 0 ? (
                  <EmptyState
                    icon={BarChart3}
                    title="No transactions yet"
                    description="Your recent transactions will appear here"
                  />
                ) : (
                  <div className="space-y-3">
                    {recentTransactionsList.map((transaction: Transaction) => {
                      const category = categories.find((c: Category) => c.id === transaction.category_id);
                      const account = accounts.find((a: Account) => a.id === transaction.account_id);
                      
                      const getGradient = () => {
                        if (transaction.transaction_type === 'income') return 'from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700';
                        if (transaction.transaction_type === 'expense') return 'from-red-500 to-rose-600 dark:from-red-600 dark:to-rose-700';
                        return 'from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700';
                      };

                      const Icon = transaction.transaction_type === 'income' ? TrendingUp : 
                                   transaction.transaction_type === 'expense' ? TrendingDown : 
                                   CreditCard;

                      return (
                        <div 
                          key={transaction.id} 
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            <div className={`w-10 h-10 bg-gradient-to-br ${getGradient()} rounded-xl flex items-center justify-center flex-shrink-0`}>
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {transaction.description}
                              </p>
                              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                {category?.icon} {category?.name || 'Uncategorized'} • {account?.name || 'Unknown'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right ml-4 flex-shrink-0">
                            <p className={`text-sm font-semibold ${transaction.transaction_type === 'income' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {transaction.transaction_type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(Number(transaction.amount) || 0))}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {format(new Date(transaction.date), 'MMM dd')}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-4">
            {/* Top Spending Categories */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Top Spending
                </h2>

                {topCategories.length === 0 ? (
                  <EmptyState
                    icon={PieChart}
                    title="No spending data"
                    description="Expense categories will appear here"
                  />
                ) : (
                  <div className="space-y-4">
                    {topCategories.map((category, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2 min-w-0 flex-1">
                            {category.icon && <span className="text-base flex-shrink-0">{category.icon}</span>}
                            <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {category.name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white ml-2 flex-shrink-0">
                            {formatCurrency(category.amount)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(category.amount / topCategories[0].amount) * 100}%`,
                              backgroundColor: category.color || '#3b82f6'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Goals */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Financial Goals
                  </h2>
                  <a 
                    href="/goals" 
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    View All →
                  </a>
                </div>

                {goals.length === 0 ? (
                  <EmptyState
                    icon={Target}
                    title="No goals set"
                    description="Create financial goals to track progress"
                  />
                ) : (
                  <div className="space-y-4">
                    {goals.slice(0, 3).map((goal: any) => {
                      const progress = (goal.current_amount / goal.target_amount) * 100;
                      
                      return (
                        <div key={goal.id}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2 min-w-0 flex-1">
                              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                              <span className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {goal.name}
                              </span>
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 ml-2 flex-shrink-0">
                              {Math.round(progress)}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2 mb-1">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {formatCurrency(goal.current_amount || 0)}
                            </span>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {formatCurrency(goal.target_amount)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card className="border-0 shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Accounts
                  </h2>
                  <a 
                    href="/accounts" 
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                  >
                    View All →
                  </a>
                </div>

                {accounts.length === 0 ? (
                  <EmptyState
                    icon={Wallet}
                    title="No accounts"
                    description="Add your first account to get started"
                  />
                ) : (
                  <div className="space-y-3">
                    {accounts.slice(0, 5).map((account: Account) => (
                      <div 
                        key={account.id} 
                        className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CreditCard className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {account.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                              {account.bank_name}
                            </p>
                          </div>
                        </div>
                        <span className={`text-sm font-semibold ml-3 flex-shrink-0 ${Number(account.current_balance) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {formatCurrency(Number(account.current_balance) || 0)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
