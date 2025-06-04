import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, IconButton } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import NotificationService from '../../services/notification/NotificationService';

const NotificationBusStatusComponent = ({ bookingId, busStatus, onStatusChange }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Subscribe to bus updates when component mounts
  React.useEffect(() => {
    const subscribeToBusUpdates = async () => {
      if (bookingId) {
        await NotificationService.subscribeToBusUpdates(bookingId);
      }
    };
    
    subscribeToBusUpdates();
    
    // Unsubscribe when component unmounts
    return () => {
      if (bookingId) {
        NotificationService.unsubscribeFromBusUpdates(bookingId);
      }
    };
  }, [bookingId]);
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'onTime': return '#4CAF50';
      case 'delayed': return '#F44336';
      case 'arriving': return '#2196F3';
      default: return '#9E9E9E';
    }
  };
  
  // Get status text
  const getStatusText = (status) => {
    switch (status) {
      case 'onTime': return t('tracking.busOnTime');
      case 'delayed': return t('tracking.busDelayed');
      case 'arriving': return t('tracking.busArriving');
      default: return t('tracking.statusUnknown');
    }
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  return (
    <Surface style={styles.container}>
      <View style={[styles.header, rtlStyles]}>
        <Text style={styles.title}>{t('notifications.busStatusUpdates')}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(busStatus) }]}>
          <Text style={styles.statusText}>{getStatusText(busStatus)}</Text>
        </View>
      </View>
      
      <View style={styles.content}>
        <Text style={[styles.description, rtlStyles]}>
          {t('notifications.statusUpdateDescription')}
        </Text>
        
        <View style={[styles.notificationTypes, rtlStyles]}>
          <View style={styles.notificationType}>
            <IconButton icon="clock-alert" size={24} color="#F44336" />
            <Text style={styles.notificationTypeText}>{t('notifications.delayAlerts')}</Text>
          </View>
          
          <View style={styles.notificationType}>
            <IconButton icon="map-marker-check" size={24} color="#4CAF50" />
            <Text style={styles.notificationTypeText}>{t('notifications.arrivalUpdates')}</Text>
          </View>
          
          <View style={styles.notificationType}>
            <IconButton icon="information" size={24} color="#2196F3" />
            <Text style={styles.notificationTypeText}>{t('notifications.statusChanges')}</Text>
          </View>
        </View>
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    elevation: 2,
    margin: 16,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E3F2FD',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  description: {
    marginBottom: 16,
    lineHeight: 20,
  },
  notificationTypes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  notificationType: {
    alignItems: 'center',
    marginHorizontal: 8,
    marginVertical: 8,
  },
  notificationTypeText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
});

export default NotificationBusStatusComponent;
