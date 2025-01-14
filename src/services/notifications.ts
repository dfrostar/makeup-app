import { Look } from '@/types/looks';

export type NotificationType = 'email' | 'push' | 'sms';

export type NotificationPreferences = {
  email: boolean;
  push: boolean;
  sms: boolean;
  reminderTime: '30min' | '1hour' | '1day' | '1week';
};

export type ScheduledNotification = {
  id: string;
  lookId: string;
  type: NotificationType;
  scheduledFor: Date;
  sent: boolean;
};

class NotificationService {
  private static instance: NotificationService;
  private worker: ServiceWorker | null = null;
  private twilioClient: any | null = null; // Replace with actual Twilio client type

  private constructor() {
    this.initializePushNotifications();
    // Initialize Twilio client here if SMS is enabled
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  private async initializePushNotifications() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        this.worker = registration.active;
      } catch (error) {
        console.error('Failed to register service worker:', error);
      }
    }
  }

  public async requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  public async scheduleNotification(
    look: Look,
    preferences: NotificationPreferences,
    scheduledFor: Date
  ): Promise<ScheduledNotification[]> {
    const notifications: ScheduledNotification[] = [];

    if (preferences.email) {
      notifications.push(await this.scheduleEmailNotification(look, scheduledFor));
    }

    if (preferences.push) {
      notifications.push(await this.schedulePushNotification(look, scheduledFor));
    }

    if (preferences.sms) {
      notifications.push(await this.scheduleSMSNotification(look, scheduledFor));
    }

    // Store notifications in IndexedDB or similar
    await this.storeNotifications(notifications);

    return notifications;
  }

  private async scheduleEmailNotification(
    look: Look,
    scheduledFor: Date
  ): Promise<ScheduledNotification> {
    // Implementation for scheduling email notifications
    // This would typically involve a backend API call
    return {
      id: crypto.randomUUID(),
      lookId: look.id,
      type: 'email',
      scheduledFor,
      sent: false,
    };
  }

  private async schedulePushNotification(
    look: Look,
    scheduledFor: Date
  ): Promise<ScheduledNotification> {
    if (!this.worker) {
      throw new Error('Service worker not initialized');
    }

    const notification: ScheduledNotification = {
      id: crypto.randomUUID(),
      lookId: look.id,
      type: 'push',
      scheduledFor,
      sent: false,
    };

    // Register the notification with the service worker
    this.worker.postMessage({
      type: 'SCHEDULE_NOTIFICATION',
      payload: {
        id: notification.id,
        title: `Time for your ${look.title} look!`,
        body: `Get ready to create your scheduled look`,
        image: look.image,
        scheduledFor,
      },
    });

    return notification;
  }

  private async scheduleSMSNotification(
    look: Look,
    scheduledFor: Date
  ): Promise<ScheduledNotification> {
    if (!this.twilioClient) {
      throw new Error('SMS service not initialized');
    }

    const notification: ScheduledNotification = {
      id: crypto.randomUUID(),
      lookId: look.id,
      type: 'sms',
      scheduledFor,
      sent: false,
    };

    // Schedule SMS using Twilio
    // This would typically involve a backend API call
    return notification;
  }

  private async storeNotifications(
    notifications: ScheduledNotification[]
  ): Promise<void> {
    // Store notifications in IndexedDB
    const db = await this.openDatabase();
    const tx = db.transaction('notifications', 'readwrite');
    const store = tx.objectStore('notifications');

    for (const notification of notifications) {
      await store.put(notification);
    }
  }

  private async openDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('notifications', 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('notifications')) {
          db.createObjectStore('notifications', { keyPath: 'id' });
        }
      };
    });
  }

  public async getScheduledNotifications(): Promise<ScheduledNotification[]> {
    const db = await this.openDatabase();
    const tx = db.transaction('notifications', 'readonly');
    const store = tx.objectStore('notifications');

    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  public async cancelNotification(id: string): Promise<void> {
    const db = await this.openDatabase();
    const tx = db.transaction('notifications', 'readwrite');
    const store = tx.objectStore('notifications');

    await store.delete(id);

    if (this.worker) {
      this.worker.postMessage({
        type: 'CANCEL_NOTIFICATION',
        payload: { id },
      });
    }
  }
}

export const notificationService = NotificationService.getInstance();
