import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Switch, Button, Divider, List } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const PreferencesScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Get preferences from route params
  const { preferences } = route.params || {
    preferences: {
      notifications: {
        email: true,
        push: true,
        sms: false
      },
      travelPreferences: {
        seatType: 'window',
        specialRequirements: []
      }
    }
  };
  
  // State for preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    email: preferences.notifications?.email || false,
    push: preferences.notifications?.push || false,
    sms: preferences.notifications?.sms || false
  });
  
  const [travelPrefs, setTravelPrefs] = useState({
    seatType: preferences.travelPreferences?.seatType || 'window',
    specialRequirements: preferences.travelPreferences?.specialRequirements || []
  });
  
  // Loading state
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle notification toggle
  const handleNotificationToggle = (type) => {
    setNotificationPrefs({
      ...notificationPrefs,
      [type]: !notificationPrefs[type]
    });
  };
  
  // Handle seat type selection
  const handleSeatTypeChange = (type) => {
    setTravelPrefs({
      ...travelPrefs,
      seatType: type
    });
  };
  
  // Handle save
  const handleSave = () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, we would dispatch an action to update the preferences
      const updatedPreferences = {
        notifications: notificationPrefs,
        travelPreferences: travelPrefs
      };
      
      setIsLoading(false);
      navigation.navigate('Profile', { updatedPreferences });
    }, 1000);
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('preferences.notifications')}</Text>
        <Text style={[styles.sectionDescription, rtlStyles]}>
          {t('preferences.notificationsDescription')}
        </Text>
        
        <List.Item
          title={t('preferences.emailNotifications')}
          description={t('preferences.emailNotificationsDescription')}
          left={props => <List.Icon {...props} icon="email" />}
          right={() => (
            <Switch
              value={notificationPrefs.email}
              onValueChange={() => handleNotificationToggle('email')}
              disabled={isLoading}
            />
          )}
        />
        
        <Divider style={styles.divider} />
        
        <List.Item
          title={t('preferences.pushNotifications')}
          description={t('preferences.pushNotificationsDescription')}
          left={props => <List.Icon {...props} icon="bell" />}
          right={() => (
            <Switch
              value={notificationPrefs.push}
              onValueChange={() => handleNotificationToggle('push')}
              disabled={isLoading}
            />
          )}
        />
        
        <Divider style={styles.divider} />
        
        <List.Item
          title={t('preferences.smsNotifications')}
          description={t('preferences.smsNotificationsDescription')}
          left={props => <List.Icon {...props} icon="message" />}
          right={() => (
            <Switch
              value={notificationPrefs.sms}
              onValueChange={() => handleNotificationToggle('sms')}
              disabled={isLoading}
            />
          )}
        />
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('preferences.travelPreferences')}</Text>
        <Text style={[styles.sectionDescription, rtlStyles]}>
          {t('preferences.travelPreferencesDescription')}
        </Text>
        
        <Text style={[styles.subsectionTitle, rtlStyles]}>{t('preferences.seatPreference')}</Text>
        
        <View style={styles.seatTypeContainer}>
          <Button
            mode={travelPrefs.seatType === 'window' ? 'contained' : 'outlined'}
            onPress={() => handleSeatTypeChange('window')}
            style={styles.seatTypeButton}
            disabled={isLoading}
          >
            {t('preferences.window')}
          </Button>
          
          <Button
            mode={travelPrefs.seatType === 'aisle' ? 'contained' : 'outlined'}
            onPress={() => handleSeatTypeChange('aisle')}
            style={styles.seatTypeButton}
            disabled={isLoading}
          >
            {t('preferences.aisle')}
          </Button>
          
          <Button
            mode={travelPrefs.seatType === 'any' ? 'contained' : 'outlined'}
            onPress={() => handleSeatTypeChange('any')}
            style={styles.seatTypeButton}
            disabled={isLoading}
          >
            {t('preferences.any')}
          </Button>
        </View>
        
        <Text style={[styles.subsectionTitle, rtlStyles, styles.specialRequirementsTitle]}>
          {t('preferences.specialRequirements')}
        </Text>
        
        <List.Item
          title={t('preferences.wheelchairAccess')}
          left={props => <List.Icon {...props} icon="wheelchair-accessibility" />}
          right={() => (
            <Switch
              value={travelPrefs.specialRequirements.includes('wheelchair')}
              onValueChange={() => {
                const requirements = [...travelPrefs.specialRequirements];
                if (requirements.includes('wheelchair')) {
                  requirements.splice(requirements.indexOf('wheelchair'), 1);
                } else {
                  requirements.push('wheelchair');
                }
                setTravelPrefs({
                  ...travelPrefs,
                  specialRequirements: requirements
                });
              }}
              disabled={isLoading}
            />
          )}
        />
        
        <Divider style={styles.divider} />
        
        <List.Item
          title={t('preferences.assistanceNeeded')}
          left={props => <List.Icon {...props} icon="hand-heart" />}
          right={() => (
            <Switch
              value={travelPrefs.specialRequirements.includes('assistance')}
              onValueChange={() => {
                const requirements = [...travelPrefs.specialRequirements];
                if (requirements.includes('assistance')) {
                  requirements.splice(requirements.indexOf('assistance'), 1);
                } else {
                  requirements.push('assistance');
                }
                setTravelPrefs({
                  ...travelPrefs,
                  specialRequirements: requirements
                });
              }}
              disabled={isLoading}
            />
          )}
        />
      </Surface>
      
      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          disabled={isLoading}
        >
          {t('common.cancel')}
        </Button>
        
        <Button
          mode="contained"
          onPress={handleSave}
          style={styles.saveButton}
          loading={isLoading}
          disabled={isLoading}
        >
          {t('common.save')}
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sectionContainer: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  specialRequirementsTitle: {
    marginTop: 24,
  },
  divider: {
    marginVertical: 8,
  },
  seatTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  seatTypeButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#1976D2',
  },
});

export default PreferencesScreen;
