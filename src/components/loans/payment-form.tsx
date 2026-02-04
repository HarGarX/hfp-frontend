'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatCurrency } from '@/lib/utils';import { type Loan } from '@/types/loan';
const paymentSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  payment_date: z.string().min(1, 'Payment date is required'),
  notes: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  loan: {
    id: string;
    name: string;
    current_balance: number;
    payment_amount?: number;
  };
  onSubmit: (data: PaymentFormData) => Promise<void> | void;
  onCancel: () => void;
}

export function PaymentForm({ loan, onSubmit, onCancel }: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: loan.payment_amount || 0,
      payment_date: new Date().toISOString().split('T')[0],
    },
  });

  const watchAmount = watch('amount');

  const handleFormSubmit = async (data: PaymentFormData) => {
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePresetAmount = (amount: number) => {
    setValue('amount', amount);
  };

  const remainingAfterPayment = Math.max(0, loan.current_balance - (watchAmount || 0));

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Current Balance */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600">Current Balance</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">
          {formatCurrency(loan.current_balance)}
        </p>
      </div>

      {/* Payment Amount */}
      <div className="space-y-2">
        <Input
          label="Payment Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          error={errors.amount?.message}
          required
          {...register('amount', { valueAsNumber: true })}
        />

        {/* Quick Amount Buttons */}
        <div className="flex gap-2">
          {loan.payment_amount && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handlePresetAmount(loan.payment_amount!)}
            >
              Regular ({formatCurrency(loan.payment_amount)})
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handlePresetAmount(loan.current_balance)}
          >
            Pay Off ({formatCurrency(loan.current_balance)})
          </Button>
        </div>
      </div>

      {/* Payment Date */}
      <Input
        label="Payment Date"
        type="date"
        error={errors.payment_date?.message}
        required
        {...register('payment_date')}
      />

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          placeholder="Add any notes about this payment..."
          {...register('notes')}
        />
      </div>

      {/* Remaining Balance Preview */}
      {watchAmount > 0 && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-gray-600">Remaining Balance After Payment</p>
          <p className="text-xl font-bold text-gray-900 mt-1">
            {formatCurrency(remainingAfterPayment)}
          </p>
          {remainingAfterPayment === 0 && (
            <p className="text-sm text-green-600 mt-2">🎉 This will pay off the loan!</p>
          )}
        </div>
      )}

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
          {isSubmitting ? 'Processing...' : 'Make Payment'}
        </Button>
      </div>
    </form>
  );
}
