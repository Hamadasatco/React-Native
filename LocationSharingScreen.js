import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share as RNShare } from 'react-native';
import { Text, Surface, Button, IconButton, ActivityIndicator, Chip, Divider, Dialog, Portal, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import SharingService from '../../services/sharing/SharingService';
import TrafficMapView from '../../components/tracking/TrafficMapView';

const LocationSharingScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const { bookingId, bus } = route.params || {
    bookingId: 'BK123456',
    bus: {
      id: '3',
      operator: 'Luxury Travel',
      departure: '10:30 AM',
      arrival: '02:30 PM',
      duration: '4h 00m',
    }
  };

  // States
  const [busLocation, setBusLocation] = useState({
    latitude: 40.7128,
    longitude: -74.0060,
  });
  const [destination, setDestination] = useState({
    latitude: 40.7500,
    longitude: -73.9800,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeShares, setActiveShares] = useState([]);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareExpiry, setShareExpiry] = useState('60'); // Default 60 minutes
  const [shareSuccess, setShareSuccess] = useState(false);
  const [shareError, setShareError] = useState(null);
  const [currentShareLink, setCurrentShareLink] = useState('');
  
  // Load active shares on mount
  useEffect(() => {
    loadActiveShares();
    
    // Clean up expired shares
    SharingService.cleanupExpiredShares();
  }, []);
  
  // Load active shares
  const loadActiveShares = async () => {
    try {
      const shares = await SharingService.getAllActiveShares();
      setActiveShares(shares);
    } catch (error) {
      console.error('Error loading active shares:', error);
    }
  };
  
  // Create and share location
  const handleShareLocation = async () => {
    try {
      setIsLoading(true);
      setShareError(null);
      
      // Create sharing link
      const expiryMinutes = parseInt(shareExpiry, 10) || 60;
      const shareInfo = await SharingService.createSharingLink(
        bookingId,
        {
          ...bus,
          currentLocation: busLocation,
          destination
        },
        expiryMinutes
      );
      
      // Share the link
      await SharingService.shareBusLocation(
        shareInfo.shareLink,
        bus.operator,
        {
          subject: t('sharing.shareSubject', { operator: bus.operator })
        }
      );
      
      // Update active shares
      await loadActiveShares();
      
      // Show success
      setCurrentShareLink(shareInfo.shareLink);
      setShareSuccess(true);
      setShowShareDialog(false);
    } catch (error) {
      console.error('Error sharing location:', error);
      setShareError(error.message || t('sharing.shareError'));
    } finally {
      setIsLoading(false);
    }
  };
  
  // Revoke a share
  const handleRevokeShare = async (token) => {
    try {
      setIsLoading(true);
      await SharingService.revokeShare(token);
      await loadActiveShares();
    } catch (error) {
      console.error('Error revoking share:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format expiry time
  const formatExpiryTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  // Calculate time remaining
  const getTimeRemaining = (expiryTime) => {
    const now = Date.now();
    const remaining = expiryTime - now;
    
    if (remaining <= 0) return t('sharing.expired');
    
    const minutes = Math.floor(remaining / 60000);
    if (minutes < 60) {
      return t('sharing.minutesRemaining', { minutes });
    }
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return t('sharing.hoursMinutesRemaining', { hours, minutes: remainingMinutes });
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  return (
    <View style={styles.container}>
      <Surface style={styles.headerContainer}>
        <Text style={[styles.headerTitle, rtlStyles]}>{t('sharing.locationSharing')}</Text>
        <Text style={[styles.headerSubtitle, rtlStyles]}>
          {bus.operator} - {t('common.bookingId')}: {bookingId}
        </Text>
      </Surface>
      
      <TrafficMapView
        style={styles.mapContainer}
        busLocation={busLocation}
        destination={destination}
        userLocation={null}
      />
      
      <ScrollView style={styles.contentScrollView}>
        <Surface style={styles.sharingContainer}>
          <Text style={[styles.sectionTitle, rtlStyles]}>{t('sharing.shareYourJourney')}</Text>
          <Text style={[styles.sectionDescription, rtlStyles]}>
            {t('sharing.shareDescription')}
          </Text>
          
          <Button
            mode="contained"
            icon="share"
            style={styles.shareButton}
            onPress={() => setShowShareDialog(true)}
            loading={isLoading}
            disabled={isLoading}
          >
            {t('sharing.shareBusLocation')}
          </Button>
          
          {shareSuccess && (
            <View style={styles.successContainer}>
              <Text style={styles.successText}>{t('sharing.shareSuccess')}</Text>
              <Button
                mode="outlined"
                onPress={() => setShareSuccess(false)}
                style={styles.dismissButton}
              >
                {t('common.dismiss')}
              </Button>
            </View>
          )}
          
          {shareError && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{shareError}</Text>
              <Button
                mode="outlined"
                onPress={() => setShareError(null)}
                style={styles.dismissButton}
              >
                {t('common.dismiss')}
              </Button>
            </View>
          )}
        </Surface>
        
        <Surface style={styles.activeSharesContainer}>
          <View style={[styles.activeSharesHeader, rtlStyles]}>
            <Text style={styles.sectionTitle}>{t('sharing.activeShares')}</Text>
            <Chip icon="refresh" onPress={loadActiveShares}>
              {t('common.refresh')}
            </Chip>
          </View>
          
          {activeShares.length === 0 ? (
            <View style={styles.emptySharesContainer}>
              <IconButton icon="share-off" size={48} color="#9E9E9E" />
              <Text style={styles.emptySharesText}>{t('sharing.noActiveShares')}</Text>
            </View>
          ) : (
            activeShares.map((share) => (
              <Surface key={share.token} style={styles.shareItem}>
                <View style={[styles.shareItemHeader, rtlStyles]}>
                  <Text style={styles.shareItemTitle}>{t('sharing.sharedWith')}</Text>
                  <Chip 
                    mode="outlined" 
                    style={styles.expiryChip}
                  >
                    {getTimeRemaining(share.expiryTime)}
                  </Chip>
                </View>
                
                <Text style={styles.shareLink} numberOfLines={1} ellipsizeMode="middle">
                  {share.shareLink}
                </Text>
                
                <Text style={styles.shareExpiry}>
                  {t('sharing.expiresAt')}: {formatExpiryTime(share.expiryTime)}
                </Text>
                
                <View style={styles.shareActions}>
                  <Button
                    mode="outlined"
                    icon="content-copy"
                    onPress={() => {
                      RNShare.share({
                        message: share.shareLink
                      });
                    }}
                    style={styles.shareActionButton}
                  >
                    {t('sharing.copyLink')}
                  </Button>
                  
                  <Button
                    mode="outlined"
                    icon="share"
                    onPress={() => {
                      SharingService.shareBusLocation(
                        share.shareLink,
                        bus.operator
                      );
                    }}
                    style={styles.shareActionButton}
                  >
                    {t('sharing.shareAgain')}
                  </Button>
                  
                  <Button
                    mode="outlined"
                    icon="delete"
                    onPress={() => handleRevokeShare(share.token)}
                    style={[styles.shareActionButton, styles.revokeButton]}
                  >
                    {t('sharing.revoke')}
                  </Button>
                </View>
              </Surface>
            ))
          )}
        </Surface>
        
        <Surface style={styles.privacyContainer}>
          <Text style={[styles.sectionTitle, rtlStyles]}>{t('sharing.privacyInfo')}</Text>
          <Text style={[styles.privacyText, rtlStyles]}>
            {t('sharing.privacyDescription')}
          </Text>
          
          <View style={styles.privacyPoints}>
            <View style={[styles.privacyPoint, rtlStyles]}>
              <IconButton icon="timer-sand" size={24} color="#1976D2" />
              <Text style={styles.privacyPointText}>
                {t('sharing.privacyPoint1')}
              </Text>
            </View>
            
            <View style={[styles.privacyPoint, rtlStyles]}>
              <IconButton icon="link-lock" size={24} color="#1976D2" />
              <Text style={styles.privacyPointText}>
                {t('sharing.privacyPoint2')}
              </Text>
            </View>
            
            <View style={[styles.privacyPoint, rtlStyles]}>
              <IconButton icon="account-cancel" size={24} color="#1976D2" />
              <Text style={styles.privacyPointText}>
                {t('sharing.privacyPoint3')}
              </Text>
            </View>
          </View>
        </Surface>
      </ScrollView>
      
      {/* Share Dialog */}
      <Portal>
        <Dialog
          visible={showShareDialog}
          onDismiss={() => setShowShareDialog(false)}
          style={styles.dialog}
        >
          <Dialog.Title>{t('sharing.shareLocationTitle')}</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              {t('sharing.shareDialogDescription')}
            </Text>
            
            <TextInput
              label={t('sharing.expiryMinutes')}
              value={shareExpiry}
              onChangeText={setShareExpiry}
              keyboardType="number-pad"
              style={styles.expiryInput}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowShareDialog(false)}>
              {t('common.cancel')}
            </Button>
            <Button onPress={handleShareLocation} loading={isLoading}>
              {t('sharing.share')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
    margin: 16,
    marginBottom: 0,
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
  mapContainer: {
    margin: 16,
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
  },
  contentScrollView: {
    flex: 1,
  },
  sharingContainer: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionDescription: {
    marginBottom: 16,
    color: '#666',
  },
  shareButton: {
    backgroundColor: '#1976D2',
  },
  successContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  successText: {
    color: '#2E7D32',
    marginBottom: 8,
  },
  errorContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
  },
  errorText: {
    color: '#C62828',
    marginBottom: 8,
  },
  dismissButton: {
    alignSelf: 'flex-end',
  },
  activeSharesContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  activeSharesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptySharesContainer: {
    alignItems: 'center',
    padding: 24,
  },
  emptySharesText: {
    marginTop: 8,
    color: '#9E9E9E',
  },
  shareItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 1,
  },
  shareItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  shareItemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  expiryChip: {
    height: 30,
  },
  shareLink: {
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  shareExpiry: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
  },
  shareActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  shareActionButton: {
    marginBottom: 8,
    flex: 1,
    marginHorizontal: 4,
  },
  revokeButton: {
    borderColor: '#F44336',
  },
  privacyContainer: {
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    marginBottom: 24,
  },
  privacyText: {
    marginBottom: 16,
    color: '#666',
  },
  privacyPoints: {
    marginTop: 8,
  },
  privacyPoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  privacyPointText: {
    flex: 1,
  },
  dialog: {
    borderRadius: 8,
  },
  dialogText: {
    marginBottom: 16,
  },
  expiryInput: {
    marginTop: 8,
  },
});

export default LocationSharingScreen;
