'use client';

import { useState } from 'react';
import {
  Bell,
  Check,
  Trash2,
  Settings as SettingsIcon,
  Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { PageLoader } from '@/components/LoadingSpinner';
import { formatDate } from '@/lib/utils';
import {
  useNotifications,
  useNotificationsUnreadCount,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useDeleteNotification,
} from '@/lib/hooks/useApi';

enum NotificationType {
  BUDGET_ALERT = 'BUDGET_ALERT',
  GOAL_MILESTONE = 'GOAL_MILESTONE',
  BILL_REMINDER = 'BILL_REMINDER',
  TRANSACTION_ALERT = 'TRANSACTION_ALERT',
  INSIGHT = 'INSIGHT',
  SYSTEM = 'SYSTEM',
}

enum NotificationStatus {
  UNREAD = 'UNREAD',
  READ = 'READ',
}

interface Notification {
  id: string;
  type: NotificationType;
  status: NotificationStatus;
  title: string;
  message: string;
  action_url?: string;
  created_at: string;
  read_at?: string;
}

const getNotificationColor = (type: NotificationType): 'red' | 'green' | 'blue' | 'yellow' | 'purple' | 'gray' => {
  return {
    [NotificationType.BUDGET_ALERT]: 'red' as const,
    [NotificationType.GOAL_MILESTONE]: 'green' as const,
    [NotificationType.BILL_REMINDER]: 'yellow' as const,
    [NotificationType.TRANSACTION_ALERT]: 'red' as const,
    [NotificationType.INSIGHT]: 'purple' as const,
    [NotificationType.SYSTEM]: 'gray' as const,
  }[type];
};

export default function NotificationsPage() {
  // React Query hooks
  const { data: notifications = [], isLoading, error } = useNotifications();
  const { data: unreadCountData } = useNotificationsUnreadCount();
  const markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const deleteNotification = useDeleteNotification();

  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<NotificationType[]>([]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead.mutateAsync(notificationId);
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead.mutateAsync();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const handleDelete = async (notificationId: string) => {
    try {
      await deleteNotification.mutateAsync(notificationId);
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const filteredNotifications = notifications.filter((n: any) => {
    if (filter === 'unread') return n.status === NotificationStatus.UNREAD;
    if (filter === 'read') return n.status === NotificationStatus.READ;
    return true;
  }).filter((n: any) => 
    selectedTypes.length === 0 || selectedTypes.includes(n.type)
  );

  const unreadCount = unreadCountData?.count || 0;

  if (isLoading) return <PageLoader />;

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading notifications</p>
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
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            {unreadCount > 0 && (
              <Badge color="red">{unreadCount} unread</Badge>
            )}
          </div>
          <p className="text-gray-600 mt-1">Stay updated with your financial activities</p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
            >
              <Check className="w-4 h-4 mr-2" />
              Mark All Read
            </Button>
          )}
          <Button
            variant="outline"
            onClick={() => setIsSettingsOpen(true)}
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'read' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('read')}
        >
          Read ({notifications.length - unreadCount})
        </Button>
      </div>

      {/* Type Filters */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm text-gray-600 flex items-center mr-2">
          <Filter className="w-4 h-4 mr-1" />
          Filter by type:
        </span>
        {Object.values(NotificationType).map(type => (
          <Button
            key={type}
            variant={selectedTypes.includes(type) ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setSelectedTypes(prev => 
                prev.includes(type)
                  ? prev.filter(t => t !== type)
                  : [...prev, type]
              );
            }}
          >
            {type.replace('_', ' ')}
          </Button>
        ))}
        {selectedTypes.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedTypes([])}
          >
            Clear
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <Card>
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600">You're all caught up!</p>
            </div>
          </Card>
        ) : (
          filteredNotifications.map((notification) => (
            <Card 
              key={notification.id}
              className={`hover:shadow-lg transition-shadow ${notification.status === NotificationStatus.UNREAD ? 'border-l-4 border-l-blue-600' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  notification.status === NotificationStatus.UNREAD ? 'bg-blue-100' : 'bg-gray-100'
                }`}>
                  <Bell className={`w-5 h-5 ${
                    notification.status === NotificationStatus.UNREAD ? 'text-blue-600' : 'text-gray-600'
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold ${
                          notification.status === NotificationStatus.UNREAD 
                            ? 'text-gray-900' 
                            : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        <Badge color={getNotificationColor(notification.type)}>
                          {notification.type.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatDate(notification.created_at)}
                        {notification.read_at && ` • Read ${formatDate(notification.read_at)}`}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3">
                    {notification.action_url && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = notification.action_url!}
                      >
                        View Details
                      </Button>
                    )}
                    {notification.status === NotificationStatus.UNREAD && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleMarkAsRead(notification.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Mark Read
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(notification.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        title="Notification Settings"
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Channels</h3>
            <div className="space-y-3">
              {['Email', 'SMS', 'Push', 'In-App'].map(channel => (
                <label key={channel} className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">{channel} Notifications</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Types</h3>
            <div className="space-y-3">
              {Object.values(NotificationType).map(type => (
                <label key={type} className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-700">{type.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Digest Settings</h3>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
              <option value="REALTIME">Real-time</option>
              <option value="DAILY">Daily Digest</option>
              <option value="WEEKLY">Weekly Digest</option>
              <option value="MONTHLY">Monthly Digest</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsSettingsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button variant="default" onClick={() => setIsSettingsOpen(false)} className="flex-1">
              Save Settings
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
