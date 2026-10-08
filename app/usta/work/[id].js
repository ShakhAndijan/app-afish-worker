import { Redirect, useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../src/context/ThemeContext';
import { useGoBack } from '../../../src/hooks/useGoBack';
import WorkDetailScreen from '../../../src/screens/WorkDetailScreen';
import { MY_WORKS } from '../../../src/screens/usta-main/data';

export default function Work() {
  const router = useRouter();
  const goBack = useGoBack('/usta');
  const { theme: t } = useTheme();
  const { id } = useLocalSearchParams();
  const work = MY_WORKS.find((w) => String(w.id) === id);

  if (!work) return <Redirect href="/usta" />;

  return (
    <WorkDetailScreen
      work={work}
      t={t}
      onBack={goBack}
      onOpenClient={(client) => router.push(`/usta/client/${client.id}`)}
    />
  );
}
