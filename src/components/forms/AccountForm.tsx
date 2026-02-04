'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Account } from '@/lib/types';
import { Wallet, TrendingUp, CreditCard, Building2, Banknote, TrendingDown, Briefcase, CircleDot } from 'lucide-react';

const accountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100),
  account_type: z.enum(['checking', 'savings', 'credit_card', 'investment', 'cash', 'loan', 'business', 'other']),
  bank_name: z.string().optional(),
  current_balance: z.number().optional(),
  currency: z.string().min(1),
  account_number: z.string().optional(),
  provider: z.string().optional(),
  status: z.enum(['active', 'inactive', 'closed']).optional(),
});

export type AccountFormData = z.infer<typeof accountSchema>;

interface AccountFormProps {
  defaultValues?: Partial<Account>;
  onSubmit: (data: AccountFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const ACCOUNT_TYPES = [
  { value: 'checking', label: 'Checking', icon: Wallet, color: 'blue' },
  { value: 'savings', label: 'Savings', icon: TrendingUp, color: 'green' },
  { value: 'credit_card', label: 'Credit Card', icon: CreditCard, color: 'purple' },
  { value: 'investment', label: 'Investment', icon: TrendingUp, color: 'indigo' },
  { value: 'cash', label: 'Cash', icon: Banknote, color: 'gray' },
  { value: 'loan', label: 'Loan', icon: TrendingDown, color: 'red' },
  { value: 'business', label: 'Business', icon: Briefcase, color: 'orange' },
  { value: 'other', label: 'Other', icon: CircleDot, color: 'gray' },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'CAD', label: 'CAD ($)', symbol: 'C$' },
];

export function AccountForm({ defaultValues, onSubmit, onCancel, isLoading, mode = 'create' }: AccountFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<AccountFormData>({
    resolver: zodResolver(accountSchema),
    defaultValues: defaultValues ? {
      name: defaultValues.name || '',
      account_type: defaultValues.account_type || 'checking',
      bank_name: defaultValues.bank_name || '',
      current_balance: Number(defaultValues.current_balance) || 0,
      currency: defaultValues.currency || 'USD',
      status: defaultValues.status || 'active',
      account_number: defaultValues.account_number || '',
      provider: defaultValues.external_provider || '',
    } : {
      currency: 'USD',
      status: 'active',
      current_balance: 0,
    },
  });

  const selectedType = watch('account_type');
  const accountStatus = watch('status');

  const handleFormSubmit = async (data: AccountFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Account Name - Full Width */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Account Name
        </label>
        <Input
          {...register('name')}
          placeholder="e.g., My Checking Account"
          error={errors.name?.message}
        />
      </div>

      {/* Account Type Selector - Visual Cards */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Account Type {mode === 'edit' && <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">(Cannot be changed)</span>}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ACCOUNT_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => mode === 'create' && setValue('account_type', type.value)}
                disabled={mode === 'edit'}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200
                  ${isSelected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/30 shadow-md' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                  }
                  ${mode === 'edit' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon className={`w-6 h-6 ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span className={`text-xs font-medium ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    {type.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        {errors.account_type && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.account_type.message}</p>
        )}
      </div>

      {/* Bank Name & Balance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Bank/Institution
          </label>
          <Input
            {...register('bank_name')}
            placeholder="e.g., Chase"
            error={errors.bank_name?.message}
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Current Balance
          </label>
          <Input
            type="number"
            step="0.01"
            {...register('current_balance', { valueAsNumber: true })}
            placeholder="0.00"
            error={errors.current_balance?.message}
          />
        </div>
      </div>

      {/* Currency & Account Number */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            Currency
          </label>
          <Select
            {...register('currency')}
            error={errors.currency?.message}
          >
            {CURRENCIES.map(currency => (
              <option key={currency.value} value={currency.value}>
                {currency.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Last 4 Digits <span className="text-gray-400">(Optional)</span>
          </label>
          <Input
            {...register('account_number')}
            placeholder="••••"
            maxLength={4}
          />
        </div>
      </div>

      {/* Status Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${accountStatus === 'active' ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Account Status</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {accountStatus === 'active' ? 'Active and visible' : 'Inactive and hidden'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setValue('status', accountStatus === 'active' ? 'inactive' : 'active')}
          className={`
            relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            ${accountStatus === 'active' ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white transition-transform
              ${accountStatus === 'active' ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-4">
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
          {mode === 'create' ? 'Create Account' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
