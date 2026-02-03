'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Target, Calendar, TrendingUp, Pause, Play, CheckCircle, AlertCircle } from 'lucide-react';
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
import type { Goal, CreateGoalRequest } from '@/lib/types';

// Mock data for development
const MOCK_GOALS: Goal[] = [
  {
    id: '1',
    household_id: 'household-1',
    name: 'Emergency Fund',
    description: '6 months of expenses for financial security',
    target_amount: 15000.00,
    current_amount: 8750.00,
    target_date: '2025-06-30',
    priority: 'HIGH',
    status: 'ACTIVE',
    category: 'Emergency',
    created_at: '2024-01-15T00:00:00.000Z',
    updated_at: '2024-11-13T00:00:00.000Z',
    deleted_at: undefined
  },
  {
    id: '2',
    household_id: 'household-1',
    name: 'European Vacation',
    description: 'Two week trip to Europe next summer',
    target_amount: 8000.00,
    current_amount: 2400.00,
    target_date: '2025-07-15',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    category: 'Travel',
    created_at: '2024-02-01T00:00:00.000Z',
    updated_at: '2024-11-13T00:00:00.000Z',
    deleted_at: undefined
  },
  {
    id: '3',
    household_id: 'household-1',
    name: 'New Car Down Payment',
    description: 'Save for 20% down payment on new car',
    target_amount: 12000.00,
    current_amount: 5200.00,
    target_date: '2025-12-01',
    priority: 'MEDIUM',
    status: 'ACTIVE',
    category: 'Transportation',
    created_at: '2024-03-10T00:00:00.000Z',
    updated_at: '2024-11-13T00:00:00.000Z',
    deleted_at: undefined
  },
  {
    id: '4',
    household_id: 'household-1',
    name: 'Home Office Setup',
    description: 'Upgrade home office with new desk and equipment',
    target_amount: 3500.00,
    current_amount: 3500.00,
    target_date: '2024-10-31',
    priority: 'LOW',
    status: 'COMPLETED',
    category: 'Home Improvement',
    created_at: '2024-08-01T00:00:00.000Z',
    updated_at: '2024-10-31T00:00:00.000Z',
    deleted_at: undefined
  },
  {
    id: '5',
    household_id: 'household-1',
    name: 'Wedding Fund',
    description: 'Save for dream wedding next year',
    target_amount: 25000.00,
    current_amount: 4800.00,
    target_date: '2025-09-15',
    priority: 'HIGH',
    status: 'PAUSED',
    category: 'Life Events',
    created_at: '2024-01-20T00:00:00.000Z',
    updated_at: '2024-11-13T00:00:00.000Z',
    deleted_at: undefined
  }
];

const GOAL_PRIORITIES = [
  { value: 'LOW', label: 'Low Priority' },
  { value: 'MEDIUM', label: 'Medium Priority' },
  { value: 'HIGH', label: 'High Priority' },
];

const GOAL_STATUS = [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PAUSED', label: 'Paused' },
];

