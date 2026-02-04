'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { LoanType, LoanStatus, type Loan, type LoanPayment } from '@/types/loan';

interface LoanDetailsProps {
  loan: Loan;
}

// Mock payment history
const MOCK_PAYMENTS = [
  {
    id: '1',
    date: '2026-02-01',
    amount: 1620,
    principal: 1250,
    interest: 370,
    remaining_balance: 298500,
  },
  {
    id: '2',
    date: '2026-01-01',
    amount: 1620,
    principal: 1245,
    interest: 375,
    remaining_balance: 299750,
  },
  {
    id: '3',
    date: '2025-12-01',
    amount: 1620,
    principal: 1240,
    interest: 380,
    remaining_balance: 300990,
  },
];

export function LoanDetails({ loan }: LoanDetailsProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'payments' | 'projection'>('overview');

  // Calculate payoff projection
  const monthsRemaining = loan.end_date
    ? Math.ceil((new Date(loan.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))
    : 0;

  const totalPayments = (loan.payment_amount || 0) * monthsRemaining;
  const totalInterest = Math.max(0, totalPayments - loan.current_balance);
  const percentPaid = ((loan.principal_amount - loan.current_balance) / loan.principal_amount) * 100;

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'payments'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Payment History
        </button>
        <button
          onClick={() => setActiveTab('projection')}
          className={`px-4 py-2 font-medium ${
            activeTab === 'projection'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Payoff Projection
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Progress */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Progress</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {formatCurrency(loan.current_balance)} of {formatCurrency(loan.principal_amount)}
                </span>
                <span className="text-green-600 font-semibold">{percentPaid.toFixed(1)}% paid</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-green-600 h-4 rounded-full transition-all"
                  style={{ width: `${percentPaid}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <h4 className="text-sm font-medium text-gray-600 mb-4">Loan Information</h4>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Type</dt>
                  <dd className="text-sm font-medium text-gray-900">{loan.type.replace('_', ' ')}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Status</dt>
                  <dd>
                    <Badge color={loan.status === LoanStatus.ACTIVE ? 'green' : 'gray'}>
                      {loan.status}
                    </Badge>
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Interest Rate</dt>
                  <dd className="text-sm font-medium text-gray-900">{loan.interest_rate}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-600">Start Date</dt>
                  <dd className="text-sm font-medium text-gray-900">{formatDate(loan.start_date)}</dd>
                </div>
                {loan.end_date && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Maturity Date</dt>
                    <dd className="text-sm font-medium text-gray-900">{formatDate(loan.end_date)}</dd>
                  </div>
                )}
              </dl>
            </Card>

            <Card>
              <h4 className="text-sm font-medium text-gray-600 mb-4">Payment Information</h4>
              <dl className="space-y-3">
                {loan.payment_amount && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Payment Amount</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {formatCurrency(loan.payment_amount)}
                    </dd>
                  </div>
                )}
                {loan.payment_frequency && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Frequency</dt>
                    <dd className="text-sm font-medium text-gray-900">{loan.payment_frequency}</dd>
                  </div>
                )}
                {loan.next_payment_date && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Next Payment</dt>
                    <dd className="text-sm font-medium text-gray-900">
                      {formatDate(loan.next_payment_date)}
                    </dd>
                  </div>
                )}
                {loan.lender && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Lender</dt>
                    <dd className="text-sm font-medium text-gray-900">{loan.lender}</dd>
                  </div>
                )}
                {loan.account_number && (
                  <div className="flex justify-between">
                    <dt className="text-sm text-gray-600">Account</dt>
                    <dd className="text-sm font-medium text-gray-900">{loan.account_number}</dd>
                  </div>
                )}
              </dl>
            </Card>
          </div>
        </div>
      )}

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment History</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Principal
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Interest
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Remaining
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {MOCK_PAYMENTS.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(payment.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(payment.principal)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(payment.interest)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {formatCurrency(payment.remaining_balance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Projection Tab */}
      {activeTab === 'projection' && (
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payoff Projection</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Months Remaining</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{monthsRemaining}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Payments</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalPayments)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Interest</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {formatCurrency(totalInterest)}
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="text-sm font-medium text-gray-600 mb-4">What-If Scenarios</h4>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Extra $100/month payment
                </p>
                <p className="text-sm text-gray-600">
                  Save {formatCurrency(totalInterest * 0.15)} in interest, pay off {Math.floor(monthsRemaining * 0.1)} months earlier
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-sm font-medium text-gray-900 mb-2">
                  Extra $250/month payment
                </p>
                <p className="text-sm text-gray-600">
                  Save {formatCurrency(totalInterest * 0.35)} in interest, pay off {Math.floor(monthsRemaining * 0.25)} months earlier
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
