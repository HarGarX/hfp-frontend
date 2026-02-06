'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Transaction, Account, Category } from '@/lib/types';
import { format } from 'date-fns';
import { TrendingDown, TrendingUp, ArrowLeftRight } from 'lucide-react';

const transactionSchema = z.object({
  account_id: z.string().min(1, 'Account is required'),
  category_id: z.string().optional(),
  amount: z.number().min(0.01, 'Amount must be greater than 0'),
  currency: z.string().min(1),
  description: z.string().min(1, 'Description is required').max(255),
  date: z.string().min(1, 'Date is required'),
  transaction_type: z.enum(['income', 'expense', 'transfer']),
  merchant: z.string().optional(),
  notes: z.string().optional(),
  transfer_account_id: z.string().optional(),
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
  { value: 'income', label: 'Income', icon: TrendingUp, gradient: 'from-green-500 to-emerald-600' },
  { value: 'expense', label: 'Expense', icon: TrendingDown, gradient: 'from-red-500 to-rose-600' },
  { value: 'transfer', label: 'Transfer', icon: ArrowLeftRight, gradient: 'from-blue-500 to-indigo-600' },
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
    defaultValues: defaultValues ? {
      ...defaultValues,
      date: defaultValues.date || format(new Date(), 'yyyy-MM-dd'),
    } : {
      currency: 'USD',
      date: format(new Date(), 'yyyy-MM-dd'),
      transaction_type: 'expense',
    },
  });

  const transactionType = watch('transaction_type');

  const handleFormSubmit = async (data: TransactionFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Transaction Type Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-3">
          Transaction Type *
        </label>
        <div className="grid grid-cols-3 gap-3">
          {TRANSACTION_TYPES.map(type => {
            const Icon = type.icon;
            const isSelected = watch('transaction_type') === type.value;
            
            return (
              <label
                key={type.value}
                className={`
                  relative flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer transition-all
                  ${isSelected
                    ? 'bg-white dark:bg-gray-800 shadow-md ring-2 ring-blue-500'
                    : 'bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow'
                  }
                `}
              >
                <input
                  type="radio"
                  {...register('transaction_type')}
                  value={type.value}
                  className="sr-only"
                />
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${type.gradient} flex items-center justify-center mb-2`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {type.label}
                </span>
              </label>
            );
          })}
        </div>
        {errors.transaction_type && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.transaction_type.message}</p>
        )}
      </div>

      {/* Account & Amount */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="account_id" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
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
                {account.name} - {account.bank_name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
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
      </div>

      {/* Transfer Account (Conditional) */}
      {transactionType === 'transfer' && (
        <div>
          <label htmlFor="transfer_account_id" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Transfer To Account *
          </label>
          <Select
            id="transfer_account_id"
            {...register('transfer_account_id')}
            error={errors.transfer_account_id?.message}
          >
            <option value="">Select destination account...</option>
            {accounts
              .filter(acc => acc.id !== watch('account_id'))
              .map(account => (
                <option key={account.id} value={account.id}>
                  {account.name} - {account.bank_name}
                </option>
              ))}
          </Select>
        </div>
      )}

      {/* Category & Date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category_id" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
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
                  {category.icon} {category.name}
                </option>
              ))}
          </Select>
        </div>

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Date *
          </label>
          <Input
            id="date"
            type="date"
            {...register('date')}
            error={errors.date?.message}
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Description *
        </label>
        <Input
          id="description"
          {...register('description')}
          placeholder="Brief description of the transaction"
          error={errors.description?.message}
        />
      </div>

      {/* Merchant & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="merchant" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Merchant
          </label>
          <Input
            id="merchant"
            {...register('merchant')}
            placeholder="e.g., Amazon, Starbucks"
          />
        </div>

        <div>
          <label htmlFor="currency" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
            Currency
          </label>
          <Input
            id="currency"
            {...register('currency')}
            placeholder="USD"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
          Notes
        </label>
        <Input
          id="notes"
          {...register('notes')}
          placeholder="Additional notes or details"
        />
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
