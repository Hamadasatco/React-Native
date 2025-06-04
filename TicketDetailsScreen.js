import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Surface, Button, Divider, IconButton, Chip, List } from 'react-native-paper';
import QRCode from 'react-native-qrcode-svg';

const TicketDetailsScreen = ({ route, navigation }) => {
  const { bookingId, bus, selectedSeats, passengerInfo } = route.params || {
    bookingId: 'BK123456',
    bus: {
      id: '3',
      operator: 'Luxury Travel',
      departure: '10:30 AM',
      arrival: '02:30 PM',
      duration: '4h 00m',
      boarding_point: 'Central Bus Terminal, Gate 5',
      dropping_point: 'Downtown Bus Station, Platform 3',
    },
    selectedSeats: ['5A', '5B'],
    passengerInfo: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '1234567890',
    },
  };

  const [expanded, setExpanded] = useState(false);
  const handlePress = () => setExpanded(!expanded);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Surface style={styles.ticketContainer}>
          <View style={styles.ticketHeader}>
            <View>
              <Text style={styles.operatorName}>{bus.operator}</Text>
              <Text style={styles.ticketId}>Ticket #{bookingId}</Text>
            </View>
            <Chip style={styles.statusChip}>Confirmed</Chip>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.journeyContainer}>
            <View style={styles.journeyTimeContainer}>
              <Text style={styles.journeyTime}>{bus.departure}</Text>
              <View style={styles.journeyLine}>
                <View style={[styles.journeyDot, { top: 0 }]} />
                <View style={[styles.journeyDot, { bottom: 0 }]} />
              </View>
              <Text style={styles.journeyTime}>{bus.arrival}</Text>
            </View>
            
            <View style={styles.journeyDetailsContainer}>
              <View style={styles.journeyDetail}>
                <Text style={styles.journeyLocation}>{bus.boarding_point}</Text>
                <Text style={styles.journeyDate}>June 15, 2025</Text>
              </View>
              
              <Text style={styles.journeyDuration}>{bus.duration}</Text>
              
              <View style={styles.journeyDetail}>
                <Text style={styles.journeyLocation}>{bus.dropping_point}</Text>
                <Text style={styles.journeyDate}>June 15, 2025</Text>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.passengerContainer}>
            <Text style={styles.sectionTitle}>Passenger Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Name:</Text>
              <Text style={styles.detailValue}>{passengerInfo.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Phone:</Text>
              <Text style={styles.detailValue}>{passengerInfo.phone}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Email:</Text>
              <Text style={styles.detailValue}>{passengerInfo.email}</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.seatContainer}>
            <Text style={styles.sectionTitle}>Seat Information</Text>
            <View style={styles.seatsRow}>
              {selectedSeats.map((seat, index) => (
                <Chip key={index} style={styles.seatChip}>
                  {seat}
                </Chip>
              ))}
            </View>
          </View>
        </Surface>

        <Surface style={styles.qrCodeContainer}>
          <Text style={styles.sectionTitle}>Boarding Pass</Text>
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

        <Surface style={styles.actionsContainer}>
          <List.Accordion
            title="Ticket Actions"
            expanded={expanded}
            onPress={handlePress}
            style={styles.accordion}
          >
            <List.Item
              title="Download Ticket"
              left={props => <List.Icon {...props} icon="download" />}
              onPress={() => alert('Ticket download functionality would be implemented here')}
            />
            <List.Item
              title="Share Ticket"
              left={props => <List.Icon {...props} icon="share" />}
              onPress={() => alert('Ticket sharing functionality would be implemented here')}
            />
            <List.Item
              title="Cancel Booking"
              left={props => <List.Icon {...props} icon="cancel" />}
              onPress={() => alert('Booking cancellation functionality would be implemented here')}
            />
          </List.Accordion>
        </Surface>
      </ScrollView>

      <Surface style={styles.bottomContainer}>
        <Button
          mode="outlined"
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          Back
        </Button>
        <Button
          mode="contained"
          style={styles.homeButton}
          onPress={() => navigation.navigate('Home')}
        >
          Go to Home
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
  ticketContainer: {
    margin: 16,
    borderRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#E3F2FD',
  },
  operatorName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  ticketId: {
    fontSize: 14,
    color: '#666',
  },
  statusChip: {
    backgroundColor: '#4CAF50',
  },
  divider: {
    marginVertical: 0,
  },
  journeyContainer: {
    padding: 16,
    flexDirection: 'row',
  },
  journeyTimeContainer: {
    alignItems: 'center',
    width: 60,
  },
  journeyTime: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  journeyLine: {
    width: 2,
    height: 80,
    backgroundColor: '#1976D2',
    marginVertical: 8,
    position: 'relative',
  },
  journeyDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#1976D2',
    position: 'absolute',
    left: -4,
  },
  journeyDetailsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  journeyDetail: {
    marginBottom: 8,
  },
  journeyLocation: {
    fontSize: 14,
    fontWeight: '500',
  },
  journeyDate: {
    fontSize: 12,
    color: '#666',
  },
  journeyDuration: {
    fontSize: 12,
    color: '#666',
    marginVertical: 8,
    fontStyle: 'italic',
  },
  passengerContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  seatContainer: {
    padding: 16,
  },
  seatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  seatChip: {
    margin: 4,
    backgroundColor: '#1976D2',
  },
  qrCodeContainer: {
    padding: 16,
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    elevation: 2,
    alignItems: 'center',
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
  actionsContainer: {
    margin: 16,
    marginTop: 0,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 80, // Extra space for bottom buttons
  },
  accordion: {
    padding: 0,
    backgroundColor: 'transparent',
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
  backButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#1976D2',
  },
  homeButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#1976D2',
  },
});

export default TicketDetailsScreen;
