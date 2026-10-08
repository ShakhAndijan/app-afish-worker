import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Avatar from '../../components/Avatar';

export default function HomeHeader({ t, user, online, onToggleOnline }) {
  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Usta';
  const initial = (user?.first_name ?? user?.last_name ?? 'U')
    .charAt(0)
    .toUpperCase();

  return (
    <>
      {/* ── Header ── */}
      <View style={s.header}>
        <View style={s.headerRow}>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}
          >
            <Avatar letter={initial} bgColor={t.orange} uri={user?.profile_photo} />
            <View>
              <Text style={{ fontSize: 11.5, color: t.muted }}>
                Usta kabineti
              </Text>
              <Text
                style={{ fontWeight: '700', fontSize: 15.5, color: t.text }}
              >
                {fullName}
              </Text>
            </View>
          </View>
          <View style={[s.bellBtn, { backgroundColor: t.card, borderColor: t.border }]}>
            <Ionicons
              name="notifications-outline"
              size={20}
              color={t.muted}
            />
            <View style={[s.bellDot, { backgroundColor: t.orange, borderColor: t.card }]} />
          </View>
        </View>

        {/* Online toggle */}
        <View
          style={[
            s.onlineRow,
            {
              backgroundColor: online
                ? 'rgba(47,163,122,0.13)'
                : t.rowIconBg,
              borderColor: online ? 'rgba(47,163,122,0.4)' : t.border,
            },
          ]}
        >
          <View
            style={[
              s.onlineDot,
              { backgroundColor: online ? t.green : t.faint },
            ]}
          />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontWeight: '800',
                fontSize: 13.5,
                color: online ? t.green : t.text,
              }}
            >
              {online ? 'Onlayn — buyurtma qabul qilinmoqda' : 'Oflayn'}
            </Text>
            <Text
              style={{
                fontSize: 11.5,
                color: t.muted,
                fontWeight: '600',
                marginTop: 2,
              }}
            >
              {online
                ? "Mijozlar sizni qidiruvda ko'radi"
                : 'Yangi buyurtmalar kelmaydi'}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onToggleOnline}
            style={[
              s.track,
              { backgroundColor: online ? t.green : '#33425a' },
            ]}
            activeOpacity={0.85}
          >
            <View style={[s.thumb, { left: online ? 21 : 3 }]} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 15,
    padding: 13,
    paddingHorizontal: 15,
    marginTop: 16,
    borderWidth: 1,
  },
  onlineDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  track: { width: 44, height: 26, borderRadius: 999, justifyContent: 'center' },
  thumb: {
    position: 'absolute',
    top: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
});
