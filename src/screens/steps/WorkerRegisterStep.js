import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { authComplete } from '../../api/auth';
import { saveToken, saveRefreshToken, saveActorType } from '../../utils/token';

// Telefon start/verify orqali allaqachon tasdiqlangan (ticket shu buni
// isbotlaydi) — shu sabab bu yerda faqat ism-familiya so'raladi, qolgan
// profil ma'lumotlari (rasm, bio, kategoriya) keyinroq profilda to'ldiriladi.
function CtaBtn({ label, onPress, disabled, loading }) {
  const blocked = disabled || loading;
  return (
    <TouchableOpacity
      style={[ct.btn, blocked && ct.disabled]}
      onPress={blocked ? undefined : onPress}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <>
          <Text style={[ct.txt, disabled && ct.disabledTxt]}>{label}</Text>
          <Ionicons name="checkmark" size={18} color={disabled ? COLORS.faint : '#fff'} />
        </>
      )}
    </TouchableOpacity>
  );
}
const ct = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 56,
    borderRadius: 16,
    marginHorizontal: 20,
    backgroundColor: COLORS.orange,
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  disabled: { backgroundColor: '#1e2f42', shadowOpacity: 0, elevation: 0 },
  txt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  disabledTxt: { color: COLORS.faint },
});

function RegisterErrorModal({ message, onClose }) {
  return (
    <Modal transparent visible={!!message} animationType="fade" onRequestClose={onClose}>
      <View style={ex.overlay}>
        <View style={ex.card}>
          <View style={ex.ring}>
            <View style={ex.badge}>
              <Ionicons name="alert-circle-outline" size={30} color="#fff" />
            </View>
          </View>
          <Text style={ex.title}>Xatolik yuz berdi</Text>
          <Text style={ex.desc}>{message}</Text>
          <TouchableOpacity style={ex.btn} onPress={onClose} activeOpacity={0.85}>
            <Text style={ex.btnTxt}>Qayta urinib ko'rish</Text>
            <Ionicons name="refresh" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const ex = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.card,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingTop: 28,
    paddingBottom: 22,
    paddingHorizontal: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 12,
  },
  ring: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(224,49,49,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e03131',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#e03131',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  desc: {
    fontSize: 14,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    alignSelf: 'stretch',
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.orange,
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  btnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
});

const sh = StyleSheet.create({
  flex: { flex: 1 },
  body: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  eyebrow: {
    fontSize: 11.5,
    fontWeight: '700',
    color: COLORS.orange,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  h1: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  sub: { fontSize: 14, color: COLORS.muted, lineHeight: 21, marginBottom: 20 },
  label: {
    fontSize: 12.5,
    fontWeight: '600',
    color: COLORS.muted,
    marginBottom: 6,
  },
  req: { color: COLORS.orange },
  control: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 15,
    gap: 10,
    marginBottom: 13,
  },
  controlFilled: { borderColor: 'rgba(232,122,69,0.5)' },
  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.white,
    fontWeight: '500',
    padding: 0,
  },
  note: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 16,
    backgroundColor: COLORS.card,
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  noteTxt: { fontSize: 12.5, color: COLORS.muted, flex: 1, lineHeight: 18 },
  footer: { paddingBottom: 16, paddingTop: 8 },
});

const tn = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function WorkerRegisterStep({ onBack, onDone, ticket }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [finishError, setFinishError] = useState('');

  const ok = firstName.trim() && lastName.trim();

  const finish = async () => {
    console.log('[WorkerRegisterStep] 5-jarayon: ro\'yxatdan o\'tish yakunlanmoqda', {
      ticket,
      firstName,
      lastName,
    });
    setLoading(true);
    setFinishError('');
    try {
      const resp = await authComplete(ticket, firstName.trim(), lastName.trim(), 'worker');
      if (resp?.access_token) await saveToken(resp.access_token);
      if (resp?.refresh_token) await saveRefreshToken(resp.refresh_token);
      await saveActorType('worker');
      console.log('[WorkerRegisterStep] ro\'yxatdan o\'tish tugadi -> kirildi', {
        already_registered: resp?.already_registered,
      });
      onDone();
    } catch (e) {
      console.log('[WorkerRegisterStep] complete xatolik', e.message);
      setFinishError(e.message || "Ro'yxatdan o'tishni yakunlashda muammo yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }} edges={['top', 'left', 'right']}>
      <View style={tn.row}>
        <TouchableOpacity style={tn.backBtn} onPress={onBack} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={20} color={COLORS.white} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={sh.flex}>
          <ScrollView contentContainerStyle={sh.body} keyboardShouldPersistTaps="handled">
            <Text style={[sh.h1, { textAlign: 'center' }]}>Sizni qanday chaqiraylik?</Text>
            <Text style={[sh.sub, { textAlign: 'center' }]}>
              Raqamingiz tasdiqlandi — endi ismingizni kiriting, qolganini keyinroq
              profilingizda to'ldirasiz.
            </Text>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 13 }}>
              <View style={{ flex: 1 }}>
                <Text style={sh.label}>
                  Ism <Text style={sh.req}>*</Text>
                </Text>
                <View style={[sh.control, firstName && sh.controlFilled]}>
                  <TextInput
                    style={sh.input}
                    placeholder="Ism"
                    placeholderTextColor={COLORS.faint}
                    value={firstName}
                    onChangeText={setFirstName}
                    autoFocus
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={sh.label}>
                  Familiya <Text style={sh.req}>*</Text>
                </Text>
                <View style={[sh.control, lastName && sh.controlFilled]}>
                  <TextInput
                    style={sh.input}
                    placeholder="Familiya"
                    placeholderTextColor={COLORS.faint}
                    value={lastName}
                    onChangeText={setLastName}
                  />
                </View>
              </View>
            </View>

            <View style={sh.note}>
              <Ionicons name="shield-checkmark-outline" size={17} color={COLORS.success} />
              <Text style={sh.noteTxt}>
                Ma'lumotlaringiz xavfsiz saqlanadi va uchinchi shaxslarga berilmaydi.
              </Text>
            </View>
          </ScrollView>

          <View style={sh.footer}>
            <CtaBtn label="Ro'yxatdan o'tish" onPress={finish} disabled={!ok} loading={loading} />
          </View>
        </View>
      </KeyboardAvoidingView>
      <RegisterErrorModal message={finishError} onClose={() => setFinishError('')} />
    </SafeAreaView>
  );
}
