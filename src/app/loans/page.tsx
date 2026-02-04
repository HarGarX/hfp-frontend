'use client';

import { useState } from 'react';
import { Plus, CreditCard, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { LoadingSpinner, PageLoader } from '@/components/LoadingSpinner';
import { LoanForm } from '@/components/loans/loan-form';
import { LoanDetails } from '@/components/loans/loan-details';
import { PaymentForm } from '@/components/loans/payment-form';
import { formatCurrency, formatDate } from '@/lib/utils';
import { LoanType, LoanStatus, PaymentFrequency, type Loan } from '@/types/loan';
import { useLoans, useCreateLoan, useDeleteLoan, useAddLoanPayment } from '@/lib/hooks/useApi';
import { LoanPayoffChart } from '@/components/charts/LoanPayoffChart';

const getLoanTypeColor = (type: LoanType): 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'gray' => {
  const colors = {
    [LoanType.MORTGAGE]: 'blue' as const,
    [LoanType.AUTO]: 'green' as const,
    [LoanType.PERSONAL]: 'purple' as const,
    [LoanType.CREDIT_CARD]: 'orange' as const,
    [LoanType.BNPL]: 'red' as const,
    [LoanType.OTHER]: 'gray' as const,
  };
  return colors[type];
};

const getLoanStatusColor = (status: LoanStatus): 'green' | 'red' | 'yellow' | 'gray' => {
  const colors = {
    [LoanStatus.ACTIVE]: 'green' as const,
    [LoanStatus.PAID_OFF]: 'gray' as const,
    [LoanStatus.DEFAULTED]: 'red' as const,
    [LoanStatus.CLOSED]: 'yellow' as const,
  };
  return colors[status];
};

export default function LoansPage() {
  // React Query hooks
  const { data: loans = [], isLoading, error } = useLoans();
  const createLoan = useCreateLoan();
  const deleteLoan = useDeleteLoan();
  const addPayment = useAddLoanPayment();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);

  const handleCreateLoan = async (data: any) => {
    try {
      await createLoan.mutateAsync(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('Error creating loan:', error);
    }
  };

  const handleViewDetails = (loan: any) => {
    setSelectedLoan(loan as Loan);
    setIsDetailsModalOpen(true);
  };

  const handleMakePayment = (loan: any) => {
    setSelectedLoan(loan as Loan);
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (data: any) => {
    if (!selectedLoan) return;
    
    try {
      await addPayment.mutateAsync({
        loanId: selectedLoan.id,
        data,
      });
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  const handleDeleteLoan = async (loanId: string) => {
    if (!confirm('Are you sure you want to delete this loan?')) return;
    
    try {
      await deleteLoan.mutateAsync(loanId);
    } catch (error) {
      console.error('Error deleting loan:', error);
    }
  };

  // Calculate summary statistics
  const loanList = (loans || []) as Loan[];
  const totalBalance = loanList
    .filter(l => l.status === LoanStatus.ACTIVE)
    .reduce((sum, loan) => sum + loan.current_balance, 0);
  
  const monthlyPayment = loanList
    .filter(l => l.status === LoanStatus.ACTIVE && l.payment_amount)
    .reduce((sum, loan) => sum + (loan.payment_amount || 0), 0);
  
  const totalInterest = loanList
    .filter(l => l.status === LoanStatus.ACTIVE)
    .reduce((sum, loan) => {
      const monthsRemaining = loan.end_date 
        ? Math.ceil((new Date(loan.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24 * 30))
        : 0;
      const totalPayments = (loan.payment_amount || 0) * monthsRemaining;
      return sum + (totalPayments - loan.current_balance);
    }, 0);

  if (isLoading) return <PageLoader />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading loans</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Loans & Debt</h1>
          <p className="text-gray-600 mt-1">Manage your loans and track debt payoff</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Loan
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Debt</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(totalBalance)}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <CreditCard className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Payment</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(monthlyPayment)}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Est. Interest</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {formatCurrency(Math.max(0, totalInterest))}
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Loan Payoff Chart */}
      {loans.length > 0 && (
        <LoanPayoffChart loans={loans} />
      )}

      {/* Loans List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Your Loans</h2>
        
        {loans.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No loans yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first loan</p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Loan
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {loanList.map((loan) => (
              <Card key={loan.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{loan.name}</h3>
                        <Badge color={getLoanTypeColor(loan.type as any)}>
                          {loan.type.replace('_', ' ')}
                        </Badge>
                        <Badge color={getLoanStatusColor(loan.status as any)}>
                          {loan.status}
                        </Badge>
                      </div>
                      {loan.description && (
                        <p className="text-sm text-gray-600">{loan.description}</p>
                      )}
                      {loan.lender && (
                        <p className="text-xs text-gray-500 mt-1">
                          {loan.lender} {loan.account_number}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">
                        {formatCurrency(loan.current_balance)} remaining
                      </span>
                      <span className="text-gray-600">
                        {Math.round((1 - loan.current_balance / loan.principal_amount) * 100)}% paid
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.round((1 - loan.current_balance / loan.principal_amount) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Interest Rate</p>
                      <p className="font-semibold text-gray-900">{loan.interest_rate}%</p>
                    </div>
                    {loan.payment_amount && (
                      <div>
                        <p className="text-gray-600">Monthly Payment</p>
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(loan.payment_amount)}
                        </p>
                      </div>
                    )}
                    {loan.next_payment_date && (
                      <div>
                        <p className="text-gray-600">Next Payment</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(loan.next_payment_date)}
                        </p>
                      </div>
                    )}
                    {loan.end_date && (
                      <div>
                        <p className="text-gray-600">Payoff Date</p>
                        <p className="font-semibold text-gray-900">
                          {formatDate(loan.end_date)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(loan as any)}
                      className="flex-1"
                    >
                      View Details
                    </Button>
                    {loan.status === LoanStatus.ACTIVE && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleMakePayment(loan as any)}
                        className="flex-1"
                      >
                        Make Payment
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteLoan(loan.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create Loan Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New Loan"
        size="lg"
      >
        <LoanForm onSubmit={handleCreateLoan} onCancel={() => setIsCreateModalOpen(false)} />
      </Modal>

      {/* Loan Details Modal */}
      {selectedLoan && (
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={selectedLoan.name}
          size="xl"
        >
          <LoanDetails loan={selectedLoan} />
        </Modal>
      )}

      {/* Payment Modal */}
      {selectedLoan && (
        <Modal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          title={`Make Payment - ${selectedLoan.name}`}
          size="md"
        >
          <PaymentForm
            loan={selectedLoan}
            onSubmit={handlePaymentSubmit}
            onCancel={() => setIsPaymentModalOpen(false)}
          />
        </Modal>
      )}
    </div>
  );
}
