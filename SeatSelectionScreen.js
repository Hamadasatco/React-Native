import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Surface, Button, IconButton, Badge } from 'react-native-paper';

const SeatSelectionScreen = ({ route, navigation }) => {
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
    }
  };

  // Mock seat layout data
  const [seatLayout] = useState({
    totalRows: 10,
    seatsPerRow: 4,
    aisle: 2, // After 2 seats there's an aisle
    unavailableSeats: ['1A', '2B', '3C', '5D', '7A', '8B', '9C', '10D'],
  });

  const [selectedSeats, setSelectedSeats] = useState([]);
  const maxSelectableSeats = 5;

  const generateSeatId = (row, position) => {
    const seatLetter = String.fromCharCode(65 + position); // A, B, C, D
    return `${row}${seatLetter}`;
  };

  const isSeatSelected = (seatId) => {
    return selectedSeats.includes(seatId);
  };

  const isSeatUnavailable = (seatId) => {
    return seatLayout.unavailableSeats.includes(seatId);
  };

  const handleSeatPress = (seatId) => {
    if (isSeatUnavailable(seatId)) return;

    if (isSeatSelected(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      if (selectedSeats.length < maxSelectableSeats) {
        setSelectedSeats([...selectedSeats, seatId]);
      } else {
        // Show alert that max seats are selected
        alert(`You can select maximum ${maxSelectableSeats} seats`);
      }
    }
  };

  const getSeatStatus = (seatId) => {
    if (isSeatSelected(seatId)) return 'selected';
    if (isSeatUnavailable(seatId)) return 'unavailable';
    return 'available';
  };

  const renderSeat = (row, position) => {
    const seatId = generateSeatId(row, position);
    const status = getSeatStatus(seatId);

    return (
      <TouchableOpacity
        key={seatId}
        style={[
          styles.seat,
          status === 'selected' && styles.selectedSeat,
          status === 'unavailable' && styles.unavailableSeat,
        ]}
        onPress={() => handleSeatPress(seatId)}
        disabled={status === 'unavailable'}
      >
        <Text style={[
          styles.seatText,
          status === 'selected' && styles.selectedSeatText,
          status === 'unavailable' && styles.unavailableSeatText,
        ]}>
          {seatId}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderRow = (row) => {
    const seats = [];
    for (let i = 0; i < seatLayout.seatsPerRow; i++) {
      // Add aisle space
      if (i === seatLayout.aisle) {
        seats.push(<View key={`aisle-${row}`} style={styles.aisle} />);
      }
      seats.push(renderSeat(row, i));
    }

    return (
      <View key={`row-${row}`} style={styles.row}>
        {seats}
      </View>
    );
  };

  const renderBus = () => {
    const rows = [];
    for (let i = 1; i <= seatLayout.totalRows; i++) {
      rows.push(renderRow(i));
    }

    return (
      <View style={styles.busLayout}>
        <View style={styles.driverArea}>
          <IconButton icon="steering" size={24} />
          <Text>Driver</Text>
        </View>
        <View style={styles.seatsContainer}>
          {rows}
        </View>
      </View>
    );
  };

  const calculateTotalPrice = () => {
    return (selectedSeats.length * bus.price).toFixed(2);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.headerContainer}>
          <Text style={styles.headerTitle}>Select Your Seats</Text>
          <Text style={styles.headerSubtitle}>
            {bus.operator} - {bus.departure} to {bus.arrival}
          </Text>
        </Surface>

        <Surface style={styles.legendContainer}>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.availableLegend]} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.selectedLegend]} />
            <Text style={styles.legendText}>Selected</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendBox, styles.unavailableLegend]} />
            <Text style={styles.legendText}>Unavailable</Text>
          </View>
        </Surface>

        <Surface style={styles.busContainer}>
          {renderBus()}
        </Surface>

        <Surface style={styles.selectionInfoContainer}>
          <Text style={styles.selectionTitle}>Selected Seats</Text>
          <View style={styles.selectedSeatsContainer}>
            {selectedSeats.length > 0 ? (
              selectedSeats.map(seatId => (
                <Badge key={seatId} style={styles.seatBadge}>
                  {seatId}
                </Badge>
              ))
            ) : (
              <Text style={styles.noSeatsText}>No seats selected</Text>
            )}
          </View>
        </Surface>
      </ScrollView>

      <Surface style={styles.bottomContainer}>
        <View>
          <Text style={styles.totalSeatsText}>
            {selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'} selected
          </Text>
          <Text style={styles.totalPriceText}>
            Total: ${calculateTotalPrice()}
          </Text>
        </View>
        
        <Button
          mode="contained"
          style={styles.continueButton}
          disabled={selectedSeats.length === 0}
          onPress={() => navigation.navigate('PassengerInfo', { 
            bus, 
            selectedSeats,
            totalPrice: calculateTotalPrice()
          })}
        >
          Continue
        </Button>
      </Surface>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    padding: 16,
    margin: 16,
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    elevation: 2,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 8,
  },
  availableLegend: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  selectedLegend: {
    backgroundColor: '#1976D2',
  },
  unavailableLegend: {
    backgroundColor: '#E0E0E0',
  },
  legendText: {
    fontSize: 12,
  },
  busContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  busLayout: {
    width: '100%',
    alignItems: 'center',
  },
  driverArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  seatsContainer: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  seat: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#1976D2',
  },
  selectedSeat: {
    backgroundColor: '#1976D2',
    borderColor: '#1976D2',
  },
  unavailableSeat: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
  seatText: {
    fontSize: 12,
    color: '#1976D2',
  },
  selectedSeatText: {
    color: '#FFFFFF',
  },
  unavailableSeatText: {
    color: '#9E9E9E',
  },
  aisle: {
    width: 20,
  },
  selectionInfoContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  selectedSeatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  seatBadge: {
    backgroundColor: '#1976D2',
    margin: 4,
  },
  noSeatsText: {
    color: '#666',
    fontStyle: 'italic',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  totalSeatsText: {
    fontSize: 14,
    color: '#666',
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  continueButton: {
    backgroundColor: '#1976D2',
  },
});

export default SeatSelectionScreen;
