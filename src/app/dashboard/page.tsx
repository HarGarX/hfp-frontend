'use client';

import { useState, useEffect } from 'react';
import { 
  Home, 
  CreditCard, 
  PieChart, 
  TrendingUp, 
  Target, 
  Bell, 
  Settings, 
  Plus,
  DollarSign,
  Users,
  Calendar
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { 
  useAccounts, 
  useAccountsSummary, 
  useTransactions, 
  useGoals, 
  useHouseholds, 
  useMe,
  useCategories
} from '@/lib/hooks/useApi';
import { PageLoader } from '@/components/LoadingSpinner';
import { SpendingOverTimeChart } from '@/components/charts/SpendingOverTimeChart';
import { ExpensesByCategoryChart } from '@/components/charts/ExpensesByCategoryChart';

const QUICK_ACTIONS = [
  { label: 'Add Transaction', icon: Plus, color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'Transfer Money', icon: TrendingUp, color: 'bg-green-500 hover:bg-green-600' },
  { label: 'Pay Bills', icon: CreditCard, color: 'bg-purple-500 hover:bg-purple-600' },
  { label: 'Set Goal', icon: Target, color: 'bg-orange-500 hover:bg-orange-600' },
];

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

  // API hooks
  const { data: user } = useMe();
  const { data: households = [] } = useHouseholds();
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: accountsSummary } = useAccountsSummary();
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions({ limit: 100 });
  const { data: goals = [], isLoading: goalsLoading } = useGoals({ limit: 3 });
  const { data: categories = [] } = useCategories();

  const household = households[0];
  const isLoading = accountsLoading || transactionsLoading || goalsLoading;

  if (isLoading) return <PageLoader />;

  const totalBalance = accountsSummary?.totalBalance || accounts.reduce((sum: number, acc: any) => sum + acc.balance, 0);
  const monthlyIncome = accountsSummary?.monthlyIncome || 0;
  const monthlyExpenses = accountsSummary?.monthlyExpenses || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Home className="w-8 h-8 text-indigo-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">HFP Dashboard</h1>
                <p className="text-sm text-gray-600">{household?.name || user?.email || 'My Household'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white mb-8">
          <h2 className="text-3xl font-bold mb-2">Welcome to Your Financial Dashboard!</h2>
          <p className="text-indigo-100 mb-4">
            You've successfully completed the onboarding process. Here's your financial overview.
          </p>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span>{accounts.length} Accounts</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Active Dashboard</span>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(monthlyIncome)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Monthly Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(monthlyExpenses)}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Net Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(monthlyIncome - monthlyExpenses)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <SpendingOverTimeChart transactions={transactions} />
          <ExpensesByCategoryChart transactions={transactions} categories={categories} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Transactions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {transactions.slice(0, 5).map((transaction: any) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        transaction.amount > 0 ? "bg-green-100" : "bg-red-100"
                      )}>
                        {transaction.amount > 0 ? (
                          <TrendingUp className="w-5 h-5 text-green-600" />
                        ) : (
                          <CreditCard className="w-5 h-5 text-red-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{transaction.description || 'Transaction'}</p>
                        <p className="text-sm text-gray-500">{transaction.category?.name || 'Uncategorized'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-semibold",
                        transaction.amount > 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-500">{new Date(transaction.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Goals and Quick Actions */}
          <div className="space-y-6">
            {/* Financial Goals */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Goals</h3>
              <div className="space-y-4">
                {goals.map((goal: any) => (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{goal.name}</span>
                      <span className="text-sm text-gray-500">{Math.round((goal.current_amount / goal.target_amount) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min((goal.current_amount / goal.target_amount) * 100, 100)}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {formatCurrency(goal.current_amount)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatCurrency(goal.target_amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {QUICK_ACTIONS.map((action, index) => (
                  <button
                    key={index}
                    className={cn(
                      "flex flex-col items-center justify-center p-4 rounded-lg text-white transition-colors",
                      action.color
                    )}
                  >
                    <action.icon className="w-6 h-6 mb-2" />
                    <span className="text-xs font-medium text-center">{action.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Account Summary */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Summary</h3>
              <div className="space-y-3">
                {accounts.map((account: any) => (
                  <div key={account.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{account.name}</span>
                    </div>
                    <span className={cn(
                      "text-sm font-semibold",
                      account.balance >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {formatCurrency(account.balance)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}