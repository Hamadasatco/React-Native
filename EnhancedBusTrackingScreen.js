import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button, IconButton, ActivityIndicator, Chip, Divider } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import TrafficMapView from '../../components/tracking/TrafficMapView';
import TrafficService from '../../services/traffic/TrafficService';
import NetInfo from '@react-native-community/netinfo';

const EnhancedBusTrackingScreen = ({ route, navigation }) => {
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
  const [trafficInfo, setTrafficInfo] = useState(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  const [showAlternativeRoutes, setShowAlternativeRoutes] = useState(false);
  
  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Simulate bus movement and ETA updates
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
      
      // Update ETA based on traffic
      if (trafficInfo) {
        const delayMinutes = trafficInfo.delayMinutes || 0;
        const baseETA = new Date();
        baseETA.setMinutes(baseETA.getMinutes() + currentTime);
        
        // Add traffic delay
        baseETA.setMinutes(baseETA.getMinutes() + delayMinutes);
        
        // Format time
        const hours = baseETA.getHours();
        const minutes = baseETA.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        
        setEstimatedArrival(`${formattedHours}:${formattedMinutes} ${ampm}`);
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [timeRemaining, distanceRemaining, trafficInfo]);
  
  // Handle traffic updates from the map component
  const handleTrafficUpdate = (data) => {
    setTrafficInfo(data.traffic);
    setAlternativeRoutes(data.alternativeRoutes || []);
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
        return { color: '#4CAF50', text: t('tracking.busOnTime') };
    }
  };
  
  const statusInfo = getStatusInfo();
  
  // Get traffic congestion text
  const getTrafficText = () => {
    if (!trafficInfo) return t('tracking.trafficUnknown');
    
    switch (trafficInfo.congestionLevel) {
      case 'low': return t('tracking.trafficLow');
      case 'moderate': return t('tracking.trafficModerate');
      case 'high': return t('tracking.trafficHigh');
      case 'severe': return t('tracking.trafficSevere');
      default: return t('tracking.trafficUnknown');
    }
  };
  
  // Get traffic congestion color
  const getTrafficColor = () => {
    if (!trafficInfo) return '#757575';
    
    switch (trafficInfo.congestionLevel) {
      case 'low': return '#4CAF50';
      case 'moderate': return '#FFC107';
      case 'high': return '#FF9800';
      case 'severe': return '#F44336';
      default: return '#757575';
    }
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
          </Surface>
          
          <TrafficMapView
            style={styles.mapContainer}
            busLocation={busLocation}
            destination={destination}
            userLocation={userLocation}
            onTrafficUpdate={handleTrafficUpdate}
          />
          
          <ScrollView style={styles.detailsScrollView}>
            <Surface style={styles.statusContainer}>
              <View style={[styles.statusHeader, rtlStyles]}>
                <Text style={styles.statusTitle}>{t('tracking.liveLocation')}</Text>
                <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                  <Text style={styles.statusText}>{statusInfo.text}</Text>
                </View>
              </View>
              
              {/* Traffic information */}
              <View style={[styles.trafficInfo, rtlStyles]}>
                <Text style={styles.trafficLabel}>{t('tracking.trafficConditions')}</Text>
                <Chip 
                  icon="traffic-light" 
                  style={[styles.trafficChip, { backgroundColor: getTrafficColor() }]}
                >
                  {getTrafficText()}
                </Chip>
              </View>
              
              {trafficInfo && trafficInfo.delayMinutes > 0 && (
                <View style={styles.delayInfo}>
                  <IconButton icon="clock-alert" size={20} color="#F44336" />
                  <Text style={styles.delayText}>
                    {t('tracking.delayDueToTraffic', { minutes: trafficInfo.delayMinutes })}
                  </Text>
                </View>
              )}
              
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
              
              {/* Alternative routes section */}
              {alternativeRoutes.length > 0 && (
                <View style={styles.alternativesSection}>
                  <Button
                    mode="outlined"
                    icon={showAlternativeRoutes ? "chevron-up" : "chevron-down"}
                    onPress={() => setShowAlternativeRoutes(!showAlternativeRoutes)}
                    style={styles.alternativesButton}
                  >
                    {t('tracking.alternativeRoutes')} ({alternativeRoutes.length})
                  </Button>
                  
                  {showAlternativeRoutes && (
                    <View style={styles.alternativesList}>
                      {alternativeRoutes.map((route, index) => (
                        <Surface key={`route-${index}`} style={styles.alternativeRoute}>
                          <Text style={styles.alternativeTitle}>
                            {t('tracking.alternativeRoute')} {index + 1}
                          </Text>
                          <Text style={styles.alternativeSummary}>{route.summary}</Text>
                          <View style={styles.alternativeDetails}>
                            <Text>
                              {t('tracking.distance')}: {route.distance.text}
                            </Text>
                            <Text>
                              {t('tracking.duration')}: {route.duration.text}
                            </Text>
                            {route.durationInTraffic && (
                              <Text style={{ color: '#F44336' }}>
                                {t('tracking.withTraffic')}: {route.durationInTraffic.text}
                              </Text>
                            )}
                          </View>
                        </Surface>
                      ))}
                    </View>
                  )}
                </View>
              )}
              
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
              
              {/* Traffic incidents section */}
              <Divider style={styles.divider} />
              <Text style={[styles.incidentsTitle, rtlStyles]}>{t('tracking.trafficIncidents')}</Text>
              
              {trafficInfo && trafficInfo.incidents && trafficInfo.incidents.length > 0 ? (
                trafficInfo.incidents.map((incident, index) => (
                  <View key={`incident-${index}`} style={styles.incidentItem}>
                    <IconButton 
                      icon={incident.type === 'accident' ? 'car-crash' : 'alert-circle'} 
                      size={20} 
                      color="#F44336" 
                    />
                    <View style={styles.incidentDetails}>
                      <Text style={styles.incidentType}>{incident.type}</Text>
                      <Text style={styles.incidentDescription}>{incident.description}</Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.noIncidentsText}>{t('tracking.noIncidentsReported')}</Text>
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
  mapContainer: {
    margin: 16,
    height: 250,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
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
  trafficInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trafficLabel: {
    fontSize: 14,
    color: '#666',
  },
  trafficChip: {
    height: 30,
  },
  delayInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    padding: 8,
    borderRadius: 4,
  },
  delayText: {
    color: '#F44336',
    flex: 1,
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
  alternativesSection: {
    marginBottom: 16,
  },
  alternativesButton: {
    marginBottom: 8,
  },
  alternativesList: {
    marginTop: 8,
  },
  alternativeRoute: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1,
  },
  alternativeTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  alternativeSummary: {
    marginBottom: 8,
    color: '#666',
  },
  alternativeDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
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
  divider: {
    marginVertical: 16,
  },
  incidentsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  incidentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'rgba(244, 67, 54, 0.05)',
    borderRadius: 4,
    padding: 4,
  },
  incidentDetails: {
    flex: 1,
  },
  incidentType: {
    fontWeight: 'bold',
  },
  incidentDescription: {
    fontSize: 12,
    color: '#666',
  },
  noIncidentsText: {
    fontStyle: 'italic',
    color: '#666',
  },
});

export default EnhancedBusTrackingScreen;
