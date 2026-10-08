import { Tabs } from 'expo-router';
import UstaTabBar from '../../../src/components/UstaTabBar';

export default function UstaTabsLayout() {
  return (
    <Tabs tabBar={(props) => <UstaTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="wallet" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
