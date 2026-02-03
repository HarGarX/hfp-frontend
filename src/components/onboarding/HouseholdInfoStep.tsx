'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Building, DollarSign } from 'lucide-react';
import { cn } from '@/lib/utils';

const householdInfoSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  postalCode: z.string().min(1, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  monthlyIncome: z.number().min(0, 'Monthly income must be positive'),
  monthlyExpenses: z.number().min(0, 'Monthly expenses must be positive'),
  financialGoals: z.array(z.string()).optional(),
});

type HouseholdInfoFormData = z.infer<typeof householdInfoSchema>;

interface HouseholdInfoStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  isLoading: boolean;
  initialData?: any;
}

const FINANCIAL_GOALS = [
  'Emergency Fund',
  'Home Purchase',
  'Debt Payoff',
  'Retirement Savings',
  'Vacation Fund',
  'Education Fund',
  'Investment Growth',
  'Budget Management',
];

export function HouseholdInfoStep({ onNext, onBack, isLoading, initialData }: HouseholdInfoStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<HouseholdInfoFormData>({
    resolver: zodResolver(householdInfoSchema),
    defaultValues: {
      address: initialData?.household?.address || '',
      city: initialData?.household?.city || '',
      state: initialData?.household?.state || '',
      postalCode: initialData?.household?.postalCode || '',
      country: initialData?.household?.country || 'United States',
      monthlyIncome: initialData?.household?.monthlyIncome || 0,
      monthlyExpenses: initialData?.household?.monthlyExpenses || 0,
      financialGoals: initialData?.household?.financialGoals || [],
    },
  });

  const selectedGoals = watch('financialGoals') || [];

  const toggleGoal = (goal: string) => {
    const currentGoals = selectedGoals;
    if (currentGoals.includes(goal)) {
      setValue('financialGoals', currentGoals.filter(g => g !== goal));
    } else {
      setValue('financialGoals', [...currentGoals, goal]);
    }
  };

  const onSubmit = (data: HouseholdInfoFormData) => {
    onNext({
      household: {
        ...initialData?.household,
        address: data.address,
        city: data.city,
        state: data.state,
        postalCode: data.postalCode,
        country: data.country,
        monthlyIncome: data.monthlyIncome,
        monthlyExpenses: data.monthlyExpenses,
        financialGoals: data.financialGoals,
      },
    });
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Household Details
        </h1>
        <p className="text-lg text-gray-600">
          Tell us more about your household to personalize your experience
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Address Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Building className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Address Information</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address *
              </label>
              <input
                {...register('address')}
                type="text"
                className={cn(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  errors.address ? "border-red-300" : "border-gray-300"
                )}
                placeholder="Enter your street address"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  {...register('city')}
                  type="text"
                  className={cn(
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                    errors.city ? "border-red-300" : "border-gray-300"
                  )}
                  placeholder="City"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  {...register('state')}
                  type="text"
                  className={cn(
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                    errors.state ? "border-red-300" : "border-gray-300"
                  )}
                  placeholder="State"
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  {...register('postalCode')}
                  type="text"
                  className={cn(
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                    errors.postalCode ? "border-red-300" : "border-gray-300"
                  )}
                  placeholder="Postal Code"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <select
                  {...register('country')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Australia">Australia</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Financial Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <DollarSign className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Income *
              </label>
              <input
                {...register('monthlyIncome', { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                className={cn(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  errors.monthlyIncome ? "border-red-300" : "border-gray-300"
                )}
                placeholder="0.00"
              />
              {errors.monthlyIncome && (
                <p className="mt-1 text-sm text-red-600">{errors.monthlyIncome.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Monthly Expenses *
              </label>
              <input
                {...register('monthlyExpenses', { valueAsNumber: true })}
                type="number"
                min="0"
                step="0.01"
                className={cn(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  errors.monthlyExpenses ? "border-red-300" : "border-gray-300"
                )}
                placeholder="0.00"
              />
              {errors.monthlyExpenses && (
                <p className="mt-1 text-sm text-red-600">{errors.monthlyExpenses.message}</p>
              )}
            </div>
          </div>

          {/* Financial Goals */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What are your financial goals? (Select all that apply)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {FINANCIAL_GOALS.map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleGoal(goal)}
                  className={cn(
                    "p-3 text-sm text-center border rounded-lg transition-colors",
                    selectedGoals.includes(goal)
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-300 hover:border-indigo-300"
                  )}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center px-6 py-3 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className={cn(
              "flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Processing...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}