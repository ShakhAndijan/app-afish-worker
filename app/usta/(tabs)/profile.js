import { useRouter } from 'expo-router';
import UstaProfileScreen from '../../../src/screens/UstaProfileScreen';
import { clearTokens } from '../../../src/utils/token';
import { clearCachedUser } from '../../../src/context/UserContext';

export default function ProfileTab() {
  const router = useRouter();

  const handleLogout = async () => {
    await clearTokens();
    await clearCachedUser();
    router.replace('/');
  };

  return (
    <UstaProfileScreen
      onLogout={handleLogout}
      onOpenEarnings={() => router.push('/usta/earnings')}
    />
  );
}
