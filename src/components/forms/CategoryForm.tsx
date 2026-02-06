'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Category } from '@/lib/types';
import { TrendingDown, TrendingUp, ArrowLeftRight } from 'lucide-react';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  category_type: z.enum(['expense', 'income', 'transfer']),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  defaultValues?: Partial<Category>;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const CATEGORY_TYPES = [
  { 
    value: 'expense' as const, 
    label: 'Expense', 
    description: 'Money going out',
    icon: TrendingDown,
    color: 'red'
  },
  { 
    value: 'income' as const, 
    label: 'Income', 
    description: 'Money coming in',
    icon: TrendingUp,
    color: 'green'
  },
  { 
    value: 'transfer' as const, 
    label: 'Transfer', 
    description: 'Between accounts',
    icon: ArrowLeftRight,
    color: 'blue'
  },
];

const PRESET_COLORS = [
  { value: '#EF4444', label: 'Red', class: 'bg-red-500' },
  { value: '#F97316', label: 'Orange', class: 'bg-orange-500' },
  { value: '#F59E0B', label: 'Amber', class: 'bg-amber-500' },
  { value: '#10B981', label: 'Green', class: 'bg-green-500' },
  { value: '#3B82F6', label: 'Blue', class: 'bg-blue-500' },
  { value: '#8B5CF6', label: 'Purple', class: 'bg-purple-500' },
  { value: '#EC4899', label: 'Pink', class: 'bg-pink-500' },
  { value: '#6B7280', label: 'Gray', class: 'bg-gray-500' },
];

const PRESET_ICONS = [
  '🍔', '🛒', '🍽️', '☕', '🍕', '🥗',
  '🚗', '⛽', '🚌', '✈️', '🚕', '🚲',
  '🏠', '🔑', '🛏️', '🪑', '🛠️', '🔨',
  '💡', '💰', '💳', '💸', '🏦', '📊',
  '🎬', '🎮', '🎵', '📚', '🎨', '🏋️',
  '👔', '👗', '👟', '💄', '💍', '🎁',
  '🏥', '💊', '🩺', '⚕️', '🧘', '💆',
  '📱', '💻', '⌚', '📷', '🎧', '🖥️',
];

export function CategoryForm({ defaultValues, onSubmit, onCancel, isLoading, mode = 'create' }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues ? {
      name: defaultValues.name || '',
      category_type: defaultValues.category_type || 'expense',
      description: defaultValues.description || '',
      color: defaultValues.color || '#3B82F6',
      icon: defaultValues.icon || '🛒',
    } : {
      category_type: 'expense',
      color: '#3B82F6',
      icon: '🛒',
    },
  });

  const selectedType = watch('category_type');
  const selectedColor = watch('color');
  const selectedIcon = watch('icon');

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Category Name */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
          Category Name
        </label>
        <Input
          {...register('name')}
          placeholder="e.g., Groceries, Salary, Rent"
          error={errors.name?.message}
        />
      </div>

      {/* Category Type Selector */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Category Type {mode === 'edit' && <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">(Cannot be changed)</span>}
        </label>
        <div className="grid grid-cols-3 gap-3">
          {CATEGORY_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = selectedType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => mode === 'create' && setValue('category_type', type.value)}
                disabled={mode === 'edit'}
                className={`
                  relative p-4 rounded-xl border-2 transition-all duration-200
                  ${isSelected 
                    ? `border-${type.color}-500 bg-${type.color}-50 dark:bg-${type.color}-950/30 shadow-md` 
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800'
                  }
                  ${mode === 'edit' ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Icon className={`w-6 h-6 ${isSelected ? `text-${type.color}-600 dark:text-${type.color}-400` : 'text-gray-400 dark:text-gray-500'}`} />
                  <div className="text-center">
                    <span className={`block text-sm font-medium ${isSelected ? `text-${type.color}-600 dark:text-${type.color}-400` : 'text-gray-700 dark:text-gray-300'}`}>
                      {type.label}
                    </span>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {type.description}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        {errors.category_type && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category_type.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
          Description <span className="text-gray-400">(Optional)</span>
        </label>
        <textarea
          {...register('description')}
          placeholder="Add any notes about this category..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-colors"
        />
      </div>

      {/* Color Picker */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Color
        </label>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((color) => {
            const isSelected = selectedColor === color.value;
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => setValue('color', color.value)}
                className={`
                  relative flex-shrink-0 transition-all
                  ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900 scale-110' : 'hover:scale-105'}
                `}
                title={color.label}
              >
                <div 
                  className="w-12 h-12 rounded-lg shadow-sm"
                  style={{ backgroundColor: color.value }}
                />
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                      <div className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Icon Picker */}
      <div>
        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Icon
        </label>
        <div className="flex gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 overflow-x-auto">
          {PRESET_ICONS.map((icon) => {
            const isSelected = selectedIcon === icon;
            return (
              <button
                key={icon}
                type="button"
                onClick={() => setValue('icon', icon)}
                className={`
                  flex-shrink-0 p-3 text-3xl rounded-lg transition-all
                  ${isSelected 
                    ? 'bg-blue-100 dark:bg-blue-950/50 ring-2 ring-blue-500 scale-110' 
                    : 'hover:bg-white dark:hover:bg-gray-700 hover:scale-105'
                  }
                `}
              >
                {icon}
              </button>
            );
          })}
        </div>
      </div>

      {/* Preview */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-3">Preview</p>
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-sm"
            style={{ backgroundColor: selectedColor || '#3B82F6' }}
          >
            {selectedIcon || '🛒'}
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900 dark:text-white">
              {watch('name') || 'Category Name'}
            </p>
            <p className="text-sm text-gray-500">
              {CATEGORY_TYPES.find(t => t.value === selectedType)?.label}
            </p>
          </div>
        </div>
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
          {mode === 'create' ? 'Create Category' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}
