'use client';

import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, TrendingDown, TrendingUp, ArrowLeftRight, Folder } from 'lucide-react';
import { 
  Button,
  Card,
  CardContent,
  Modal,
  ModalBody,
  ModalHeader,
} from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/lib/hooks/useApi';
import { PageLoader } from '@/components/LoadingSpinner';
import { Category } from '@/lib/types';
import { EmptyState } from '@/components/EmptyState';
import { CategoryForm, type CategoryFormData } from '@/components/forms/CategoryForm';

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const handleCreateCategory = async (data: CategoryFormData) => {
    await createCategory.mutateAsync(data);
    setIsCreateModalOpen(false);
  };

  const handleUpdateCategory = async (data: CategoryFormData) => {
    if (!selectedCategory) return;
    await updateCategory.mutateAsync({ id: selectedCategory.id, data });
    setIsEditModalOpen(false);
    setSelectedCategory(null);
  };

  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    await deleteCategory.mutateAsync(selectedCategory.id);
    setIsDeleteModalOpen(false);
    setSelectedCategory(null);
  };

  if (isLoading) return <PageLoader />;

  const getCategoryIcon = (type: string) => {
    const iconMap: Record<string, React.ElementType> = {
      'expense': TrendingDown,
      'income': TrendingUp,
      'transfer': ArrowLeftRight,
    };
    return iconMap[type] || Tag;
  };

  const getCategoryTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      'expense': 'from-red-500 to-rose-600',
      'income': 'from-green-500 to-emerald-600',
      'transfer': 'from-blue-500 to-indigo-600',
    };
    return colorMap[type] || 'from-gray-500 to-gray-600';
  };

  const expenseCategories = categories.filter((c: Category) => c.category_type === 'expense');
  const incomeCategories = categories.filter((c: Category) => c.category_type === 'income');
  const transferCategories = categories.filter((c: Category) => c.category_type === 'transfer');

  const totalTransactions = categories.reduce((sum: number, cat: Category) => sum + (Number(cat.transaction_count) || 0), 0);
  const totalAmount = categories.reduce((sum: number, cat: Category) => sum + (Number(cat.total_amount) || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                Categories
              </h1>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                Organize transactions with custom categories
              </p>
            </div>
            <Button 
              onClick={() => setIsCreateModalOpen(true)}
              size="default"
              className="shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 shadow-sm hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Categories
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {categories.length}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/50 rounded-xl flex items-center justify-center">
                    <Folder className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
                    Expense Categories
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {expenseCategories.length}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-950/50 rounded-xl flex items-center justify-center">
                    <TrendingDown className="w-6 h-6 text-red-600 dark:text-red-400" />
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
                    Income Categories
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {incomeCategories.length}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-950/50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
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
                    Total Transactions
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {totalTransactions}
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-950/50 rounded-xl flex items-center justify-center">
                    <Tag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Categories List */}
        {categories.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No categories yet"
            description="Get started by creating your first category to organize transactions"
            action={{ label: "Add Category", onClick: () => setIsCreateModalOpen(true) }}
          />
        ) : (
          <div className="space-y-3">
            {categories.map((category: Category) => {
              const Icon = getCategoryIcon(category.category_type);
              const gradientClass = getCategoryTypeColor(category.category_type);
              
              return (
                <Card 
                  key={category.id}
                  className="border-0 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <CardContent className="p-0">
                    <div className="flex items-center p-6">
                      {/* Icon with custom color */}
                      <div className="flex-shrink-0">
                        <div 
                          className={`w-12 h-12 bg-gradient-to-br ${gradientClass} rounded-xl flex items-center justify-center text-2xl`}
                          style={category.color ? { background: category.color } : {}}
                        >
                          {category.icon || <Icon className="w-6 h-6 text-white" />}
                        </div>
                      </div>

                      {/* Category Info */}
                      <div className="ml-4 flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-base font-semibold text-gray-900 dark:text-white truncate">
                            {category.name}
                          </h3>
                          {category.is_system && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                              System
                            </span>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            {category.category_type.charAt(0).toUpperCase() + category.category_type.slice(1)}
                          </span>
                          <span className="text-gray-400 dark:text-gray-600">•</span>
                          <span className="text-gray-500">
                            {category.transaction_count} transaction{category.transaction_count !== 1 ? 's' : ''}
                          </span>
                        </div>
                        {category.description && (
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 truncate">
                            {category.description}
                          </p>
                        )}
                      </div>

                      {/* Amount */}
                      <div className="ml-6 flex-shrink-0 text-right">
                        <p className={`text-xl font-bold ${
                          category.category_type === 'income'
                            ? 'text-green-600 dark:text-green-400'
                            : category.category_type === 'expense'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}>
                          {formatCurrency(Number(category.total_amount) || 0)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Total
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="ml-6 flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedCategory(category);
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
                            setSelectedCategory(category);
                            setIsDeleteModalOpen(true);
                          }}
                          disabled={category.is_system}
                          className="hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed"
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
            Create New Category
          </h2>
        </ModalHeader>
        <ModalBody>
          <CategoryForm
            onSubmit={handleCreateCategory}
            onCancel={() => setIsCreateModalOpen(false)}
            isLoading={createCategory.isPending}
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
            Edit Category
          </h2>
        </ModalHeader>
        <ModalBody>
          {selectedCategory && (
            <CategoryForm
              defaultValues={selectedCategory}
              onSubmit={handleUpdateCategory}
              onCancel={() => setIsEditModalOpen(false)}
              isLoading={updateCategory.isPending}
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
            Delete Category
          </h2>
        </ModalHeader>
        <ModalBody>
          {selectedCategory && (
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete <strong className="text-gray-900 dark:text-white">"{selectedCategory.name}"</strong>?
              </p>
              
              {selectedCategory.transaction_count > 0 && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Warning:</strong> This category has {selectedCategory.transaction_count} transaction(s). 
                    They will need to be recategorized.
                  </p>
                </div>
              )}

              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Type:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {selectedCategory.category_type.charAt(0).toUpperCase() + selectedCategory.category_type.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Amount:</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(selectedCategory.total_amount)}
                    </span>
                  </div>
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
                  loading={deleteCategory.isPending}
                  onClick={handleDeleteCategory}
                  disabled={selectedCategory.is_system}
                >
                  {selectedCategory.is_system ? 'Cannot Delete System Category' : 'Delete Category'}
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
      </Modal>
    </div>
  );
}
