import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Card, Button, Chip, Divider, Surface, Searchbar } from 'react-native-paper';

const BusListScreen = ({ route, navigation }) => {
  const { searchParams } = route.params || { 
    searchParams: { from: 'New York', to: 'Boston', date: '06/15/2025' } 
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('departure'); // departure, price, duration
  
  // Mock data for bus list
  const [buses] = useState([
    {
      id: '1',
      operator: 'Express Lines',
      departure: '08:00 AM',
      arrival: '12:30 PM',
      duration: '4h 30m',
      price: 45.99,
      available_seats: 23,
      amenities: ['WiFi', 'AC', 'Power Outlets'],
      rating: 4.5,
    },
    {
      id: '2',
      operator: 'City Connect',
      departure: '09:15 AM',
      arrival: '01:45 PM',
      duration: '4h 30m',
      price: 39.99,
      available_seats: 15,
      amenities: ['WiFi', 'AC', 'Snacks'],
      rating: 4.2,
    },
    {
      id: '3',
      operator: 'Luxury Travel',
      departure: '10:30 AM',
      arrival: '02:30 PM',
      duration: '4h 00m',
      price: 59.99,
      available_seats: 8,
      amenities: ['WiFi', 'AC', 'Power Outlets', 'Entertainment', 'Reclining Seats'],
      rating: 4.8,
    },
    {
      id: '4',
      operator: 'Budget Bus',
      departure: '11:45 AM',
      arrival: '04:15 PM',
      duration: '4h 30m',
      price: 29.99,
      available_seats: 30,
      amenities: ['AC'],
      rating: 3.9,
    },
    {
      id: '5',
      operator: 'Night Rider',
      departure: '11:00 PM',
      arrival: '03:00 AM',
      duration: '4h 00m',
      price: 35.99,
      available_seats: 25,
      amenities: ['WiFi', 'AC', 'Blankets'],
      rating: 4.0,
    },
  ]);

  const filteredBuses = buses.filter(bus => 
    bus.operator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedBuses = [...filteredBuses].sort((a, b) => {
    if (sortBy === 'price') {
      return a.price - b.price;
    } else if (sortBy === 'duration') {
      return a.duration.localeCompare(b.duration);
    } else {
      // Default sort by departure time
      return a.departure.localeCompare(b.departure);
    }
  });

  const renderBusItem = ({ item }) => (
    <Card style={styles.busCard}>
      <Card.Content>
        <View style={styles.busHeader}>
          <Text style={styles.operatorName}>{item.operator}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>★ {item.rating}</Text>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.timeContainer}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Departure</Text>
            <Text style={styles.timeValue}>{item.departure}</Text>
          </View>
          
          <View style={styles.durationContainer}>
            <Text style={styles.durationText}>{item.duration}</Text>
            <View style={styles.durationLine}>
              <View style={styles.durationDot}></View>
              <View style={styles.durationDot}></View>
            </View>
          </View>
          
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Arrival</Text>
            <Text style={styles.timeValue}>{item.arrival}</Text>
          </View>
        </View>
        
        <View style={styles.amenitiesContainer}>
          {item.amenities.map((amenity, index) => (
            <Chip key={index} style={styles.amenityChip} textStyle={styles.amenityText}>
              {amenity}
            </Chip>
          ))}
        </View>
        
        <View style={styles.bottomContainer}>
          <View>
            <Text style={styles.seatsText}>{item.available_seats} seats available</Text>
            <Text style={styles.priceText}>${item.price.toFixed(2)}</Text>
          </View>
          
          <Button 
            mode="contained" 
            style={styles.viewButton}
            onPress={() => navigation.navigate('BusDetails', { bus: item })}
          >
            View
          </Button>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.searchHeader}>
        <Text style={styles.routeTitle}>
          {searchParams.from} to {searchParams.to}
        </Text>
        <Text style={styles.dateText}>{searchParams.date}</Text>
        
        <Searchbar
          placeholder="Search by operator"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <View style={styles.sortContainer}>
          <Text style={styles.sortLabel}>Sort by:</Text>
          <View style={styles.sortButtons}>
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'departure' && styles.sortButtonActive]}
              onPress={() => setSortBy('departure')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'departure' && styles.sortButtonTextActive]}>
                Departure
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'price' && styles.sortButtonActive]}
              onPress={() => setSortBy('price')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'price' && styles.sortButtonTextActive]}>
                Price
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.sortButton, sortBy === 'duration' && styles.sortButtonActive]}
              onPress={() => setSortBy('duration')}
            >
              <Text style={[styles.sortButtonText, sortBy === 'duration' && styles.sortButtonTextActive]}>
                Duration
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Surface>
      
      <FlatList
        data={sortedBuses}
        renderItem={renderBusItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  searchHeader: {
    padding: 16,
    elevation: 4,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  searchbar: {
    marginBottom: 12,
    elevation: 2,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortLabel: {
    marginRight: 10,
    fontSize: 14,
    color: '#666',
  },
  sortButtons: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
  },
  sortButtonActive: {
    backgroundColor: '#1976D2',
  },
  sortButtonText: {
    fontSize: 12,
    color: '#666',
  },
  sortButtonTextActive: {
    color: 'white',
  },
  listContainer: {
    padding: 16,
  },
  busCard: {
    marginBottom: 16,
    elevation: 2,
  },
  busHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  operatorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingContainer: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
  divider: {
    marginVertical: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
  },
  timeColumn: {
    alignItems: 'center',
    width: '30%',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  durationContainer: {
    alignItems: 'center',
    width: '40%',
  },
  durationText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  durationLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 2,
    backgroundColor: '#E0E0E0',
    position: 'relative',
  },
  durationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1976D2',
    position: 'absolute',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 8,
  },
  amenityChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E3F2FD',
  },
  amenityText: {
    fontSize: 10,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  seatsText: {
    fontSize: 12,
    color: '#666',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  viewButton: {
    backgroundColor: '#1976D2',
  },
});

export default BusListScreen;
