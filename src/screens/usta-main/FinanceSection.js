import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SectionHeader from '../../components/SectionHeader';
import { formatAmount } from '../../utils/format';
import { BALANCE } from './data';
import { shared } from './styles';

export default function FinanceSection({ t, onWithdraw, onShowHistory }) {
  return (
    <>
      {/* ── Moliya ── */}
      <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
        <SectionHeader theme={t} title="Moliya" />
      </View>

      {/* ── Balance card ── */}
      <View style={{ paddingHorizontal: 20 }}>
        <View style={[s.balanceCard, { backgroundColor: t.orange }]}>
          <View style={s.balanceCircle} />
          <View
            style={{
              position: 'absolute',
              right: 14,
              bottom: 14,
              opacity: 0.16,
            }}
          >
            <MaterialCommunityIcons name="wallet" size={56} color="#fff" />
          </View>
          <Text style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.92)' }}>
            Hisobingizdagi mablag'
          </Text>
          <Text style={s.balanceAmt}>
            {formatAmount(BALANCE)} <Text style={s.balanceCur}>so'm</Text>
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
            <TouchableOpacity
              style={s.btnWhite}
              activeOpacity={0.8}
              onPress={onWithdraw}
            >
              <Text
                style={{ color: t.orangeD, fontWeight: '700', fontSize: 13 }}
              >
                Pul yechish
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={s.btnOutline}
              activeOpacity={0.8}
              onPress={onShowHistory}
            >
              <Text
                style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}
              >
                Tarix
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── Today / Week ── */}
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          marginTop: 16,
          gap: 12,
        }}
      >
        {[
          { label: 'Bugun', val: '340 000', sub: '4 buyurtma' },
          { label: 'Bu hafta', val: '1.8M', sub: "↑ 12% o'sish" },
        ].map((item, i) => (
          <View
            key={i}
            style={[shared.miniCard, { flex: 1, backgroundColor: t.card, borderColor: t.border }]}
          >
            <Text style={{ fontSize: 11.5, color: t.muted }}>
              {item.label}
            </Text>
            <Text
              style={{
                fontWeight: '800',
                fontSize: 20,
                color: t.text,
                marginTop: 5,
              }}
            >
              {item.val}
            </Text>
            <Text style={{ fontSize: 10.5, color: t.green, marginTop: 2 }}>
              {item.sub}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}

const s = StyleSheet.create({
  balanceCard: {
    borderRadius: 22,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  balanceCircle: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  balanceAmt: {
    fontWeight: '800',
    fontSize: 32,
    color: '#fff',
    marginTop: 6,
    letterSpacing: -0.5,
  },
  balanceCur: { fontSize: 16, fontWeight: '600' },
  btnWhite: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  btnOutline: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
});
