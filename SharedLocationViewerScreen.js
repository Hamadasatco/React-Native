import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import TrafficMapView from '../../components/tracking/TrafficMapView';
import SharingService from '../../services/sharing/SharingService';

const SharedLocationViewerScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const { token } = route.params || { token: null };
  
  // States
  const [isLoading, setIsLoading] = useState(true);
  const [shareData, setShareData] = useState(null);
  const [error, setError] = useState(null);
  const [busLocation, setBusLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  const [expiryTime, setExpiryTime] = useState(null);
  const [busInfo, setBusInfo] = useState(null);
  
  // Load shared data on mount
  useEffect(() => {
    loadSharedData();
    
    // Set up refresh interval
    const intervalId = setInterval(loadSharedData, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [token]);
  
  // Load shared data
  const loadSharedData = async () => {
    if (!token) {
      setError(t('sharing.invalidLink'));
      setIsLoading(false);
      return;
    }
    
    try {
      const data = await SharingService.getShareData(token);
      
      if (!data) {
        setError(t('sharing.expiredOrInvalidLink'));
        setIsLoading(false);
        return;
      }
      
      setShareData(data);
      setBusInfo(data.busInfo);
      setBusLocation(data.busInfo.currentLocation);
      setDestination(data.busInfo.destination);
      setExpiryTime(data.expiryTime);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading shared data:', error);
      setError(t('sharing.errorLoadingData'));
      setIsLoading(false);
    }
  };
  
  // Calculate time remaining
  const getTimeRemaining = () => {
    if (!expiryTime) return '';
    
    const now = Date.now();
    const remaining = expiryTime - now;
    
    if (remaining <= 0) return t('sharing.expired');
    
    const minutes = Math.floor(remaining / 60000);
    if (minutes < 60) {
      return t('sharing.minutesRemaining', { minutes });
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return t('sharing.hoursMinutesRemaining', { hours, minutes: remainingMinutes });
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>{t('sharing.linkError')}</Text>
          <Text style={styles.errorText}>{error}</Text>
          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            {t('common.goBack')}
          </Button>
        </View>
      ) : (
        <>
          <Surface style={styles.headerContainer}>
            <Text style={[styles.headerTitle, rtlStyles]}>{t('sharing.sharedBusLocation')}</Text>
            {busInfo && (
              <Text style={[styles.headerSubtitle, rtlStyles]}>
                {busInfo.operator}
              </Text>
            )}
            
            <View style={styles.expiryContainer}>
              <Text style={styles.expiryText}>
                {t('sharing.linkExpiry')}: {getTimeRemaining()}
              </Text>
            </View>
          </Surface>
          
          {busLocation && destination && (
            <TrafficMapView
              style={styles.mapContainer}
              busLocation={busLocation}
              destination={destination}
              userLocation={null}
              readOnly={true}
            />
          )}
          
          <ScrollView style={styles.contentScrollView}>
            {busInfo && (
              <Surface style={styles.journeyContainer}>
                <Text style={[styles.sectionTitle, rtlStyles]}>{t('common.journeyDetails')}</Text>
                
                <View style={[styles.journeyDetail, rtlStyles]}>
                  <Text style={styles.journeyLabel}>{t('common.departure')}</Text>
                  <Text style={styles.journeyValue}>{busInfo.departure}</Text>
                </View>
                
                <View style={[styles.journeyDetail, rtlStyles]}>
                  <Text style={styles.journeyLabel}>{t('common.arrival')}</Text>
                  <Text style={styles.journeyValue}>{busInfo.arrival}</Text>
                </View>
                
                <View style={[styles.journeyDetail, rtlStyles]}>
                  <Text style={styles.journeyLabel}>{t('common.duration')}</Text>
                  <Text style={styles.journeyValue}>{busInfo.duration}</Text>
                </View>
              </Surface>
            )}
            
            <Surface style={styles.privacyContainer}>
              <Text style={[styles.sectionTitle, rtlStyles]}>{t('sharing.privacyNotice')}</Text>
              <Text style={[styles.privacyText, rtlStyles]}>
                {t('sharing.sharedPrivacyDescription')}
              </Text>
            </Surface>
            
            <Button
              mode="contained"
              onPress={loadSharedData}
              style={styles.refreshButton}
              icon="refresh"
            >
              {t('sharing.refreshLocation')}
            </Button>
          </ScrollView>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#F44336',
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginTop: 16,
  },
  headerContainer: {
    padding: 16,
    margin: 16,
    marginBottom: 0,
    borderRadius: 8,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  expiryContainer: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
  },
  expiryText: {
    color: '#1976D2',
  },
  mapContainer: {
    margin: 16,
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  contentScrollView: {
    flex: 1,
  },
  journeyContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  journeyDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  journeyLabel: {
    fontSize: 14,
    color: '#666',
  },
  journeyValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  privacyContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  privacyText: {
    color: '#666',
  },
  refreshButton: {
    margin: 16,
    marginTop: 0,
    marginBottom: 24,
    backgroundColor: '#1976D2',
  },
});

export default SharedLocationViewerScreen;
