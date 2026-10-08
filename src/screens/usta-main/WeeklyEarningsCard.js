import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { WEEK, MAX_WEEK } from './data';
import { shared } from './styles';

export default function WeeklyEarningsCard({ t, onPress }) {
  return (
    <>
      {/* ── Weekly chart ── */}
      <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
        <TouchableOpacity
          style={[shared.miniCard, { backgroundColor: t.card, borderColor: t.border }]}
          activeOpacity={0.8}
          onPress={onPress}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <Text style={{ fontWeight: '700', fontSize: 14, color: t.text }}>
              Haftalik daromad
            </Text>
            <Text style={{ fontSize: 11.5, color: t.muted }}>
              so'm (ming)
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'flex-end',
              height: 80,
              marginTop: 16,
              gap: 6,
            }}
          >
            {WEEK.map((d, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end',
                }}
              >
                <View
                  style={{
                    width: '75%',
                    height: Math.round((d[1] / MAX_WEEK) * 72),
                    borderRadius: 6,
                    backgroundColor:
                      d[1] === MAX_WEEK ? t.orange : 'rgba(232,122,69,0.28)',
                  }}
                />
                <Text style={{ fontSize: 9.5, color: t.faint, marginTop: 6 }}>
                  {d[0]}
                </Text>
              </View>
            ))}
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              marginTop: 14,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: '700', color: t.orange }}>
              Barcha daromadlarni ko'rish
            </Text>
            <Ionicons name="chevron-forward" size={13} color={t.orange} />
          </View>
        </TouchableOpacity>
      </View>
    </>
  );
}
