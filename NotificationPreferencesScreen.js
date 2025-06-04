import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Surface, IconButton, Switch, Divider, Button, Chip } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import NotificationService from '../../services/notification/NotificationService';

const NotificationPreferencesScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const [preferences, setPreferences] = useState({
    departureReminders: true,
    delayAlerts: true,
    arrivalNotifications: true,
    promotions: false,
    reminderTimes: {
      '24h': true,
      '1h': true,
      '30min': true
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(true);
  
  // Load preferences on mount
  useEffect(() => {
    const loadPreferences = async () => {
      try {
        // Check notification permission
        const hasPermission = await NotificationService.requestPermission();
        setPermissionGranted(hasPermission);
        
        // Load saved preferences
        const savedPreferences = await NotificationService.getNotificationPreferences();
        setPreferences(savedPreferences);
      } catch (error) {
        console.error('Failed to load notification preferences:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadPreferences();
  }, []);
  
  // Save preferences when they change
  const savePreferences = async (newPreferences) => {
    try {
      await NotificationService.saveNotificationPreferences(newPreferences);
      setPreferences(newPreferences);
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
    }
  };
  
  // Toggle a main preference
  const togglePreference = (key) => {
    const newPreferences = {
      ...preferences,
      [key]: !preferences[key]
    };
    savePreferences(newPreferences);
  };
  
  // Toggle a reminder time preference
  const toggleReminderTime = (time) => {
    const newPreferences = {
      ...preferences,
      reminderTimes: {
        ...preferences.reminderTimes,
        [time]: !preferences.reminderTimes[time]
      }
    };
    savePreferences(newPreferences);
  };
  
  // Request notification permission
  const requestPermission = async () => {
    const granted = await NotificationService.requestPermission();
    setPermissionGranted(granted);
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  return (
    <View style={styles.container}>
      <Surface style={styles.headerContainer}>
        <Text style={[styles.headerTitle, rtlStyles]}>{t('notifications.preferences')}</Text>
        <Text style={[styles.headerSubtitle, rtlStyles]}>
          {t('notifications.preferencesDescription')}
        </Text>
      </Surface>
      
      {!permissionGranted && (
        <Surface style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            {t('notifications.permissionRequired')}
          </Text>
          <Button 
            mode="contained" 
            onPress={requestPermission}
            style={styles.permissionButton}
          >
            {t('notifications.grantPermission')}
          </Button>
        </Surface>
      )}
      
      <Surface style={styles.preferencesContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('notifications.notificationTypes')}</Text>
        
        {/* Departure Reminders */}
        <View style={[styles.preferenceItem, rtlStyles]}>
          <View style={styles.preferenceTextContainer}>
            <Text style={styles.preferenceTitle}>{t('notifications.departureReminders')}</Text>
            <Text style={styles.preferenceDescription}>
              {t('notifications.departureRemindersDescription')}
            </Text>
          </View>
          <Switch
            value={preferences.departureReminders}
            onValueChange={() => togglePreference('departureReminders')}
            disabled={!permissionGranted}
          />
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Delay Alerts */}
        <View style={[styles.preferenceItem, rtlStyles]}>
          <View style={styles.preferenceTextContainer}>
            <Text style={styles.preferenceTitle}>{t('notifications.delayAlerts')}</Text>
            <Text style={styles.preferenceDescription}>
              {t('notifications.delayAlertsDescription')}
            </Text>
          </View>
          <Switch
            value={preferences.delayAlerts}
            onValueChange={() => togglePreference('delayAlerts')}
            disabled={!permissionGranted}
          />
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Arrival Notifications */}
        <View style={[styles.preferenceItem, rtlStyles]}>
          <View style={styles.preferenceTextContainer}>
            <Text style={styles.preferenceTitle}>{t('notifications.arrivalNotifications')}</Text>
            <Text style={styles.preferenceDescription}>
              {t('notifications.arrivalNotificationsDescription')}
            </Text>
          </View>
          <Switch
            value={preferences.arrivalNotifications}
            onValueChange={() => togglePreference('arrivalNotifications')}
            disabled={!permissionGranted}
          />
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Promotions */}
        <View style={[styles.preferenceItem, rtlStyles]}>
          <View style={styles.preferenceTextContainer}>
            <Text style={styles.preferenceTitle}>{t('notifications.promotions')}</Text>
            <Text style={styles.preferenceDescription}>
              {t('notifications.promotionsDescription')}
            </Text>
          </View>
          <Switch
            value={preferences.promotions}
            onValueChange={() => togglePreference('promotions')}
            disabled={!permissionGranted}
          />
        </View>
      </Surface>
      
      {preferences.departureReminders && (
        <Surface style={styles.reminderTimesContainer}>
          <Text style={[styles.sectionTitle, rtlStyles]}>{t('notifications.reminderTimes')}</Text>
          <Text style={[styles.sectionDescription, rtlStyles]}>
            {t('notifications.reminderTimesDescription')}
          </Text>
          
          <View style={styles.reminderChips}>
            <TouchableOpacity
              onPress={() => toggleReminderTime('24h')}
              disabled={!permissionGranted}
            >
              <Chip
                selected={preferences.reminderTimes['24h']}
                style={[
                  styles.reminderChip,
                  preferences.reminderTimes['24h'] && styles.selectedChip
                ]}
                textStyle={preferences.reminderTimes['24h'] && styles.selectedChipText}
              >
                {t('notifications.reminder24h')}
              </Chip>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => toggleReminderTime('1h')}
              disabled={!permissionGranted}
            >
              <Chip
                selected={preferences.reminderTimes['1h']}
                style={[
                  styles.reminderChip,
                  preferences.reminderTimes['1h'] && styles.selectedChip
                ]}
                textStyle={preferences.reminderTimes['1h'] && styles.selectedChipText}
              >
                {t('notifications.reminder1h')}
              </Chip>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => toggleReminderTime('30min')}
              disabled={!permissionGranted}
            >
              <Chip
                selected={preferences.reminderTimes['30min']}
                style={[
                  styles.reminderChip,
                  preferences.reminderTimes['30min'] && styles.selectedChip
                ]}
                textStyle={preferences.reminderTimes['30min'] && styles.selectedChipText}
              >
                {t('notifications.reminder30min')}
              </Chip>
            </TouchableOpacity>
          </View>
        </Surface>
      )}
      
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('NotificationHistory')}
        style={styles.historyButton}
        icon="history"
      >
        {t('notifications.viewHistory')}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  permissionContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFF3E0',
  },
  permissionText: {
    marginBottom: 12,
    color: '#E65100',
  },
  permissionButton: {
    backgroundColor: '#FF9800',
  },
  preferencesContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  preferenceTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 12,
    color: '#666',
  },
  divider: {
    backgroundColor: '#E0E0E0',
  },
  reminderTimesContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  reminderChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  reminderChip: {
    margin: 4,
    backgroundColor: '#E0E0E0',
  },
  selectedChip: {
    backgroundColor: '#1976D2',
  },
  selectedChipText: {
    color: 'white',
  },
  historyButton: {
    marginTop: 8,
  },
});

export default NotificationPreferencesScreen;
