'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Home, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const welcomeSchema = z.object({
  // User information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  phoneNumber: z.string(),
  // Household information
  householdName: z.string().min(1, 'Household name is required'),
  householdType: z.enum(['family', 'couple', 'single', 'roommates']),
  currency: z.string().min(1, 'Currency is required'),
  timezone: z.string().min(1, 'Timezone is required'),
});

type WelcomeFormData = z.infer<typeof welcomeSchema>;

interface WelcomeStepProps {
  onNext: (data: any) => void;
  isLoading: boolean;
  initialData?: any;
}

export function WelcomeStep({ onNext, isLoading, initialData }: WelcomeStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<WelcomeFormData>({
    resolver: zodResolver(welcomeSchema),
    defaultValues: {
      firstName: initialData?.user?.firstName || '',
      lastName: initialData?.user?.lastName || '',
      email: initialData?.user?.email || '',
      phoneNumber: initialData?.user?.phoneNumber || '',
      householdName: initialData?.household?.name || '',
      householdType: initialData?.household?.type || 'family',
      currency: initialData?.household?.currency || 'USD',
      timezone: initialData?.household?.timezone || 'America/New_York',
    },
  });

  const onSubmit = (data: WelcomeFormData) => {
    onNext({
      user: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
      },
      household: {
        name: data.householdName,
        type: data.householdType,
        currency: data.currency,
        timezone: data.timezone,
      },
    });
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to HFP
        </h1>
        <p className="text-lg text-gray-600">
          Let's get started by setting up your household financial profile
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* User Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <User className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                {...register('firstName')}
                type="text"
                className={cn(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  errors.firstName ? "border-red-300" : "border-gray-300"
                )}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                {...register('lastName')}
                type="text"
                className={cn(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  errors.lastName ? "border-red-300" : "border-gray-300"
                )}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                {...register('email')}
                type="email"
                className={cn(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  errors.email ? "border-red-300" : "border-gray-300"
                )}
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                {...register('phoneNumber')}
                type="tel"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        </div>

        {/* Household Information Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Home className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Household Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Household Name *
              </label>
              <input
                {...register('householdName')}
                type="text"
                className={cn(
                  "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                  errors.householdName ? "border-red-300" : "border-gray-300"
                )}
                placeholder="e.g., The Smith Family, Our Home, etc."
              />
              {errors.householdName && (
                <p className="mt-1 text-sm text-red-600">{errors.householdName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Household Type *
              </label>
              <select
                {...register('householdType')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="family">Family</option>
                <option value="couple">Couple</option>
                <option value="single">Single</option>
                <option value="roommates">Roommates</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Currency
              </label>
              <select
                {...register('currency')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="CAD">CAD ($)</option>
                <option value="AUD">AUD ($)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
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
                Setting up...
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