import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button, Divider, List, IconButton, Chip, Searchbar, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const TripsHistoryScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // State for trips
  const [trips, setTrips] = useState([]);
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock trip data
  const mockTrips = [
    {
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
        }
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
        busType: 'Luxury'
      },
      seat: {
        number: '14A',
        type: 'window'
      },
      payment: {
        amount: 45.99,
        currency: 'USD',
        method: 'Credit Card',
        transactionId: 'TX987654',
        status: 'completed'
      },
      createdAt: '2025-05-20T14:30:00Z'
    },
    {
      id: 'trip2',
      bookingId: 'BK12346',
      status: 'completed',
      route: {
        origin: {
          name: 'Chicago',
          address: 'Union Station',
          coordinates: {
            latitude: 41.8781,
            longitude: -87.6298
          }
        },
        destination: {
          name: 'Detroit',
          address: 'Transit Center',
          coordinates: {
            latitude: 42.3314,
            longitude: -83.0458
          }
        }
      },
      schedule: {
        departureDate: '2025-05-10',
        departureTime: '10:15',
        arrivalDate: '2025-05-10',
        arrivalTime: '14:30',
        duration: '4h 15m'
      },
      bus: {
        id: 'bus456',
        operator: 'Midwest Transit',
        busNumber: 'MT-123',
        busType: 'Standard'
      },
      seat: {
        number: '22B',
        type: 'aisle'
      },
      payment: {
        amount: 35.50,
        currency: 'USD',
        method: 'PayPal',
        transactionId: 'TX987655',
        status: 'completed'
      },
      rating: {
        score: 4,
        review: 'Good service, comfortable seats.',
        date: '2025-05-11T09:45:00Z'
      },
      createdAt: '2025-05-01T11:20:00Z'
    },
    {
      id: 'trip3',
      bookingId: 'BK12347',
      status: 'canceled',
      route: {
        origin: {
          name: 'Los Angeles',
          address: 'Union Station',
          coordinates: {
            latitude: 34.0522,
            longitude: -118.2437
          }
        },
        destination: {
          name: 'San Francisco',
          address: 'Transbay Terminal',
          coordinates: {
            latitude: 37.7749,
            longitude: -122.4194
          }
        }
      },
      schedule: {
        departureDate: '2025-04-25',
        departureTime: '07:00',
        arrivalDate: '2025-04-25',
        arrivalTime: '14:30',
        duration: '7h 30m'
      },
      bus: {
        id: 'bus789',
        operator: 'Pacific Coast Lines',
        busNumber: 'PCL-456',
        busType: 'Premium'
      },
      seat: {
        number: '5C',
        type: 'window'
      },
      payment: {
        amount: 65.75,
        currency: 'USD',
        method: 'Credit Card',
        transactionId: 'TX987656',
        status: 'refunded'
      },
      createdAt: '2025-04-15T16:45:00Z'
    }
  ];
  
  // Load trips on mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTrips(mockTrips);
      setFilteredTrips(mockTrips);
      setIsLoading(false);
    }, 1000);
  }, []);
  
  // Handle filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      setFilteredTrips(trips);
    } else {
      const filtered = trips.filter(trip => trip.status === filter);
      setFilteredTrips(filtered);
    }
  };
  
  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      // If search is empty, just apply the current filter
      handleFilterChange(activeFilter);
      return;
    }
    
    // Filter by the current status filter and search query
    let filtered = trips;
    if (activeFilter !== 'all') {
      filtered = filtered.filter(trip => trip.status === activeFilter);
    }
    
    // Then apply search filter
    const lowercaseQuery = query.toLowerCase();
    filtered = filtered.filter(trip => 
      trip.bookingId.toLowerCase().includes(lowercaseQuery) ||
      trip.route.origin.name.toLowerCase().includes(lowercaseQuery) ||
      trip.route.destination.name.toLowerCase().includes(lowercaseQuery) ||
      trip.schedule.departureDate.includes(lowercaseQuery)
    );
    
    setFilteredTrips(filtered);
  };
  
  // Handle view trip details
  const handleViewTripDetails = (tripId) => {
    navigation.navigate('TripDetail', { tripId });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
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
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  return (
    <View style={styles.container}>
      <Surface style={styles.headerContainer}>
        <Text style={[styles.headerTitle, rtlStyles]}>{t('trips.myTrips')}</Text>
        
        <Searchbar
          placeholder={t('trips.searchTrips')}
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContainer}
        >
          <Chip
            selected={activeFilter === 'all'}
            onPress={() => handleFilterChange('all')}
            style={[styles.filterChip, activeFilter === 'all' && styles.activeFilterChip]}
            textStyle={activeFilter === 'all' && styles.activeFilterText}
          >
            {t('trips.allTrips')}
          </Chip>
          
          <Chip
            selected={activeFilter === 'upcoming'}
            onPress={() => handleFilterChange('upcoming')}
            style={[styles.filterChip, activeFilter === 'upcoming' && styles.activeFilterChip]}
            textStyle={activeFilter === 'upcoming' && styles.activeFilterText}
          >
            {t('trips.upcoming')}
          </Chip>
          
          <Chip
            selected={activeFilter === 'completed'}
            onPress={() => handleFilterChange('completed')}
            style={[styles.filterChip, activeFilter === 'completed' && styles.activeFilterChip]}
            textStyle={activeFilter === 'completed' && styles.activeFilterText}
          >
            {t('trips.completed')}
          </Chip>
          
          <Chip
            selected={activeFilter === 'canceled'}
            onPress={() => handleFilterChange('canceled')}
            style={[styles.filterChip, activeFilter === 'canceled' && styles.activeFilterChip]}
            textStyle={activeFilter === 'canceled' && styles.activeFilterText}
          >
            {t('trips.canceled')}
          </Chip>
        </ScrollView>
      </Surface>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={styles.loadingText}>{t('trips.loading')}</Text>
        </View>
      ) : filteredTrips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <IconButton icon="bus-stop" size={48} color="#9E9E9E" />
          <Text style={styles.emptyTitle}>{t('trips.noTripsFound')}</Text>
          <Text style={styles.emptyDescription}>{t('trips.noTripsDescription')}</Text>
        </View>
      ) : (
        <ScrollView style={styles.tripsContainer}>
          {filteredTrips.map((trip) => (
            <Surface key={trip.id} style={styles.tripCard}>
              <View style={[styles.tripHeader, rtlStyles]}>
                <View style={styles.tripInfo}>
                  <Text style={styles.tripId}>{t('trips.booking')}: {trip.bookingId}</Text>
                  <Text style={styles.tripDate}>{formatDate(trip.schedule.departureDate)}</Text>
                </View>
                
                <Chip
                  style={[styles.statusChip, { backgroundColor: getStatusColor(trip.status) + '20' }]}
                  textStyle={{ color: getStatusColor(trip.status) }}
                >
                  {getStatusText(trip.status)}
                </Chip>
              </View>
              
              <View style={styles.routeContainer}>
                <View style={styles.routeTimeColumn}>
                  <Text style={styles.departureTime}>{trip.schedule.departureTime}</Text>
                  <View style={styles.routeTimeLine}>
                    <View style={styles.routeTimeCircle} />
                    <View style={styles.routeTimeDash} />
                    <View style={styles.routeTimeCircle} />
                  </View>
                  <Text style={styles.arrivalTime}>{trip.schedule.arrivalTime}</Text>
                </View>
                
                <View style={styles.routeDetailsColumn}>
                  <View style={styles.routePoint}>
                    <Text style={styles.routeCity}>{trip.route.origin.name}</Text>
                    <Text style={styles.routeAddress}>{trip.route.origin.address}</Text>
                  </View>
                  
                  <View style={styles.routeDuration}>
                    <Text style={styles.durationText}>{trip.schedule.duration}</Text>
                  </View>
                  
                  <View style={styles.routePoint}>
                    <Text style={styles.routeCity}>{trip.route.destination.name}</Text>
                    <Text style={styles.routeAddress}>{trip.route.destination.address}</Text>
                  </View>
                </View>
              </View>
              
              <Divider style={styles.divider} />
              
              <View style={[styles.tripFooter, rtlStyles]}>
                <View style={styles.tripDetails}>
                  <Text style={styles.busInfo}>
                    {trip.bus.operator} • {t('trips.seat')} {trip.seat.number}
                  </Text>
                  <Text style={styles.paymentInfo}>
                    {trip.payment.amount} {trip.payment.currency}
                  </Text>
                </View>
                
                <Button
                  mode="contained"
                  onPress={() => handleViewTripDetails(trip.id)}
                  style={styles.viewButton}
                >
                  {t('trips.viewDetails')}
                </Button>
              </View>
            </Surface>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    padding: 16,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBar: {
    marginBottom: 16,
    elevation: 0,
    backgroundColor: '#EEEEEE',
  },
  filtersContainer: {
    paddingBottom: 8,
  },
  filterChip: {
    marginRight: 8,
    backgroundColor: '#EEEEEE',
  },
  activeFilterChip: {
    backgroundColor: '#1976D2',
  },
  activeFilterText: {
    color: 'white',
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  tripsContainer: {
    flex: 1,
    padding: 16,
  },
  tripCard: {
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
  },
  tripInfo: {
    flex: 1,
  },
  tripId: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  tripDate: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  statusChip: {
    height: 28,
  },
  routeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  routeTimeColumn: {
    width: 50,
    alignItems: 'center',
  },
  departureTime: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  arrivalTime: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  routeTimeLine: {
    flex: 1,
    alignItems: 'center',
    marginVertical: 4,
  },
  routeTimeCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1976D2',
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
    marginBottom: 4,
  },
  routeCity: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  routeAddress: {
    fontSize: 12,
    color: '#666',
  },
  routeDuration: {
    alignItems: 'center',
    marginVertical: 8,
  },
  durationText: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: 'bold',
  },
  divider: {
    marginHorizontal: 16,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 12,
  },
  tripDetails: {
    flex: 1,
  },
  busInfo: {
    fontSize: 12,
  },
  paymentInfo: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 2,
  },
  viewButton: {
    backgroundColor: '#1976D2',
  },
});

export default TripsHistoryScreen;
