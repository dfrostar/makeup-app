'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select } from '@/components/ui/select';
import { X, Bell, Mail, Phone, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Look } from '@/types/looks';
import {
  notificationService,
  NotificationPreferences,
  ScheduledNotification,
} from '@/services/notifications';
import { useTheme } from '@/contexts/ThemeContext';

type LookSchedulerProps = {
  look: Look;
  onClose: () => void;
  onSchedule: (date: Date, preferences: NotificationPreferences) => void;
};

export function LookScheduler({ look, onClose, onSchedule }: LookSchedulerProps) {
  const { culturalPreference } = useTheme();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email: true,
    push: false,
    sms: false,
    reminderTime: '1hour',
  });
  const [scheduledNotifications, setScheduledNotifications] = useState<
    ScheduledNotification[]
  >([]);

  useEffect(() => {
    // Load existing notifications
    loadScheduledNotifications();
    // Request push notification permission
    requestNotificationPermission();
  }, []);

  const loadScheduledNotifications = async () => {
    const notifications = await notificationService.getScheduledNotifications();
    setScheduledNotifications(notifications);
  };

  const requestNotificationPermission = async () => {
    const granted = await notificationService.requestNotificationPermission();
    if (granted) {
      setNotifications((prev) => ({ ...prev, push: true }));
    }
  };

  const handleSchedule = async () => {
    const scheduledFor = new Date(selectedDate);
    const [hours, minutes] = selectedTime.split(':');
    scheduledFor.setHours(parseInt(hours), parseInt(minutes));

    try {
      await notificationService.scheduleNotification(
        look,
        notifications,
        scheduledFor
      );
      onSchedule(scheduledFor, notifications);
      onClose();
    } catch (error) {
      console.error('Failed to schedule notifications:', error);
      // Show error message to user
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Schedule Look</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Date Selection */}
          <div>
            <h3 className="text-sm font-medium mb-2">Select Date</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
          </div>

          {/* Time Selection */}
          <div>
            <h3 className="text-sm font-medium mb-2">Select Time</h3>
            <Select
              value={selectedTime}
              onValueChange={setSelectedTime}
              options={[
                { value: '09:00', label: '9:00 AM' },
                { value: '12:00', label: '12:00 PM' },
                { value: '15:00', label: '3:00 PM' },
                { value: '18:00', label: '6:00 PM' },
              ]}
            />
          </div>

          {/* Notification Preferences */}
          <div>
            <h3 className="text-sm font-medium mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">Email Notifications</span>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, email: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="text-sm">Push Notifications</span>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, push: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">SMS Notifications</span>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) =>
                    setNotifications((prev) => ({ ...prev, sms: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">Reminder Time</span>
                </div>
                <Select
                  value={notifications.reminderTime}
                  onValueChange={(value) =>
                    setNotifications((prev) => ({
                      ...prev,
                      reminderTime: value as NotificationPreferences['reminderTime'],
                    }))
                  }
                  options={[
                    { value: '30min', label: '30 minutes before' },
                    { value: '1hour', label: '1 hour before' },
                    { value: '1day', label: '1 day before' },
                    { value: '1week', label: '1 week before' },
                  ]}
                />
              </div>
            </div>
          </div>

          {/* Cultural Events */}
          {culturalPreference && (
            <div>
              <h3 className="text-sm font-medium mb-2">Cultural Events</h3>
              <div className="text-sm text-gray-600">
                {/* Add cultural event suggestions based on selected date */}
                Suggested for {culturalPreference.country} events in{' '}
                {selectedDate.toLocaleString('default', { month: 'long' })}
              </div>
            </div>
          )}

          {/* Scheduled Notifications */}
          {scheduledNotifications.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-2">Scheduled Notifications</h3>
              <div className="space-y-2">
                {scheduledNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>
                      {notification.type} -{' '}
                      {notification.scheduledFor.toLocaleString()}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        notificationService.cancelNotification(notification.id)
                      }
                    >
                      Cancel
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSchedule}>Schedule Look</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
