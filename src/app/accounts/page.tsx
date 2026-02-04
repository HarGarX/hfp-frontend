'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Wallet, TrendingUp, CreditCard, Building2, Banknote, TrendingDown, Briefcase, CircleDot } from 'lucide-react';
import { 
  Button,
  Card,
  CardContent,
  Modal,
  ModalBody,
  ModalHeader,
} from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/lib/hooks/useApi';
import { PageLoader } from '@/components/LoadingSpinner';
import { EmptyState } from '@/components/EmptyState';
import { AccountForm, type AccountFormData } from '@/components/forms/AccountForm';
import type { Account } from '@/lib/types';

export default function AccountsPage() {
  const { data: accounts = [], isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  const handleCreateAccount = async (data: AccountFormData) => {
    await createAccount.mutateAsync(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdateAccount = async (data: AccountFormData) => {
    if (!selectedAccount) return;
    
    // Filter out fields not allowed in UpdateAccountDto
    const { account_type, provider, ...updateData } = data;
    
    // Map provider to external_provider if provided
    const finalData = {
      ...updateData,
      ...(provider && { external_provider: provider }),
    };
    
    await updateAccount.mutateAsync({ id: selectedAccount.id, data: finalData });
    setIsEditModalOpen(false);
    setSelectedAccount(null);
  };

  const handleDeleteAccount = async () => {
    if (!selectedAccount) return;
    await deleteAccount.mutateAsync(selectedAccount.id);
    setIsDeleteModalOpen(false);
    setSelectedAccount(null);
  };

  if (isLoading) return <PageLoader />;

  const getAccountIcon = (type: string) => {
    const iconMap: Record<string, React.ElementType> = {
      'checking': Wallet,
      'savings': TrendingUp,
      'credit_card': CreditCard,
      'investment': TrendingUp,
      'cash': Banknote,
      'loan': TrendingDown,
      'business': Briefcase,
      'other': CircleDot,
    };
    return iconMap[type] || CircleDot;
  };

  const totalBalance = accounts.reduce((sum, account) => sum + (Number(account.current_balance) || 0), 0);
  const activeAccounts = accounts.filter(acc => acc.is_active).length;
  const creditAvailable = Math.abs(accounts.filter(acc => acc.account_type === 'credit_card').reduce((sum, acc) => sum + (Number(acc.current_balance) || 0), 0));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Accounts
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Manage your financial accounts and track balances
              </p>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              size="default"
              className="shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Account
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
                    Across all accounts
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
                    Active Accounts
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {activeAccounts}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Currently in use
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-950/50 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                    Credit Available
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(creditAvailable)}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Credit card limits
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/50 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Accounts List */}
        {accounts.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No accounts yet"
            description="Get started by adding your first financial account"
            action={{ label: "Add Account", onClick: () => setIsCreateModalOpen(true) }}
          />
        ) : (
          <div className="space-y-3">
            {accounts.map((account) => {
              const Icon = getAccountIcon(account.account_type);
              
              return (
                <Card 
                  key={account.id}
                  className="border-0 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center p-6">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Account Info */}
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {account.name}
                          </h3>
                          {!account.is_active && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                              Inactive
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {account.bank_name || 'No bank'}
                          </span>
                          <span className="text-gray-400 dark:text-gray-600">•</span>
                          <span className="text-gray-500">
                            {account.account_type.replace('_', ' ').charAt(0).toUpperCase() + account.account_type.replace('_', ' ').slice(1)}
                          </span>
                        </div>
                      </div>

                      {/* Balance */}
                      <div className="ml-6 flex-shrink-0 text-right">
                        <p className={`text-xl font-bold ${
                          Number(account.current_balance) >= 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {formatCurrency(Number(account.current_balance) || 0)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {account.currency}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="ml-6 flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedAccount(account);
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
                            setSelectedAccount(account);
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
            Create New Account
          </h2>
        </ModalHeader>
        <ModalBody>
          <AccountForm
            onSubmit={handleCreateAccount}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createAccount.isPending}
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
            Edit Account
          </h2>
        </ModalHeader>
        <ModalBody>
          {selectedAccount && (
            <AccountForm
              defaultValues={selectedAccount}
              onSubmit={handleUpdateAccount}
              onCancel={() => setIsEditModalOpen(false)}
              isLoading={updateAccount.isPending}
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
            Delete Account
          </h2>
        </ModalHeader>
        <ModalBody>
          {selectedAccount && (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete <strong className="text-gray-900 dark:text-white">"{selectedAccount.name}"</strong>?
              </p>
              
              <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Warning:</strong> This action cannot be undone. Transaction history will be preserved.
                </p>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Current Balance:</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(Number(selectedAccount.current_balance) || 0)}
                  </span>
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
                  loading={deleteAccount.isPending}
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}
