import React from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Surface, Button, Divider, IconButton } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

const BookingConfirmationScreen = ({ route, navigation }) => {
  const { bus, selectedSeats, totalPrice, passengerInfo, bookingId, paymentMethod } = route.params || {
    bus: {
      id: '3',
      operator: 'Luxury Travel',
      departure: '10:30 AM',
      arrival: '02:30 PM',
      duration: '4h 00m',
    },
    selectedSeats: ['5A', '5B'],
    totalPrice: '119.98',
    passengerInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    },
    bookingId: 'BK123456',
    paymentMethod: 'creditCard',
  };

  const handleViewTicket = () => {
    navigation.navigate('TicketDetails', {
      bookingId,
      bus,
      selectedSeats,
      passengerInfo,
    });
  };

  const handleGoHome = () => {
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <IconButton
              icon="check-circle"
              size={60}
              color="#4CAF50"
            />
          </View>
          <Text style={styles.successTitle}>Booking Successful!</Text>
          <Text style={styles.successMessage}>
            Your bus tickets have been booked successfully. A confirmation has been sent to your email.
          </Text>
        </Surface>

        <Surface style={styles.bookingDetailsContainer}>
          <Text style={styles.sectionTitle}>Booking Details</Text>
          
          <View style={styles.bookingIdContainer}>
            <Text style={styles.bookingIdLabel}>Booking ID:</Text>
            <Text style={styles.bookingIdValue}>{bookingId}</Text>
          </View>
          
          <Divider style={styles.divider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Operator:</Text>
            <Text style={styles.detailValue}>{bus.operator}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Journey:</Text>
            <Text style={styles.detailValue}>{bus.departure} - {bus.arrival}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration:</Text>
            <Text style={styles.detailValue}>{bus.duration}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Seats:</Text>
            <Text style={styles.detailValue}>{selectedSeats.join(', ')}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Passenger:</Text>
            <Text style={styles.detailValue}>{passengerInfo.name}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contact:</Text>
            <Text style={styles.detailValue}>{passengerInfo.phone}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Payment Method:</Text>
            <Text style={styles.detailValue}>
              {paymentMethod === 'creditCard' ? 'Credit/Debit Card' : 
               paymentMethod === 'paypal' ? 'PayPal' : 'Google Pay'}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount Paid:</Text>
            <Text style={styles.detailValue}>${totalPrice}</Text>
          </View>
        </Surface>

        <Surface style={styles.qrCodeContainer}>
          <Text style={styles.sectionTitle}>Ticket QR Code</Text>
          <View style={styles.qrWrapper}>
            <QRCode
              value={`BUSTICKET-${bookingId}-${selectedSeats.join(',')}`}
              size={200}
              color="#000"
              backgroundColor="#fff"
            />
          </View>
          <Text style={styles.qrInstructions}>
            Show this QR code to the bus operator for boarding
          </Text>
        </Surface>
      </ScrollView>

      <Surface style={styles.bottomContainer}>
        <Button
          mode="outlined"
          style={styles.homeButton}
          onPress={handleGoHome}
        >
          Go to Home
        </Button>
        <Button
          mode="contained"
          style={styles.ticketButton}
          onPress={handleViewTicket}
        >
          View Ticket
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
  successContainer: {
    padding: 24,
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  successIconContainer: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#4CAF50',
  },
  successMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666',
  },
  bookingDetailsContainer: {
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  bookingIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookingIdLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  bookingIdValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  divider: {
    marginVertical: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  qrCodeContainer: {
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
    marginBottom: 80, // Extra space for bottom buttons
  },
  qrWrapper: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
  },
  qrInstructions: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  homeButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#1976D2',
  },
  ticketButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#1976D2',
  },
});

export default BookingConfirmationScreen;
