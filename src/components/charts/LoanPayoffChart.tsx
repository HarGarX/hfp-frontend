'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loan } from '@/lib/types';
import { format, addMonths, parseISO } from 'date-fns';

interface LoanPayoffChartProps {
  loans: Loan[];
}

export function LoanPayoffChart({ loans }: LoanPayoffChartProps) {
  const chartData = React.useMemo(() => {
    if (!loans || loans.length === 0) return [];

    const activeLoans = loans.filter(l => l.status === 'ACTIVE');
    
    if (activeLoans.length === 0) return [];

    // Generate projection for next 12 months
    const months = 12;
    const projections = [];

    for (let i = 0; i <= months; i++) {
      const currentDate = addMonths(new Date(), i);
      const monthLabel = format(currentDate, 'MMM yyyy');

      const monthData: any = {
        month: monthLabel,
        fullDate: format(currentDate, 'yyyy-MM-dd'),
      };

      activeLoans.forEach(loan => {
        // Simple projection: reduce remaining by monthly payment
        const monthsPassed = i;
        const payment = loan.payment_amount || 0;
        const paidSoFar = Math.min(
          payment * monthsPassed,
          loan.current_balance
        );
        const remaining = Math.max(0, loan.current_balance - paidSoFar);
        
        monthData[loan.name] = parseFloat(remaining.toFixed(2));
      });

      projections.push(monthData);
    }

    return projections;
  }, [loans]);

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loan Payoff Projection</CardTitle>
          <CardDescription>No active loans to display</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const loanNames = loans
    .filter(l => l.status === 'ACTIVE')
    .map(l => l.name);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Loan Payoff Projection</CardTitle>
        <CardDescription>Projected remaining balance over the next 12 months</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />
            <XAxis 
              dataKey="month" 
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
              formatter={(value: number | undefined, name: string | undefined) => 
                [value !== undefined ? `$${value.toFixed(2)}` : '$0.00', name || '']
              }
            />
            <Legend />
            {loanNames.map((loanName, index) => (
              <Area
                key={loanName}
                type="monotone"
                dataKey={loanName}
                stackId="1"
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

const COLORS = [
  '#3b82f6', // blue
  '#10b981', // green
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // violet
  '#ec4899', // pink
];
