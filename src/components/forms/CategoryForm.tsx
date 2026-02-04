'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Category } from '@/lib/types';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  category_type: z.enum(['expense', 'income', 'transfer']),
  description: z.string().optional(),
  color: z.string(),
  icon: z.string(),
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
  { value: 'expense', label: 'Expense', description: 'Money going out' },
  { value: 'income', label: 'Income', description: 'Money coming in' },
  { value: 'transfer', label: 'Transfer', description: 'Between accounts' },
];

const PRESET_COLORS = [
  { value: '#EF4444', label: 'Red' },
  { value: '#F59E0B', label: 'Orange' },
  { value: '#10B981', label: 'Green' },
  { value: '#3B82F6', label: 'Blue' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#6B7280', label: 'Gray' },
];

const PRESET_ICONS = [
  { value: '🍔', label: 'Food' },
  { value: '🚗', label: 'Transport' },
  { value: '🏠', label: 'Housing' },
  { value: '💡', label: 'Utilities' },
  { value: '🎬', label: 'Entertainment' },
  { value: '🏥', label: 'Healthcare' },
  { value: '🛒', label: 'Shopping' },
  { value: '✈️', label: 'Travel' },
  { value: '💰', label: 'Savings' },
  { value: '📚', label: 'Education' },
];

export function CategoryForm({ defaultValues, onSubmit, onCancel, isLoading, mode = 'create' }: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
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

  const handleFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data);
  };

  const selectedType = watch('category_type');

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="space-y-4">
        {/* Category Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category Name *
          </label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g., Groceries, Salary, Rent"
            error={errors.name?.message}
            className="w-full"
          />
        </div>

        {/* Category Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category Type *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {CATEGORY_TYPES.map((type) => (
              <label
                key={type.value}
                className={`
                  relative flex flex-col items-center p-3 border rounded-lg cursor-pointer transition-all
                  ${selectedType === type.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 ring-2 ring-blue-500'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                  }
                `}
              >
                <input
                  type="radio"
                  value={type.value}
                  {...register('category_type')}
                  className="sr-only"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {type.label}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {type.description}
                </span>
              </label>
            ))}
          </div>
          {errors.category_type && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category_type.message}</p>
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
            placeholder="Add any notes or details about this category"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-gray-100"
          />
        </div>

        {/* Color & Icon */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="color" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Color (optional)
            </label>
            <Select
              id="color"
              {...register('color')}
              error={errors.color?.message}
            >
              {PRESET_COLORS.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </Select>
            <div className="mt-2 flex items-center space-x-2">
              <div
                className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: watch('color') || '#3B82F6' }}
              />
              <span className="text-xs text-gray-500 dark:text-gray-400">Preview</span>
            </div>
          </div>

          <div>
            <label htmlFor="icon" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Icon (optional)
            </label>
            <Select
              id="icon"
              {...register('icon')}
              error={errors.icon?.message}
            >
              {PRESET_ICONS.map((icon) => (
                <option key={icon.value} value={icon.value}>
                  {icon.value} {icon.label}
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
          {mode === 'create' ? 'Create Category' : 'Update Category'}
        </Button>
      </div>
    </form>
  );
}
