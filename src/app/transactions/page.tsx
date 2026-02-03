'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, Download, ArrowUpDown, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react';
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
import type { Transaction, Account, Category, CreateTransactionRequest } from '@/lib/types';

// Mock data for development
const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    household_id: 'household-1',
    account_id: '1',
    category_id: 'cat-1',
    amount: 125.50,
    currency: 'USD',
    description: 'Grocery shopping at Whole Foods',
    transaction_date: '2024-11-13',
    transaction_type: 'EXPENSE',
    status: 'COMPLETED',
    merchant: 'Whole Foods Market',
    location: 'New York, NY',
    tags: ['groceries', 'food'],
    created_at: '2024-11-13T10:30:00.000Z',
    updated_at: '2024-11-13T10:30:00.000Z',
    deleted_at: undefined
  },
  {
    id: '2',
    household_id: 'household-1',
    account_id: '2',
    category_id: 'cat-2',
    amount: 3200.00,
    currency: 'USD',
    description: 'Monthly salary deposit',
    transaction_date: '2024-11-01',
    transaction_type: 'INCOME',
    status: 'COMPLETED',
    merchant: 'Acme Corp',
    location: 'Direct Deposit',
    tags: ['salary', 'income'],
    created_at: '2024-11-01T08:00:00.000Z',
    updated_at: '2024-11-01T08:00:00.000Z',
    deleted_at: undefined
  },
  {
    id: '3',
    household_id: 'household-1',
    account_id: '1',
    category_id: 'cat-3',
    amount: 500.00,
    currency: 'USD',
    description: 'Transfer to Emergency Savings',
    transaction_date: '2024-11-10',
    transaction_type: 'TRANSFER',
    status: 'COMPLETED',
    location: 'Internal Transfer',
    tags: ['savings', 'emergency-fund'],
    created_at: '2024-11-10T15:20:00.000Z',
    updated_at: '2024-11-10T15:20:00.000Z',
    deleted_at: undefined
  },
  {
    id: '4',
    household_id: 'household-1',
    account_id: '1',
    category_id: 'cat-4',
    amount: 85.20,
    currency: 'USD',
    description: 'Gas station fill-up',
    transaction_date: '2024-11-12',
    transaction_type: 'EXPENSE',
    status: 'COMPLETED',
    merchant: 'Shell',
    location: 'Highway 101',
    tags: ['gas', 'transportation'],
    created_at: '2024-11-12T16:45:00.000Z',
    updated_at: '2024-11-12T16:45:00.000Z',
    deleted_at: undefined
  },
  {
    id: '5',
    household_id: 'household-1',
    account_id: '3',
    category_id: 'cat-5',
    amount: 45.00,
    currency: 'USD',
    description: 'Netflix subscription',
    transaction_date: '2024-11-09',
    transaction_type: 'EXPENSE',
    status: 'PENDING',
    merchant: 'Netflix',
    location: 'Online',
    tags: ['entertainment', 'subscription'],
    created_at: '2024-11-09T12:00:00.000Z',
    updated_at: '2024-11-09T12:00:00.000Z',
    deleted_at: undefined
  }
];

const MOCK_ACCOUNTS: Account[] = [
  { id: '1', name: 'Main Checking', account_type: 'CHECKING', balance: 4250.50 } as Account,
  { id: '2', name: 'Emergency Savings', account_type: 'SAVINGS', balance: 15750.00 } as Account,
  { id: '3', name: 'Travel Rewards Card', account_type: 'CREDIT', balance: -1250.00 } as Account,
];

const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Groceries', color: '#10B981' } as Category,
  { id: 'cat-2', name: 'Salary', color: '#3B82F6' } as Category,
  { id: 'cat-3', name: 'Savings', color: '#8B5CF6' } as Category,
  { id: 'cat-4', name: 'Transportation', color: '#F59E0B' } as Category,
  { id: 'cat-5', name: 'Entertainment', color: '#EF4444' } as Category,
];

const TRANSACTION_TYPES = [
  { value: 'INCOME', label: 'Income' },
  { value: 'EXPENSE', label: 'Expense' },
  { value: 'TRANSFER', label: 'Transfer' },
];

