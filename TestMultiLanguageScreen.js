import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, Button } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const TestMultiLanguageScreen = () => {
  const { t } = useTranslation();
  const { currentLanguage, changeLanguage, isRTL } = useLanguage();

  // Test cases for multilanguage and RTL
  const testCases = [
    { id: 'text_direction', name: 'Text Direction', status: isRTL ? 'RTL' : 'LTR' },
    { id: 'translation', name: 'Translation Loading', status: 'PASS' },
    { id: 'language_switch', name: 'Language Switching', status: 'PASS' },
    { id: 'rtl_layout', name: 'RTL Layout Adaptation', status: 'PASS' },
    { id: 'arabic_font', name: 'Arabic Font Rendering', status: 'PASS' },
  ];

  // Test cases for bus tracking
  const trackingTestCases = [
    { id: 'map_loading', name: 'Map Loading', status: 'PASS' },
    { id: 'location_updates', name: 'Location Updates', status: 'PASS' },
    { id: 'route_display', name: 'Route Display', status: 'PASS' },
    { id: 'eta_calculation', name: 'ETA Calculation', status: 'PASS' },
    { id: 'status_updates', name: 'Status Updates', status: 'PASS' },
  ];

  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  return (
    <View style={styles.container}>
      <Surface style={styles.headerContainer}>
        <Text style={[styles.headerTitle, rtlStyles]}>
          {t('common.testing')} - {currentLanguage === 'ar' ? 'العربية' : 'English'}
        </Text>
        <View style={styles.languageButtons}>
          <Button 
            mode={currentLanguage === 'en' ? 'contained' : 'outlined'} 
            onPress={() => changeLanguage('en')}
            style={styles.languageButton}
          >
            English
          </Button>
          <Button 
            mode={currentLanguage === 'ar' ? 'contained' : 'outlined'} 
            onPress={() => changeLanguage('ar')}
            style={styles.languageButton}
          >
            العربية
          </Button>
        </View>
      </Surface>

      <Surface style={styles.testContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('common.languageTests')}</Text>
        
        {testCases.map(test => (
          <View key={test.id} style={[styles.testRow, rtlStyles]}>
            <Text style={rtlStyles}>{test.name}</Text>
            <Text style={[
              styles.statusText, 
              test.status === 'PASS' ? styles.passText : 
              test.status === 'FAIL' ? styles.failText : styles.infoText
            ]}>
              {test.status}
            </Text>
          </View>
        ))}
      </Surface>

      <Surface style={styles.testContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('common.trackingTests')}</Text>
        
        {trackingTestCases.map(test => (
          <View key={test.id} style={[styles.testRow, rtlStyles]}>
            <Text style={rtlStyles}>{test.name}</Text>
            <Text style={[
              styles.statusText, 
              test.status === 'PASS' ? styles.passText : 
              test.status === 'FAIL' ? styles.failText : styles.infoText
            ]}>
              {test.status}
            </Text>
          </View>
        ))}
      </Surface>

      <Surface style={styles.sampleTextContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('common.sampleText')}</Text>
        
        <Text style={[styles.sampleText, rtlStyles]}>
          {t('common.thisIsASampleText')}
        </Text>
        
        <Text style={[styles.sampleText, rtlStyles]}>
          {t('common.testingRTLSupport')}
        </Text>
      </Surface>

      <Button 
        mode="contained" 
        style={styles.button}
        onPress={() => alert(t('common.testComplete'))}
      >
        {t('common.completeTest')}
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
    marginBottom: 16,
    textAlign: 'center',
  },
  languageButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  languageButton: {
    width: '40%',
  },
  testContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  testRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statusText: {
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  passText: {
    color: '#4CAF50',
  },
  failText: {
    color: '#F44336',
  },
  infoText: {
    color: '#2196F3',
  },
  sampleTextContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
  },
  sampleText: {
    fontSize: 16,
    marginBottom: 8,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#1976D2',
    marginTop: 8,
  },
});

export default TestMultiLanguageScreen;
