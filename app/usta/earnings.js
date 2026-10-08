import { useRouter } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';
import { useUstaData } from '../../src/context/UstaDataContext';
import { useGoBack } from '../../src/hooks/useGoBack';
import EarningsScreen from '../../src/screens/EarningsScreen';
import { WEEK, MY_WORKS } from '../../src/screens/usta-main/data';

export default function Earnings() {
  const router = useRouter();
  const goBack = useGoBack('/usta');
  const { theme: t } = useTheme();
  const { categories } = useUstaData();

  return (
    <EarningsScreen
      t={t}
      week={WEEK}
      works={MY_WORKS}
      categories={categories}
      onBack={goBack}
      onSelectWork={(w) => router.push(`/usta/work/${w.id}`)}
    />
  );
}
