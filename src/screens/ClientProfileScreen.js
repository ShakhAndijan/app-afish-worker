import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Avatar from '../components/Avatar';

export default function ClientProfileScreen({ client, works = [], t, onBack, onSelectWork }) {
  const insets = useSafeAreaInsets();
  if (!client) return null;

  const isRepeat = client.totalOrders > 1;
  const sortedWorks = [...works].sort((a, b) => b.id - a.id);
  const reviews = sortedWorks.filter((w) => w.clientReview);
  const lastOrderDate = sortedWorks[0]?.date?.split(',')[0] || '—';

  const categoryCounts = works.reduce((acc, w) => {
    acc[w.category] = (acc[w.category] || 0) + 1;
    return acc;
  }, {});
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0];

  const call = () => Linking.openURL(`tel:${client.phone.replace(/\s/g, '')}`).catch(() => {});

  const stats = [
    { icon: 'briefcase-check-outline', value: String(client.totalOrders), label: 'Buyurtma' },
    { icon: 'cash-multiple', value: client.totalSpent, label: "So'm sarflagan" },
    { icon: 'calendar-clock-outline', value: lastOrderDate, label: 'Oxirgi buyurtma' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top', 'left', 'right']}>
      <StatusBar style={t.isDark ? 'light' : 'dark'} />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={onBack}
          style={[s.iconBtn, { backgroundColor: t.card, borderColor: t.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: t.text }]} numberOfLines={1}>
          Mijoz profili
        </Text>
        <View style={s.iconBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 14) + 24,
        }}
      >
        {/* ── Hero ── */}
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <Avatar letter={client.initial} bgColor={client.color} size={78} />
          <Text style={{ fontSize: 19, fontWeight: '800', color: t.text, marginTop: 12 }}>
            {client.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 }}>
            <Ionicons name="location-outline" size={13} color={t.muted} />
            <Text style={{ fontSize: 12.5, color: t.muted }}>{client.location}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            {isRepeat && (
              <View style={[s.badge, { backgroundColor: 'rgba(47,163,122,0.14)' }]}>
                <MaterialCommunityIcons name="repeat-variant" size={13} color={t.green} />
                <Text style={{ fontSize: 11.5, fontWeight: '800', color: t.green }}>
                  Doimiy mijoz
                </Text>
              </View>
            )}
            <View style={[s.badge, { backgroundColor: t.rowIconBg }]}>
              <MaterialCommunityIcons name="calendar-account-outline" size={13} color={t.muted} />
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: t.muted }}>
                {client.memberSince}dan beri
              </Text>
            </View>
          </View>
          {isRepeat && topCategory && (
            <View style={[s.badge, { backgroundColor: t.rowIconBg, marginTop: 8 }]}>
              <MaterialCommunityIcons name="briefcase-outline" size={13} color={t.muted} />
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: t.muted }}>
                Ko'pincha: {topCategory}
              </Text>
            </View>
          )}
        </View>

        {/* ── Stats ── */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
          {stats.map((st, i) => (
            <View
              key={i}
              style={[s.miniCard, { flex: 1, backgroundColor: t.card, borderColor: t.border }]}
            >
              <MaterialCommunityIcons name={st.icon} size={18} color={t.orange} />
              <Text
                style={{ fontSize: 14.5, fontWeight: '800', color: t.text, marginTop: 8 }}
                numberOfLines={1}
              >
                {st.value}
              </Text>
              <Text style={{ fontSize: 10, color: t.muted, marginTop: 2, textAlign: 'center' }}>
                {st.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Aloqa ── */}
        <Text style={[s.secTitle, { color: t.text }]}>Aloqa</Text>
        <View style={[s.card, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={[s.contactIconBox, { backgroundColor: t.rowIconBg }]}>
              <Ionicons name="call-outline" size={16} color={t.muted} />
            </View>
            <Text style={{ fontSize: 13.5, color: t.text, fontWeight: '600', flex: 1 }}>
              {client.phone}
            </Text>
          </View>
          {!!client.fullAddress && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}>
              <View style={[s.contactIconBox, { backgroundColor: t.rowIconBg }]}>
                <Ionicons name="location-outline" size={16} color={t.muted} />
              </View>
              <Text style={{ fontSize: 13, color: t.muted, flex: 1, lineHeight: 18 }}>
                {client.fullAddress}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[s.callBtn, { backgroundColor: t.orange }]}
            activeOpacity={0.85}
            onPress={call}
          >
            <Ionicons name="call" size={16} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 13.5 }}>
              Qo'ng'iroq qilish
            </Text>
          </TouchableOpacity>
        </View>

        {/* ── Eslatma ── */}
        {!!client.note && (
          <>
            <Text style={[s.secTitle, { color: t.text }]}>Eslatma</Text>
            <View style={[s.noteCard, { backgroundColor: t.orange + '12', borderColor: t.orange + '30' }]}>
              <MaterialCommunityIcons name="note-text-outline" size={17} color={t.orange} />
              <Text style={{ fontSize: 13, color: t.text, flex: 1, lineHeight: 19 }}>
                {client.note}
              </Text>
            </View>
          </>
        )}

        {/* ── Buyurtmalar tarixi ── */}
        <Text style={[s.secTitle, { color: t.text }]}>Buyurtmalar tarixi</Text>
        <View style={{ gap: 10 }}>
          {sortedWorks.map((w) => (
            <TouchableOpacity
              key={w.id}
              style={[s.workRow, { backgroundColor: t.card, borderColor: t.border }]}
              activeOpacity={0.8}
              onPress={() => onSelectWork?.(w)}
            >
              <View style={[s.workIconBox, { backgroundColor: w.color + '20' }]}>
                <MaterialCommunityIcons name={w.icon} size={19} color={w.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }} numberOfLines={1}>
                  {w.title}
                </Text>
                <Text style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>{w.date}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={{ fontSize: 12.5, fontWeight: '800', color: t.text }}>
                  {w.price} so'm
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Ionicons name="star" size={11} color={t.gold} />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: t.gold }}>
                    {w.rating.toFixed(1)}
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={16} color={t.faint} />
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Sharhlari ── */}
        {reviews.length > 0 && (
          <>
            <Text style={[s.secTitle, { color: t.text }]}>Qoldirgan sharhlari</Text>
            <View style={{ gap: 10 }}>
              {reviews.map((w) => (
                <View
                  key={w.id}
                  style={[s.card, { backgroundColor: t.card, borderColor: t.border, padding: 14 }]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: t.muted, fontWeight: '600' }} numberOfLines={1}>
                      {w.title}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 1 }}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Ionicons
                          key={i}
                          name="star"
                          size={11}
                          color={i < w.clientReview.rating ? t.gold : t.border}
                        />
                      ))}
                    </View>
                  </View>
                  <Text
                    style={{ fontSize: 13, color: t.muted, marginTop: 9, lineHeight: 19, fontStyle: 'italic' }}
                  >
                    "{w.clientReview.text}"
                  </Text>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'transparent',
  },
  headerTitle: { fontSize: 16.5, fontWeight: '700', flex: 1, textAlign: 'center' },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
  },

  miniCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
    alignItems: 'center',
  },

  secTitle: { fontSize: 15, fontWeight: '800', marginTop: 22, marginBottom: 11 },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },

  noteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },

  contactIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtn: {
    marginTop: 14,
    height: 46,
    borderRadius: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  workRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  workIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
