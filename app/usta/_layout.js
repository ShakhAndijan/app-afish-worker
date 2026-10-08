import { Stack } from 'expo-router';
import { UserProvider } from '../../src/context/UserContext';
import { UstaDataProvider } from '../../src/context/UstaDataContext';

// Foydalanuvchi ma'lumoti (`/auth/me`) faqat kabinetga kirilganda yuklanadi.
export default function UstaLayout() {
  return (
    <UserProvider>
      <UstaDataProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </UstaDataProvider>
    </UserProvider>
  );
}
