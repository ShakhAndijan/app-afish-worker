import { useTheme } from '../../../src/context/ThemeContext';
import { useUstaData } from '../../../src/context/UstaDataContext';
import BuyurtmalarScreen from '../../../src/screens/BuyurtmalarScreen';
import { ALL_ELONLAR } from '../../../src/screens/usta-main/data';

export default function OrdersTab() {
  const { theme: t } = useTheme();
  const { categories } = useUstaData();

  return <BuyurtmalarScreen t={t} categories={categories} elonlar={ALL_ELONLAR} />;
}
