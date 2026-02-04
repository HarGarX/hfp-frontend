'use client';

import { useState } from 'react';
import { 
  Lightbulb, 
  BarChart3, 
  AlertTriangle,
  CheckCircle,
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageLoader } from '@/components/LoadingSpinner';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  useInsights, 
  useInsightsSummary, 
  useAcknowledgeInsight, 
  useDismissInsight, 
  useTransactions, 
  useCategories 
} from '@/lib/hooks/useApi';
import { SpendingOverTimeChart } from '@/components/charts/SpendingOverTimeChart';
import { ExpensesByCategoryChart } from '@/components/charts/ExpensesByCategoryChart';

enum InsightType {
  SPENDING_PATTERN = 'SPENDING_PATTERN',
  BUDGET_ALERT = 'BUDGET_ALERT',
  SAVINGS_OPPORTUNITY = 'SAVINGS_OPPORTUNITY',
  GOAL_PROGRESS = 'GOAL_PROGRESS',
  ANOMALY_DETECTION = 'ANOMALY_DETECTION',
  DEBT_MANAGEMENT = 'DEBT_MANAGEMENT',
  INCOME_TRACKING = 'INCOME_TRACKING',
  FINANCIAL_HEALTH = 'FINANCIAL_HEALTH',
}

enum InsightPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

enum InsightStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  DISMISSED = 'DISMISSED',
  RESOLVED = 'RESOLVED',
}

interface Insight {
  id: string;
  type: InsightType;
  priority: InsightPriority;
  status: InsightStatus;
  title: string;
  description: string;
  recommendation?: string;
  impact_score?: number;
  data_source: string;
  created_at: string;
  acknowledged_at?: string;
}

const getPriorityColor = (priority: InsightPriority): 'red' | 'yellow' | 'blue' => {
  return {
    [InsightPriority.HIGH]: 'red' as const,
    [InsightPriority.MEDIUM]: 'yellow' as const,
    [InsightPriority.LOW]: 'blue' as const,
  }[priority];
};

const getInsightIcon = (type: InsightType) => {
  const icons = {
    [InsightType.SPENDING_PATTERN]: BarChart3,
    [InsightType.BUDGET_ALERT]: AlertTriangle,
    [InsightType.SAVINGS_OPPORTUNITY]: Lightbulb,
    [InsightType.GOAL_PROGRESS]: CheckCircle,
    [InsightType.ANOMALY_DETECTION]: AlertTriangle,
    [InsightType.DEBT_MANAGEMENT]: BarChart3,
    [InsightType.INCOME_TRACKING]: BarChart3,
    [InsightType.FINANCIAL_HEALTH]: Lightbulb,
  };
  return icons[type];
};

export default function InsightsPage() {
  // React Query hooks
  const { data: insights = [], isLoading, error } = useInsights();
  const { data: summary } = useInsightsSummary();
  const { data: transactions = [] } = useTransactions({ limit: 100 });
  const { data: categories = [] } = useCategories();
  const acknowledgeInsight = useAcknowledgeInsight();
  const dismissInsight = useDismissInsight();

  const [filter, setFilter] = useState<'all' | InsightPriority>('all');

  const handleAcknowledge = async (insightId: string) => {
    try {
      await acknowledgeInsight.mutateAsync(insightId);
    } catch (error) {
      console.error('Error acknowledging insight:', error);
    }
  };

  const handleDismiss = async (insightId: string) => {
    try {
      await dismissInsight.mutateAsync(insightId);
    } catch (error) {
      console.error('Error dismissing insight:', error);
    }
  };

  const filteredInsights = filter === 'all' 
    ? insights 
    : insights.filter((i: any) => i.priority === filter);

  const activeInsights = insights.filter((i: any) => i.status === InsightStatus.ACTIVE);

  if (isLoading) return <PageLoader />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading insights</p>
          <p className="text-gray-600 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Insights & Analytics</h1>
        <p className="text-gray-600 mt-1">AI-powered financial insights and recommendations</p>
      </div>

      {/* Financial Health Score */}
      <Card>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Financial Health Score</h2>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-gray-900">{summary?.financial_health_score || 0}</span>
              <span className="text-lg text-gray-600 mb-1">/ 100</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mt-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  (summary?.financial_health_score || 0) >= 80 ? 'bg-green-600' :
                  (summary?.financial_health_score || 0) >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${summary?.financial_health_score || 0}%` }}
              />
            </div>
          </div>
          <div className="flex flex-col items-end gap-2 ml-8">
            <Badge color={activeInsights.length > 5 ? 'red' : 'green'}>
              {activeInsights.length} Active Insights
            </Badge>
            <span className="text-xs text-gray-500">
              Updated {summary?.last_generated ? formatDate(summary.last_generated) : 'N/A'}
            </span>
          </div>
        </div>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Priority</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{summary?.high_priority || 0}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Medium Priority</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">{summary?.medium_priority || 0}</p>
            </div>
            <Lightbulb className="w-8 h-8 text-yellow-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Low Priority</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{summary?.low_priority || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
      </div>
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingOverTimeChart transactions={transactions} />
        <ExpensesByCategoryChart transactions={transactions} categories={categories} />
      </div>
      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({insights.length})
        </Button>
        <Button
          variant={filter === InsightPriority.HIGH ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter(InsightPriority.HIGH)}
        >
          High Priority
        </Button>
        <Button
          variant={filter === InsightPriority.MEDIUM ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter(InsightPriority.MEDIUM)}
        >
          Medium Priority
        </Button>
        <Button
          variant={filter === InsightPriority.LOW ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter(InsightPriority.LOW)}
        >
          Low Priority
        </Button>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No insights found</h3>
              <p className="text-gray-600">Check back later for new insights</p>
            </div>
          </Card>
        ) : (
          filteredInsights.map((insight) => {
            const Icon = getInsightIcon(insight.type);
            return (
              <Card key={insight.id} className="hover:shadow-lg transition-shadow">
                <div className="flex gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${
                    insight.priority === InsightPriority.HIGH ? 'bg-red-100' :
                    insight.priority === InsightPriority.MEDIUM ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      insight.priority === InsightPriority.HIGH ? 'text-red-600' :
                      insight.priority === InsightPriority.MEDIUM ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                          <Badge color={getPriorityColor(insight.priority)}>
                            {insight.priority}
                          </Badge>
                          {insight.status === InsightStatus.ACKNOWLEDGED && (
                            <Badge color="gray">Acknowledged</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>

                    {insight.recommendation && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm font-medium text-blue-900">💡 Recommendation</p>
                        <p className="text-sm text-blue-800 mt-1">{insight.recommendation}</p>
                      </div>
                    )}

                    {insight.impact_score && (
                      <div className="mt-3">
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-600">Impact Score:</span>
                          <div className="flex-1 max-w-xs bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                insight.impact_score >= 80 ? 'bg-red-600' :
                                insight.impact_score >= 60 ? 'bg-yellow-600' : 'bg-blue-600'
                              }`}
                              style={{ width: `${insight.impact_score}%` }}
                            />
                          </div>
                          <span className="font-semibold text-gray-900">{insight.impact_score}/100</span>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    {insight.status === InsightStatus.ACTIVE && (
                      <div className="flex gap-2 mt-4 pt-3 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleAcknowledge(insight.id)}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Acknowledge
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDismiss(insight.id)}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Dismiss
                        </Button>
                      </div>
                    )}

                    <p className="text-xs text-gray-500 mt-2">
                      Generated {formatDate(insight.created_at)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
