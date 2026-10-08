import { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import DetailHeader from './usta-detail/DetailHeader';
import UstaHero from './usta-detail/UstaHero';
import OnlineStatus from './usta-detail/OnlineStatus';
import StatsRow from './usta-detail/StatsRow';
import BadgesRow from './usta-detail/BadgesRow';
import SpecializationChips from './usta-detail/SpecializationChips';
import ServicesSection from './usta-detail/ServicesSection';
import AvailableTimes from './usta-detail/AvailableTimes';
import CertificatesSection from './usta-detail/CertificatesSection';
import WorksSection from './usta-detail/WorksSection';
import RatingSummary from './usta-detail/RatingSummary';
import ReviewsSection from './usta-detail/ReviewsSection';
import BottomCta from './usta-detail/BottomCta';
import { getUstaDetailView } from './usta-detail/view';
import { C } from './usta-detail/theme';

export default function UstaDetailScreen({
  usta,
  onBack,
  onGoToLogin,
  isLoggedIn = false,
}) {
  const insets = useSafeAreaInsets();
  const [reviewFilter, setReviewFilter] = useState('all');
  const [selectedSpec, setSelectedSpec] = useState(null);

  const {
    initial,
    name,
    trade,
    rating,
    jobs,
    bgColor,
    location,
    experience,
    repeatRate,
    reviewCount,
    startingPrice,
    specs,
    specServices,
    specTimes,
    specCerts,
    specWorks,
    bars,
    ratingValue,
    ratingCount,
    shownReviews,
  } = getUstaDetailView(usta, { selectedSpec, reviewFilter });

  return (
    <SafeAreaView style={st.safe} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />

      <DetailHeader name={name} trade={trade} rating={rating} onBack={onBack} isLoggedIn={isLoggedIn} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom, 14) + 76,
        }}
      >
        {/* ═══ Padded content block 1 ═══ */}
        <View style={st.pad}>
          <UstaHero initial={initial} bgColor={bgColor} name={name} trade={trade} location={location} rating={rating} reviewCount={reviewCount} />

          {isLoggedIn && <OnlineStatus />}

          <StatsRow jobs={jobs} experience={experience} repeatRate={repeatRate} />

          <BadgesRow />

          <SpecializationChips specs={specs} selectedSpec={selectedSpec} onSelect={setSelectedSpec} />

          <ServicesSection services={specServices} />

          {isLoggedIn && <AvailableTimes times={specTimes} />}

          <CertificatesSection certs={specCerts} />
        </View>

        <WorksSection works={specWorks} />

        {/* ═══ Padded content block 2 ═══ */}
        <View style={st.pad}>
          <RatingSummary ratingValue={ratingValue} ratingCount={ratingCount} bars={bars} />

          <ReviewsSection reviews={shownReviews} filter={reviewFilter} onFilterChange={setReviewFilter} />
        </View>
      </ScrollView>

      <BottomCta startingPrice={startingPrice} isLoggedIn={isLoggedIn} onGoToLogin={onGoToLogin} />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.bg },
  pad: { paddingHorizontal: 20 },
});
