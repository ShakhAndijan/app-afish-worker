import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGoBack } from '../src/hooks/useGoBack';
import UstaDetailScreen from '../src/screens/UstaDetailScreen';

export default function UstaDetail() {
  const router = useRouter();
  const goBack = useGoBack('/');
  const { usta } = useLocalSearchParams();

  return (
    <UstaDetailScreen
      usta={JSON.parse(usta)}
      onBack={goBack}
      onGoToLogin={() => router.replace('/login')}
    />
  );
}
