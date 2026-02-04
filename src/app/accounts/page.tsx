'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, CreditCard, Wallet } from 'lucide-react';
import { 
  Button,
  Input,
  Select,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Badge,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from '@/components/ui';
import { Form, FormSection, FormActions } from '@/components/forms/FormComponents';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { useAccounts, useCreateAccount, useUpdateAccount, useDeleteAccount } from '@/lib/hooks/useApi';
import { PageLoader } from '@/components/LoadingSpinner';
import type { Account, CreateAccountRequest } from '@/lib/types';

const ACCOUNT_TYPES = [
  { value: 'CHECKING', label: 'Checking Account' },
  { value: 'SAVINGS', label: 'Savings Account' },
  { value: 'CREDIT', label: 'Credit Card' },
  { value: 'INVESTMENT', label: 'Investment Account' },
  { value: 'LOAN', label: 'Loan Account' },
];

export default function AccountsPage() {
  const { data: accounts = [], isLoading } = useAccounts();
  const createAccount = useCreateAccount();
  const updateAccount = useUpdateAccount();
  const deleteAccount = useDeleteAccount();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

  if (isLoading) return <PageLoader />;

  const getAccountIcon = (type: string) => {
    switch (type) {
      case 'CHECKING':
      case 'SAVINGS':
        return <Wallet className="w-5 h-5 text-blue-600" />;
      case 'CREDIT':
        return <CreditCard className="w-5 h-5 text-purple-600" />;
      default:
        return <Wallet className="w-5 h-5 text-gray-600" />;
    }
  };

  const getAccountBadgeColor = (type: string) => {
    switch (type) {
      case 'CHECKING':
        return 'info';
      case 'SAVINGS':
        return 'success';
      case 'CREDIT':
        return 'warning';
      case 'INVESTMENT':
        return 'purple';
      case 'LOAN':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const handleCreateAccount = async (accountData: CreateAccountRequest) => {
    try {
      await createAccount.mutateAsync(accountData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create account:', error);
    }
  };

  const handleEditAccount = async (accountData: CreateAccountRequest) => {
    if (!selectedAccount) return;
    
    try {
      await updateAccount.mutateAsync({ id: selectedAccount.id, data: accountData });
      setIsEditModalOpen(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Failed to update account:', error);
    }
  };

  const handleDeleteAccount = async (id: string) => {
    try {
      await deleteAccount.mutateAsync(id);
      setIsDeleteModalOpen(false);
      setSelectedAccount(null);
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  const activeAccounts = accounts.filter(acc => acc.is_active).length;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Accounts</h1>
          <p className="text-gray-600">Manage your financial accounts</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Account
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <Wallet className="w-8 h-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Accounts</p>
                <p className="text-2xl font-bold text-gray-900">{activeAccounts}</p>
              </div>
              <CreditCard className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Credit Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(Math.abs(accounts.filter(acc => acc.account_type === 'credit_card').reduce((sum, acc) => sum + acc.balance, 0)))}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accounts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Bank</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      {getAccountIcon(account.account_type)}
                      <div>
                        <p className="font-medium">{account.name}</p>
                        <p className="text-sm text-gray-500">
                          Created {new Date(account.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getAccountBadgeColor(account.account_type) as any}>
                      {ACCOUNT_TYPES.find(type => type.value === account.account_type)?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.bank_name || 'N/A'}</TableCell>
                  <TableCell className="text-right">
                    <span className={account.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(account.balance)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={account.is_active ? 'success' : 'secondary'}>
                      {account.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedAccount(account);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedAccount(account);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Account Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        size="md"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold">Create New Account</h2>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => e.preventDefault()}>
            <FormSection>
              <div className="space-y-4">
                <Input
                  label="Account Name"
                  placeholder="e.g., Main Checking Account"
                  required
                />
                <Select
                  label="Account Type"
                  placeholder="Select account type"
                  options={ACCOUNT_TYPES}
                  required
                />
                <Input
                  label="Bank/Institution Name"
                  placeholder="e.g., Chase Bank"
                  required
                />
                <Input
                  type="number"
                  label="Initial Balance"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
                <Select
                  label="Currency"
                  placeholder="Select currency"
                  options={[
                    { value: 'USD', label: 'US Dollar (USD)' },
                    { value: 'EUR', label: 'Euro (EUR)' },
                    { value: 'GBP', label: 'British Pound (GBP)' },
                    { value: 'CAD', label: 'Canadian Dollar (CAD)' }
                  ]}
                  required
                />
              </div>
            </FormSection>
          </Form>
        </ModalBody>
        <ModalFooter>
          <FormActions>
            <Button 
              variant="outline" 
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              loading={createAccount.isPending}
              onClick={() => handleCreateAccount({
                name: 'Sample Account',
                account_type: 'checking',
                bank_name: 'Sample Bank',
                balance: 1000,
                currency: 'USD'
              })}
            >
              Create Account
            </Button>
          </FormActions>
        </ModalFooter>
      </Modal>

      {/* Edit Account Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        size="md"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold">Edit Account</h2>
        </ModalHeader>
        <ModalBody>
          {selectedAccount && (
            <Form onSubmit={(e) => e.preventDefault()}>
              <FormSection>
                <div className="space-y-4">
                  <Input
                    label="Account Name"
                    defaultValue={selectedAccount.name}
                    placeholder="e.g., Main Checking Account"
                    required
                  />
                  <Select
                    label="Account Type"
                    defaultValue={selectedAccount.account_type}
                    options={ACCOUNT_TYPES}
                    required
                  />
                  <Input
                    label="Bank/Institution Name"
                    defaultValue={selectedAccount.bank_name}
                    placeholder="e.g., Chase Bank"
                    required
                  />
                  <Input
                    type="number"
                    label="Current Balance"
                    defaultValue={selectedAccount.balance}
                    step="0.01"
                    required
                  />
                  <Select
                    label="Currency"
                    defaultValue={selectedAccount.currency}
                    options={[
                      { value: 'USD', label: 'US Dollar (USD)' },
                      { value: 'EUR', label: 'Euro (EUR)' },
                      { value: 'GBP', label: 'British Pound (GBP)' },
                      { value: 'CAD', label: 'Canadian Dollar (CAD)' }
                    ]}
                    required
                  />
                  <div className="flex items-center space-x-2">
                    <input 
                      type="checkbox" 
                      id="is_active"
                      defaultChecked={selectedAccount.is_active}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="is_active" className="text-sm font-medium">
                      Account is active
                    </label>
                  </div>
                </div>
              </FormSection>
            </Form>
          )}
        </ModalBody>
        <ModalFooter>
          <FormActions>
            <Button 
              variant="outline" 
              onClick={() => setIsEditModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="default"
              loading={updateAccount.isPending}
              onClick={() => selectedAccount && handleEditAccount({
                name: selectedAccount.name,
                account_type: selectedAccount.account_type,
                bank_name: selectedAccount.bank_name,
                balance: selectedAccount.balance,
                currency: selectedAccount.currency
              })}
            >
              Update Account
            </Button>
          </FormActions>
        </ModalFooter>
      </Modal>

      {/* Delete Account Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        size="sm"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold text-red-600">Delete Account</h2>
        </ModalHeader>
        <ModalBody>
          {selectedAccount && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete the account "{selectedAccount.name}"?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. All transaction history 
                  associated with this account will be preserved but the account will be marked as deleted.
                </p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-800">
                  Current Balance: <strong>{formatCurrency(selectedAccount.balance)}</strong>
                </p>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <FormActions>
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive"
              loading={isLoading}
              onClick={() => selectedAccount && handleDeleteAccount(selectedAccount.id)}
            >
              Delete Account
            </Button>
          </FormActions>
        </ModalFooter>
      </Modal>

      {/* Modals will be added in the next part */}
    </div>
  );
}