import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

// Usta rad etsa yoki qabul qilsa e'lon ro'yxatdan olib tashlanadi — qabul
// qilinganda mijoz shu ustaga eksklyuziv bog'lanadi (boshqa ustaga
// buyurtma bera olmay qoladi), shu sabab tasdiqlash xabarida shu alohida
// ta'kidlanadi.
export default function BuyurtmalarScreen({ t, categories = [], elonlar = [] }) {
  const [list, setList] = useState(elonlar);
  const [activeCategory, setActiveCategory] = useState('Barchasi');

  const chips = ['Barchasi', ...categories.map((c) => c.name)];
  const filtered =
    activeCategory === 'Barchasi'
      ? list
      : list.filter((e) => e.category === activeCategory);

  const handleDecision = (elon, accepted) => {
    setList((prev) => prev.filter((e) => e.id !== elon.id));
    if (accepted) {
      Alert.alert(
        'Qabul qilindi',
        `${elon.client.name} endi sizga bog'landi — bu mijoz endi faqat sizga buyurtma bera oladi.`
      );
    }
  };

  const openElon = (elon) => {
    Alert.alert(
      elon.client.name,
      `${elon.title}\n\n${elon.description}\n\n${elon.address} • ${elon.budget} so'm`,
      [
        { text: 'Rad etish', style: 'destructive', onPress: () => handleDecision(elon, false) },
        { text: 'Qabul qilish', onPress: () => handleDecision(elon, true) },
        { text: 'Bekor qilish', style: 'cancel' },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top', 'left', 'right']}>
      <StatusBar style={t.isDark ? 'light' : 'dark'} />

      <View style={s.header}>
        <Text style={[s.headerTitle, { color: t.text }]}>Buyurtmalar</Text>
        <Text style={{ fontSize: 12.5, color: t.muted, marginTop: 3 }}>
          Kategoriyangiz bo'yicha tushgan ochiq e'lonlar
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 8, paddingBottom: 14 }}
        style={{ flexGrow: 0 }}
      >
        {chips.map((name) => {
          const on = name === activeCategory;
          return (
            <TouchableOpacity
              key={name}
              style={[
                s.chip,
                {
                  backgroundColor: on ? t.orange : t.rowIconBg,
                  borderColor: on ? t.orange : t.border,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setActiveCategory(name)}
            >
              <Text
                style={{
                  fontSize: 12.5,
                  fontWeight: '700',
                  color: on ? '#fff' : t.muted,
                }}
              >
                {name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110, gap: 10 }}
      >
        {filtered.length === 0 ? (
          <View style={[s.emptyCard, { backgroundColor: t.card, borderColor: t.border }]}>
            <MaterialCommunityIcons name="clipboard-text-off-outline" size={26} color={t.faint} />
            <Text style={{ fontSize: 12.5, color: t.muted, marginTop: 8, textAlign: 'center' }}>
              Bu kategoriyada hozircha yangi e'lon yo'q
            </Text>
          </View>
        ) : (
          filtered.map((e) => (
            <TouchableOpacity
              key={e.id}
              style={[s.card, { backgroundColor: t.card, borderColor: t.border }]}
              activeOpacity={0.8}
              onPress={() => openElon(e)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={[s.avatarBox, { backgroundColor: e.client.color }]}>
                  <Text style={{ color: '#fff', fontWeight: '800', fontSize: 15 }}>
                    {e.client.initial}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{ fontSize: 13.5, fontWeight: '700', color: t.text }}
                    numberOfLines={1}
                  >
                    {e.client.name}
                  </Text>
                  <Text style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>
                    {e.postedAgo}
                  </Text>
                </View>
                <View style={[s.catTag, { backgroundColor: e.color + '1c' }]}>
                  <MaterialCommunityIcons name={e.icon} size={12} color={e.color} />
                  <Text style={{ fontSize: 10.5, fontWeight: '700', color: e.color }}>
                    {e.category}
                  </Text>
                </View>
              </View>

              <Text
                style={{ fontSize: 13.5, fontWeight: '700', color: t.text, marginTop: 10 }}
                numberOfLines={1}
              >
                {e.title}
              </Text>
              <Text
                style={{ fontSize: 12, color: t.muted, marginTop: 3, lineHeight: 17 }}
                numberOfLines={2}
              >
                {e.description}
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginTop: 10,
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: t.border,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 }}>
                  <Ionicons name="location-outline" size={12} color={t.faint} />
                  <Text style={{ fontSize: 11, color: t.faint }} numberOfLines={1}>
                    {e.address}
                  </Text>
                </View>
                <Text style={{ fontSize: 12.5, fontWeight: '800', color: t.orange }}>
                  {e.budget} so'm
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
  },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.4 },

  chip: {
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
  },
  avatarBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },

  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    marginTop: 20,
  },
});
