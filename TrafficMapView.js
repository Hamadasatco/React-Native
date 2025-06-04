import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface, IconButton, ActivityIndicator } from 'react-native-paper';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import TrafficService from '../../services/traffic/TrafficService';
import NetInfo from '@react-native-community/netinfo';

const TrafficMapView = ({ 
  busLocation, 
  destination, 
  userLocation,
  onTrafficUpdate,
  style 
}) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const [trafficEnabled, setTrafficEnabled] = useState(true);
  const [trafficData, setTrafficData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [alternativeRoutes, setAlternativeRoutes] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [isConnected, setIsConnected] = useState(true);
  
  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });
    
    return () => unsubscribe();
  }, []);
  
  // Fetch traffic data when bus location changes
  useEffect(() => {
    if (!busLocation || !destination || !isConnected) return;
    
    const fetchTrafficData = async () => {
      try {
        setIsLoading(true);
        
        // Get traffic along the route
        const traffic = await TrafficService.getTrafficAlongRoute(
          busLocation,
          destination
        );
        
        setTrafficData(traffic);
        
        // Get traffic incidents
        const incidentsData = await TrafficService.getTrafficIncidents(busLocation);
        setIncidents(incidentsData);
        
        // Get alternative routes if there's significant delay
        if (traffic.delayMinutes > 10) {
          const routes = await TrafficService.getAlternativeRoutes(
            busLocation,
            destination
          );
          setAlternativeRoutes(routes);
        } else {
          setAlternativeRoutes([]);
        }
        
        // Notify parent component about traffic update
        if (onTrafficUpdate) {
          onTrafficUpdate({
            traffic,
            incidents: incidentsData,
            alternativeRoutes: traffic.delayMinutes > 10 ? routes : []
          });
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching traffic data:', err);
        setError(t('errors.trafficDataFailed'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrafficData();
    
    // Set up interval to refresh traffic data every 2 minutes
    const intervalId = setInterval(fetchTrafficData, 120000);
    
    return () => clearInterval(intervalId);
  }, [busLocation, destination, isConnected, t, onTrafficUpdate]);
  
  // Get color for traffic congestion level
  const getTrafficColor = (level) => {
    switch (level) {
      case 'low': return '#4CAF50'; // Green
      case 'moderate': return '#FFC107'; // Yellow
      case 'high': return '#FF9800'; // Orange
      case 'severe': return '#F44336'; // Red
      default: return '#4CAF50';
    }
  };
  
  // Get icon for incident type
  const getIncidentIcon = (type) => {
    switch (type) {
      case 'accident': return 'car-crash';
      case 'construction': return 'hammer';
      case 'closure': return 'road-closed';
      default: return 'alert-circle';
    }
  };
  
  return (
    <View style={[styles.container, style]}>
      {isLoading && !trafficData && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>{t('common.loadingTraffic')}</Text>
        </View>
      )}
      
      {error && (
        <Surface style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </Surface>
      )}
      
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsTraffic={trafficEnabled}
        initialRegion={{
          latitude: busLocation?.latitude || 0,
          longitude: busLocation?.longitude || 0,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        region={{
          latitude: busLocation?.latitude || 0,
          longitude: busLocation?.longitude || 0,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Bus marker */}
        {busLocation && (
          <Marker
            coordinate={busLocation}
            title={t('tracking.busLocation')}
          >
            <IconButton icon="bus" size={24} color="#1976D2" />
          </Marker>
        )}
        
        {/* Destination marker */}
        {destination && (
          <Marker
            coordinate={destination}
            title={t('common.destination')}
          >
            <IconButton icon="flag-checkered" size={24} color="#F44336" />
          </Marker>
        )}
        
        {/* User location marker */}
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title={t('tracking.currentLocation')}
          >
            <IconButton icon="account" size={24} color="#4CAF50" />
          </Marker>
        )}
        
        {/* Main route with traffic coloring */}
        {busLocation && destination && trafficData && (
          <Polyline
            coordinates={[busLocation, destination]}
            strokeColor={getTrafficColor(trafficData.congestionLevel)}
            strokeWidth={5}
          />
        )}
        
        {/* Alternative routes */}
        {alternativeRoutes.map((route, index) => (
          <Polyline
            key={`alt-route-${index}`}
            coordinates={route.polyline.points.map(point => ({
              latitude: point.lat,
              longitude: point.lng
            }))}
            strokeColor="#2196F3" // Blue
            strokeWidth={3}
            strokeDashPattern={[5, 5]} // Dashed line
          />
        ))}
        
        {/* Traffic incidents */}
        {incidents.map(incident => (
          <Marker
            key={incident.id}
            coordinate={incident.location}
            title={incident.type}
            description={incident.description}
          >
            <IconButton 
              icon={getIncidentIcon(incident.type)} 
              size={20} 
              color="#F44336" 
            />
          </Marker>
        ))}
      </MapView>
      
      {/* Traffic toggle button */}
      <View style={styles.trafficToggle}>
        <IconButton
          icon={trafficEnabled ? 'layers' : 'layers-off'}
          size={24}
          color="#1976D2"
          onPress={() => setTrafficEnabled(!trafficEnabled)}
        />
      </View>
      
      {/* Traffic legend */}
      {trafficEnabled && (
        <View style={styles.legendContainer}>
          <Text style={styles.legendTitle}>{t('tracking.trafficLegend')}</Text>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
            <Text>{t('tracking.trafficLow')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FFC107' }]} />
            <Text>{t('tracking.trafficModerate')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#FF9800' }]} />
            <Text>{t('tracking.trafficHigh')}</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: '#F44336' }]} />
            <Text>{t('tracking.trafficSevere')}</Text>
          </View>
        </View>
      )}
      
      {/* Connection status indicator */}
      {!isConnected && (
        <View style={styles.offlineIndicator}>
          <Text style={styles.offlineText}>{t('common.offline')}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 300,
    borderRadius: 8,
    overflow: 'hidden',
    position: 'relative',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  loadingText: {
    marginTop: 8,
    fontSize: 14,
  },
  errorContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(244, 67, 54, 0.8)',
    zIndex: 2,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
  trafficToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 2,
  },
  legendContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 4,
    elevation: 2,
  },
  legendTitle: {
    fontWeight: 'bold',
    marginBottom: 4,
    fontSize: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  legendColor: {
    width: 12,
    height: 12,
    marginRight: 4,
    borderRadius: 2,
  },
  offlineIndicator: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  offlineText: {
    color: 'white',
    fontSize: 12,
  },
});

export default TrafficMapView;
