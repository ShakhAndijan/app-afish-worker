import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import SuccessModal from '../components/SuccessModal';

const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const onlyDigits = (str) => (str || '').replace(/\D/g, '');
const PAYOUT_CARDS = [
  { id: 'humo', label: "Humo ··42", icon: 'credit-card-outline' },
  { id: 'uzcard', label: "Uzcard ··18", icon: 'credit-card-outline' },
];
const AMOUNT_PRESETS = [25, 50, 100];

export default function WithdrawScreen({ t, balance = 1840000, onBack }) {
  const insets = useSafeAreaInsets();
  const [amount, setAmount] = useState('');
  const [cardId, setCardId] = useState(PAYOUT_CARDS[0].id);
  const [success, setSuccess] = useState(null);

  const numeric = Number(onlyDigits(amount));
  const overLimit = numeric > balance;
  const ok = numeric > 0 && !overLimit;

  const applyPreset = (pct) => {
    setAmount(String(Math.round((balance * pct) / 100)));
  };

  const handleConfirm = () => {
    if (!ok) return;
    const card = PAYOUT_CARDS.find((c) => c.id === cardId);
    setSuccess({ amount: numeric, card });
  };

  const handleSuccessClose = () => {
    setSuccess(null);
    onBack?.();
  };

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
          Pul yechish
        </Text>
        <View style={s.iconBtn} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 6, paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Mavjud mablag' ── */}
          <View style={[s.balanceCard, { overflow: 'hidden' }]}>
            <View style={s.balanceCircle} />
            <View style={{ position: 'absolute', right: 14, bottom: 14, opacity: 0.16 }}>
              <MaterialCommunityIcons name="wallet" size={56} color="#fff" />
            </View>
            <Text style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.92)' }}>
              Mavjud mablag'
            </Text>
            <Text style={s.balanceAmt}>
              {fmt(balance)} <Text style={s.balanceCur}>so'm</Text>
            </Text>
          </View>

          {/* ── Summa ── */}
          <Text style={[s.fieldLabel, { color: t.muted }]}>Summani kiriting</Text>
          <View
            style={[
              s.amountWrap,
              { backgroundColor: t.inputBg, borderColor: overLimit ? t.red : t.border },
            ]}
          >
            <TextInput
              style={[s.amountInput, { color: t.text }]}
              value={amount}
              onChangeText={(v) => setAmount(onlyDigits(v))}
              keyboardType="number-pad"
              placeholder="0"
              placeholderTextColor={t.faint}
              autoFocus
            />
            <Text style={{ fontSize: 16, color: t.faint, fontWeight: '600' }}>so'm</Text>
          </View>
          {overLimit && (
            <Text style={{ fontSize: 11.5, color: t.red, marginTop: 6 }}>
              Mavjud mablag'dan oshib ketdi
            </Text>
          )}

          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            {AMOUNT_PRESETS.map((pct) => (
              <TouchableOpacity
                key={pct}
                style={[s.presetChip, { backgroundColor: t.rowIconBg, borderColor: t.border }]}
                activeOpacity={0.8}
                onPress={() => applyPreset(pct)}
              >
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: t.text }}>
                  {pct === 100 ? 'Hammasi' : `${pct}%`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ── Karta tanlash ── */}
          <Text style={[s.fieldLabel, { color: t.muted, marginTop: 26 }]}>
            Qaysi kartaga o'tkazilsin
          </Text>
          <View style={{ gap: 10, marginTop: 10 }}>
            {PAYOUT_CARDS.map((c) => {
              const on = c.id === cardId;
              return (
                <TouchableOpacity
                  key={c.id}
                  style={[
                    s.cardOption,
                    { backgroundColor: on ? t.orange + '14' : t.rowIconBg, borderColor: on ? t.orange : t.border },
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setCardId(c.id)}
                >
                  <MaterialCommunityIcons name={c.icon} size={20} color={on ? t.orange : t.muted} />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: t.text, flex: 1 }}>
                    {c.label}
                  </Text>
                  <View style={[s.radio, { borderColor: on ? t.orange : t.faint }]}>
                    {on && <View style={[s.radioDot, { backgroundColor: t.orange }]} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={[s.noteBox, { backgroundColor: t.rowIconBg, marginTop: 20 }]}>
            <MaterialCommunityIcons name="information-outline" size={16} color={t.faint} />
            <Text style={{ fontSize: 12, color: t.muted, flex: 1, lineHeight: 17 }}>
              Mablag' 1-3 ish kuni ichida kartangizga tushadi
            </Text>
          </View>
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 20,
            paddingTop: 10,
            paddingBottom: Math.max(insets.bottom, 14) + 10,
          }}
        >
          <TouchableOpacity
            style={[s.confirmBtn, { backgroundColor: ok ? t.orange : t.rowIconBg }]}
            onPress={handleConfirm}
            activeOpacity={0.85}
            disabled={!ok}
          >
            <Text style={{ color: ok ? '#fff' : t.faint, fontWeight: '700', fontSize: 15 }}>
              Pul yechish
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={!!success}
        onClose={handleSuccessClose}
        t={t}
        title="So'rov qabul qilindi"
        message={
          success
            ? `${fmt(success.amount)} so'm ${success.card?.label} kartasiga 1-3 ish kuni ichida o'tkaziladi.`
            : ''
        }
        buttonText="Tushunarli"
      />
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

  balanceCard: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: '#e87a45',
    position: 'relative',
    marginTop: 6,
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
    fontSize: 28,
    color: '#fff',
    marginTop: 6,
    letterSpacing: -0.5,
  },
  balanceCur: { fontSize: 15, fontWeight: '600' },

  fieldLabel: { fontSize: 12, fontWeight: '700', marginTop: 22 },
  amountWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 10,
  },
  amountInput: { flex: 1, fontSize: 20, fontWeight: '800', padding: 0 },
  presetChip: {
    flex: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
  },
  cardOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 12,
    padding: 12,
  },
  confirmBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
});
