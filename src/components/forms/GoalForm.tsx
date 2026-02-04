'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Goal } from '@/lib/types';

const goalSchema = z.object({
  name: z.string().min(1, 'Goal name is required').max(100),
  goal_type: z.enum(['savings', 'debt_payoff', 'emergency_fund', 'investment', 'purchase', 'vacation', 'custom']),
  description: z.string().optional(),
  target_amount: z.number().min(0.01, 'Target amount must be greater than 0'),
  current_amount: z.number().min(0, 'Current amount must be positive'),
  target_date: z.string().min(1, 'Target date is required'),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  status: z.enum(['ACTIVE', 'COMPLETED', 'PAUSED']),
});

export type GoalFormData = z.infer<typeof goalSchema>;

interface GoalFormProps {
  defaultValues?: Partial<Goal>;
  onSubmit: (data: GoalFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const GOAL_TYPES = [
  { value: 'savings', label: 'Savings Goal', icon: '💰', description: 'Build up savings' },
  { value: 'debt_payoff', label: 'Debt Payoff', icon: '💳', description: 'Pay off debt' },
  { value: 'emergency_fund', label: 'Emergency Fund', icon: '🆘', description: 'Build safety net' },
  { value: 'investment', label: 'Investment', icon: '📈', description: 'Grow wealth' },
  { value: 'purchase', label: 'Purchase', icon: '🛍️', description: 'Save for item' },
  { value: 'vacation', label: 'Vacation', icon: '✈️', description: 'Plan a trip' },
  { value: 'custom', label: 'Custom', icon: '🎯', description: 'Other goal' },
];

const PRIORITIES = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
];

const STATUSES = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PAUSED', label: 'Paused' },
];

export function GoalForm({ defaultValues, onSubmit, onCancel, isLoading, mode = 'create' }: GoalFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: defaultValues ? {
      name: defaultValues.name || '',
      goal_type: defaultValues.goal_type || 'savings',
      description: defaultValues.description || '',
      target_amount: defaultValues.target_amount || 0,
      current_amount: defaultValues.current_amount || 0,
      target_date: defaultValues.target_date || '',
      priority: defaultValues.priority || 'medium',
      status: defaultValues.status || 'ACTIVE',
    } : {
      goal_type: 'savings',
      current_amount: 0,
      priority: 'medium',
      status: 'ACTIVE',
    },
  });

  const handleFormSubmit = async (data: GoalFormData) => {
    await onSubmit(data);
  };

  const selectedGoalType = watch('goal_type');
  const targetAmount = watch('target_amount') || 0;
  const currentAmount = watch('current_amount') || 0;
  const progress = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Goal Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Goal Name *
          </label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g., Emergency Fund, New Car, Vacation"
            error={errors.name?.message}
            className="w-full"
          />
        </div>

        {/* Goal Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Goal Type *
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GOAL_TYPES.map((type) => (
              <label
                key={type.value}
                className={`
                  relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all
                  ${selectedGoalType === type.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }
                `}
              >
                <input
                  type="radio"
                  value={type.value}
                  {...register('goal_type')}
                  className="sr-only"
                />
                <span className="text-2xl mb-1">{type.icon}</span>
                <span className="text-xs font-medium text-gray-900 dark:text-gray-100 text-center">
                  {type.label}
                </span>
              </label>
            ))}
          </div>
          {errors.goal_type && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.goal_type.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            {...register('description')}
            placeholder="Add details about your goal..."
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Amounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="target_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Amount *
            </label>
            <Input
              id="target_amount"
              type="number"
              step="0.01"
              {...register('target_amount', { valueAsNumber: true })}
              placeholder="0.00"
              error={errors.target_amount?.message}
            />
          </div>

          <div>
            <label htmlFor="current_amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Current Amount *
            </label>
            <Input
              id="current_amount"
              type="number"
              step="0.01"
              {...register('current_amount', { valueAsNumber: true })}
              placeholder="0.00"
              error={errors.current_amount?.message}
            />
          </div>
        </div>

        {/* Progress Bar */}
        {targetAmount > 0 && (
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Progress</span>
              <span className="font-medium">{progress.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Target Date, Priority & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="target_date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Target Date *
            </label>
            <Input
              id="target_date"
              type="date"
              {...register('target_date')}
              error={errors.target_date?.message}
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Priority *
            </label>
            <Select
              id="priority"
              {...register('priority')}
              error={errors.priority?.message}
            >
              {PRIORITIES.map((priority) => (
                <option key={priority.value} value={priority.value}>
                  {priority.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status *
            </label>
            <Select
              id="status"
              {...register('status')}
              error={errors.status?.message}
            >
              {STATUSES.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </Select>
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
          {mode === 'create' ? 'Create Goal' : 'Update Goal'}
        </Button>
      </div>
    </form>
  );
}
