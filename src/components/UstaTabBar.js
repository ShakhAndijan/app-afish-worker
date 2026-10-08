import { useTheme } from '../context/ThemeContext';
import BottomNav from './BottomNav';

// `key` — app/usta/(tabs)/ ichidagi route nomi bilan bir xil.
const USTA_TABS = [
  { key: 'index', label: 'Asosiy', on: 'home', off: 'home-outline' },
  { key: 'orders', label: 'Buyurtmalar', on: 'grid', off: 'grid-outline' },
  { key: 'wallet', label: 'Hamyon', on: 'wallet', off: 'wallet-outline' },
  { key: 'profile', label: 'Profil', on: 'person', off: 'person-outline' },
];

/** expo-router `Tabs` uchun maxsus tab bar: mavjud BottomNav dizaynini saqlaydi. */
export default function UstaTabBar({ state, navigation }) {
  const { theme: t } = useTheme();
  const activeKey = state.routes[state.index].name;

  const handleTabChange = (key) => {
    const route = state.routes.find((r) => r.name === key);
    const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
    if (!event.defaultPrevented && key !== activeKey) navigation.navigate(route.name, route.params);
  };

  return (
    <BottomNav
      activeTab={activeKey}
      onTabChange={handleTabChange}
      tabs={USTA_TABS}
      accent={t.orange}
      background={t.navBg}
      border={t.border}
      muted={t.faint}
      ringColor={t.bg}
    />
  );
}
