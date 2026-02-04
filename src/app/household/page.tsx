'use client';

import { useState } from 'react';
import {
  Home,
  Users,
  UserPlus,
  Pencil,
  Trash2,
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { PageLoader } from '@/components/LoadingSpinner';
import { formatDate } from '@/lib/utils';
import { 
  useHouseholds, 
  // useHouseholdMembers,  // TODO: Uncomment when backend implements this endpoint
  useHouseholdStats,
  // useAddHouseholdMember,  // TODO: Uncomment when backend implements this endpoint
  // useUpdateHouseholdMemberRole,  // TODO: Uncomment when backend implements this endpoint
  // useRemoveHouseholdMember,  // TODO: Uncomment when backend implements this endpoint
  useUpdateHousehold
} from '@/lib/hooks/useApi';

enum UserRole {
  HOUSEHOLD_ADMIN = 'HOUSEHOLD_ADMIN',
  MEMBER = 'MEMBER',
  VIEWER = 'VIEWER',
}

enum HouseholdStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
}

interface HouseholdMember {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: UserRole;
  joined_at: string;
}

interface Household {
  id: string;
  name: string;
  status: HouseholdStatus;
  created_at: string;
  updated_at: string;
}

const getRoleColor = (role: UserRole): 'blue' | 'green' | 'gray' => {
  return {
    [UserRole.HOUSEHOLD_ADMIN]: 'blue' as const,
    [UserRole.MEMBER]: 'green' as const,
    [UserRole.VIEWER]: 'gray' as const,
  }[role];
};

