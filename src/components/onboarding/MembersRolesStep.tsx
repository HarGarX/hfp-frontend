'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, ArrowRight, Plus, Trash2, Users, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const memberSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Valid email is required'),
  role: z.enum(['admin', 'member', 'viewer']),
});

const membersRolesSchema = z.object({
  members: z.array(memberSchema),
});

type MembersRolesFormData = z.infer<typeof membersRolesSchema>;
type Member = z.infer<typeof memberSchema>;

interface MembersRolesStepProps {
  onNext: (data: any) => void;
  onBack: () => void;
  isLoading: boolean;
  initialData?: any;
}

const ROLES = [
  { value: 'admin', label: 'Admin', description: 'Full access to all features' },
  { value: 'member', label: 'Member', description: 'Can view and edit financial data' },
  { value: 'viewer', label: 'Viewer', description: 'Can only view financial data' },
];

export function MembersRolesStep({ onNext, onBack, isLoading, initialData }: MembersRolesStepProps) {
  const [members, setMembers] = useState<Member[]>(
    initialData?.members || []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm<{ firstName: string; lastName: string; email: string; role: string }>({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      role: 'member',
    },
  });

  const addMember = (data: { firstName: string; lastName: string; email: string; role: string }) => {
    const newMember = {
      ...data,
      role: data.role as 'admin' | 'member' | 'viewer',
    };
    
    setMembers([...members, newMember]);
    reset();
    clearErrors();
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const updateMemberRole = (index: number, role: 'admin' | 'member' | 'viewer') => {
    const updatedMembers = [...members];
    updatedMembers[index].role = role;
    setMembers(updatedMembers);
  };

  const handleContinue = () => {
    onNext({
      members: members,
      roles: members.map((member, index) => ({
        userId: `temp-${index}`, // This will be replaced with actual user IDs
        role: member.role,
      })),
    });
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Add Household Members
        </h1>
        <p className="text-lg text-gray-600">
          Invite family members or housemates to join your financial platform
        </p>
      </div>

      <div className="space-y-8">
        {/* Add New Member Form */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center mb-4">
            <Plus className="w-5 h-5 text-indigo-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">Add New Member</h2>
          </div>

          <form onSubmit={handleSubmit(addMember)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  {...register('firstName', { required: 'First name is required' })}
                  type="text"
                  className={cn(
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                    errors.firstName ? "border-red-300" : "border-gray-300"
                  )}
                  placeholder="First name"
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
                  {...register('lastName', { required: 'Last name is required' })}
                  type="text"
                  className={cn(
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                    errors.lastName ? "border-red-300" : "border-gray-300"
                  )}
                  placeholder="Last name"
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
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Valid email is required'
                    }
                  })}
                  type="email"
                  className={cn(
                    "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
                    errors.email ? "border-red-300" : "border-gray-300"
                  )}
                  placeholder="email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role *
              </label>
              <select
                {...register('role')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {ROLES.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label} - {role.description}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </button>
          </form>
        </div>

        {/* Current Members List */}
        {members.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex items-center mb-4">
              <Users className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">
                Household Members ({members.length})
              </h2>
            </div>

            <div className="space-y-3">
              {members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {member.role === 'admin' ? (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <Users className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </p>
                      <p className="text-sm text-gray-600">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <select
                      value={member.role}
                      onChange={(e) => updateMemberRole(index, e.target.value as 'admin' | 'member' | 'viewer')}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      {ROLES.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => removeMember(index)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skip Option */}
        {members.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-700">
              <strong>Note:</strong> You can add members later from your dashboard settings. 
              For now, you'll be the only admin of this household.
            </p>
          </div>
        )}

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
            type="button"
            onClick={handleContinue}
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
      </div>
    </div>
  );
}