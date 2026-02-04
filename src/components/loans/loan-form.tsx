'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { LoanType, LoanStatus, PaymentFrequency, type Loan } from '@/types/loan';

const loanSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  description: z.string().optional(),
  type: z.nativeEnum(LoanType),
  status: z.nativeEnum(LoanStatus),
  principal_amount: z.number().positive('Principal amount must be positive'),
  current_balance: z.number().positive('Current balance must be positive'),
  interest_rate: z.number().min(0).max(100, 'Interest rate must be between 0-100'),
  payment_amount: z.number().positive('Payment amount must be positive'),
  payment_frequency: z.nativeEnum(PaymentFrequency),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().optional(),
  next_payment_date: z.string().optional(),
  lender: z.string().optional(),
  account_number: z.string().optional(),
});

type LoanFormData = z.infer<typeof loanSchema>;

interface LoanFormProps {
  initialData?: Partial<LoanFormData>;
  onSubmit: (data: LoanFormData) => Promise<void> | void;
  onCancel: () => void;
}

export function LoanForm({ initialData, onSubmit, onCancel }: LoanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoanFormData>({
    resolver: zodResolver(loanSchema),
    defaultValues: initialData || {
      status: LoanStatus.ACTIVE,
      type: LoanType.PERSONAL,
      payment_frequency: PaymentFrequency.MONTHLY,
    },
  });

  const handleFormSubmit = async (data: LoanFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
        
        <Input
          label="Loan Name"
          placeholder="e.g., Home Mortgage, Car Loan"
          error={errors.name?.message}
          required
          {...register('name')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Loan Type"
            error={errors.type?.message}
            required
            {...register('type')}
          >
            <option value={LoanType.PERSONAL}>Personal Loan</option>
            <option value={LoanType.MORTGAGE}>Mortgage</option>
            <option value={LoanType.AUTO}>Auto Loan</option>
            <option value={LoanType.CREDIT_CARD}>Credit Card</option>
            <option value={LoanType.BNPL}>Buy Now Pay Later</option>
            <option value={LoanType.OTHER}>Other</option>
          </Select>

          <Select
            label="Status"
            error={errors.status?.message}
            required
            {...register('status')}
          >
            <option value={LoanStatus.ACTIVE}>Active</option>
            <option value={LoanStatus.PAID_OFF}>Paid Off</option>
            <option value={LoanStatus.DEFAULTED}>Defaulted</option>
            <option value={LoanStatus.CLOSED}>Closed</option>
          </Select>
        </div>

        <Input
          label="Description"
          placeholder="Optional description"
          error={errors.description?.message}
          {...register('description')}
        />
      </div>

      {/* Loan Amounts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Loan Amounts</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Original Principal Amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.principal_amount?.message}
            required
            {...register('principal_amount', { valueAsNumber: true })}
          />

          <Input
            label="Current Balance"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.current_balance?.message}
            required
            {...register('current_balance', { valueAsNumber: true })}
          />
        </div>

        <Input
          label="Interest Rate (%)"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.interest_rate?.message}
          required
          {...register('interest_rate', { valueAsNumber: true })}
        />
      </div>

      {/* Payment Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Payment Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Payment Amount"
            type="number"
            step="0.01"
            placeholder="0.00"
            error={errors.payment_amount?.message}
            {...register('payment_amount', { valueAsNumber: true })}
          />

          <Select
            label="Payment Frequency"
            error={errors.payment_frequency?.message}
            {...register('payment_frequency')}
          >
            <option value="WEEKLY">Weekly</option>
            <option value="BIWEEKLY">Bi-weekly</option>
            <option value="MONTHLY">Monthly</option>
            <option value="QUARTERLY">Quarterly</option>
            <option value="YEARLY">Yearly</option>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Start Date"
            type="date"
            error={errors.start_date?.message}
            required
            {...register('start_date')}
          />

          <Input
            label="End Date"
            type="date"
            error={errors.end_date?.message}
            {...register('end_date')}
          />

          <Input
            label="Next Payment Date"
            type="date"
            error={errors.next_payment_date?.message}
            {...register('next_payment_date')}
          />
        </div>
      </div>

      {/* Lender Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Lender Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Lender Name"
            placeholder="e.g., Bank of America"
            error={errors.lender?.message}
            {...register('lender')}
          />

          <Input
            label="Account Number"
            placeholder="e.g., ****1234"
            error={errors.account_number?.message}
            {...register('account_number')}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button type="submit" variant="default" disabled={isSubmitting} className="flex-1">
          {isSubmitting ? 'Saving...' : initialData ? 'Update Loan' : 'Create Loan'}
        </Button>
      </div>
    </form>
  );
}
