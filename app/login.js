import { useRouter } from 'expo-router';
import { useGoBack } from '../src/hooks/useGoBack';
import LoginScreen from '../src/screens/LoginScreen';

export default function Login() {
  const router = useRouter();
  const goBack = useGoBack('/');

  return (
    <LoginScreen
      onBack={goBack}
      onLoginSuccess={(actorType) => router.replace(actorType === 'worker' ? '/usta' : '/')}
    />
  );
}
