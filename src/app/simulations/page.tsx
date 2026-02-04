'use client';

import { useState } from 'react';
import {
  BarChart3,
  Plus,
  Play,
  TrendingUp,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { PageLoader } from '@/components/LoadingSpinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useSimulations, useCreateSimulation, useRunSimulation, useDeleteSimulation } from '@/lib/hooks/useApi';

enum SimulationType {
  RETIREMENT_PLANNING = 'RETIREMENT_PLANNING',
  DEBT_PAYOFF = 'DEBT_PAYOFF',
  GOAL_PROJECTION = 'GOAL_PROJECTION',
  BUDGET_ADJUSTMENT = 'BUDGET_ADJUSTMENT',
  INCOME_CHANGE = 'INCOME_CHANGE',
  WHAT_IF = 'WHAT_IF',
}

enum SimulationStatus {
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

interface Simulation {
  id: string;
  name: string;
  type: SimulationType;
  status: SimulationStatus;
  description?: string;
  parameters: Record<string, any>;
  results?: {
    projected_savings: number;
    time_to_goal_months: number;
    total_interest_saved?: number;
    financial_impact_score: number;
  };
  created_at: string;
  updated_at: string;
}

const getSimulationTypeColor = (type: SimulationType): 'blue' | 'green' | 'purple' | 'yellow' | 'orange' | 'red' => {
  return {
    [SimulationType.RETIREMENT_PLANNING]: 'blue' as const,
    [SimulationType.DEBT_PAYOFF]: 'green' as const,
    [SimulationType.GOAL_PROJECTION]: 'purple' as const,
    [SimulationType.BUDGET_ADJUSTMENT]: 'yellow' as const,
    [SimulationType.INCOME_CHANGE]: 'orange' as const,
    [SimulationType.WHAT_IF]: 'red' as const,
  }[type];
};

export default function SimulationsPage() {
  // React Query hooks
  const { data: simulations = [], isLoading, error } = useSimulations();
  const createSimulation = useCreateSimulation();
  const runSimulation = useRunSimulation();
  const deleteSimulation = useDeleteSimulation();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);
  const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);

  const handleCreateSimulation = async (data: any) => {
    try {
      await createSimulation.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating simulation:', error);
    }
  };

  const handleRunSimulation = async (simulationId: string) => {
    try {
      await runSimulation.mutateAsync({ id: simulationId });
    } catch (error) {
      console.error('Error running simulation:', error);
    }
  };

  const handleDeleteSimulation = async (simulationId: string) => {
    if (!confirm('Are you sure you want to delete this simulation?')) return;

    try {
      await deleteSimulation.mutateAsync(simulationId);
    } catch (error) {
      console.error('Error deleting simulation:', error);
    }
  };

  const handleViewResults = (simulation: Simulation) => {
    setSelectedSimulation(simulation);
    setIsResultsModalOpen(true);
  };

  const completedSimulations = simulations.filter((s: any) => s.status === SimulationStatus.COMPLETED);
  const avgImpactScore = completedSimulations.length > 0
    ? Math.round(
        completedSimulations.reduce((sum: number, s: any) => sum + (s.results?.financial_impact_score || 0), 0) /
        completedSimulations.length
      )
    : 0;

  if (isLoading) return <PageLoader />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading simulations</p>
          <p className="text-gray-600 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Simulations & Forecasting</h1>
          <p className="text-gray-600 mt-1">Model what-if scenarios and financial projections</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Simulation
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Simulations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{simulations.length}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{completedSimulations.length}</p>
            </div>
            <Play className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Impact Score</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">{avgImpactScore}/100</p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Quick Scenario Templates */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Quick Scenario Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              type: SimulationType.DEBT_PAYOFF,
              title: 'Debt Payoff Calculator',
              description: 'See how extra payments affect your debt timeline',
              icon: '💰',
            },
            {
              type: SimulationType.RETIREMENT_PLANNING,
              title: 'Retirement Planner',
              description: 'Project your retirement savings and timeline',
              icon: '🏖️',
            },
            {
              type: SimulationType.GOAL_PROJECTION,
              title: 'Goal Projection',
              description: 'Model progress towards financial goals',
              icon: '🎯',
            },
          ].map((template) => (
            <Card key={template.type} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setIsCreateModalOpen(true)}>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">{template.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{template.title}</h3>
                <p className="text-sm text-gray-600">{template.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Simulations List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Simulations</h2>

        {simulations.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No simulations yet</h3>
              <p className="text-gray-600 mb-4">Create your first financial simulation</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Simulation
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-4">
            {simulations.map((simulation) => (
              <Card key={simulation.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{simulation.name}</h3>
                      <Badge color={getSimulationTypeColor(simulation.type)}>
                        {simulation.type.replace(/_/g, ' ')}
                      </Badge>
                      <Badge color={simulation.status === SimulationStatus.COMPLETED ? 'green' : 'gray'}>
                        {simulation.status}
                      </Badge>
                    </div>

                    {simulation.description && (
                      <p className="text-sm text-gray-600 mb-3">{simulation.description}</p>
                    )}

                    {simulation.results && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {simulation.results.projected_savings !== undefined && (
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="text-xs text-green-600 font-medium">Projected Savings</p>
                            <p className="text-lg font-bold text-green-900">
                              {formatCurrency(simulation.results.projected_savings)}
                            </p>
                          </div>
                        )}

                        {simulation.results.time_to_goal_months !== undefined && (
                          <div className="p-3 bg-blue-50 rounded-lg">
                            <p className="text-xs text-blue-600 font-medium">Time to Goal</p>
                            <p className="text-lg font-bold text-blue-900">
                              {simulation.results.time_to_goal_months} months
                            </p>
                          </div>
                        )}

                        {simulation.results.financial_impact_score !== undefined && (
                          <div className="p-3 bg-purple-50 rounded-lg">
                            <p className="text-xs text-purple-600 font-medium">Impact Score</p>
                            <p className="text-lg font-bold text-purple-900">
                              {simulation.results.financial_impact_score}/100
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Created {formatDate(simulation.created_at)}</span>
                      <span>Updated {formatDate(simulation.updated_at)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  {simulation.status === SimulationStatus.COMPLETED ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleViewResults(simulation)}
                    >
                      View Results
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleRunSimulation(simulation.id)}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      Run Simulation
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSimulation(simulation.id)}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Simulation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Simulation"
        size="lg"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleCreateSimulation({
              name: formData.get('name'),
              type: formData.get('type'),
              description: formData.get('description'),
            });
          }}
          className="space-y-4"
        >
          <Input
            name="name"
            label="Simulation Name"
            placeholder="e.g., Early Retirement Plan"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              name="type"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select type...</option>
              {Object.values(SimulationType).map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Describe your simulation scenario..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" className="flex-1">
              Create Simulation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Results Modal */}
      {selectedSimulation && selectedSimulation.results && (
        <Modal
          isOpen={isResultsModalOpen}
          onClose={() => setIsResultsModalOpen(false)}
          title={selectedSimulation.name}
          size="xl"
        >
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Projected Savings</h3>
                <p className="text-3xl font-bold text-green-600">
                  {formatCurrency(selectedSimulation.results.projected_savings)}
                </p>
              </Card>

              <Card>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Timeline</h3>
                <p className="text-3xl font-bold text-blue-600">
                  {selectedSimulation.results.time_to_goal_months} months
                </p>
              </Card>

              {selectedSimulation.results.total_interest_saved !== undefined && (
                <Card>
                  <h3 className="text-sm font-medium text-gray-600 mb-2">Interest Saved</h3>
                  <p className="text-3xl font-bold text-purple-600">
                    {formatCurrency(selectedSimulation.results.total_interest_saved)}
                  </p>
                </Card>
              )}

              <Card>
                <h3 className="text-sm font-medium text-gray-600 mb-2">Impact Score</h3>
                <p className="text-3xl font-bold text-orange-600">
                  {selectedSimulation.results.financial_impact_score}/100
                </p>
              </Card>
            </div>

            {/* Insights */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">
                    This scenario has a high positive financial impact
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600">✓</span>
                  <span className="text-gray-700">
                    You could reach your goal {Math.floor(selectedSimulation.results.time_to_goal_months / 12)} years
                    {' '}and {selectedSimulation.results.time_to_goal_months % 12} months earlier
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">ℹ</span>
                  <span className="text-gray-700">
                    Consider implementing this strategy gradually
                  </span>
                </li>
              </ul>
            </Card>

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setIsResultsModalOpen(false)}>
                Close
              </Button>
              <Button variant="default">
                Apply This Scenario
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
