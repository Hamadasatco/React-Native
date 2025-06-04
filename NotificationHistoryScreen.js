import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Surface, IconButton, Badge, Divider, Button, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import NotificationService from '../../services/notification/NotificationService';

const NotificationHistoryScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);
  
  // Load notifications from storage
  const loadNotifications = async () => {
    try {
      setLoading(true);
      const history = await NotificationService.getNotificationHistory();
      setNotifications(history);
    } catch (error) {
      console.error('Failed to load notification history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  // Refresh notifications
  const handleRefresh = () => {
    setRefreshing(true);
    loadNotifications();
  };
  
  // Mark notification as read
  const markAsRead = async (notificationId) => {
    await NotificationService.markNotificationAsRead(notificationId);
    
    // Update local state
    setNotifications(prevNotifications => 
      prevNotifications.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Clear all notifications
  const clearAllNotifications = async () => {
    await NotificationService.clearAllNotifications();
    setNotifications([]);
  };
  
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
  
  // Get color for notification type
  const getNotificationColor = (type) => {
    switch (type) {
      case 'departure_reminder': return '#2196F3';
      case 'delay_alert': return '#F44336';
      case 'arrival_alert': return '#4CAF50';
      case 'status_update': return '#FF9800';
      default: return '#9E9E9E';
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  // Render notification item
  const renderNotificationItem = ({ item }) => (
    <Surface style={[styles.notificationItem, !item.read && styles.unreadNotification]}>
      <TouchableOpacity 
        style={[styles.notificationContent, rtlStyles]}
        onPress={() => markAsRead(item.id)}
      >
        <View style={[styles.iconContainer, { backgroundColor: getNotificationColor(item.type) }]}>
          <IconButton 
            icon={getNotificationIcon(item.type)} 
            size={24} 
            color="white" 
          />
          {!item.read && (
            <Badge 
              size={8} 
              style={styles.unreadBadge} 
            />
          )}
        </View>
        
        <View style={styles.textContainer}>
          <Text style={[styles.notificationTitle, rtlStyles, !item.read && styles.boldText]}>
            {item.title}
          </Text>
          <Text style={[styles.notificationBody, rtlStyles]}>
            {item.body}
          </Text>
          <Text style={[styles.notificationTimestamp, rtlStyles]}>
            {formatTimestamp(item.timestamp)}
          </Text>
        </View>
      </TouchableOpacity>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.headerContainer}>
        <View style={[styles.headerContent, rtlStyles]}>
          <Text style={styles.headerTitle}>{t('notifications.history')}</Text>
          <Button 
            mode="text" 
            onPress={clearAllNotifications}
            disabled={notifications.length === 0}
          >
            {t('notifications.clearAll')}
          </Button>
        </View>
      </Surface>
      
      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconButton icon="bell-off" size={48} color="#9E9E9E" />
          <Text style={styles.emptyText}>{t('notifications.noNotifications')}</Text>
          <Button 
            mode="outlined" 
            onPress={handleRefresh}
            style={styles.refreshButton}
          >
            {t('common.refresh')}
          </Button>
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={renderNotificationItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
      
      <Button
        mode="contained"
        onPress={() => navigation.navigate('NotificationPreferences')}
        style={styles.preferencesButton}
        icon="cog"
      >
        {t('notifications.managePreferences')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 16,
    borderRadius: 0,
    elevation: 2,
    marginBottom: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#9E9E9E',
    marginTop: 16,
    marginBottom: 24,
  },
  refreshButton: {
    marginTop: 8,
  },
  listContent: {
    padding: 16,
    paddingBottom: 80,
  },
  notificationItem: {
    borderRadius: 8,
    elevation: 1,
    overflow: 'hidden',
  },
  unreadNotification: {
    backgroundColor: '#E3F2FD',
  },
  notificationContent: {
    flexDirection: 'row',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#F44336',
  },
  textContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  notificationBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  notificationTimestamp: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  separator: {
    height: 8,
  },
  preferencesButton: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: '#1976D2',
  },
});

export default NotificationHistoryScreen;
