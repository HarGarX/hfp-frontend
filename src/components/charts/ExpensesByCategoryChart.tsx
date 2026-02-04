'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction, Category } from '@/lib/types';

interface ExpensesByCategoryChartProps {
  transactions: Transaction[];
  categories: Category[];
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#6366f1', // indigo
  '#84cc16', // lime
];

export function ExpensesByCategoryChart({ transactions, categories }: ExpensesByCategoryChartProps) {
  const chartData = React.useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    // Filter only expenses
    const expenses = transactions.filter(t => t.transaction_type === 'expense');

    // Group by category
    const categoryTotals = expenses.reduce((acc, transaction) => {
      const categoryId = transaction.category_id || 'uncategorized';
      acc[categoryId] = (acc[categoryId] || 0) + transaction.amount;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and add category names
    const data = Object.entries(categoryTotals).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        name: category?.name || 'Uncategorized',
        value: parseFloat(amount.toFixed(2)),
        percentage: 0, // Will calculate after
      };
    });

    // Calculate percentages
    const total = data.reduce((sum, item) => sum + item.value, 0);
    data.forEach(item => {
      item.percentage = parseFloat(((item.value / total) * 100).toFixed(1));
    });

    // Sort by value descending
    return data.sort((a, b) => b.value - a.value);
  }, [transactions, categories]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
          <CardDescription>No expense data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            ${data.value.toFixed(2)} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
        <CardDescription>Breakdown of spending by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry: any) => `${entry.name} (${entry.percentage}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
