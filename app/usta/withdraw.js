import { useTheme } from '../../src/context/ThemeContext';
import { useGoBack } from '../../src/hooks/useGoBack';
import WithdrawScreen from '../../src/screens/WithdrawScreen';
import { BALANCE } from '../../src/screens/usta-main/data';

export default function Withdraw() {
  const goBack = useGoBack('/usta');
  const { theme: t } = useTheme();

  return <WithdrawScreen t={t} balance={BALANCE} onBack={goBack} />;
}
