import React, { useEffect, useState } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import { Text, Surface, Portal, Modal, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import NotificationService from '../../services/notification/NotificationService';

const NotificationBanner = ({ notification, onDismiss }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};
  
  // Get icon for notification type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'departure_reminder': return 'clock-time-four';
      case 'delay_alert': return 'clock-alert';
      case 'arrival_alert': return 'map-marker-check';
      case 'status_update': return 'information';
      default: return 'bell';
    }
  };
  
  return (
    <Surface style={styles.bannerContainer}>
      <View style={[styles.bannerContent, rtlStyles]}>
        <IconButton 
          icon={getNotificationIcon(notification.type)} 
          size={24} 
          color="#1976D2" 
        />
        <View style={styles.bannerTextContainer}>
          <Text style={[styles.bannerTitle, rtlStyles]}>{notification.title}</Text>
          <Text style={[styles.bannerBody, rtlStyles]}>{notification.body}</Text>
        </View>
      </View>
      <View style={styles.bannerActions}>
        <Button onPress={onDismiss}>{t('common.dismiss')}</Button>
        <Button 
          onPress={() => {
            // Handle action based on notification type
            if (notification.bookingId) {
              // Navigate to relevant screen
              navigation.navigate('BusTracking', { bookingId: notification.bookingId });
            }
            onDismiss();
          }}
        >
          {t('common.view')}
        </Button>
      </View>
    </Surface>
  );
};

const NotificationHandler = ({ children }) => {
  const [currentNotification, setCurrentNotification] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  
  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppState(nextAppState);
    });
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Initialize notification service
  useEffect(() => {
    const handleNotificationReceived = (remoteMessage) => {
      const processedNotification = NotificationService.processNotification(remoteMessage);
      
      // Store notification in history
      NotificationService.storeNotification(processedNotification);
      
      // Show notification banner if app is in foreground
      if (appState === 'active') {
        setCurrentNotification(processedNotification);
      }
    };
    
    const handleNotificationOpened = (remoteMessage) => {
      const processedNotification = NotificationService.processNotification(remoteMessage);
      
      // Mark as read
      NotificationService.markNotificationAsRead(processedNotification.id);
      
      // Handle navigation based on notification type
      if (processedNotification.bookingId) {
        // Navigate to relevant screen
        // This would typically be handled by a navigation service
        // or by passing navigation props from a higher component
      }
    };
    
    // Initialize notification service
    NotificationService.initialize(
      handleNotificationReceived,
      handleNotificationOpened
    );
    
    return () => {
      // Clean up listeners
      NotificationService.removeListeners();
    };
  }, [appState]);
  
  // Dismiss notification banner
  const dismissNotification = () => {
    if (currentNotification) {
      NotificationService.markNotificationAsRead(currentNotification.id);
      setCurrentNotification(null);
    }
  };
  
  return (
    <>
      {children}
      
      {/* Notification Banner */}
      {currentNotification && (
        <Portal>
          <View style={styles.bannerWrapper}>
            <NotificationBanner 
              notification={currentNotification} 
              onDismiss={dismissNotification} 
            />
          </View>
        </Portal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bannerWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    padding: 16,
    zIndex: 1000,
  },
  bannerContainer: {
    borderRadius: 8,
    elevation: 4,
    padding: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  bannerTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bannerBody: {
    fontSize: 14,
    color: '#666',
  },
  bannerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default NotificationHandler;
