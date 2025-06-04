import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image } from 'react-native';
import { Text, Surface, Button, Divider, List, IconButton, Chip, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const TripTicketScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Get trip ID from route params
  const { tripId } = route.params || { tripId: null };
  
  // State for ticket
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mock ticket data - in a real app, this would come from an API call
  const mockTicket = {
    id: 'ticket1',
    tripId: 'trip1',
    bookingId: 'BK12345',
    qrCode: 'https://example.com/qr/BK12345',
    passengerName: 'John Doe',
    route: {
      origin: 'New York',
      destination: 'Boston'
    },
    schedule: {
      departureDate: '2025-06-15',
      departureTime: '08:30',
      arrivalDate: '2025-06-15',
      arrivalTime: '12:45'
    },
    bus: {
      operator: 'Express Lines',
      busNumber: 'EL-789'
    },
    seat: {
      number: '14A',
      type: 'window',
      deck: 'Upper'
    },
    barcode: '1234567890',
    issueDate: '2025-05-20T14:30:00Z',
    status: 'valid'
  };
  
  // Load ticket on mount
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTicket(mockTicket);
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
  
  // Handle download ticket
  const handleDownloadTicket = () => {
    // In a real app, this would download the ticket as PDF
    console.log('Downloading ticket...');
  };
  
  // Handle share ticket
  const handleShareTicket = () => {
    // In a real app, this would open a share dialog
    console.log('Sharing ticket...');
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
        <Text style={styles.loadingText}>{t('tickets.loadingTicket')}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.ticketContainer}>
        <View style={styles.ticketHeader}>
          <Text style={styles.ticketTitle}>{t('tickets.busTicket')}</Text>
          <Chip
            style={[
              styles.statusChip,
              { backgroundColor: ticket.status === 'valid' ? '#E8F5E9' : '#FFEBEE' }
            ]}
            textStyle={{
              color: ticket.status === 'valid' ? '#2E7D32' : '#D32F2F'
            }}
          >
            {t(`tickets.status.${ticket.status}`)}
          </Chip>
        </View>
        
        <View style={styles.qrContainer}>
          <Image
            source={require('../../assets/images/qr_placeholder.png')}
            style={styles.qrCode}
            resizeMode="contain"
          />
          <Text style={styles.scanText}>{t('tickets.scanToBoard')}</Text>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.ticketDetailsContainer}>
          <View style={[styles.ticketRow, rtlStyles]}>
            <Text style={styles.ticketLabel}>{t('tickets.passenger')}</Text>
            <Text style={styles.ticketValue}>{ticket.passengerName}</Text>
          </View>
          
          <View style={[styles.ticketRow, rtlStyles]}>
            <Text style={styles.ticketLabel}>{t('tickets.bookingId')}</Text>
            <Text style={styles.ticketValue}>{ticket.bookingId}</Text>
          </View>
          
          <View style={[styles.ticketRow, rtlStyles]}>
            <Text style={styles.ticketLabel}>{t('tickets.from')}</Text>
            <Text style={styles.ticketValue}>{ticket.route.origin}</Text>
          </View>
          
          <View style={[styles.ticketRow, rtlStyles]}>
            <Text style={styles.ticketLabel}>{t('tickets.to')}</Text>
            <Text style={styles.ticketValue}>{ticket.route.destination}</Text>
          </View>
          
          <View style={[styles.ticketRow, rtlStyles]}>
            <Text style={styles.ticketLabel}>{t('tickets.departureDate')}</Text>
            <Text style={styles.ticketValue}>{formatDate(ticket.schedule.departureDate)}</Text>
          </View>
          
          <View style={[styles.ticketRow, rtlStyles]}>
            <Text style={styles.ticketLabel}>{t('tickets.departureTime')}</Text>
            <Text style={styles.ticketValue}>{ticket.schedule.departureTime}</Text>
          </View>
          
          <View style={[styles.ticketRow, rtlStyles]}>
            <Text style={styles.ticketLabel}>{t('tickets.arrivalTime')}</Text>
            <Text style={styles.ticketValue}>{ticket.schedule.arrivalTime}</Text>
          </View>
          
          <View style={[styles.ticketRow, rtlStyles]}>
            <Text style={styles.ticketLabel}>{t('tickets.busOperator')}</Text>
            <Text style={styles.ticketValue}>{ticket.bus.operator}</Text>
          </View>
          
          <View style={[styles.ticketRow, rtlStyles]}>
            <Text style={styles.ticketLabel}>{t('tickets.busNumber')}</Text>
            <Text style={styles.ticketValue}>{ticket.bus.busNumber}</Text>
          </View>
          
          <View style={[styles.ticketRow, rtlStyles]}>
            <Text style={styles.ticketLabel}>{t('tickets.seatNumber')}</Text>
            <Text style={styles.ticketValue}>{ticket.seat.number} ({t(`tickets.seatTypes.${ticket.seat.type}`)})</Text>
          </View>
          
          <View style={[styles.ticketRow, rtlStyles]}>
            <Text style={styles.ticketLabel}>{t('tickets.deck')}</Text>
            <Text style={styles.ticketValue}>{ticket.seat.deck}</Text>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        <View style={styles.barcodeContainer}>
          <Image
            source={require('../../assets/images/barcode_placeholder.png')}
            style={styles.barcode}
            resizeMode="contain"
          />
          <Text style={styles.barcodeText}>{ticket.barcode}</Text>
        </View>
        
        <Text style={styles.issueDate}>
          {t('tickets.issued')}: {formatDate(ticket.issueDate)}
        </Text>
      </Surface>
      
      <View style={styles.actionsContainer}>
        <Button
          mode="contained"
          icon="download"
          onPress={handleDownloadTicket}
          style={styles.downloadButton}
        >
          {t('tickets.downloadPdf')}
        </Button>
        
        <Button
          mode="outlined"
          icon="share"
          onPress={handleShareTicket}
          style={styles.shareButton}
        >
          {t('tickets.shareTicket')}
        </Button>
        
        <Button
          mode="text"
          icon="arrow-left"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          {t('common.back')}
        </Button>
      </View>
      
      <Surface style={styles.infoContainer}>
        <Text style={[styles.infoTitle, rtlStyles]}>{t('tickets.importantInfo')}</Text>
        
        <View style={[styles.infoItem, rtlStyles]}>
          <IconButton icon="clock-check" size={24} color="#1976D2" />
          <Text style={styles.infoText}>{t('tickets.arriveEarly')}</Text>
        </View>
        
        <View style={[styles.infoItem, rtlStyles]}>
          <IconButton icon="ticket-confirmation" size={24} color="#1976D2" />
          <Text style={styles.infoText}>{t('tickets.keepTicket')}</Text>
        </View>
        
        <View style={[styles.infoItem, rtlStyles]}>
          <IconButton icon="card-account-details" size={24} color="#1976D2" />
          <Text style={styles.infoText}>{t('tickets.idRequired')}</Text>
        </View>
      </Surface>
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
  ticketContainer: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  ticketTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusChip: {
    height: 28,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  qrCode: {
    width: 200,
    height: 200,
    marginBottom: 8,
  },
  scanText: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    marginVertical: 16,
  },
  ticketDetailsContainer: {
    marginBottom: 16,
  },
  ticketRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ticketLabel: {
    fontSize: 14,
    color: '#666',
  },
  ticketValue: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  barcodeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  barcode: {
    width: '100%',
    height: 80,
    marginBottom: 8,
  },
  barcodeText: {
    fontSize: 14,
    letterSpacing: 2,
  },
  issueDate: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  actionsContainer: {
    margin: 16,
    marginBottom: 8,
  },
  downloadButton: {
    marginBottom: 12,
    backgroundColor: '#1976D2',
  },
  shareButton: {
    marginBottom: 12,
  },
  backButton: {
    marginBottom: 8,
  },
  infoContainer: {
    margin: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
  },
});

export default TripTicketScreen;
