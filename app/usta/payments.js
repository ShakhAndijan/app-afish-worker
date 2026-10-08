import { useGoBack } from '../../src/hooks/useGoBack';
import PaymentHistoryScreen from '../../src/screens/PaymentHistoryScreen';

export default function Payments() {
  const goBack = useGoBack('/usta');

  return <PaymentHistoryScreen onBack={goBack} />;
}
