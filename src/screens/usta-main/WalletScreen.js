import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';
import FinanceSection from './FinanceSection';
import WeeklyEarningsCard from './WeeklyEarningsCard';

/** "Hamyon" tabi: balans, pul yechish/tarix va haftalik daromad. */
export default function WalletScreen() {
  const { theme: t } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <FinanceSection
          t={t}
          onWithdraw={() => router.push('/usta/withdraw')}
          onShowHistory={() => router.push('/usta/payments')}
        />
        <WeeklyEarningsCard t={t} onPress={() => router.push('/usta/earnings')} />
      </ScrollView>
    </SafeAreaView>
  );
}