const GOAL_CATEGORIES = [
  'Emergency',
  'Travel',
  'Transportation',
  'Home Improvement',
  'Life Events',
  'Education',
  'Investment',
  'Debt Reduction',
  'Other'
];

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');

  const handleCreateGoal = async (goalData: CreateGoalRequest) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const newGoal = await api.post('/goals', goalData);
      
      // Mock implementation
      const newGoal: Goal = {
        id: Date.now().toString(),
        household_id: 'household-1',
        name: goalData.name,
        description: goalData.description,
        target_amount: goalData.target_amount,
        current_amount: 0,
        target_date: goalData.target_date,
        priority: goalData.priority,
        status: 'ACTIVE',
        category: goalData.category,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: undefined
      };
      
      setGoals([newGoal, ...goals]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Failed to create goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGoal = async (id: string, data: any) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.put(`/goals/${id}`, data);
      
      setGoals(goals.map(goal => 
        goal.id === id ? { ...goal, ...data, updated_at: new Date().toISOString() } : goal
      ));
      setIsEditModalOpen(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Failed to update goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // await api.delete(`/goals/${id}`);
      
      // Soft delete - mark as deleted instead of removing
      setGoals(goals.map(goal => 
        goal.id === id ? { ...goal, deleted_at: new Date().toISOString() } : goal
      ));
      setIsDeleteModalOpen(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Failed to delete goal:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGoalProgress = (goal: Goal) => {
    if (goal.target_amount <= 0) return 0;
    return Math.min((goal.current_amount / goal.target_amount) * 100, 100);
  };

  const getDaysUntilTarget = (targetDate: string) => {
    const target = new Date(targetDate);
    const today = new Date();
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'success';
      case 'ACTIVE':
        return 'info';
      case 'PAUSED':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'destructive';
      case 'MEDIUM':
        return 'warning';
      case 'LOW':
        return 'default';
      default:
        return 'default';
    }
  };

  const getFilteredGoals = () => {
    return goals.filter(goal => {
      if (goal.deleted_at) return false;
      
      const matchesStatus = filterStatus === 'all' || goal.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || goal.priority === filterPriority;
      
      return matchesStatus && matchesPriority;
    });
  };

  const filteredGoals = getFilteredGoals();

  // Calculate summary stats
  const activeGoals = filteredGoals.filter(g => g.status === 'ACTIVE');
  const completedGoals = filteredGoals.filter(g => g.status === 'COMPLETED');
  const totalTargetAmount = activeGoals.reduce((sum, g) => sum + g.target_amount, 0);
  const totalCurrentAmount = activeGoals.reduce((sum, g) => sum + g.current_amount, 0);
  const overallProgress = totalTargetAmount > 0 ? (totalCurrentAmount / totalTargetAmount) * 100 : 0;

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Goals</h1>
          <p className="text-gray-600 mt-1">Track your savings goals and financial milestones</p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)}
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-blue-600">
                  {activeGoals.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {completedGoals.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Progress</p>
                <p className="text-2xl font-bold text-purple-600">
                  {overallProgress.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-orange-500 rounded-full" />
              <div>
                <p className="text-sm font-medium text-gray-600">Amount Saved</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(totalCurrentAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1" />
            
            <Select
              placeholder="All Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Status' },
                ...GOAL_STATUS
              ]}
            />
            
            <Select
              placeholder="All Priorities"
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              options={[
                { value: 'all', label: 'All Priorities' },
                ...GOAL_PRIORITIES
              ]}
            />
          </div>
        </CardContent>
      </Card>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => {
          const progress = getGoalProgress(goal);
          const daysUntil = getDaysUntilTarget(goal.target_date);
          const isOverdue = daysUntil < 0 && goal.status === 'ACTIVE';
          
          return (
            <Card key={goal.id} className="relative overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold mb-1">{goal.name}</CardTitle>
                    {goal.description && (
                      <p className="text-sm text-gray-600">{goal.description}</p>
                    )}
                  </div>
                  <div className="flex space-x-1">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedGoal(goal);
                        setIsEditModalOpen(true);
                      }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedGoal(goal);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Progress</span>
                    <span className="text-sm font-bold text-gray-900">{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-300 ${
                        goal.status === 'COMPLETED' ? 'bg-green-600' :
                        goal.status === 'PAUSED' ? 'bg-yellow-500' :
                        progress >= 100 ? 'bg-green-600' :
                        progress >= 75 ? 'bg-blue-600' :
                        progress >= 50 ? 'bg-indigo-600' :
                        'bg-gray-400'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Amount Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Current Amount</span>
                    <span className="text-sm font-semibold">{formatCurrency(goal.current_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Target Amount</span>
                    <span className="text-sm font-semibold">{formatCurrency(goal.target_amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Remaining</span>
                    <span className="text-sm font-semibold text-orange-600">
                      {formatCurrency(Math.max(0, goal.target_amount - goal.current_amount))}
                    </span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Target Date</span>
                    <span className="text-sm font-medium">
                      {new Date(goal.target_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Days Remaining</span>
                    <span className={`text-sm font-medium ${
                      isOverdue ? 'text-red-600' : 
                      daysUntil <= 30 ? 'text-orange-600' : 
                      'text-gray-900'
                    }`}>
                      {isOverdue ? `${Math.abs(daysUntil)} days overdue` : 
                       goal.status === 'COMPLETED' ? 'Completed' :
                       `${daysUntil} days`}
                    </span>
                  </div>
                </div>

                {/* Status and Priority Badges */}
                <div className="flex justify-between items-center">
                  <div className="flex space-x-2">
                    <Badge variant={getStatusColor(goal.status)} className="text-xs">
                      {goal.status}
                    </Badge>
                    <Badge variant={getPriorityColor(goal.priority)} className="text-xs">
                      {goal.priority}
                    </Badge>
                  </div>
                  
                  {goal.category && (
                    <Badge variant="outline" className="text-xs">
                      {goal.category}
                    </Badge>
                  )}
                </div>

                {/* Warning for overdue goals */}
                {isOverdue && (
                  <div className="mt-3 flex items-center space-x-2 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-xs">This goal is overdue</span>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Create Goal Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
        size="md"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold">Create New Goal</h2>
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => e.preventDefault()}>
            <FormSection>
              <div className="space-y-4">
                <Input
                  label="Goal Name"
                  placeholder="e.g., Emergency Fund"
                  required
                />
                <Input
                  label="Description"
                  placeholder="e.g., 6 months of expenses for financial security"
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    type="number"
                    label="Target Amount"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                  <Input
                    type="date"
                    label="Target Date"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Priority"
                    placeholder="Select priority"
                    options={GOAL_PRIORITIES}
                    required
                  />
                  <Select
                    label="Category"
                    placeholder="Select category"
                    options={GOAL_CATEGORIES.map(cat => ({
                      value: cat,
                      label: cat
                    }))}
                  />
                </div>
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
              onClick={() => handleCreateGoal({
                name: 'Sample Goal',
                description: 'Sample description',
                target_amount: 5000,
                target_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                priority: 'MEDIUM',
                category: 'Other'
              })}
            >
              Create Goal
            </Button>
          </FormActions>
        </ModalFooter>
      </Modal>

      {/* Edit Goal Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        size="md"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold">Edit Goal</h2>
        </ModalHeader>
        <ModalBody>
          {selectedGoal && (
            <Form onSubmit={(e) => e.preventDefault()}>
              <FormSection>
                <div className="space-y-4">
                  <Input
                    label="Goal Name"
                    defaultValue={selectedGoal.name}
                    placeholder="e.g., Emergency Fund"
                    required
                  />
                  <Input
                    label="Description"
                    defaultValue={selectedGoal.description || ''}
                    placeholder="e.g., 6 months of expenses for financial security"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="number"
                      label="Target Amount"
                      defaultValue={selectedGoal.target_amount}
                      step="0.01"
                      required
                    />
                    <Input
                      type="number"
                      label="Current Amount"
                      defaultValue={selectedGoal.current_amount}
                      step="0.01"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      type="date"
                      label="Target Date"
                      defaultValue={selectedGoal.target_date}
                      required
                    />
                    <Select
                      label="Status"
                      defaultValue={selectedGoal.status}
                      options={GOAL_STATUS}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      label="Priority"
                      defaultValue={selectedGoal.priority}
                      options={GOAL_PRIORITIES}
                      required
                    />
                    <Select
                      label="Category"
                      defaultValue={selectedGoal.category || ''}
                      options={[
                        { value: '', label: 'No Category' },
                        ...GOAL_CATEGORIES.map(cat => ({
                          value: cat,
                          label: cat
                        }))
                      ]}
                    />
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
              onClick={() => selectedGoal && handleUpdateGoal(selectedGoal.id, {
                name: selectedGoal.name,
                description: selectedGoal.description,
                target_amount: selectedGoal.target_amount,
                current_amount: selectedGoal.current_amount,
                target_date: selectedGoal.target_date,
                priority: selectedGoal.priority,
                status: selectedGoal.status,
                category: selectedGoal.category
              })}
            >
              Update Goal
            </Button>
          </FormActions>
        </ModalFooter>
      </Modal>

      {/* Delete Goal Modal */}
      <Modal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        size="sm"
      >
        <ModalHeader>
          <h2 className="text-lg font-semibold text-red-600">Delete Goal</h2>
        </ModalHeader>
        <ModalBody>
          {selectedGoal && (
            <div className="space-y-4">
              <p className="text-gray-700">
                Are you sure you want to delete the goal "{selectedGoal.name}"?
              </p>
              
              <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
                <div className="space-y-2">
                  <p className="font-medium">{selectedGoal.name}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Progress:</span>
                      <span className="ml-2 font-medium">{getGoalProgress(selectedGoal).toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Saved:</span>
                      <span className="ml-2 font-medium">{formatCurrency(selectedGoal.current_amount)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This action cannot be undone. All progress tracking for this goal will be lost.
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
              onClick={() => selectedGoal && handleDeleteGoal(selectedGoal.id)}
            >
              Delete Goal
            </Button>
          </FormActions>
        </ModalFooter>
      </Modal>
    </div>
  );
}