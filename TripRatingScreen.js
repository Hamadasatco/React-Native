import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, Button, TextInput, Rating, Avatar, ActivityIndicator } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';

const TripRatingScreen = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  // Get trip ID from route params
  const { tripId } = route.params || { tripId: null };
  
  // State for rating
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Handle submit rating
  const handleSubmitRating = () => {
    if (rating === 0) {
      // Show error - rating is required
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, we would dispatch an action to submit the rating
      setIsLoading(false);
      setIsSubmitted(true);
      
      // Navigate back after a delay
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    }, 1500);
  };
  
  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    textAlign: 'right',
  } : {};

  return (
    <ScrollView style={styles.container}>
      <Surface style={styles.ratingContainer}>
        {isSubmitted ? (
          <View style={styles.successContainer}>
            <Avatar.Icon size={64} icon="check-circle" style={styles.successIcon} />
            <Text style={styles.successTitle}>{t('rating.thankYou')}</Text>
            <Text style={styles.successMessage}>{t('rating.feedbackSubmitted')}</Text>
          </View>
        ) : (
          <>
            <Text style={[styles.title, rtlStyles]}>{t('rating.rateYourTrip')}</Text>
            <Text style={[styles.subtitle, rtlStyles]}>{t('rating.shareExperience')}</Text>
            
            <View style={styles.starsContainer}>
              <Rating
                value={rating}
                onValueChange={setRating}
                size={40}
                animationConfig={{ duration: 150 }}
                style={styles.stars}
              />
              <Text style={styles.ratingText}>
                {rating > 0 ? t(`rating.ratings.${rating}`) : t('rating.tapToRate')}
              </Text>
            </View>
            
            <TextInput
              label={t('rating.writeReview')}
              value={review}
              onChangeText={setReview}
              style={styles.reviewInput}
              multiline
              numberOfLines={5}
              disabled={isLoading}
              placeholder={t('rating.reviewPlaceholder')}
            />
            
            <Button
              mode="contained"
              onPress={handleSubmitRating}
              style={styles.submitButton}
              loading={isLoading}
              disabled={isLoading || rating === 0}
            >
              {t('rating.submitRating')}
            </Button>
            
            <Button
              mode="text"
              onPress={() => navigation.goBack()}
              style={styles.skipButton}
              disabled={isLoading}
            >
              {t('rating.skipRating')}
            </Button>
          </>
        )}
      </Surface>
      
      <Surface style={styles.tipsContainer}>
        <Text style={[styles.tipsTitle, rtlStyles]}>{t('rating.ratingTips')}</Text>
        
        <View style={[styles.tipItem, rtlStyles]}>
          <Avatar.Icon size={36} icon="star" style={styles.tipIcon} />
          <View style={styles.tipContent}>
            <Text style={styles.tipText}>{t('rating.tip1')}</Text>
          </View>
        </View>
        
        <View style={[styles.tipItem, rtlStyles]}>
          <Avatar.Icon size={36} icon="text" style={styles.tipIcon} />
          <View style={styles.tipContent}>
            <Text style={styles.tipText}>{t('rating.tip2')}</Text>
          </View>
        </View>
        
        <View style={[styles.tipItem, rtlStyles]}>
          <Avatar.Icon size={36} icon="account-voice" style={styles.tipIcon} />
          <View style={styles.tipContent}>
            <Text style={styles.tipText}>{t('rating.tip3')}</Text>
          </View>
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
  ratingContainer: {
    margin: 16,
    marginBottom: 8,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
  },
  starsContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  stars: {
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  reviewInput: {
    marginBottom: 24,
    backgroundColor: 'white',
  },
  submitButton: {
    marginBottom: 12,
    backgroundColor: '#1976D2',
  },
  skipButton: {
    marginBottom: 8,
  },
  successContainer: {
    alignItems: 'center',
    padding: 24,
  },
  successIcon: {
    backgroundColor: '#2E7D32',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  tipsContainer: {
    margin: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  tipIcon: {
    backgroundColor: '#E3F2FD',
  },
  tipContent: {
    flex: 1,
    marginLeft: 16,
  },
  tipText: {
    fontSize: 14,
  },
});

export default TripRatingScreen;
