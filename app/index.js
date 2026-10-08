import { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { COLORS } from '../src/constants/colors';
import AfishLoader from '../src/components/AfishLoader';
import HomeScreen from '../src/screens/home/HomeScreen';
import { getToken, getActorType } from '../src/utils/token';

// Saqlangan sessiya bo'lsa, ustani to'g'ridan-to'g'ri kabinetiga yuboradi.
// Mijoz oqimi hali alohida ekranga ega emas: u bosh sahifada qoladi.
async function resolveStartRoute() {
  try {
    const token = await getToken();
    if (token && (await getActorType()) === 'worker') return 'usta';
  } catch {
    // Token o'qib bo'lmasa — mehmon sifatida bosh sahifa ochiladi.
  }
  return 'home';
}

export default function Index() {
  const router = useRouter();
  const [start, setStart] = useState(null);

  useEffect(() => {
    resolveStartRoute().then(setStart);
  }, []);

  if (start === null) {
    return (
      <View style={styles.loader}>
        <AfishLoader size={160} />
      </View>
    );
  }

  if (start === 'usta') return <Redirect href="/usta" />;

  return (
    <HomeScreen
      onLogin={() => router.push('/login')}
      onSelectUsta={(usta) =>
        router.push({ pathname: '/usta-detail', params: { usta: JSON.stringify(usta) } })
      }
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.bg,
  },
});
