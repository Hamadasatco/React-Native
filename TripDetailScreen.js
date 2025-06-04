import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Surface, Button, Divider, List, IconButton, Chip, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const TripDetailScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Get trip ID from route params
  const { tripId } = route.params || { tripId: null };
  
  // State for trip details
  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock trip data - in a real app, this would come from an API call
  const mockTrip = {
    id: 'trip1',
    bookingId: 'BK12345',
    status: 'upcoming',
    route: {
      origin: {
        name: 'New York',
        address: 'Port Authority Bus Terminal',
        coordinates: {
          latitude: 40.7577,
          longitude: -73.9857
        }
      },
      destination: {
        name: 'Boston',
        address: 'South Station',
        coordinates: {
          latitude: 42.3519,
          longitude: -71.0551
        }
      },
      stops: [
        {
          name: 'Hartford',
          address: 'Union Station',
          coordinates: {
            latitude: 41.7658,
            longitude: -72.6734
          },
          arrivalTime: '10:15',
          departureTime: '10:25'
        }
      ]
    },
    schedule: {
      departureDate: '2025-06-15',
      departureTime: '08:30',
      arrivalDate: '2025-06-15',
      arrivalTime: '12:45',
      duration: '4h 15m'
    },
    bus: {
      id: 'bus123',
      operator: 'Express Lines',
      busNumber: 'EL-789',
      busType: 'Luxury',
      amenities: ['WiFi', 'Power Outlets', 'Air Conditioning', 'Restroom']
    },
    seat: {
      number: '14A',
      type: 'window',
      deck: 'Upper'
    },
    passenger: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567'
    },
    payment: {
      amount: 45.99,
      currency: 'USD',
      method: 'Credit Card',
      cardNumber: '****4567',
      transactionId: 'TX987654',
      status: 'completed',
      date: '2025-05-20T14:30:00Z'
    },
    createdAt: '2025-05-20T14:30:00Z',
    updatedAt: '2025-05-20T14:30:00Z'
  };
  
  // Load trip details on mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTrip(mockTrip);
      setIsLoading(false);
    }, 1000);
  }, [tripId]);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return '#1976D2'; // Blue
      case 'completed':
        return '#2E7D32'; // Green
      case 'canceled':
        return '#D32F2F'; // Red
      default:
        return '#757575'; // Grey
    }
  };
  
  // Get status text
  const getStatusText = (status) => {
    return t(`trips.status.${status}`);
  };
  
  // Handle download ticket
  const handleDownloadTicket = () => {
    // In a real app, this would download the ticket
    console.log('Downloading ticket...');
  };
  
  // Handle share trip
  const handleShareTrip = () => {
    // In a real app, this would open a share dialog
    console.log('Sharing trip...');
  };
  
  // Handle cancel trip
  const handleCancelTrip = () => {
    // In a real app, this would open a confirmation dialog
    console.log('Canceling trip...');
  };
  
  // Handle track bus
  const handleTrackBus = () => {
    navigation.navigate('BusTracking', { tripId });
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1976D2" />
        <Text style={styles.loadingText}>{t('trips.loadingDetails')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.headerContainer}>
        <View style={[styles.headerTop, rtlStyles]}>
          <View style={styles.headerInfo}>
            <Text style={styles.bookingId}>{t('trips.booking')}: {trip.bookingId}</Text>
            <Chip
              style={[styles.statusChip, { backgroundColor: getStatusColor(trip.status) + '20' }]}
              textStyle={{ color: getStatusColor(trip.status) }}
            >
              {getStatusText(trip.status)}
            </Chip>
          </View>
        </View>
        
        <View style={styles.routeContainer}>
          <View style={styles.routeTimeColumn}>
            <Text style={styles.departureTime}>{trip.schedule.departureTime}</Text>
            <View style={styles.routeTimeLine}>
              <View style={styles.routeTimeCircle} />
              <View style={styles.routeTimeDash} />
              {trip.route.stops && trip.route.stops.map((stop, index) => (
                <React.Fragment key={index}>
                  <View style={styles.routeTimeStopCircle} />
                  <View style={styles.routeTimeDash} />
                </React.Fragment>
              ))}
              <View style={styles.routeTimeCircle} />
            </View>
            <Text style={styles.arrivalTime}>{trip.schedule.arrivalTime}</Text>
          </View>
          
          <View style={styles.routeDetailsColumn}>
            <View style={styles.routePoint}>
              <Text style={styles.routeCity}>{trip.route.origin.name}</Text>
              <Text style={styles.routeAddress}>{trip.route.origin.address}</Text>
              <Text style={styles.routeDate}>{formatDate(trip.schedule.departureDate)}</Text>
            </View>
            
            {trip.route.stops && trip.route.stops.map((stop, index) => (
              <View key={index} style={styles.routeStop}>
                <Text style={styles.routeStopCity}>{stop.name}</Text>
                <Text style={styles.routeStopAddress}>{stop.address}</Text>
                <Text style={styles.routeStopTime}>
                  {stop.arrivalTime} - {stop.departureTime}
                </Text>
              </View>
            ))}
            
            <View style={styles.routePoint}>
              <Text style={styles.routeCity}>{trip.route.destination.name}</Text>
              <Text style={styles.routeAddress}>{trip.route.destination.address}</Text>
              <Text style={styles.routeDate}>{formatDate(trip.schedule.arrivalDate)}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.durationContainer}>
          <IconButton icon="clock-outline" size={20} color="#1976D2" />
          <Text style={styles.durationText}>
            {t('trips.totalDuration')}: {trip.schedule.duration}
          </Text>
        </View>
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('trips.busDetails')}</Text>
        
        <View style={[styles.busDetailsRow, rtlStyles]}>
          <View style={styles.busDetailsColumn}>
            <Text style={styles.busDetailLabel}>{t('trips.operator')}</Text>
            <Text style={styles.busDetailValue}>{trip.bus.operator}</Text>
          </View>
          
          <View style={styles.busDetailsColumn}>
            <Text style={styles.busDetailLabel}>{t('trips.busNumber')}</Text>
            <Text style={styles.busDetailValue}>{trip.bus.busNumber}</Text>
          </View>
          
          <View style={styles.busDetailsColumn}>
            <Text style={styles.busDetailLabel}>{t('trips.busType')}</Text>
            <Text style={styles.busDetailValue}>{trip.bus.busType}</Text>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <Text style={[styles.amenitiesTitle, rtlStyles]}>{t('trips.amenities')}</Text>
        
        <View style={styles.amenitiesContainer}>
          {trip.bus.amenities.map((amenity, index) => (
            <Chip key={index} style={styles.amenityChip}>
              {amenity}
            </Chip>
          ))}
        </View>
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('trips.seatInfo')}</Text>
        
        <View style={[styles.seatInfoRow, rtlStyles]}>
          <View style={styles.seatInfoColumn}>
            <Text style={styles.seatInfoLabel}>{t('trips.seatNumber')}</Text>
            <Text style={styles.seatInfoValue}>{trip.seat.number}</Text>
          </View>
          
          <View style={styles.seatInfoColumn}>
            <Text style={styles.seatInfoLabel}>{t('trips.seatType')}</Text>
            <Text style={styles.seatInfoValue}>{t(`trips.seatTypes.${trip.seat.type}`)}</Text>
          </View>
          
          <View style={styles.seatInfoColumn}>
            <Text style={styles.seatInfoLabel}>{t('trips.deck')}</Text>
            <Text style={styles.seatInfoValue}>{trip.seat.deck}</Text>
          </View>
        </View>
        
        <View style={styles.seatMapContainer}>
          <Text style={[styles.seatMapTitle, rtlStyles]}>{t('trips.seatMap')}</Text>
          <Image
            source={require('../../assets/images/seat_map_placeholder.png')}
            style={styles.seatMap}
            resizeMode="contain"
          />
        </View>
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('trips.passengerDetails')}</Text>
        
        <List.Item
          title={trip.passenger.name}
          description={t('trips.primaryPassenger')}
          left={props => <List.Icon {...props} icon="account" />}
        />
        
        <Divider style={styles.divider} />
        
        <List.Item
          title={trip.passenger.email}
          description={t('trips.email')}
          left={props => <List.Icon {...props} icon="email" />}
        />
        
        <Divider style={styles.divider} />
        
        <List.Item
          title={trip.passenger.phone}
          description={t('trips.phone')}
          left={props => <List.Icon {...props} icon="phone" />}
        />
      </Surface>
      
      <Surface style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, rtlStyles]}>{t('trips.paymentInfo')}</Text>
        
        <View style={[styles.paymentRow, rtlStyles]}>
          <Text style={styles.paymentLabel}>{t('trips.amount')}</Text>
          <Text style={styles.paymentValue}>
            {trip.payment.amount} {trip.payment.currency}
          </Text>
        </View>
        
        <View style={[styles.paymentRow, rtlStyles]}>
          <Text style={styles.paymentLabel}>{t('trips.paymentMethod')}</Text>
          <Text style={styles.paymentValue}>{trip.payment.method}</Text>
        </View>
        
        {trip.payment.cardNumber && (
          <View style={[styles.paymentRow, rtlStyles]}>
            <Text style={styles.paymentLabel}>{t('trips.cardNumber')}</Text>
            <Text style={styles.paymentValue}>{trip.payment.cardNumber}</Text>
          </View>
        )}
        
        <View style={[styles.paymentRow, rtlStyles]}>
          <Text style={styles.paymentLabel}>{t('trips.transactionId')}</Text>
          <Text style={styles.paymentValue}>{trip.payment.transactionId}</Text>
        </View>
        
        <View style={[styles.paymentRow, rtlStyles]}>
          <Text style={styles.paymentLabel}>{t('trips.paymentStatus')}</Text>
          <Chip
            style={[
              styles.paymentStatusChip,
              { backgroundColor: trip.payment.status === 'completed' ? '#E8F5E9' : '#FFEBEE' }
            ]}
            textStyle={{
              color: trip.payment.status === 'completed' ? '#2E7D32' : '#D32F2F'
            }}
          >
            {t(`trips.paymentStatus.${trip.payment.status}`)}
          </Chip>
        </View>
        
        <View style={[styles.paymentRow, rtlStyles]}>
          <Text style={styles.paymentLabel}>{t('trips.paymentDate')}</Text>
          <Text style={styles.paymentValue}>{formatDate(trip.payment.date)}</Text>
        </View>
      </Surface>
      
      <View style={styles.actionsContainer}>
        {trip.status === 'upcoming' && (
          <>
            <Button
              mode="contained"
              icon="map-marker"
              onPress={handleTrackBus}
              style={[styles.actionButton, styles.trackButton]}
            >
              {t('trips.trackBus')}
            </Button>
            
            <Button
              mode="contained"
              icon="ticket"
              onPress={handleDownloadTicket}
              style={[styles.actionButton, styles.ticketButton]}
            >
              {t('trips.downloadTicket')}
            </Button>
            
            <Button
              mode="outlined"
              icon="share"
              onPress={handleShareTrip}
              style={styles.actionButton}
            >
              {t('trips.shareTrip')}
            </Button>
            
            <Button
              mode="outlined"
              icon="cancel"
              onPress={handleCancelTrip}
              style={[styles.actionButton, styles.cancelButton]}
              labelStyle={styles.cancelButtonLabel}
            >
              {t('trips.cancelTrip')}
            </Button>
          </>
        )}
        
        {trip.status === 'completed' && (
          <>
            <Button
              mode="contained"
              icon="ticket"
              onPress={handleDownloadTicket}
              style={[styles.actionButton, styles.ticketButton]}
            >
              {t('trips.downloadTicket')}
            </Button>
            
            <Button
              mode="outlined"
              icon="share"
              onPress={handleShareTrip}
              style={styles.actionButton}
            >
              {t('trips.shareTrip')}
            </Button>
            
            <Button
              mode="outlined"
              icon="star"
              onPress={() => navigation.navigate('TripRating', { tripId })}
              style={styles.actionButton}
            >
              {t('trips.rateTrip')}
            </Button>
          </>
        )}
        
        {trip.status === 'canceled' && (
          <>
            <Button
              mode="outlined"
              icon="share"
              onPress={handleShareTrip}
              style={styles.actionButton}
            >
              {t('trips.shareTrip')}
            </Button>
            
            <Button
              mode="contained"
              icon="refresh"
              onPress={() => {}}
              style={[styles.actionButton, styles.rebookButton]}
            >
              {t('trips.rebookTrip')}
            </Button>
          </>
        )}
      </View>
    </ScrollView>
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
    color: '#666',
  },
  headerContainer: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  routeContainer: {
    flexDirection: 'row',
  },
  routeTimeColumn: {
    width: 50,
    alignItems: 'center',
  },
  departureTime: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  arrivalTime: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  routeTimeLine: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 4,
  },
  routeTimeCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1976D2',
  },
  routeTimeStopCircle: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#90CAF9',
  },
  routeTimeDash: {
    width: 1,
    flex: 1,
    backgroundColor: '#1976D2',
    marginVertical: 2,
  },
  routeDetailsColumn: {
    flex: 1,
    marginLeft: 8,
  },
  routePoint: {
    marginBottom: 16,
  },
  routeCity: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  routeAddress: {
    fontSize: 14,
    color: '#666',
  },
  routeDate: {
    fontSize: 12,
    color: '#1976D2',
    marginTop: 4,
  },
  routeStop: {
    marginBottom: 16,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#E0E0E0',
  },
  routeStopCity: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  routeStopAddress: {
    fontSize: 12,
    color: '#666',
  },
  routeStopTime: {
    fontSize: 12,
    color: '#1976D2',
    marginTop: 2,
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  durationText: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: 'bold',
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
    marginBottom: 16,
  },
  busDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  busDetailsColumn: {
    flex: 1,
  },
  busDetailLabel: {
    fontSize: 12,
    color: '#666',
  },
  busDetailValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  amenitiesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityChip: {
    margin: 4,
  },
  seatInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  seatInfoColumn: {
    flex: 1,
  },
  seatInfoLabel: {
    fontSize: 12,
    color: '#666',
  },
  seatInfoValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  seatMapContainer: {
    marginTop: 16,
  },
  seatMapTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  seatMap: {
    width: '100%',
    height: 150,
    backgroundColor: '#E0E0E0',
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#666',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  paymentStatusChip: {
    height: 28,
  },
  actionsContainer: {
    margin: 16,
    marginBottom: 24,
  },
  actionButton: {
    marginBottom: 12,
  },
  trackButton: {
    backgroundColor: '#1976D2',
  },
  ticketButton: {
    backgroundColor: '#2E7D32',
  },
  rebookButton: {
    backgroundColor: '#1976D2',
  },
  cancelButton: {
    borderColor: '#D32F2F',
  },
  cancelButtonLabel: {
    color: '#D32F2F',
  },
});

export default TripDetailScreen;
