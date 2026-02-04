'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Transaction } from '@/lib/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, parseISO } from 'date-fns';

interface SpendingOverTimeChartProps {
  transactions: Transaction[];
  dateRange?: { start: Date; end: Date };
}

export function SpendingOverTimeChart({ transactions, dateRange }: SpendingOverTimeChartProps) {
  // Prepare data for the chart
  const chartData = React.useMemo(() => {
    if (!transactions || transactions.length === 0) return [];

    const range = dateRange || {
      start: startOfMonth(new Date()),
      end: endOfMonth(new Date()),
    };

    // Create daily buckets
    const days = eachDayOfInterval({ start: range.start, end: range.end });
    
    const dailyData = days.map((day: Date) => {
      const dayStr = format(day, 'yyyy-MM-dd');
      
      // Calculate income and expenses for this day
      const dayTransactions = transactions.filter(t => {
        const txDate = t.transaction_date ? format(parseISO(t.transaction_date), 'yyyy-MM-dd') : '';
        return txDate === dayStr;
      });

      const income = dayTransactions
        .filter(t => t.transaction_type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

      const expenses = dayTransactions
        .filter(t => t.transaction_type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: format(day, 'MMM dd'),
        fullDate: dayStr,
        income: parseFloat(income.toFixed(2)),
        expenses: parseFloat(expenses.toFixed(2)),
        net: parseFloat((income - expenses).toFixed(2)),
      };
    });

    return dailyData;
  }, [transactions, dateRange]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Over Time</CardTitle>
          <CardDescription>No transaction data available</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Over Time</CardTitle>
        <CardDescription>Income, expenses, and net cash flow</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="date" 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
            />
            <YAxis 
              className="text-xs"
              tick={{ fill: 'currentColor' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '6px',
              }}
              formatter={(value: number | undefined) => value !== undefined ? [`$${value.toFixed(2)}`, ''] : ['$0.00', '']}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="income" 
              stroke="#10b981" 
              strokeWidth={2}
              name="Income"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="expenses" 
              stroke="#ef4444" 
              strokeWidth={2}
              name="Expenses"
              dot={false}
            />
            <Line 
              type="monotone" 
              dataKey="net" 
              stroke="#3b82f6" 
              strokeWidth={2}
              name="Net"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
