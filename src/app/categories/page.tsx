'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Folder, Tag, BarChart3, Search, Eye, EyeOff } from 'lucide-react';
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
import { CategoryForm } from '@/components/forms/CategoryForm';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/lib/hooks/useApi';
import { PageLoader } from '@/components/LoadingSpinner';
import type { Category } from '@/lib/types';

const PREDEFINED_ICONS = [
  '🍔', '🛒', '🍽️', '🚗', '⛽', '🎬', '💰', '📄', '🏠', '💊', '👔', '✈️', '🎓', '🛍️', '🎮', '📱', '🏋️', '💄', '🔧', '🎨'
];

const PREDEFINED_COLORS = [
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981', '#14B8A6', 
  '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#C084FC', '#E879F9', 
  '#EC4899', '#F43F5E', '#6B7280', '#374151'
];

interface CreateCategoryRequest {
  name: string;
  category_type: 'expense' | 'income' | 'transfer';
  description?: string;
  color: string;
  icon?: string;
  parent_id?: string;
}

export default function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSystemCategories, setShowSystemCategories] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  if (isLoading) return <PageLoader />;

  const handleCreateCategory = async (categoryData: CreateCategoryRequest) => {
    try {
      await createCategory.mutateAsync(categoryData);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleUpdateCategory = async (id: string, data: any) => {
    try {
      await updateCategory.mutateAsync({ id, data });
      setIsEditModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Failed to update category:', error);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteCategory.mutateAsync(id);
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getFilteredCategories = () => {
    return categories.filter(category => {
      if (category.deleted_at) return false;
      
      const matchesSearch = searchTerm === '' || 
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSystemFilter = showSystemCategories || !category.is_system;
      
      return matchesSearch && matchesSystemFilter;
    });
  };

  const getParentCategories = () => {
    return getFilteredCategories().filter(cat => !cat.parent_id);
  };

  const getSubCategories = (parentId: string) => {
    return getFilteredCategories().filter(cat => cat.parent_id === parentId);
  };

  const getCategoryDepth = (category: Category): number => {
    if (!category.parent_id) return 0;
    const parent = categories.find(cat => cat.id === category.parent_id);
    return parent ? getCategoryDepth(parent) + 1 : 0;
  };

  const filteredCategories = getFilteredCategories();
  const parentCategories = getParentCategories();
  
  // Calculate summary stats
  const totalCategories = filteredCategories.length;
  const totalTransactions = filteredCategories.reduce((sum, cat) => sum + cat.transaction_count, 0);
  const totalAmount = filteredCategories.reduce((sum, cat) => sum + cat.total_amount, 0);
  const systemCategories = filteredCategories.filter(cat => cat.is_system).length;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
          <p className="text-gray-600 mt-1">Organize your transactions with custom categories</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSystemCategories(!showSystemCategories)}
          >
            {showSystemCategories ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showSystemCategories ? 'Hide System' : 'Show System'}
          </Button>
          <Button 
            onClick={() => setIsCreateModalOpen(true)}
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Folder className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold text-blue-600">
                  {totalCategories}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Transactions</p>
                <p className="text-2xl font-bold text-green-600">
                  {totalTransactions}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Tag className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Amount</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(totalAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-400 rounded-full flex items-center justify-center">
                <span className="text-xs text-white">S</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">System Categories</p>
                <p className="text-2xl font-bold text-gray-600">
                  {systemCategories}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search categories by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Categories Hierarchy */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Categories ({filteredCategories.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {parentCategories.map((parentCategory) => (
              <div key={parentCategory.id} className="border border-gray-200 rounded-lg">
                {/* Parent Category */}
                <div 
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleCategoryExpansion(parentCategory.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                        style={{ backgroundColor: parentCategory.color }}
                      >
                        {parentCategory.icon || parentCategory.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold text-gray-900">{parentCategory.name}</h3>
                          {parentCategory.is_system && (
                            <Badge variant="outline" className="text-xs">System</Badge>
                          )}
                        </div>
                        {parentCategory.description && (
                          <p className="text-sm text-gray-600">{parentCategory.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {parentCategory.transaction_count} transactions
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatCurrency(parentCategory.total_amount)}
                        </p>
                      </div>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory(parentCategory);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        {!parentCategory.is_system && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(parentCategory);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub Categories */}
                {expandedCategories.has(parentCategory.id) && (
                  <div className="border-t border-gray-200 bg-gray-50">
                    {getSubCategories(parentCategory.id).map((subCategory) => (
                      <div 
                        key={subCategory.id} 
                        className="p-4 border-l-4 border-gray-300 ml-6 hover:bg-white"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                              style={{ backgroundColor: subCategory.color }}
                            >
                              {subCategory.icon || subCategory.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{subCategory.name}</h4>
                              {subCategory.description && (
                                <p className="text-xs text-gray-600">{subCategory.description}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="text-xs font-medium text-gray-900">
                                {subCategory.transaction_count} transactions
                              </p>
                              <p className="text-xs text-gray-600">
                                {formatCurrency(subCategory.total_amount)}
                              </p>
                            </div>
                            <div className="flex space-x-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedCategory(subCategory);
                                  setIsEditModalOpen(true);
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedCategory(subCategory);
                                  setIsDeleteModalOpen(true);
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {/* Add Sub-category button */}
                    <div className="p-4 border-l-4 border-dashed border-gray-300 ml-6">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-600 hover:text-gray-900"
                        onClick={() => {
                          // Pre-populate with parent category
                          setSelectedCategory({ parent_id: parentCategory.id } as Category);
                          setIsCreateModalOpen(true);
                        }}
                      >
                        <Plus className="w-3 h-3 mr-2" />
                        Add subcategory
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Create Category Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        size="md"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold dark:text-gray-100">Create New Category</h2>
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

      {/* Edit Category Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        size="md"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold">Edit Category</h2>
        </ModalHeader>
        <ModalBody>
          {selectedCategory && (
            <Form onSubmit={(e) => e.preventDefault()}>
              <FormSection>
                <div className="space-y-4">
                  <Input
                    label="Category Name"
                    defaultValue={selectedCategory.name}
                    placeholder="e.g., Entertainment"
                    required
                  />
                  <Input
                    label="Description"
                    defaultValue={selectedCategory.description || ''}
                    placeholder="e.g., Movies, games, and leisure activities"
                  />
                  
                  {selectedCategory.is_system && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                      <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> This is a system category. Some fields cannot be modified.
                      </p>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Icon
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {PREDEFINED_ICONS.slice(0, 10).map((icon) => (
                          <button
                            key={icon}
                            type="button"
                            className={`w-10 h-10 rounded-lg border-2 ${
                              icon === selectedCategory.icon 
                                ? 'border-blue-500 bg-blue-50' 
                                : 'border-gray-200 hover:border-blue-500'
                            } flex items-center justify-center text-lg transition-colors`}
                          >
                            {icon}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Color
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {PREDEFINED_COLORS.slice(0, 10).map((color) => (
                          <button
                            key={color}
                            type="button"
                            className={`w-10 h-10 rounded-lg border-2 ${
                              color === selectedCategory.color
                                ? 'border-gray-800'
                                : 'border-gray-200 hover:border-gray-400'
                            } transition-colors`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
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
              loading={isLoading}
              onClick={() => selectedCategory && handleUpdateCategory(selectedCategory.id, {
                name: selectedCategory.name,
                description: selectedCategory.description,
                color: selectedCategory.color,
                icon: selectedCategory.icon
              })}
            >
              Update Category
            </Button>
          </FormActions>
        </ModalFooter>
      </Modal>

      {/* Delete Category Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        size="sm"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold text-red-600">Delete Category</h2>
        </ModalHeader>
        <ModalBody>
          {selectedCategory && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete the category "{selectedCategory.name}"?
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-medium"
                    style={{ backgroundColor: selectedCategory.color }}
                  >
                    {selectedCategory.icon || selectedCategory.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium">{selectedCategory.name}</p>
                    <p className="text-sm text-gray-600">
                      {selectedCategory.transaction_count} transactions • {formatCurrency(selectedCategory.total_amount)}
                    </p>
                  </div>
                </div>
              </div>

              {selectedCategory.transaction_count > 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                  <p className="text-sm text-yellow-800">
                    <strong>Warning:</strong> This category has {selectedCategory.transaction_count} associated transactions. 
                    They will be moved to "Uncategorized" after deletion.
                  </p>
                </div>
              )}

              {getSubCategories(selectedCategory.id).length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                  <p className="text-sm text-red-800">
                    <strong>Cannot Delete:</strong> This category has subcategories. Please delete or move subcategories first.
                  </p>
                </div>
              )}
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
              disabled={selectedCategory ? getSubCategories(selectedCategory.id).length > 0 : false}
              onClick={() => selectedCategory && handleDeleteCategory(selectedCategory.id)}
            >
              Delete Category
            </Button>
          </FormActions>
        </ModalFooter>
      </Modal>
    </div>
  );
}