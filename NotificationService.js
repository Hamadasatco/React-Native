import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

class NotificationService {
  constructor() {
    this.messageListener = null;
    this.notificationOpenedAppListener = null;
    this.notificationListener = null;
    this.tokenRefreshListener = null;
    this.onNotificationReceived = null;
    this.onNotificationOpened = null;
  }

  /**
   * Initialize the notification service
   * @param {Function} onNotificationReceived - Callback when notification is received
   * @param {Function} onNotificationOpened - Callback when notification is opened
   */
  async initialize(onNotificationReceived, onNotificationOpened) {
    this.onNotificationReceived = onNotificationReceived;
    this.onNotificationOpened = onNotificationOpened;

    // Request permission (iOS only, Android grants by default)
    await this.requestPermission();

    // Get FCM token and save it
    await this.getToken();

    // Set up listeners
    this.setupListeners();
  }

  /**
   * Request notification permission
   * @returns {Promise<boolean>} - Whether permission was granted
   */
  async requestPermission() {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;
        
        return enabled;
      }
      return true; // Android grants by default
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  /**
   * Get FCM token and save it
   * @returns {Promise<string>} - FCM token
   */
  async getToken() {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        await this.saveToken(fcmToken);
        return fcmToken;
      }
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
    return null;
  }

  /**
   * Save FCM token to storage
   * @param {string} token - FCM token
   */
  async saveToken(token) {
    try {
      await AsyncStorage.setItem('fcmToken', token);
      console.log('FCM Token saved:', token);
    } catch (error) {
      console.error('Failed to save FCM token:', error);
    }
  }

  /**
   * Set up notification listeners
   */
  setupListeners() {
    // When the app is in the foreground
    this.messageListener = messaging().onMessage(async remoteMessage => {
      console.log('Notification received in foreground:', remoteMessage);
      if (this.onNotificationReceived) {
        this.onNotificationReceived(remoteMessage);
      }
    });

    // When the app is opened from a notification
    this.notificationOpenedAppListener = messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('Notification opened app:', remoteMessage);
      if (this.onNotificationOpened) {
        this.onNotificationOpened(remoteMessage);
      }
    });

    // Check if app was opened from a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log('App opened from notification:', remoteMessage);
          if (this.onNotificationOpened) {
            this.onNotificationOpened(remoteMessage);
          }
        }
      });

    // Token refresh
    this.tokenRefreshListener = messaging().onTokenRefresh(token => {
      this.saveToken(token);
    });
  }

  /**
   * Remove all listeners
   */
  removeListeners() {
    if (this.messageListener) this.messageListener();
    if (this.notificationOpenedAppListener) this.notificationOpenedAppListener();
    if (this.tokenRefreshListener) this.tokenRefreshListener();
  }

  /**
   * Subscribe to a topic
   * @param {string} topic - Topic to subscribe to
   */
  async subscribeToTopic(topic) {
    try {
      await messaging().subscribeToTopic(topic);
      console.log(`Subscribed to topic: ${topic}`);
    } catch (error) {
      console.error(`Failed to subscribe to topic ${topic}:`, error);
    }
  }

  /**
   * Unsubscribe from a topic
   * @param {string} topic - Topic to unsubscribe from
   */
  async unsubscribeFromTopic(topic) {
    try {
      await messaging().unsubscribeFromTopic(topic);
      console.log(`Unsubscribed from topic: ${topic}`);
    } catch (error) {
      console.error(`Failed to unsubscribe from topic ${topic}:`, error);
    }
  }

  /**
   * Subscribe to bus updates for a specific booking
   * @param {string} bookingId - Booking ID
   */
  async subscribeToBusUpdates(bookingId) {
    await this.subscribeToTopic(`bus_updates_${bookingId}`);
  }

  /**
   * Unsubscribe from bus updates for a specific booking
   * @param {string} bookingId - Booking ID
   */
  async unsubscribeFromBusUpdates(bookingId) {
    await this.unsubscribeFromTopic(`bus_updates_${bookingId}`);
  }

  /**
   * Save notification preferences
   * @param {Object} preferences - Notification preferences
   */
  async saveNotificationPreferences(preferences) {
    try {
      await AsyncStorage.setItem('notificationPreferences', JSON.stringify(preferences));
      console.log('Notification preferences saved:', preferences);
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  }

  /**
   * Get notification preferences
   * @returns {Promise<Object>} - Notification preferences
   */
  async getNotificationPreferences() {
    try {
      const preferences = await AsyncStorage.getItem('notificationPreferences');
      return preferences ? JSON.parse(preferences) : this.getDefaultPreferences();
    } catch (error) {
      console.error('Failed to get notification preferences:', error);
      return this.getDefaultPreferences();
    }
  }

  /**
   * Get default notification preferences
   * @returns {Object} - Default preferences
   */
  getDefaultPreferences() {
    return {
      departureReminders: true,
      delayAlerts: true,
      arrivalNotifications: true,
      promotions: false,
      reminderTimes: {
        '24h': true,
        '1h': true,
        '30min': true
      }
    };
  }

  /**
   * Handle a received notification
   * @param {Object} notification - Notification data
   * @returns {Object} - Processed notification
   */
  processNotification(notification) {
    const { data, notification: notificationDetails } = notification;
    
    // Extract notification type
    const type = data?.type || 'general';
    
    // Process based on notification type
    switch (type) {
      case 'departure_reminder':
        return {
          id: data.id || new Date().getTime().toString(),
          title: notificationDetails?.title || 'Departure Reminder',
          body: notificationDetails?.body || `Your bus departs soon`,
          type: 'departure_reminder',
          bookingId: data.bookingId,
          departureTime: data.departureTime,
          timestamp: new Date().getTime(),
          read: false
        };
        
      case 'delay_alert':
        return {
          id: data.id || new Date().getTime().toString(),
          title: notificationDetails?.title || 'Delay Alert',
          body: notificationDetails?.body || `Your bus is delayed`,
          type: 'delay_alert',
          bookingId: data.bookingId,
          delayMinutes: parseInt(data.delayMinutes, 10) || 0,
          newDepartureTime: data.newDepartureTime,
          timestamp: new Date().getTime(),
          read: false
        };
        
      case 'arrival_alert':
        return {
          id: data.id || new Date().getTime().toString(),
          title: notificationDetails?.title || 'Arrival Alert',
          body: notificationDetails?.body || `Your bus is arriving soon`,
          type: 'arrival_alert',
          bookingId: data.bookingId,
          arrivalTime: data.arrivalTime,
          timestamp: new Date().getTime(),
          read: false
        };
        
      case 'status_update':
        return {
          id: data.id || new Date().getTime().toString(),
          title: notificationDetails?.title || 'Status Update',
          body: notificationDetails?.body || `Bus status update`,
          type: 'status_update',
          bookingId: data.bookingId,
          status: data.status,
          timestamp: new Date().getTime(),
          read: false
        };
        
      default:
        return {
          id: data?.id || new Date().getTime().toString(),
          title: notificationDetails?.title || 'Notification',
          body: notificationDetails?.body || 'You have a new notification',
          type: 'general',
          timestamp: new Date().getTime(),
          read: false
        };
    }
  }

  /**
   * Store notification in history
   * @param {Object} notification - Notification to store
   */
  async storeNotification(notification) {
    try {
      // Get existing notifications
      const storedNotifications = await AsyncStorage.getItem('notificationHistory');
      const notifications = storedNotifications ? JSON.parse(storedNotifications) : [];
      
      // Add new notification
      notifications.unshift(notification);
      
      // Keep only the latest 50 notifications
      const trimmedNotifications = notifications.slice(0, 50);
      
      // Save back to storage
      await AsyncStorage.setItem('notificationHistory', JSON.stringify(trimmedNotifications));
    } catch (error) {
      console.error('Failed to store notification:', error);
    }
  }

  /**
   * Get notification history
   * @returns {Promise<Array>} - Notification history
   */
  async getNotificationHistory() {
    try {
      const storedNotifications = await AsyncStorage.getItem('notificationHistory');
      return storedNotifications ? JSON.parse(storedNotifications) : [];
    } catch (error) {
      console.error('Failed to get notification history:', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   */
  async markNotificationAsRead(notificationId) {
    try {
      const storedNotifications = await AsyncStorage.getItem('notificationHistory');
      if (!storedNotifications) return;
      
      const notifications = JSON.parse(storedNotifications);
      const updatedNotifications = notifications.map(notification => {
        if (notification.id === notificationId) {
          return { ...notification, read: true };
        }
        return notification;
      });
      
      await AsyncStorage.setItem('notificationHistory', JSON.stringify(updatedNotifications));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications() {
    try {
      await AsyncStorage.setItem('notificationHistory', JSON.stringify([]));
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  }
}

export default new NotificationService();
