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

// Mock data for dashboard (will be replaced with real API calls)
const MOCK_DATA = {
  household: {
    name: "The Smith Family",
    totalBalance: 15750.50,
    monthlyIncome: 8500.00,
    monthlyExpenses: 6200.00,
    members: 3
  },
  recentTransactions: [
    { id: 1, description: 'Grocery Store', amount: -125.50, date: '2024-11-13', category: 'Food' },
    { id: 2, description: 'Salary Deposit', amount: 4250.00, date: '2024-11-12', category: 'Income' },
    { id: 3, description: 'Electric Bill', amount: -89.25, date: '2024-11-11', category: 'Utilities' },
    { id: 4, description: 'Gas Station', amount: -45.00, date: '2024-11-10', category: 'Transportation' },
  ],
  goals: [
    { id: 1, name: 'Emergency Fund', target: 25000, current: 15750, progress: 63 },
    { id: 2, name: 'Vacation Fund', target: 5000, current: 2100, progress: 42 },
    { id: 3, name: 'Home Renovation', target: 15000, current: 3200, progress: 21 },
  ],
  accounts: [
    { id: 1, name: 'Checking Account', balance: 4250.50, type: 'checking' },
    { id: 2, name: 'Savings Account', balance: 11500.00, type: 'savings' },
    { id: 3, name: 'Credit Card', balance: -850.00, type: 'credit' },
  ]
};

const QUICK_ACTIONS = [
  { label: 'Add Transaction', icon: Plus, color: 'bg-blue-500 hover:bg-blue-600' },
  { label: 'Transfer Money', icon: TrendingUp, color: 'bg-green-500 hover:bg-green-600' },
  { label: 'Pay Bills', icon: CreditCard, color: 'bg-purple-500 hover:bg-purple-600' },
  { label: 'Set Goal', icon: Target, color: 'bg-orange-500 hover:bg-orange-600' },
];

export default function DashboardPage() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30d');

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
                <p className="text-sm text-gray-600">{MOCK_DATA.household.name}</p>
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
              <span>{MOCK_DATA.household.members} Members</span>
            </div>
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span>Since November 2024</span>
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
                  {formatCurrency(MOCK_DATA.household.totalBalance)}
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
                  {formatCurrency(MOCK_DATA.household.monthlyIncome)}
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
                  {formatCurrency(MOCK_DATA.household.monthlyExpenses)}
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
                  {formatCurrency(MOCK_DATA.household.monthlyIncome - MOCK_DATA.household.monthlyExpenses)}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <PieChart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
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
                {MOCK_DATA.recentTransactions.map((transaction) => (
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
                        <p className="font-medium text-gray-900">{transaction.description}</p>
                        <p className="text-sm text-gray-500">{transaction.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={cn(
                        "font-semibold",
                        transaction.amount > 0 ? "text-green-600" : "text-red-600"
                      )}>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount)}
                      </p>
                      <p className="text-sm text-gray-500">{transaction.date}</p>
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
                {MOCK_DATA.goals.map((goal) => (
                  <div key={goal.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{goal.name}</span>
                      <span className="text-sm text-gray-500">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {formatCurrency(goal.current)}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatCurrency(goal.target)}
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
                {MOCK_DATA.accounts.map((account) => (
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