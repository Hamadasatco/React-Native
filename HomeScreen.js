import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Surface, TextInput, Button, Card, Title, Paragraph, Chip } from 'react-native-paper';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../../contexts/LanguageContext';
import LanguageSwitcher from '../../components/common/LanguageSwitcher';

const HomeScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const { isRTL } = useLanguage();
  
  const [popularRoutes] = useState([
    { id: 1, from: t('home.newYork'), to: t('home.boston'), price: '$45' },
    { id: 2, from: t('home.chicago'), to: t('home.detroit'), price: '$35' },
    { id: 3, from: t('home.losAngeles'), to: t('home.sanFrancisco'), price: '$55' },
    { id: 4, from: t('home.miami'), to: t('home.orlando'), price: '$30' },
  ]);

  const [specialOffers] = useState([
    { id: 1, title: t('home.weekend'), discount: '20% OFF', code: 'WEEKEND20' },
    { id: 2, title: t('home.firstTrip'), discount: '15% OFF', code: 'FIRST15' },
  ]);

  const searchValidationSchema = Yup.object().shape({
    from: Yup.string().required(t('errors.required', { field: t('common.from') })),
    to: Yup.string().required(t('errors.required', { field: t('common.to') })),
    date: Yup.string().required(t('errors.required', { field: t('common.date') })),
  });

  const formik = useFormik({
    initialValues: { from: '', to: '', date: '' },
    validationSchema: searchValidationSchema,
    onSubmit: (values) => {
      console.log('Search submitted with:', values);
      navigation.navigate('BusList', { searchParams: values });
    },
  });

  // Apply RTL styles conditionally
  const rtlStyles = isRTL ? {
    flexDirection: 'row-reverse',
    textAlign: 'right',
  } : {};

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <LanguageSwitcher />
        
        <Surface style={styles.searchContainer}>
          <Text style={[styles.searchTitle, rtlStyles]}>{t('home.findYourBus')}</Text>

          <TextInput
            label={t('common.from')}
            value={formik.values.from}
            onChangeText={formik.handleChange('from')}
            onBlur={formik.handleBlur('from')}
            error={formik.touched.from && Boolean(formik.errors.from)}
            style={[styles.input, rtlStyles]}
            left={<TextInput.Icon icon="map-marker" />}
          />
          {formik.touched.from && formik.errors.from && (
            <Text style={[styles.errorText, rtlStyles]}>{formik.errors.from}</Text>
          )}

          <TextInput
            label={t('common.to')}
            value={formik.values.to}
            onChangeText={formik.handleChange('to')}
            onBlur={formik.handleBlur('to')}
            error={formik.touched.to && Boolean(formik.errors.to)}
            style={[styles.input, rtlStyles]}
            left={<TextInput.Icon icon="map-marker" />}
          />
          {formik.touched.to && formik.errors.to && (
            <Text style={[styles.errorText, rtlStyles]}>{formik.errors.to}</Text>
          )}

          <TextInput
            label={t('common.date')}
            value={formik.values.date}
            onChangeText={formik.handleChange('date')}
            onBlur={formik.handleBlur('date')}
            error={formik.touched.date && Boolean(formik.errors.date)}
            style={[styles.input, rtlStyles]}
            left={<TextInput.Icon icon="calendar" />}
            placeholder="MM/DD/YYYY"
          />
          {formik.touched.date && formik.errors.date && (
            <Text style={[styles.errorText, rtlStyles]}>{formik.errors.date}</Text>
          )}

          <Button
            mode="contained"
            onPress={formik.handleSubmit}
            style={styles.searchButton}
            loading={formik.isSubmitting}
            disabled={formik.isSubmitting}
          >
            {t('home.searchBuses')}
          </Button>
        </Surface>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, rtlStyles]}>{t('home.popularRoutes')}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {popularRoutes.map((route) => (
              <Card key={route.id} style={styles.routeCard}>
                <Card.Content>
                  <Title style={[styles.routeTitle, rtlStyles]}>{route.from} {t('common.to')} {route.to}</Title>
                  <Paragraph style={[styles.routePrice, rtlStyles]}>
                    {t('common.startingFrom')} {route.price}
                  </Paragraph>
                </Card.Content>
                <Card.Actions style={isRTL ? { justifyContent: 'flex-start' } : {}}>
                  <Button
                    mode="outlined"
                    onPress={() => {
                      formik.setFieldValue('from', route.from);
                      formik.setFieldValue('to', route.to);
                    }}
                  >
                    {t('home.selectRoute')}
                  </Button>
                </Card.Actions>
              </Card>
            ))}
          </ScrollView>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, rtlStyles]}>{t('home.specialOffers')}</Text>
          {specialOffers.map((offer) => (
            <Card key={offer.id} style={styles.offerCard}>
              <Card.Content style={[styles.offerContent, isRTL ? { flexDirection: 'row-reverse' } : {}]}>
                <View>
                  <Title style={[styles.offerTitle, rtlStyles]}>{offer.title}</Title>
                  <Paragraph style={rtlStyles}>{t('home.useCode')}: {offer.code}</Paragraph>
                </View>
                <Chip style={styles.discountChip}>{offer.discount}</Chip>
              </Card.Content>
            </Card>
          ))}
        </View>

        <View style={styles.featuresContainer}>
          <Text style={[styles.sectionTitle, rtlStyles]}>{t('home.whyChooseUs')}</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🚌</Text>
              <Text style={[styles.featureTitle, rtlStyles]}>{t('home.comfortableBuses')}</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>💰</Text>
              <Text style={[styles.featureTitle, rtlStyles]}>{t('home.bestPrices')}</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🔒</Text>
              <Text style={[styles.featureTitle, rtlStyles]}>{t('home.secureBooking')}</Text>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureIcon}>🎫</Text>
              <Text style={[styles.featureTitle, rtlStyles]}>{t('home.eTickets')}</Text>
            </View>
          </View>
        </View>
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
  searchContainer: {
    padding: 16,
    borderRadius: 10,
    elevation: 4,
    marginBottom: 20,
  },
  searchTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'transparent',
  },
  errorText: {
    color: '#B00020',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
  searchButton: {
    marginTop: 8,
    paddingVertical: 8,
    backgroundColor: '#1976D2',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  routeCard: {
    width: 200,
    marginRight: 12,
    elevation: 2,
  },
  routeTitle: {
    fontSize: 16,
  },
  routePrice: {
    color: '#1976D2',
    fontWeight: 'bold',
  },
  offerCard: {
    marginBottom: 12,
    elevation: 2,
  },
  offerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offerTitle: {
    fontSize: 16,
  },
  discountChip: {
    backgroundColor: '#1976D2',
    color: 'white',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default HomeScreen;