const TRANSACTION_STATUS = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
];

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [accounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [categories] = useState<Category[]>(MOCK_CATEGORIES);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');

  const handleCreateTransaction = async (transactionData: CreateTransactionRequest) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const newTransaction = await api.post('/transactions', transactionData);
      
      // Mock implementation
      const newTransaction: Transaction = {
        id: Date.now().toString(),
        household_id: 'household-1',
        account_id: transactionData.account_id,
        category_id: transactionData.category_id,
        amount: transactionData.amount,
        currency: transactionData.currency,
        description: transactionData.description,
        transaction_date: transactionData.transaction_date,
        transaction_type: transactionData.transaction_type,
        status: 'COMPLETED',
        merchant: transactionData.merchant,
        location: transactionData.location,
        tags: transactionData.tags || [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: undefined
      };
      
      setTransactions([newTransaction, ...transactions]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTransaction = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.put(`/transactions/${id}`, data);
      
      setTransactions(transactions.map(transaction => 
        transaction.id === id ? { ...transaction, ...data, updated_at: new Date().toISOString() } : transaction
      ));
      setIsEditModalOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Failed to update transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/transactions/${id}`);
      
      // Soft delete - mark as deleted instead of removing
      setTransactions(transactions.map(transaction => 
        transaction.id === id ? { ...transaction, deleted_at: new Date().toISOString() } : transaction
      ));
      setIsDeleteModalOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'INCOME':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'EXPENSE':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'TRANSFER':
        return <ArrowRightLeft className="w-4 h-4 text-blue-600" />;
      default:
        return <ArrowUpDown className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'CANCELLED':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'INCOME':
        return 'success';
      case 'EXPENSE':
        return 'destructive';
      case 'TRANSFER':
        return 'info';
      default:
        return 'default';
    }
  };

  const getAccountName = (accountId: string) => {
    const account = accounts.find(acc => acc.id === accountId);
    return account?.name || 'Unknown Account';
  };

  const getCategoryName = (categoryId?: string) => {
    if (!categoryId) return 'Uncategorized';
    const category = categories.find(cat => cat.id === categoryId);
    return category?.name || 'Unknown Category';
  };

  const getFilteredTransactions = () => {
    return transactions.filter(transaction => {
      if (transaction.deleted_at) return false;
      
      const matchesSearch = searchTerm === '' || 
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.merchant?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryName(transaction.category_id).toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || transaction.transaction_type === filterType;
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
      const matchesAccount = filterAccount === 'all' || transaction.account_id === filterAccount;
      
      return matchesSearch && matchesType && matchesStatus && matchesAccount;
    });
  };

  const filteredTransactions = getFilteredTransactions();

  // Calculate summary stats
  const totalIncome = filteredTransactions
    .filter(t => t.transaction_type === 'INCOME' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.transaction_type === 'EXPENSE' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);

  const netAmount = totalIncome - totalExpenses;
  const pendingCount = filteredTransactions.filter(t => t.status === 'PENDING').length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600 mt-1">Track and manage your financial transactions</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Income</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalIncome)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(totalExpenses)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Net Amount</p>
                <p className={`text-2xl font-bold ${netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(netAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {pendingCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search transactions, merchants, categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select
              placeholder="All Types"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              options={[
                { value: 'all', label: 'All Types' },
                ...TRANSACTION_TYPES
              ]}
            />
            
            <Select
              placeholder="All Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                ...TRANSACTION_STATUS
              ]}
            />
            
            <Select
              placeholder="All Accounts"
              value={filterAccount}
              onChange={(e) => setFilterAccount(e.target.value)}
              options={[
                { value: 'all', label: 'All Accounts' },
                ...accounts.map(account => ({
                  value: account.id,
                  label: account.name
                }))
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Transactions ({filteredTransactions.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Account</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {new Date(transaction.transaction_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getTransactionIcon(transaction.transaction_type)}
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        {transaction.merchant && (
                          <p className="text-sm text-gray-500">{transaction.merchant}</p>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {getCategoryName(transaction.category_id)}
                    </Badge>
                  </TableCell>
                  <TableCell>{getAccountName(transaction.account_id)}</TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadgeColor(transaction.transaction_type)} className="text-xs">
                      {transaction.transaction_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeColor(transaction.status)} className="text-xs">
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={
                      transaction.transaction_type === 'INCOME' ? 'text-green-600 font-semibold' :
                      transaction.transaction_type === 'EXPENSE' ? 'text-red-600 font-semibold' :
                      'text-blue-600 font-semibold'
                    }>
                      {transaction.transaction_type === 'INCOME' ? '+' : transaction.transaction_type === 'EXPENSE' ? '-' : ''}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedTransaction(transaction);
                          setIsEditModalOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setSelectedTransaction(transaction);
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

      {/* Create Transaction Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        size="md"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold">Add New Transaction</h2>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => e.preventDefault()}>
            <FormSection>
              <div className="space-y-4">
                <Input
                  label="Description"
                  placeholder="e.g., Grocery shopping"
                  required
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Amount"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                  <Input
                    type="date"
                    label="Date"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Type"
                    placeholder="Select type"
                    options={TRANSACTION_TYPES}
                    required
                  />
                  <Select
                    label="Account"
                    placeholder="Select account"
                    options={accounts.map(account => ({
                      value: account.id,
                      label: account.name
                    }))}
                    required
                  />
                </div>
                <Select
                  label="Category"
                  placeholder="Select category"
                  options={[
                    { value: '', label: 'Uncategorized' },
                    ...categories.map(category => ({
                      value: category.id,
                      label: category.name
                    }))
                  ]}
                />
                <Input
                  label="Merchant/Payee"
                  placeholder="e.g., Whole Foods"
                />
                <Input
                  label="Location"
                  placeholder="e.g., New York, NY"
                />
                <Input
                  label="Tags"
                  placeholder="e.g., groceries, food (comma-separated)"
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
              loading={isLoading}
              onClick={() => handleCreateTransaction({
                account_id: '1',
                category_id: 'cat-1',
                amount: 25.50,
                currency: 'USD',
                description: 'Sample Transaction',
                transaction_date: new Date().toISOString().split('T')[0],
                transaction_type: 'EXPENSE',
                merchant: 'Sample Store',
                location: 'Sample Location',
                tags: ['sample']
              })}
            >
              Add Transaction
            </Button>
          </FormActions>
        </ModalFooter>
      </Modal>

      {/* Edit Transaction Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        size="md"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold">Edit Transaction</h2>
        </ModalHeader>
        <ModalBody>
          {selectedTransaction && (
            <Form onSubmit={(e) => e.preventDefault()}>
              <FormSection>
                <div className="space-y-4">
                  <Input
                    label="Description"
                    defaultValue={selectedTransaction.description}
                    placeholder="e.g., Grocery shopping"
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      label="Amount"
                      defaultValue={selectedTransaction.amount}
                      step="0.01"
                      required
                    />
                    <Input
                      type="date"
                      label="Date"
                      defaultValue={selectedTransaction.transaction_date}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Type"
                      defaultValue={selectedTransaction.transaction_type}
                      options={TRANSACTION_TYPES}
                      required
                    />
                    <Select
                      label="Status"
                      defaultValue={selectedTransaction.status}
                      options={TRANSACTION_STATUS}
                      required
                    />
                  </div>
                  <Select
                    label="Account"
                    defaultValue={selectedTransaction.account_id}
                    options={accounts.map(account => ({
                      value: account.id,
                      label: account.name
                    }))}
                    required
                  />
                  <Select
                    label="Category"
                    defaultValue={selectedTransaction.category_id || ''}
                    options={[
                      { value: '', label: 'Uncategorized' },
                      ...categories.map(category => ({
                        value: category.id,
                        label: category.name
                      }))
                    ]}
                  />
                  <Input
                    label="Merchant/Payee"
                    defaultValue={selectedTransaction.merchant || ''}
                    placeholder="e.g., Whole Foods"
                  />
                  <Input
                    label="Location"
                    defaultValue={selectedTransaction.location || ''}
                    placeholder="e.g., New York, NY"
                  />
                  <Input
                    label="Tags"
                    defaultValue={selectedTransaction.tags?.join(', ') || ''}
                    placeholder="e.g., groceries, food (comma-separated)"
                  />
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
              loading={isLoading}
              onClick={() => selectedTransaction && handleUpdateTransaction(selectedTransaction.id, {
                description: selectedTransaction.description,
                amount: selectedTransaction.amount,
                transaction_date: selectedTransaction.transaction_date,
                transaction_type: selectedTransaction.transaction_type,
                status: selectedTransaction.status
              })}
            >
              Update Transaction
            </Button>
          </FormActions>
        </ModalFooter>
      </Modal>

      {/* Delete Transaction Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        size="sm"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold text-red-600">Delete Transaction</h2>
        </ModalHeader>
        <ModalBody>
          {selectedTransaction && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete this transaction?
              </p>
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <p className="font-medium">{selectedTransaction.description}</p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(selectedTransaction.amount)} • {new Date(selectedTransaction.transaction_date).toLocaleDateString()}
                </p>
                {selectedTransaction.merchant && (
                  <p className="text-sm text-gray-600">{selectedTransaction.merchant}</p>
                )}
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. The transaction will be marked as deleted.
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
              onClick={() => selectedTransaction && handleDeleteTransaction(selectedTransaction.id)}
            >
              Delete Transaction
            </Button>
          </FormActions>
        </ModalFooter>
      </Modal>
    </div>
  );
}