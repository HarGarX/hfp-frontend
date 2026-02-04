'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  UserCircle,
  ShieldCheck,
  Bell,
  EyeOff,
  Download,
  Palette,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageLoader } from '@/components/LoadingSpinner';

type SettingsTab = 'profile' | 'security' | 'notifications' | 'privacy' | 'data' | 'appearance';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const tabs: { id: SettingsTab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: UserCircle },
    { id: 'security', label: 'Security', icon: ShieldCheck },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy', icon: EyeOff },
    { id: 'data', label: 'Data & Export', icon: Download },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings & Preferences</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && <ProfileSettings isSaving={isSaving} setIsSaving={setIsSaving} />}
          
          {/* Security Tab */}
          {activeTab === 'security' && <SecuritySettings isSaving={isSaving} setIsSaving={setIsSaving} />}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && <NotificationSettings isSaving={isSaving} setIsSaving={setIsSaving} />}
          
          {/* Privacy Tab */}
          {activeTab === 'privacy' && <PrivacySettings isSaving={isSaving} setIsSaving={setIsSaving} />}
          
          {/* Data & Export Tab */}
          {activeTab === 'data' && <DataExportSettings />}
          
          {/* Appearance Tab */}
          {activeTab === 'appearance' && <AppearanceSettings isSaving={isSaving} setIsSaving={setIsSaving} />}
        </div>
      </div>
    </div>
  );
}

function ProfileSettings({ isSaving, setIsSaving }: { isSaving: boolean; setIsSaving: (val: boolean) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567',
      timezone: 'America/New_York',
      currency: 'USD',
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      // TODO: Call API
      console.log('Saving profile:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Profile Information</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="First Name"
            error={errors.first_name?.message}
            required
            {...register('first_name', { required: 'First name is required' })}
          />
          <Input
            label="Last Name"
            error={errors.last_name?.message}
            required
            {...register('last_name', { required: 'Last name is required' })}
          />
        </div>

        <Input
          label="Email"
          type="email"
          error={errors.email?.message}
          required
          {...register('email', { required: 'Email is required' })}
        />

        <Input
          label="Phone"
          type="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              {...register('timezone')}
            >
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              {...register('currency')}
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" variant="default" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

function SecuritySettings({ isSaving, setIsSaving }: { isSaving: boolean; setIsSaving: (val: boolean) => void }) {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      // TODO: Call API
      console.log('Changing password:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            error={errors.current_password?.message as string}
            required
            {...register('current_password', { required: 'Current password is required' })}
          />

          <Input
            label="New Password"
            type="password"
            error={errors.new_password?.message as string}
            required
            {...register('new_password', { 
              required: 'New password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
          />

          <Input
            label="Confirm New Password"
            type="password"
            error={errors.confirm_password?.message as string}
            required
            {...register('confirm_password', {
              required: 'Please confirm your password',
              validate: (value) => value === watch('new_password') || 'Passwords do not match',
            })}
          />

          <div className="flex justify-end pt-4">
            <Button type="submit" variant="default" disabled={isSaving}>
              {isSaving ? 'Updating...' : 'Update Password'}
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Two-Factor Authentication</h2>
        <p className="text-gray-600 mb-4">Add an extra layer of security to your account</p>
        <Button variant="outline">Enable 2FA</Button>
      </Card>

      <Card className="border-red-200 bg-red-50">
        <h2 className="text-xl font-semibold text-red-900 mb-4">Danger Zone</h2>
        <p className="text-red-700 mb-4">Permanently delete your account and all associated data</p>
        <Button variant="destructive">Delete Account</Button>
      </Card>
    </div>
  );
}

function NotificationSettings({ isSaving, setIsSaving }: { isSaving: boolean; setIsSaving: (val: boolean) => void }) {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    push: true,
    inApp: true,
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // TODO: Call API
      console.log('Saving notification settings:', settings);
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Channels</h3>
          <div className="space-y-3">
            {[
              { key: 'email', label: 'Email Notifications' },
              { key: 'sms', label: 'SMS Notifications' },
              { key: 'push', label: 'Push Notifications' },
              { key: 'inApp', label: 'In-App Notifications' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between">
                <span className="text-gray-700">{label}</span>
                <input
                  type="checkbox"
                  checked={settings[key as keyof typeof settings]}
                  onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
                  className="w-4 h-4 text-blue-600"
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Digest Frequency</h3>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
            <option value="REALTIME">Real-time</option>
            <option value="DAILY">Daily Digest</option>
            <option value="WEEKLY">Weekly Digest</option>
            <option value="MONTHLY">Monthly Digest</option>
          </select>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="default" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function PrivacySettings({ isSaving, setIsSaving }: { isSaving: boolean; setIsSaving: (val: boolean) => void }) {
  const [settings, setSettings] = useState({
    shareData: false,
    analytics: true,
    marketing: false,
  });

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // TODO: Call API
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Privacy settings saved!');
    } catch (error) {
      console.error('Error saving privacy settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy Settings</h2>
      <div className="space-y-4">
        {[
          { key: 'shareData', label: 'Share anonymized data for product improvements' },
          { key: 'analytics', label: 'Enable usage analytics' },
          { key: 'marketing', label: 'Receive marketing communications' },
        ].map(({ key, label }) => (
          <label key={key} className="flex items-center justify-between">
            <span className="text-gray-700">{label}</span>
            <input
              type="checkbox"
              checked={settings[key as keyof typeof settings]}
              onChange={(e) => setSettings({ ...settings, [key]: e.target.checked })}
              className="w-4 h-4 text-blue-600"
            />
          </label>
        ))}

        <div className="flex justify-end pt-4">
          <Button variant="default" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </Card>
  );
}

function DataExportSettings() {
  const handleExport = async (format: 'json' | 'csv') => {
    try {
      // TODO: Call API to export data
      console.log(`Exporting data as ${format}`);
      alert(`Data exported as ${format.toUpperCase()}!`);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Data & Export</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Export Your Data</h3>
          <p className="text-gray-600 mb-4">
            Download a copy of your financial data in your preferred format
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleExport('json')}>
              Export as JSON
            </Button>
            <Button variant="outline" onClick={() => handleExport('csv')}>
              Export as CSV
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Data Retention</h3>
          <p className="text-gray-600">
            Your data is retained according to our data retention policy. 
            Deleted items are permanently removed after 30 days.
          </p>
        </div>
      </div>
    </Card>
  );
}

function AppearanceSettings({ isSaving, setIsSaving }: { isSaving: boolean; setIsSaving: (val: boolean) => void }) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // TODO: Call API and apply theme
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Appearance settings saved!');
    } catch (error) {
      console.error('Error saving appearance settings:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Appearance</h2>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Theme</h3>
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: 'light', label: 'Light' },
              { value: 'dark', label: 'Dark' },
              { value: 'system', label: 'System' },
            ].map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setTheme(value as any)}
                className={`p-4 border-2 rounded-lg text-center transition-colors ${
                  theme === value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="default" onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </div>
    </Card>
  );
}
