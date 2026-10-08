import { useEffect, useState } from 'react';
import { View, ScrollView, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import { useUser } from '../../context/UserContext';
import { useUstaData } from '../../context/UstaDataContext';
import { useProfileCompletion } from '../../hooks/useProfileCompletion';
import ProfileCompletionCard from '../../components/ProfileCompletionCard';
import ReviewDetailSheet from '../../components/ReviewDetailSheet';
import { MY_WORKS, LINKED_ELONLAR, ALL_ELONLAR } from './data';
import HomeHeader from './HomeHeader';
import ActivityStats from './ActivityStats';
import WeeklyEarningsCard from './WeeklyEarningsCard';
import RecentReviews from './RecentReviews';
import FinanceSection from './FinanceSection';
import MyCategoriesSection from './MyCategoriesSection';
import RecentWorksSection from './RecentWorksSection';
import LinkedElonlarSection from './LinkedElonlarSection';
import GeneralElonlarSection from './GeneralElonlarSection';

export default function UstaHomeScreen() {
  const router = useRouter();
  const { theme: t } = useTheme();
  const { user, refreshUser } = useUser();
  const { categories } = useUstaData();
  const { isComplete: profileComplete } = useProfileCompletion(user);
  const [online, setOnline] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [linkedElonlar, setLinkedElonlar] = useState(LINKED_ELONLAR);
  const [refreshing, setRefreshing] = useState(false);

  const goToProfile = () => router.navigate('/usta/profile');
  const openWork = (work) => router.push(`/usta/work/${work.id}`);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
  };

  // Profil to'liq bo'lmagan hisob "onlayn" holatida ochilib qolmasin.
  useEffect(() => {
    if (user && !profileComplete) setOnline(false);
  }, [user, profileComplete]);

  const handleToggleOnline = () => {
    if (!online && !profileComplete) {
      Alert.alert(
        "Profilni to'ldiring",
        "Buyurtma qabul qilish uchun avval ma'lumotlaringizni to'ldirishingiz kerak.",
        [
          { text: 'Bekor qilish', style: 'cancel' },
          { text: "To'ldirish", onPress: goToProfile },
        ]
      );
      return;
    }
    setOnline((o) => !o);
  };

  const handleLinkedElonDecision = (elon, accepted) => {
    setLinkedElonlar((prev) => prev.filter((e) => e.id !== elon.id));
    if (accepted) {
      Alert.alert('Qabul qilindi', `${elon.client.name} bilan buyurtma tasdiqlandi.`);
    }
  };

  const openLinkedElon = (elon) => {
    Alert.alert(
      elon.client.name,
      `${elon.title}\n\n${elon.description}\n\n${elon.address} • ${elon.budget} so'm`,
      [
        { text: 'Rad etish', style: 'destructive', onPress: () => handleLinkedElonDecision(elon, false) },
        { text: 'Qabul qilish', onPress: () => handleLinkedElonDecision(elon, true) },
        { text: 'Bekor qilish', style: 'cancel' },
      ]
    );
  };

  const reviewWork = selectedReview
    ? MY_WORKS.find((w) => w.id === selectedReview.workId)
    : null;

  const openClientFromReview = (client) => {
    if (!client) return;
    setSelectedReview(null);
    router.push(`/usta/client/${client.id}`);
  };

  const openWorkFromReview = (work) => {
    if (!work) return;
    setSelectedReview(null);
    openWork(work);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: t.bg }}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={t.isDark ? 'light' : 'dark'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={t.orange}
            colors={[t.orange]}
          />
        }
      >
        <HomeHeader
          t={t}
          user={user}
          online={online}
          onToggleOnline={handleToggleOnline}
        />

        {/* ── Profil to'ldirilishi ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
          <ProfileCompletionCard
            user={user}
            theme={t}
            onPressComplete={goToProfile}
          />
        </View>

        {/* ── Sizga tegishli e'lonlar ── */}
        <LinkedElonlarSection t={t} elonlar={linkedElonlar} onOpen={openLinkedElon} />

        <ActivityStats t={t} />

        <WeeklyEarningsCard t={t} onPress={() => router.push('/usta/earnings')} />

        {/* ── Mening kategoriyalarim ── */}
        <MyCategoriesSection
          t={t}
          categories={categories}
          onSelect={(c) => router.push(`/usta/category/${c.id}`)}
        />

        {/* ── Bajarilgan ishlar ── */}
        <RecentWorksSection t={t} onSelect={openWork} />

        <RecentReviews t={t} onSelect={setSelectedReview} />

        <FinanceSection
          t={t}
          onWithdraw={() => router.push('/usta/withdraw')}
          onShowHistory={() => router.push('/usta/payments')}
        />

        {/* ── Yangi e'lonlar (umumiy) ── */}
        <GeneralElonlarSection
          t={t}
          elonlar={ALL_ELONLAR}
          onOpenAll={() => router.navigate('/usta/orders')}
        />
      </ScrollView>

      <ReviewDetailSheet
        visible={!!selectedReview}
        review={selectedReview}
        work={reviewWork}
        client={reviewWork?.client}
        onClose={() => setSelectedReview(null)}
        onOpenClient={openClientFromReview}
        onOpenWork={openWorkFromReview}
        t={t}
      />
    </SafeAreaView>
  );
}
