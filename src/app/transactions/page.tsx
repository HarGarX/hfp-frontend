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
import { TransactionForm } from '@/components/forms/TransactionForm';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction, useAccounts, useCategories } from '@/lib/hooks/useApi';
import { PageLoader } from '@/components/LoadingSpinner';
import type { Transaction, Account, Category, CreateTransactionRequest } from '@/lib/types';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAccount, setFilterAccount] = useState<string>('all');

  const isLoading = transactionsLoading || accountsLoading || categoriesLoading;
  if (isLoading) return <PageLoader />;

  const handleCreateTransaction = async (transactionData: CreateTransactionRequest) => {
    try {
      await createTransaction.mutateAsync(transactionData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create transaction:', error);
    }
  };

  const handleUpdateTransaction = async (id: string, data: any) => {
    try {
      await updateTransaction.mutateAsync({ id, data });
      setIsEditModalOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Failed to update transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction.mutateAsync(id);
      setIsDeleteModalOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
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
    .filter(t => t.transaction_type === 'income' && t.status === 'COMPLETED')
    .reduce((sum, t) => sum + t.amount, 0);
  
  const totalExpenses = filteredTransactions
    .filter(t => t.transaction_type === 'expense' && t.status === 'COMPLETED')
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
                      transaction.transaction_type === 'income' ? 'text-green-600 font-semibold' :
                      transaction.transaction_type === 'expense' ? 'text-red-600 font-semibold' :
                      'text-blue-600 font-semibold'
                    }>
                      {transaction.transaction_type === 'income' ? '+' : transaction.transaction_type === 'expense' ? '-' : ''}
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
          <h2 className="text-lg font-semibold dark:text-gray-100">Add New Transaction</h2>
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