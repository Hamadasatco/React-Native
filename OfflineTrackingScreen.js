import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button, IconButton, ActivityIndicator, Chip, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import TrafficMapView from '../../components/tracking/TrafficMapView';
import TrafficService from '../../services/traffic/TrafficService';
import OfflineService from '../../services/offline/OfflineService';
import NetInfo from '@react-native-community/netinfo';

const OfflineTrackingScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const { bookingId, bus } = route.params || {
    bookingId: 'BK123456',
    bus: {
      id: '3',
      operator: 'Luxury Travel',
      departure: '10:30 AM',
      arrival: '02:30 PM',
      duration: '4h 00m',
    }
  };

  // Location states
  const [busLocation, setBusLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [destination, setDestination] = useState(null);
  
  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [estimatedArrival, setEstimatedArrival] = useState('--:--');
  const [distanceRemaining, setDistanceRemaining] = useState('--');
  const [timeRemaining, setTimeRemaining] = useState('--');
  const [busStatus, setBusStatus] = useState('unknown');
  const [trafficInfo, setTrafficInfo] = useState(null);
  
  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = OfflineService.addConnectionListener((connected) => {
      setIsConnected(connected);
      if (connected && offlineMode) {
        // Connection restored, offer to refresh data
        // Keep offline mode until user explicitly refreshes
      }
    });
    
    return () => unsubscribe();
  }, [offlineMode]);
  
  // Load data on mount
  useEffect(() => {
    loadTrackingData();
  }, [bookingId]);
  
  // Load tracking data (online or offline)
  const loadTrackingData = async () => {
    setIsLoading(true);
    
    try {
      // Check connection status
      const connected = await OfflineService.isNetworkConnected();
      setIsConnected(connected);
      
      if (connected) {
        // Online mode - fetch fresh data
        await loadOnlineData();
      } else {
        // Offline mode - load cached data
        await loadOfflineData();
        setOfflineMode(true);
      }
    } catch (error) {
      console.error('Error loading tracking data:', error);
      // Fallback to offline data on error
      await loadOfflineData();
      setOfflineMode(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load data in online mode
  const loadOnlineData = async () => {
    try {
      // Simulate fetching bus location from API
      const mockBusLocation = {
        latitude: 40.7128,
        longitude: -74.0060,
      };
      
      // Simulate fetching user location
      const mockUserLocation = {
        latitude: 40.7300,
        longitude: -73.9950,
      };
      
      // Simulate fetching destination
      const mockDestination = {
        latitude: 40.7500,
        longitude: -73.9800,
      };
      
      // Set locations
      setBusLocation(mockBusLocation);
      setUserLocation(mockUserLocation);
      setDestination(mockDestination);
      
      // Generate route key for caching
      const routeKey = `${mockBusLocation.latitude},${mockBusLocation.longitude}-${mockDestination.latitude},${mockDestination.longitude}`;
      
      // Fetch traffic data
      const trafficData = await TrafficService.getTrafficAlongRoute(
        mockBusLocation,
        mockDestination
      );
      
      // Cache data for offline use
      await OfflineService.cacheBusLocation(bookingId, mockBusLocation);
      await OfflineService.cacheRouteData(routeKey, {
        origin: mockBusLocation,
        destination: mockDestination,
        userLocation: mockUserLocation
      });
      await OfflineService.cacheTrafficData(routeKey, trafficData);
      
      // Update UI
      setTrafficInfo(trafficData);
      updateTravelInfo(mockBusLocation, mockDestination, trafficData);
      setLastUpdated(new Date());
      setOfflineMode(false);
    } catch (error) {
      console.error('Error loading online data:', error);
      throw error;
    }
  };
  
  // Load data in offline mode
  const loadOfflineData = async () => {
    try {
      // Load cached bus location
      const cachedBusLocation = await OfflineService.getCachedBusLocation(bookingId);
      
      if (!cachedBusLocation) {
        throw new Error('No cached bus location available');
      }
      
      setBusLocation(cachedBusLocation);
      
      // Try to find a matching route
      const cachedRoutes = await AsyncStorage.getAllKeys();
      const routeKeys = cachedRoutes.filter(key => key.startsWith('route_data_'));
      
      if (routeKeys.length > 0) {
        // Just use the first cached route for simplicity
        const routeData = await OfflineService.getCachedRouteData(
          routeKeys[0].replace('route_data_', '')
        );
        
        if (routeData) {
          setUserLocation(routeData.userLocation);
          setDestination(routeData.destination);
          
          // Load cached traffic data
          const trafficData = await OfflineService.getCachedTrafficData(
            routeKeys[0].replace('route_data_', '')
          );
          
          if (trafficData) {
            setTrafficInfo(trafficData);
            updateTravelInfo(cachedBusLocation, routeData.destination, trafficData);
          }
          
          // Set last updated time from cache
          setLastUpdated(new Date(cachedBusLocation.timestamp));
        }
      }
    } catch (error) {
      console.error('Error loading offline data:', error);
      // Show error state in UI
      setBusStatus('unknown');
      setEstimatedArrival('--:--');
      setDistanceRemaining('--');
      setTimeRemaining('--');
    }
  };
  
  // Update travel information based on locations and traffic
  const updateTravelInfo = (busLoc, destLoc, traffic) => {
    // Calculate estimated arrival (mock implementation)
    const now = new Date();
    const delayMinutes = traffic?.delayMinutes || 0;
    const baseMinutes = 30; // Base travel time in minutes
    const totalMinutes = baseMinutes + delayMinutes;
    
    now.setMinutes(now.getMinutes() + totalMinutes);
    
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    
    setEstimatedArrival(`${formattedHours}:${formattedMinutes} ${ampm}`);
    
    // Calculate distance (mock)
    const distance = calculateDistance(busLoc, destLoc);
    setDistanceRemaining(`${distance.toFixed(1)} km`);
    
    // Set time remaining
    setTimeRemaining(`${totalMinutes} min`);
    
    // Set bus status based on traffic
    if (traffic) {
      if (traffic.delayMinutes > 15) {
        setBusStatus('delayed');
      } else if (distance < 1) {
        setBusStatus('arriving');
      } else {
        setBusStatus('onTime');
      }
    } else {
      setBusStatus('unknown');
    }
  };
  
  // Simple distance calculation (mock)
  const calculateDistance = (point1, point2) => {
    const latDiff = point1.latitude - point2.latitude;
    const lngDiff = point1.longitude - point2.longitude;
    return Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion
  };
  
  // Handle refresh button press
  const handleRefresh = async () => {
    if (isConnected) {
      await loadOnlineData();
      setOfflineMode(false);
    } else {
      // Still offline, show message
      // This would typically show a toast or alert
      console.log('Still offline, cannot refresh');
    }
  };
  
  // Get status color and text
  const getStatusInfo = () => {
    switch (busStatus) {
      case 'onTime':
        return { color: '#4CAF50', text: t('tracking.busOnTime') };
      case 'delayed':
        return { color: '#F44336', text: t('tracking.busDelayed') };
      case 'arriving':
        return { color: '#2196F3', text: t('tracking.busArriving') };
      default:
        return { color: '#9E9E9E', text: t('tracking.statusUnknown') };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  // Format last updated time
  const formatLastUpdated = () => {
    if (!lastUpdated) return t('tracking.neverUpdated');
    
    return lastUpdated.toLocaleTimeString();
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
      ) : (
        <>
          <Surface style={styles.headerContainer}>
            <Text style={[styles.headerTitle, rtlStyles]}>{t('tracking.trackYourBus')}</Text>
            <Text style={[styles.headerSubtitle, rtlStyles]}>
              {bus.operator} - {t('common.bookingId')}: {bookingId}
            </Text>
            
            {/* Offline indicator */}
            {offlineMode && (
              <View style={styles.offlineBanner}>
                <IconButton icon="wifi-off" size={20} color="white" />
                <Text style={styles.offlineText}>{t('tracking.offlineMode')}</Text>
                <Text style={styles.lastUpdatedText}>
                  {t('tracking.lastUpdated')}: {formatLastUpdated()}
                </Text>
              </View>
            )}
          </Surface>
          
          {busLocation && destination ? (
            <TrafficMapView
              style={styles.mapContainer}
              busLocation={busLocation}
              destination={destination}
              userLocation={userLocation}
              offlineMode={offlineMode}
              cachedTrafficData={trafficInfo}
            />
          ) : (
            <Surface style={styles.noMapContainer}>
              <IconButton icon="map-marker-off" size={48} color="#9E9E9E" />
              <Text style={styles.noMapText}>{t('tracking.noMapDataAvailable')}</Text>
            </Surface>
          )}
          
          <ScrollView style={styles.detailsScrollView}>
            <Surface style={styles.statusContainer}>
              <View style={[styles.statusHeader, rtlStyles]}>
                <Text style={styles.statusTitle}>
                  {offlineMode ? t('tracking.cachedLocation') : t('tracking.liveLocation')}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                  <Text style={styles.statusText}>{statusInfo.text}</Text>
                </View>
              </View>
              
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('tracking.estimatedArrival')}</Text>
                  <Text style={styles.infoValue}>{estimatedArrival}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('tracking.distance')}</Text>
                  <Text style={styles.infoValue}>{distanceRemaining}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('tracking.timeRemaining')}</Text>
                  <Text style={styles.infoValue}>{timeRemaining}</Text>
                </View>
                
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>{t('common.status')}</Text>
                  <Text style={[styles.infoValue, { color: statusInfo.color }]}>{statusInfo.text}</Text>
                </View>
              </View>
              
              <Button
                mode="contained"
                icon="refresh"
                style={styles.refreshButton}
                onPress={handleRefresh}
                disabled={isLoading || (!isConnected && offlineMode)}
              >
                {isConnected 
                  ? t('tracking.refreshLocation') 
                  : t('tracking.waitingForConnection')}
              </Button>
              
              {offlineMode && isConnected && (
                <Text style={styles.reconnectedText}>
                  {t('tracking.connectionRestored')}
                </Text>
              )}
            </Surface>
            
            <Surface style={styles.journeyContainer}>
              <Text style={[styles.journeyTitle, rtlStyles]}>{t('common.journeyDetails')}</Text>
              
              <View style={[styles.journeyDetail, rtlStyles]}>
                <Text style={styles.journeyLabel}>{t('common.departure')}</Text>
                <Text style={styles.journeyValue}>{bus.departure}</Text>
              </View>
              
              <View style={[styles.journeyDetail, rtlStyles]}>
                <Text style={styles.journeyLabel}>{t('common.arrival')}</Text>
                <Text style={styles.journeyValue}>{bus.arrival}</Text>
              </View>
              
              <View style={[styles.journeyDetail, rtlStyles]}>
                <Text style={styles.journeyLabel}>{t('common.duration')}</Text>
                <Text style={styles.journeyValue}>{bus.duration}</Text>
              </View>
              
              {offlineMode && (
                <View style={styles.offlineInfoContainer}>
                  <Text style={styles.offlineInfoTitle}>{t('tracking.offlineInfo')}</Text>
                  <Text style={styles.offlineInfoText}>
                    {t('tracking.offlineInfoDescription')}
                  </Text>
                </View>
              )}
            </Surface>
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
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9800',
    padding: 8,
    borderRadius: 4,
    marginTop: 12,
  },
  offlineText: {
    color: 'white',
    fontWeight: 'bold',
    flex: 1,
  },
  lastUpdatedText: {
    color: 'white',
    fontSize: 12,
  },
  mapContainer: {
    margin: 16,
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  noMapContainer: {
    margin: 16,
    height: 250,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },
  noMapText: {
    marginTop: 16,
    color: '#9E9E9E',
  },
  detailsScrollView: {
    flex: 1,
  },
  statusContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
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
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#1976D2',
  },
  reconnectedText: {
    textAlign: 'center',
    marginTop: 8,
    color: '#4CAF50',
  },
  journeyContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  journeyTitle: {
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
  offlineInfoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
  },
  offlineInfoTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  offlineInfoText: {
    fontSize: 12,
    lineHeight: 18,
  },
});

export default OfflineTrackingScreen;
