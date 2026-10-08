import { Redirect, useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../../src/context/ThemeContext';
import { useGoBack } from '../../../src/hooks/useGoBack';
import ClientProfileScreen from '../../../src/screens/ClientProfileScreen';
import { CLIENTS, MY_WORKS } from '../../../src/screens/usta-main/data';

export default function Client() {
  const router = useRouter();
  const goBack = useGoBack('/usta');
  const { theme: t } = useTheme();
  const { id } = useLocalSearchParams();
  const client = Object.values(CLIENTS).find((c) => c.id === id);

  if (!client) return <Redirect href="/usta" />;

  return (
    <ClientProfileScreen
      client={client}
      works={MY_WORKS.filter((w) => w.client.id === client.id)}
      t={t}
      onBack={goBack}
      onSelectWork={(w) => router.push(`/usta/work/${w.id}`)}
    />
  );
}
