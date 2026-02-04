'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Transaction, Account, Category } from '@/lib/types';
import { format } from 'date-fns';

const transactionSchema = z.object({
  account_id: z.string().min(1, 'Account is required'),
  category_id: z.string().optional(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(1),
  description: z.string().min(1, 'Description is required').max(500),
  transaction_date: z.string().min(1, 'Date is required'),
  transaction_type: z.enum(['income', 'expense', 'transfer']),
  merchant: z.string().optional(),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  defaultValues?: Partial<Transaction>;
  accounts: Account[];
  categories: Category[];
  onSubmit: (data: TransactionFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const TRANSACTION_TYPES = [
  { value: 'income', label: 'Income', icon: '💰' },
  { value: 'expense', label: 'Expense', icon: '💸' },
  { value: 'transfer', label: 'Transfer', icon: '🔄' },
];

export function TransactionForm({ 
  defaultValues, 
  accounts, 
  categories, 
  onSubmit, 
  onCancel, 
  isLoading, 
  mode = 'create' 
}: TransactionFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: defaultValues || {
      currency: 'USD',
      transaction_date: format(new Date(), 'yyyy-MM-dd'),
      transaction_type: 'expense',
      tags: [],
    },
  });

  const transactionType = watch('transaction_type');

  const handleFormSubmit = async (data: TransactionFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Transaction Type Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Transaction Type *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {TRANSACTION_TYPES.map(type => (
              <label
                key={type.value}
                className={`
                  relative flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all
                  ${watch('transaction_type') === type.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <input
                  type="radio"
                  {...register('transaction_type')}
                  value={type.value}
                  className="sr-only"
                />
                <span className="text-2xl mb-1">{type.icon}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
          {errors.transaction_type && (
            <p className="mt-1 text-sm text-red-600">{errors.transaction_type.message}</p>
          )}
        </div>

        {/* Account & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="account_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Account *
            </label>
            <Select
              id="account_id"
              {...register('account_id')}
              error={errors.account_id?.message}
            >
              <option value="">Select account...</option>
              {accounts.map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} ({account.bank_name})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <Select
              id="category_id"
              {...register('category_id')}
              error={errors.category_id?.message}
            >
              <option value="">Select category...</option>
              {categories
                .filter(cat => cat.category_type === transactionType)
                .map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </Select>
          </div>
        </div>

        {/* Amount & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount *
            </label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register('amount', { valueAsNumber: true })}
              placeholder="0.00"
              error={errors.amount?.message}
            />
          </div>

          <div>
            <label htmlFor="transaction_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Date *
            </label>
            <Input
              id="transaction_date"
              type="date"
              {...register('transaction_date')}
              error={errors.transaction_date?.message}
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description *
          </label>
          <Input
            id="description"
            {...register('description')}
            placeholder="What was this transaction for?"
            error={errors.description?.message}
          />
        </div>

        {/* Merchant & Location (Optional) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="merchant" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Merchant (optional)
            </label>
            <Input
              id="merchant"
              {...register('merchant')}
              placeholder="e.g., Amazon, Starbucks"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Location (optional)
            </label>
            <Input
              id="location"
              {...register('location')}
              placeholder="e.g., New York, NY"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button 
          type="button"
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting || isLoading}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          variant="default"
          loading={isSubmitting || isLoading}
        >
          {mode === 'create' ? 'Create Transaction' : 'Update Transaction'}
        </Button>
      </div>
    </form>
  );
}
