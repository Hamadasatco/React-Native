import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const TestMultilingualScreen = () => {
  const { t } = useTranslation();
  const { language, changeLanguage, isRTL } = useLanguage();
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};
  
  // Toggle language
  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    changeLanguage(newLanguage);
  };
  
  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={[styles.headerTitle, rtlStyles]}>{t('common.appName')}</Text>
        <Text style={[styles.headerSubtitle, rtlStyles]}>
          {t('profile.language')}: {language === 'en' ? 'English' : 'العربية'}
        </Text>
        
        <Button
          mode="contained"
          onPress={toggleLanguage}
          style={styles.languageButton}
        >
          {language === 'en' ? 'تغيير إلى العربية' : 'Switch to English'}
        </Button>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('profile.personalInfo')}</Text>
        
        <View style={[styles.infoRow, rtlStyles]}>
          <Text style={styles.infoLabel}>{t('profile.firstName')}:</Text>
          <Text style={styles.infoValue}>John</Text>
        </View>
        
        <View style={[styles.infoRow, rtlStyles]}>
          <Text style={styles.infoLabel}>{t('profile.lastName')}:</Text>
          <Text style={styles.infoValue}>Doe</Text>
        </View>
        
        <View style={[styles.infoRow, rtlStyles]}>
          <Text style={styles.infoLabel}>{t('profile.email')}:</Text>
          <Text style={styles.infoValue}>john.doe@example.com</Text>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('trips.myTrips')}</Text>
        
        <View style={[styles.tripCard, rtlStyles]}>
          <View style={styles.tripInfo}>
            <Text style={styles.tripRoute}>New York → Boston</Text>
            <Text style={styles.tripDate}>June 15, 2025</Text>
          </View>
          <Text style={[styles.tripStatus, { color: '#1976D2' }]}>
            {t('trips.status.upcoming')}
          </Text>
        </View>
        
        <View style={[styles.tripCard, rtlStyles]}>
          <View style={styles.tripInfo}>
            <Text style={styles.tripRoute}>Chicago → Detroit</Text>
            <Text style={styles.tripDate}>May 10, 2025</Text>
          </View>
          <Text style={[styles.tripStatus, { color: '#2E7D32' }]}>
            {t('trips.status.completed')}
          </Text>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('statistics.travelStatistics')}</Text>
        
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>{t('statistics.totalTrips')}</Text>
          </View>
          
          <View style={styles.statCard}>
            <Text style={styles.statValue}>4328</Text>
            <Text style={styles.statLabel}>{t('statistics.totalDistance')} km</Text>
          </View>
        </View>
      </View>
      
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('help.contactUs')}</Text>
        
        <View style={[styles.contactRow, rtlStyles]}>
          <Text style={styles.contactLabel}>{t('help.email')}:</Text>
          <Text style={styles.contactValue}>support@bustickets.app</Text>
        </View>
        
        <View style={[styles.contactRow, rtlStyles]}>
          <Text style={styles.contactLabel}>{t('help.phone')}:</Text>
          <Text style={styles.contactValue}>+1 (800) 123-4567</Text>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {t('profile.version')}: 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 16,
    backgroundColor: '#1976D2',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 16,
  },
  languageButton: {
    marginBottom: 8,
  },
  sectionContainer: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tripCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    marginBottom: 8,
  },
  tripInfo: {
    flex: 1,
  },
  tripRoute: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 12,
    color: '#666',
  },
  tripStatus: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  contactLabel: {
    fontSize: 14,
    color: '#666',
  },
  contactValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    padding: 16,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
  },
});

export default TestMultilingualScreen;
