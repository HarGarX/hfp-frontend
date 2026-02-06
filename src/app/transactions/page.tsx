'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, TrendingDown, ArrowLeftRight, CreditCard, BarChart3 } from 'lucide-react';
import { 
  Button,
  Card,
  CardContent,
  Modal,
  ModalBody,
  ModalHeader,
} from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction, useAccounts, useCategories } from '@/lib/hooks/useApi';
import { PageLoader } from '@/components/LoadingSpinner';
import { Account, Category } from '@/lib/types';
import { EmptyState } from '@/components/EmptyState';
import { TransactionForm, type TransactionFormData } from '@/components/forms/TransactionForm';
import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';

export default function TransactionsPage() {
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions();
  const { data: accounts = [], isLoading: accountsLoading } = useAccounts();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const createTransaction = useCreateTransaction();
  const updateTransaction = useUpdateTransaction();
  const deleteTransaction = useDeleteTransaction();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handleCreateTransaction = async (data: TransactionFormData) => {
    await createTransaction.mutateAsync(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdateTransaction = async (data: TransactionFormData) => {
    if (!selectedTransaction) return;
    await updateTransaction.mutateAsync({ id: selectedTransaction.id, data });
    setIsEditModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleDeleteTransaction = async () => {
    if (!selectedTransaction) return;
    await deleteTransaction.mutateAsync(selectedTransaction.id);
    setIsDeleteModalOpen(false);
    setSelectedTransaction(null);
  };

  const isLoading = transactionsLoading || accountsLoading || categoriesLoading;
  if (isLoading) return <PageLoader />;

  const getTransactionIcon = (type: string) => {
    const iconMap: Record<string, React.ElementType> = {
      'income': TrendingUp,
      'expense': TrendingDown,
      'transfer': ArrowLeftRight,
    };
    return iconMap[type] || CreditCard;
  };

  const getTransactionColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'income': 'from-green-500 to-emerald-600',
      'expense': 'from-red-500 to-rose-600',
      'transfer': 'from-blue-500 to-indigo-600',
    };
    return colorMap[type] || 'from-gray-500 to-gray-600';
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find((acc: Account) => acc.id === accountId);
    return account?.name || 'Unknown Account';
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find((cat: Category) => cat.id === categoryId);
    return category?.name || 'Unknown';
  };

  const totalIncome = transactions
    .filter(t => t.transaction_type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  
  const totalExpenses = transactions
    .filter(t => t.transaction_type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  const netBalance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Transactions
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Track all your financial transactions
              </p>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              size="default"
              className="shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Transactions
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {transactions.length}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                    Total Income
                  </p>
                  <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                    {formatCurrency(totalIncome)}
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
                    Total Expenses
                  </p>
                  <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                    {formatCurrency(totalExpenses)}
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
                  <p className={`mt-2 text-3xl font-bold ${
                    netBalance >= 0 
                      ? 'text-green-600 dark:text-green-400' 
                      : 'text-red-600 dark:text-red-400'
                  }`}>
                    {formatCurrency(netBalance)}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    netBalance >= 0
                      ? 'bg-green-100 dark:bg-green-950/50'
                      : 'bg-red-100 dark:bg-red-950/50'
                  }`}>
                    <CreditCard className={`w-6 h-6 ${
                      netBalance >= 0
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400'
                    }`} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Transactions List */}
        {transactions.length === 0 ? (
          <EmptyState
            icon={CreditCard}
            title="No transactions yet"
            description="Get started by adding your first transaction"
            action={{ label: "Add Transaction", onClick: () => setIsCreateModalOpen(true) }}
          />
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const Icon = getTransactionIcon(transaction.transaction_type);
              const gradientClass = getTransactionColor(transaction.transaction_type);
              
              return (
                <Card 
                  key={transaction.id}
                  className="border-0 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center p-6">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Transaction Info */}
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {transaction.description}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            transaction.transaction_type === 'income'
                              ? 'bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-400'
                              : transaction.transaction_type === 'expense'
                              ? 'bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                              : 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                          }`}>
                            {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {getAccountName(transaction.account_id)}
                          </span>
                          <span className="text-gray-400 dark:text-gray-600">•</span>
                          <span className="text-gray-500">
                            {getCategoryName(transaction.category_id)}
                          </span>
                          {transaction.merchant && (
                            <>
                              <span className="text-gray-400 dark:text-gray-600">•</span>
                              <span className="text-gray-500">{transaction.merchant}</span>
                            </>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="ml-6 flex-shrink-0 text-right">
                        <p className={`text-xl font-bold ${
                          transaction.transaction_type === 'income'
                            ? 'text-green-600 dark:text-green-400'
                            : transaction.transaction_type === 'expense'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {transaction.transaction_type === 'expense' ? '-' : '+'}
                          {formatCurrency(Number(transaction.amount) || 0)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {transaction.currency}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="ml-6 flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setIsEditModalOpen(true);
                          }}
                          className="hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setIsDeleteModalOpen(true);
                          }}
                          className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        size="lg"
      >
        <ModalHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Create New Transaction
          </h2>
        </ModalHeader>
        <ModalBody>
          <TransactionForm
            accounts={accounts}
            categories={categories}
            onSubmit={handleCreateTransaction}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createTransaction.isPending}
            mode="create"
          />
        </ModalBody>
      </Modal>

      {/* Edit Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        size="lg"
      >
        <ModalHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Edit Transaction
          </h2>
        </ModalHeader>
        <ModalBody>
          {selectedTransaction && (
            <TransactionForm
              defaultValues={selectedTransaction}
              accounts={accounts}
              categories={categories}
              onSubmit={handleUpdateTransaction}
              onCancel={() => setIsEditModalOpen(false)}
              isLoading={updateTransaction.isPending}
              mode="edit"
            />
          )}
        </ModalBody>
      </Modal>

      {/* Delete Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        size="sm"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
            Delete Transaction
          </h2>
        </ModalHeader>
        <ModalBody>
          {selectedTransaction && (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this transaction?
              </p>
              
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Description:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedTransaction.description}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Amount:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(Number(selectedTransaction.amount) || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedTransaction.transaction_type.charAt(0).toUpperCase() + selectedTransaction.transaction_type.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  loading={deleteTransaction.isPending}
                  onClick={handleDeleteTransaction}
                >
                  Delete Transaction
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}