export default function HouseholdPage() {
  // Assuming current household ID is '1' - in real app, get from auth context
  const householdId = '1';
  
  // React Query hooks
  const { data: households = [] } = useHouseholds();
  // TODO: Uncomment when backend implements household members endpoint
  // const { data: members = [], isLoading, error } = useHouseholdMembers(householdId);
  const members: HouseholdMember[] = []; // Temporary placeholder
  const isLoading = false;
  const error = null;
  
  const { data: stats } = useHouseholdStats(householdId);
  const updateHousehold = useUpdateHousehold();
  // TODO: Uncomment when backend implements these endpoints
  // const addMember = useAddHouseholdMember();
  // const updateMemberRole = useUpdateHouseholdMemberRole();
  // const removeMember = useRemoveHouseholdMember();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<HouseholdMember | null>(null);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);

  const household = households[0]; // First household for current user

  const handleUpdateHousehold = async (data: any) => {
    try {
      await updateHousehold.mutateAsync({
        id: householdId,
        data,
      });
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating household:', error);
    }
  };

  const handleAddMember = async (data: any) => {
    // TODO: Uncomment when backend implements this endpoint
    // try {
    //   await addMember.mutateAsync({
    //     householdId,
    //     data,
    //   });
    //   setIsAddMemberModalOpen(false);
    // } catch (error) {
    //   console.error('Error adding member:', error);
    // }
    console.log('Add member not yet implemented in backend');
    setIsAddMemberModalOpen(false);
  };

  const handleUpdateMemberRole = async (userId: string, role: UserRole) => {
    // TODO: Uncomment when backend implements this endpoint
    // try {
    //   await updateMemberRole.mutateAsync({
    //     householdId,
    //     userId,
    //     role,
    //   });
    //   setIsRoleModalOpen(false);
    //   setSelectedMember(null);
    // } catch (error) {
    //   console.error('Error updating member role:', error);
    // }
    console.log('Update member role not yet implemented in backend');
    setIsRoleModalOpen(false);
    setSelectedMember(null);
  };

  const handleRemoveMember = async (userId: string) => {
    // TODO: Uncomment when backend implements this endpoint
    // try {
    //   await removeMember.mutateAsync({
    //     householdId,
    //     userId,
    //   });
    // } catch (error) {
    //   console.error('Error removing member:', error);
    // }
    console.log('Remove member not yet implemented in backend');
  };

  if (isLoading) return <PageLoader />;

  // if (error) {
  //   return (
  //     <div className="flex items-center justify-center h-96">
  //       <div className="text-center">
  //         <p className="text-red-600 mb-4">Error loading household</p>
  //         <p className="text-gray-600 text-sm">{error.message}</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Household Management</h1>
          <p className="text-gray-600 mt-1">Manage your household and members</p>
        </div>
        <Button onClick={() => setIsEditModalOpen(true)}>
          <Pencil className="w-4 h-4 mr-2" />
          Edit Household
        </Button>
      </div>

      {/* Household Info */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
              <Home className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{household.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge color={household.status === HouseholdStatus.ACTIVE ? 'green' : 'gray'}>
                  {household.status}
                </Badge>
                <span className="text-sm text-gray-600">
                  Created {formatDate(household.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <p className="text-sm text-gray-600">Members</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.member_count || members.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Accounts</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.total_accounts || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Transactions</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.total_transactions || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Goals</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.total_goals || 0}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-600">Active Loans</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats?.active_loans || 0}</p>
        </Card>
      </div>

      {/* Members Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Household Members</h2>
          <Button onClick={() => setIsAddMemberModalOpen(true)}>
            <UserPlus className="w-4 h-4 mr-2" />
            Add Member
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <Card key={member.id} className="hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-700">
                      {member.first_name[0]}{member.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {member.first_name} {member.last_name}
                    </h3>
                    <p className="text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Role</span>
                  <Badge color={getRoleColor(member.role)}>
                    {member.role.replace('_', ' ')}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Joined</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatDate(member.joined_at)}
                  </span>
                </div>
              </div>

              {member.role !== UserRole.HOUSEHOLD_ADMIN && (
                <div className="flex gap-2 mt-4 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedMember(member);
                      setIsRoleModalOpen(true);
                    }}
                    className="flex-1"
                  >
                    Change Role
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    Remove
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Edit Household Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Household"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleUpdateHousehold({ name: formData.get('name') });
          }}
          className="space-y-4"
        >
          <Input
            name="name"
            label="Household Name"
            defaultValue={household.name}
            required
          />

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Member Modal */}
      <Modal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        title="Add Household Member"
        size="md"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            handleAddMember({
              email: formData.get('email'),
              role: formData.get('role'),
            });
          }}
          className="space-y-4"
        >
          <Input
            name="email"
            label="Email Address"
            type="email"
            placeholder="member@example.com"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              name="role"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value={UserRole.MEMBER}>Member</option>
              <option value={UserRole.VIEWER}>Viewer</option>
              <option value={UserRole.HOUSEHOLD_ADMIN}>Household Admin</option>
            </select>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            An invitation will be sent to the email address. They can accept and join the household.
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddMemberModalOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" variant="default" className="flex-1">
              Send Invitation
            </Button>
          </div>
        </form>
      </Modal>

      {/* Change Role Modal */}
      {selectedMember && (
        <Modal
          isOpen={isRoleModalOpen}
          onClose={() => setIsRoleModalOpen(false)}
          title="Change Member Role"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              Change role for {selectedMember.first_name} {selectedMember.last_name}
            </p>

            <div className="space-y-2">
              {[UserRole.HOUSEHOLD_ADMIN, UserRole.MEMBER, UserRole.VIEWER].map((role) => (
                <button
                  key={role}
                  onClick={() => handleUpdateMemberRole(selectedMember.id, role)}
                  className={`w-full p-3 border-2 rounded-lg text-left transition-colors ${
                    selectedMember.role === role
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{role.replace('_', ' ')}</div>
                  <div className="text-sm text-gray-600">
                    {role === UserRole.HOUSEHOLD_ADMIN && 'Full access to manage household'}
                    {role === UserRole.MEMBER && 'Can view and manage own data'}
                    {role === UserRole.VIEWER && 'Read-only access'}
                  </div>
                </button>
              ))}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsRoleModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
