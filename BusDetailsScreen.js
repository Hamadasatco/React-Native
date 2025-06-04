import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Card, Button, Chip, Divider, Surface, List, IconButton } from 'react-native-paper';

const BusDetailsScreen = ({ route, navigation }) => {
  const { bus } = route.params || {
    bus: {
      id: '3',
      operator: 'Luxury Travel',
      departure: '10:30 AM',
      arrival: '02:30 PM',
      duration: '4h 00m',
      price: 59.99,
      available_seats: 8,
      amenities: ['WiFi', 'AC', 'Power Outlets', 'Entertainment', 'Reclining Seats'],
      rating: 4.8,
      bus_type: 'Luxury Coach',
      boarding_point: 'Central Bus Terminal, Gate 5',
      dropping_point: 'Downtown Bus Station, Platform 3',
      cancellation_policy: 'Free cancellation up to 24 hours before departure',
      baggage_allowance: '2 bags (up to 20kg each)',
    }
  };

  const [expanded, setExpanded] = useState(false);

  const handlePress = () => setExpanded(!expanded);

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <Surface style={styles.headerContainer}>
          <Text style={styles.operatorName}>{bus.operator}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingText}>★ {bus.rating}</Text>
          </View>
        </Surface>

        <Card style={styles.detailsCard}>
          <Card.Content>
            <View style={styles.busTypeContainer}>
              <Text style={styles.busTypeText}>{bus.bus_type}</Text>
            </View>

            <View style={styles.timeContainer}>
              <View style={styles.timeColumn}>
                <Text style={styles.timeLabel}>Departure</Text>
                <Text style={styles.timeValue}>{bus.departure}</Text>
              </View>
              
              <View style={styles.durationContainer}>
                <Text style={styles.durationText}>{bus.duration}</Text>
                <View style={styles.durationLine}>
                  <View style={[styles.durationDot, { left: 0 }]}></View>
                  <View style={[styles.durationDot, { right: 0 }]}></View>
                </View>
              </View>
              
              <View style={styles.timeColumn}>
                <Text style={styles.timeLabel}>Arrival</Text>
                <Text style={styles.timeValue}>{bus.arrival}</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.locationContainer}>
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>Boarding Point:</Text>
                <Text style={styles.locationValue}>{bus.boarding_point}</Text>
              </View>
              <View style={styles.locationItem}>
                <Text style={styles.locationLabel}>Dropping Point:</Text>
                <Text style={styles.locationValue}>{bus.dropping_point}</Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {bus.amenities.map((amenity, index) => (
                <Chip key={index} style={styles.amenityChip} textStyle={styles.amenityText}>
                  {amenity}
                </Chip>
              ))}
            </View>

            <Divider style={styles.divider} />

            <List.Accordion
              title="Additional Information"
              expanded={expanded}
              onPress={handlePress}
              style={styles.accordion}
            >
              <List.Item
                title="Cancellation Policy"
                description={bus.cancellation_policy}
                left={props => <List.Icon {...props} icon="calendar-remove" />}
              />
              <List.Item
                title="Baggage Allowance"
                description={bus.baggage_allowance}
                left={props => <List.Icon {...props} icon="bag-checked" />}
              />
            </List.Accordion>
          </Card.Content>
        </Card>

        <Card style={styles.busImageCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Bus Images</Text>
            <Image
              source={require('../../assets/bus-placeholder.png')}
              style={styles.busImage}
              resizeMode="cover"
            />
          </Card.Content>
        </Card>

        <Surface style={styles.priceContainer}>
          <View>
            <Text style={styles.seatsText}>{bus.available_seats} seats available</Text>
            <Text style={styles.priceText}>${bus.price.toFixed(2)}</Text>
          </View>
          
          <Button 
            mode="contained" 
            style={styles.selectSeatsButton}
            onPress={() => navigation.navigate('SeatSelection', { bus })}
          >
            Select Seats
          </Button>
        </Surface>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    elevation: 2,
  },
  operatorName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  ratingContainer: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  ratingText: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  detailsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  busTypeContainer: {
    marginBottom: 12,
  },
  busTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1976D2',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  timeColumn: {
    alignItems: 'center',
    width: '30%',
  },
  timeLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  durationContainer: {
    alignItems: 'center',
    width: '40%',
  },
  durationText: {
    fontSize: 14,
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1976D2',
    position: 'absolute',
  },
  divider: {
    marginVertical: 16,
  },
  locationContainer: {
    marginVertical: 8,
  },
  locationItem: {
    marginBottom: 12,
  },
  locationLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  amenityChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E3F2FD',
  },
  amenityText: {
    fontSize: 12,
  },
  accordion: {
    padding: 0,
    backgroundColor: 'transparent',
  },
  busImageCard: {
    marginBottom: 16,
    elevation: 2,
  },
  busImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    elevation: 4,
    marginBottom: 16,
  },
  seatsText: {
    fontSize: 14,
    color: '#666',
  },
  priceText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  selectSeatsButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 16,
  },
});

export default BusDetailsScreen;
