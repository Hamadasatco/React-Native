import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Surface, Chip, Divider, Button, Searchbar, SegmentedButtons } from 'react-native-paper';

const UpcomingTicketsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('upcoming');
  
  // Mock data for tickets
  const [tickets] = useState([
    {
      id: 'BK123456',
      operator: 'Luxury Travel',
      from: 'New York',
      to: 'Boston',
      departure: '10:30 AM',
      arrival: '02:30 PM',
      date: 'June 15, 2025',
      seats: ['5A', '5B'],
      status: 'confirmed',
      price: '119.98',
    },
    {
      id: 'BK234567',
      operator: 'Express Lines',
      from: 'Chicago',
      to: 'Detroit',
      departure: '08:00 AM',
      arrival: '12:30 PM',
      date: 'July 5, 2025',
      seats: ['3C'],
      status: 'confirmed',
      price: '45.99',
    },
    {
      id: 'BK345678',
      operator: 'City Connect',
      from: 'Los Angeles',
      to: 'San Francisco',
      departure: '09:15 AM',
      arrival: '01:45 PM',
      date: 'July 12, 2025',
      seats: ['7D', '7E'],
      status: 'confirmed',
      price: '79.98',
    },
  ]);

  const [pastTickets] = useState([
    {
      id: 'BK012345',
      operator: 'Night Rider',
      from: 'Miami',
      to: 'Orlando',
      departure: '11:00 PM',
      arrival: '03:00 AM',
      date: 'May 20, 2025',
      seats: ['10A'],
      status: 'completed',
      price: '35.99',
    },
    {
      id: 'BK987654',
      operator: 'Budget Bus',
      from: 'Seattle',
      to: 'Portland',
      departure: '11:45 AM',
      arrival: '04:15 PM',
      date: 'May 5, 2025',
      seats: ['2B'],
      status: 'completed',
      price: '29.99',
    },
  ]);

  const filteredTickets = activeTab === 'upcoming' 
    ? tickets.filter(ticket => 
        ticket.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.to.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : pastTickets.filter(ticket => 
        ticket.operator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.to.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const renderTicketItem = ({ item }) => (
    <Surface style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <Text style={styles.operatorName}>{item.operator}</Text>
        <Chip 
          style={[
            styles.statusChip, 
            item.status === 'confirmed' ? styles.confirmedChip : styles.completedChip
          ]}
        >
          {item.status === 'confirmed' ? 'Confirmed' : 'Completed'}
        </Chip>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.journeyContainer}>
        <View style={styles.journeyDetails}>
          <Text style={styles.journeyTitle}>{item.from} to {item.to}</Text>
          <Text style={styles.journeyDate}>{item.date}</Text>
        </View>
        
        <View style={styles.timeContainer}>
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Departure</Text>
            <Text style={styles.timeValue}>{item.departure}</Text>
          </View>
          
          <View style={styles.timeColumn}>
            <Text style={styles.timeLabel}>Arrival</Text>
            <Text style={styles.timeValue}>{item.arrival}</Text>
          </View>
        </View>
      </View>
      
      <Divider style={styles.divider} />
      
      <View style={styles.bottomContainer}>
        <View>
          <Text style={styles.seatsLabel}>Seats</Text>
          <View style={styles.seatsContainer}>
            {item.seats.map((seat, index) => (
              <Chip key={index} style={styles.seatChip}>
                {seat}
              </Chip>
            ))}
          </View>
        </View>
        
        <Button
          mode="contained"
          style={styles.viewButton}
          onPress={() => navigation.navigate('TicketDetails', {
            bookingId: item.id,
            bus: {
              operator: item.operator,
              departure: item.departure,
              arrival: item.arrival,
              boarding_point: `${item.from} Bus Terminal`,
              dropping_point: `${item.to} Bus Station`,
            },
            selectedSeats: item.seats,
            passengerInfo: {
              name: 'John Doe',
              email: 'john@example.com',
              phone: '1234567890',
            },
          })}
        >
          View
        </Button>
      </View>
    </Surface>
  );

  return (
    <View style={styles.container}>
      <Surface style={styles.headerContainer}>
        <Text style={styles.headerTitle}>My Tickets</Text>
        
        <Searchbar
          placeholder="Search tickets"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
        
        <SegmentedButtons
          value={activeTab}
          onValueChange={setActiveTab}
          buttons={[
            { value: 'upcoming', label: 'Upcoming' },
            { value: 'past', label: 'Past' },
          ]}
          style={styles.segmentedButtons}
        />
      </Surface>
      
      {filteredTickets.length > 0 ? (
        <FlatList
          data={filteredTickets}
          renderItem={renderTicketItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {activeTab === 'upcoming' 
              ? 'No upcoming tickets found' 
              : 'No past tickets found'}
          </Text>
          <Button
            mode="contained"
            style={styles.bookButton}
            onPress={() => navigation.navigate('Home')}
          >
            Book a Ticket
          </Button>
        </View>
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
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchbar: {
    marginBottom: 16,
    elevation: 2,
  },
  segmentedButtons: {
    marginBottom: 8,
  },
  listContainer: {
    padding: 16,
  },
  ticketCard: {
    marginBottom: 16,
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
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusChip: {
    height: 28,
  },
  confirmedChip: {
    backgroundColor: '#4CAF50',
  },
  completedChip: {
    backgroundColor: '#9E9E9E',
  },
  divider: {
    marginVertical: 0,
  },
  journeyContainer: {
    padding: 16,
  },
  journeyDetails: {
    marginBottom: 12,
  },
  journeyTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  journeyDate: {
    fontSize: 14,
    color: '#666',
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeColumn: {
    alignItems: 'flex-start',
  },
  timeLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  seatsLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  seatsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  seatChip: {
    margin: 2,
    height: 28,
    backgroundColor: '#1976D2',
  },
  viewButton: {
    backgroundColor: '#1976D2',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  bookButton: {
    backgroundColor: '#1976D2',
  },
});

export default UpcomingTicketsScreen;
