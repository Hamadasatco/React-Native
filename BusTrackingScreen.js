import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button, IconButton, ActivityIndicator } from 'react-native-paper';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const BusTrackingScreen = ({ route, navigation }) => {
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

  // Mock bus location data
  const [busLocation, setBusLocation] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
  });
  
  // Mock user location
  const [userLocation, setUserLocation] = useState({
    latitude: 40.7300,
    longitude: -73.9950,
  });
  
  // Mock destination
  const destination = {
    latitude: 40.7500,
    longitude: -73.9800,
  };
  
  const [isLoading, setIsLoading] = useState(true);
  const [estimatedArrival, setEstimatedArrival] = useState('12:45 PM');
  const [distanceRemaining, setDistanceRemaining] = useState('2.5 km');
  const [timeRemaining, setTimeRemaining] = useState('15 min');
  const [busStatus, setBusStatus] = useState('onTime'); // onTime, delayed, arriving
  
  // Simulate bus movement
  useEffect(() => {
    // Initial loading simulation
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    
    // Simulate bus movement every 5 seconds
    const interval = setInterval(() => {
      setBusLocation(prevLocation => ({
        latitude: prevLocation.latitude + (Math.random() * 0.001 - 0.0005),
        longitude: prevLocation.longitude + (Math.random() * 0.001 - 0.0005),
      }));
      
      // Randomly update status
      const statuses = ['onTime', 'delayed', 'arriving'];
      const randomStatus = statuses[Math.floor(Math.random() * 3)];
      setBusStatus(randomStatus);
      
      // Update time remaining
      const currentTime = parseInt(timeRemaining.split(' ')[0]);
      if (currentTime > 1) {
        setTimeRemaining(`${currentTime - 1} min`);
      }
      
      // Update distance
      const currentDistance = parseFloat(distanceRemaining.split(' ')[0]);
      if (currentDistance > 0.1) {
        setDistanceRemaining(`${(currentDistance - 0.1).toFixed(1)} km`);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [timeRemaining, distanceRemaining]);
  
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
        return { color: '#4CAF50', text: t('tracking.busOnTime') };
    }
  };
  
  const statusInfo = getStatusInfo();
  
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
          </Surface>
          
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: busLocation.latitude,
                longitude: busLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              {/* Bus marker */}
              <Marker
                coordinate={busLocation}
                title={t('tracking.busLocation')}
                description={bus.operator}
              >
                <IconButton icon="bus" size={24} color="#1976D2" />
              </Marker>
              
              {/* User location marker */}
              <Marker
                coordinate={userLocation}
                title={t('tracking.currentLocation')}
              >
                <IconButton icon="account" size={24} color="#4CAF50" />
              </Marker>
              
              {/* Destination marker */}
              <Marker
                coordinate={destination}
                title={t('common.destination')}
              >
                <IconButton icon="flag-checkered" size={24} color="#F44336" />
              </Marker>
              
              {/* Route line */}
              <Polyline
                coordinates={[busLocation, destination]}
                strokeColor="#1976D2"
                strokeWidth={3}
              />
            </MapView>
          </View>
          
          <ScrollView style={styles.detailsScrollView}>
            <Surface style={styles.statusContainer}>
              <View style={[styles.statusHeader, rtlStyles]}>
                <Text style={styles.statusTitle}>{t('tracking.liveLocation')}</Text>
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
                onPress={() => {
                  setIsLoading(true);
                  setTimeout(() => setIsLoading(false), 1000);
                }}
              >
                {t('tracking.refreshLocation')}
              </Button>
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
  mapContainer: {
    margin: 16,
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  map: {
    width: '100%',
    height: '100%',
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
});

export default BusTrackingScreen;
