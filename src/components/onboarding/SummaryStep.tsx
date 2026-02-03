'use client';

import { ArrowLeft, CheckCircle, Home, Users, DollarSign, Target } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface SummaryStepProps {
  onNext: () => void;
  onBack: () => void;
  isLoading: boolean;
  data: any;
}

export function SummaryStep({ onNext, onBack, isLoading, data }: SummaryStepProps) {
  const { user, household, members = [], financialGoals = [] } = data;

  return (
    <div>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Review Your Setup
        </h1>
        <p className="text-lg text-gray-600">
          Please review your information before completing the setup
        </p>
      </div>

      <div className="space-y-6">
        {/* Primary User Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Users className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Your Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-gray-500">Name</span>
              <p className="text-gray-900">{user?.firstName} {user?.lastName}</p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">Email</span>
              <p className="text-gray-900">{user?.email}</p>
            </div>
            {user?.phoneNumber && (
              <div>
                <span className="text-sm font-medium text-gray-500">Phone</span>
                <p className="text-gray-900">{user.phoneNumber}</p>
              </div>
            )}
          </div>
        </div>

        {/* Household Information */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Home className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Household Information</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Household Name</span>
                <p className="text-gray-900">{household?.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Type</span>
                <p className="text-gray-900 capitalize">{household?.type}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Currency</span>
                <p className="text-gray-900">{household?.currency}</p>
              </div>
            </div>

            {household?.address && (
              <div>
                <span className="text-sm font-medium text-gray-500">Address</span>
                <div className="text-gray-900">
                  <p>{household.address}</p>
                  <p>{household.city}, {household.state} {household.postalCode}</p>
                  <p>{household.country}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Financial Overview */}
        {(household?.monthlyIncome || household?.monthlyExpenses) && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <DollarSign className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Financial Overview</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {household?.monthlyIncome > 0 && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Monthly Income</span>
                  <p className="text-xl font-semibold text-green-600">
                    {formatCurrency(household.monthlyIncome)}
                  </p>
                </div>
              )}

              {household?.monthlyExpenses > 0 && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Monthly Expenses</span>
                  <p className="text-xl font-semibold text-red-600">
                    {formatCurrency(household.monthlyExpenses)}
                  </p>
                </div>
              )}

              {household?.monthlyIncome > 0 && household?.monthlyExpenses > 0 && (
                <div className="p-4 bg-white rounded-lg border border-gray-200">
                  <span className="text-sm font-medium text-gray-500">Net Income</span>
                  <p className={cn(
                    "text-xl font-semibold",
                    (household.monthlyIncome - household.monthlyExpenses) >= 0 
                      ? "text-green-600" 
                      : "text-red-600"
                  )}>
                    {formatCurrency(household.monthlyIncome - household.monthlyExpenses)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Financial Goals */}
        {household?.financialGoals && household.financialGoals.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Target className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Financial Goals</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {household.financialGoals.map((goal: string, index: number) => (
                <div
                  key={index}
                  className="p-3 bg-indigo-50 text-indigo-700 rounded-lg text-center text-sm font-medium"
                >
                  {goal}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Household Members */}
        {members && members.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Household Members ({members.length})
              </h2>
            </div>

            <div className="space-y-3">
              {members.map((member: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.firstName} {member.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    member.role === 'admin' 
                      ? "bg-yellow-100 text-yellow-700"
                      : member.role === 'member'
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-700"
                  )}>
                    {member.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completion Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Almost Done!</h3>
              <p className="text-sm text-green-700 mt-1">
                Once you complete the setup, you'll be taken to your dashboard where you can:
              </p>
              <ul className="text-sm text-green-700 mt-2 list-disc list-inside space-y-1">
                <li>Connect your bank accounts</li>
                <li>Set up budgets and financial goals</li>
                <li>Track expenses and income</li>
                <li>Invite additional household members</li>
                <li>Access financial insights and recommendations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center px-6 py-3 text-gray-600 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Edit
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={isLoading}
            className={cn(
              "flex items-center px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors",
              isLoading && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                Completing Setup...
              </>
            ) : (
              <>
                Complete Setup
                <CheckCircle className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}