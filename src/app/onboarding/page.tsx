'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  WelcomeStep,
  HouseholdInfoStep,
  MembersRolesStep,
  SummaryStep,
  ProgressIndicator 
} from '@/components/onboarding';
import { OnboardingData } from '@/lib/types';
import api from '@/lib/api';

const STEPS = ['welcome', 'household_info', 'members_roles', 'summary'] as const;
type OnboardingStep = typeof STEPS[number];

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [onboardingData, setOnboardingData] = useState<Partial<OnboardingData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check existing onboarding status on mount
  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const response = await api.onboarding.getStatus();
      if (response.data?.step && response.data.step !== 'welcome') {
        setCurrentStep(response.data.step as OnboardingStep);
        setOnboardingData(response.data.data || {});
      }
    } catch (err) {
      console.error('Failed to check onboarding status:', err);
    }
  };

  const handleStepComplete = async (stepData: Partial<OnboardingData>) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedData = { ...onboardingData, ...stepData };
      setOnboardingData(updatedData);

      switch (currentStep) {
        case 'welcome':
          await api.onboarding.start({
            household: {
              name: updatedData.household!.name,
              address: updatedData.household!.address,
              city: updatedData.household!.city,
              state: updatedData.household!.state,
              zip_code: updatedData.household!.postalCode,
              country: updatedData.household!.country || 'US',
              default_currency: updatedData.household!.currency || 'USD'
            },
            user: {
              email: updatedData.user!.email,
              first_name: updatedData.user!.firstName,
              last_name: updatedData.user!.lastName,
              username: updatedData.user!.email
            }
          });
          setCurrentStep('household_info');
          break;
        
        case 'household_info':
          setCurrentStep('members_roles');
          break;
        
        case 'members_roles':
          if (updatedData.members && updatedData.members.length > 0) {
            // Add members one by one since the API expects single member
            for (const member of updatedData.members) {
              await api.onboarding.addMember({
                email: member.email,
                first_name: member.firstName,
                last_name: member.lastName,
                role: member.role === 'admin' ? 'HOUSEHOLD_ADMIN' 
                     : member.role === 'member' ? 'HOUSEHOLD_MEMBER' 
                     : 'HOUSEHOLD_VIEWER'
              });
            }
            
            // Assign roles if available
            if (updatedData.roles) {
              await api.onboarding.assignRoles(updatedData.roles.map(role => ({
                userId: role.userId,
                role: role.role
              })));
            }
          }
          setCurrentStep('summary');
          break;
        
        case 'summary':
          await api.onboarding.complete();
          router.push('/dashboard');
          break;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during onboarding');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepBack = () => {
    const currentIndex = STEPS.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(STEPS[currentIndex - 1]);
    }
  };

  const getCurrentStepIndex = () => STEPS.indexOf(currentStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <ProgressIndicator
            currentStep={getCurrentStepIndex()}
            totalSteps={STEPS.length}
            stepLabels={['Welcome', 'Household Info', 'Members & Roles', 'Summary']}
          />

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Step Content */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            {currentStep === 'welcome' && (
              <WelcomeStep
                onNext={handleStepComplete}
                isLoading={isLoading}
                initialData={onboardingData}
              />
            )}

            {currentStep === 'household_info' && (
              <HouseholdInfoStep
                onNext={handleStepComplete}
                onBack={handleStepBack}
                isLoading={isLoading}
                initialData={onboardingData}
              />
            )}

            {currentStep === 'members_roles' && (
              <MembersRolesStep
                onNext={handleStepComplete}
                onBack={handleStepBack}
                isLoading={isLoading}
                initialData={onboardingData}
              />
            )}

            {currentStep === 'summary' && (
              <SummaryStep
                onNext={() => handleStepComplete({})}
                onBack={handleStepBack}
                isLoading={isLoading}
                data={onboardingData}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}