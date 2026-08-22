import { useState, useRef, useEffect } from 'react';
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
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import PhoneInput from '../../components/login/PhoneInput';
import PasswordInput from '../../components/login/PasswordInput';
import {
  requestWorkerRegisterOtp,
  verifyWorkerRegisterOtp,
} from '../../api/auth';
import { saveToken, saveRefreshToken, saveActorType } from '../../utils/token';

const WORKER_REGISTRATION_SOURCE_ID = 1;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Register minimal: ism, familiya, email, parol — qolgan ma'lumotlar
// (rasm, bio, kategoriya, sertifikat) profil to'ldirish bosqichida yig'iladi.
const STEP_ORDER = ['phone', 'code', 'info'];
const TOTAL_STEPS = STEP_ORDER.length;
const PHONE_STEP = STEP_ORDER.indexOf('phone') + 1; // 1
const CODE_STEP = STEP_ORDER.indexOf('code') + 1; // 2
const INFO_STEP = STEP_ORDER.indexOf('info') + 1; // 3

const PASSWORD_RULES = [
  { key: 'length', label: 'Kamida 8 ta belgi', test: (pw) => pw.length >= 8 },
  { key: 'upper', label: '1 ta katta harf (A-Z)', test: (pw) => /[A-Z]/.test(pw) },
  { key: 'lower', label: '1 ta kichik harf (a-z)', test: (pw) => /[a-z]/.test(pw) },
  { key: 'digit', label: '1 ta raqam (0-9)', test: (pw) => /\d/.test(pw) },
  {
    key: 'special',
    label: '1 ta maxsus belgi (!@#$%)',
    test: (pw) => /[^A-Za-z0-9]/.test(pw),
  },
];

function PasswordRules({ password }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8, marginBottom: 13 }}>
      {PASSWORD_RULES.map((rule) => {
        const passed = rule.test(password);
        return (
          <View
            key={rule.key}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 7,
              width: '50%',
              marginBottom: 6,
              paddingRight: 6,
            }}
          >
            <Ionicons
              name={passed ? 'checkmark-circle' : 'ellipse-outline'}
              size={15}
              color={passed ? COLORS.success : COLORS.faint}
            />
            <Text
              style={{
                fontSize: 12,
                color: passed ? COLORS.success : COLORS.muted,
                fontWeight: passed ? '600' : '400',
                flexShrink: 1,
              }}
            >
              {rule.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

// ─── ProgressBar ─────────────────────────────────────────────────────────────
function ProgressBar({ step }) {
  return (
    <View style={pr.row}>
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <View
          key={i}
          style={[pr.seg, i + 1 < step && pr.done, i + 1 === step && pr.active]}
        />
      ))}
    </View>
  );
}
const pr = StyleSheet.create({
  row: { flexDirection: 'row', gap: 5, flex: 1 },
  seg: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  done: { backgroundColor: COLORS.success },
  active: { backgroundColor: COLORS.orange },
});

// ─── TopNav ──────────────────────────────────────────────────────────────────
function TopNav({ step, onBack, dimBack }) {
  return (
    <View style={tn.row}>
      <TouchableOpacity
        style={[tn.backBtn, dimBack && { opacity: 0.35 }]}
        onPress={onBack}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={20} color={COLORS.white} />
      </TouchableOpacity>
      <ProgressBar step={step} />
      <Text style={tn.counter}>
        {step}/{TOTAL_STEPS}
      </Text>
    </View>
  );
}
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
  counter: {
    fontSize: 12.5,
    color: COLORS.muted,
    fontWeight: '600',
    minWidth: 28,
  },
});

// ─── CtaBtn ──────────────────────────────────────────────────────────────────
function CtaBtn({ label, onPress, disabled, checkIcon, loading }) {
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
          <Ionicons
            name={checkIcon ? 'checkmark' : 'arrow-forward'}
            size={18}
            color={disabled ? COLORS.faint : '#fff'}
          />
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

// ─── Step: Phone ─────────────────────────────────────────────────────────────
const formatPhone = (raw) => {
  const d = raw.replace(/\D/g, '').slice(0, 9);
  let out = d.slice(0, 2);
  if (d.length > 2) out += ' ' + d.slice(2, 5);
  if (d.length > 5) out += ' ' + d.slice(5, 7);
  if (d.length > 7) out += ' ' + d.slice(7, 9);
  return out;
};

function StepPhone({ data, set, onNext, loading }) {
  const digits = data.phone.replace(/\D/g, '');
  const ok = digits.length === 9;
  return (
    <View style={sh.flex}>
      <ScrollView
        contentContainerStyle={sh.body}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../../../assets/afish-logo-vertical-pro.png')}
          style={{
            width: 220,
            height: 120,
            alignSelf: 'center',
            marginBottom: 20,
          }}
          resizeMode="contain"
        />
        <Text style={[sh.eyebrow, { textAlign: 'center' }]}>{PHONE_STEP}-QADAM</Text>
        <Text style={[sh.h1, { textAlign: 'center' }]}>Telefon raqamingiz</Text>
        <Text style={[sh.sub, { textAlign: 'center' }]}>
          Ro'yxatdan o'tish uchun raqam kiriting. Tasdiqlash kodi yuboriladi.
        </Text>

        <Text style={sh.label}>
          Telefon raqami <Text style={sh.req}>*</Text>
        </Text>
        <PhoneInput
          value={data.phone}
          onChangeText={(v) => set({ phone: v })}
          theme={{ isDark: true }}
          autoFocus
        />

        <View style={sh.note}>
          <Ionicons name="shield-checkmark-outline" size={17} color={COLORS.success} />
          <Text style={sh.noteTxt}>
            Raqamingiz faqat shaxsingizni tasdiqlash uchun ishlatiladi va boshqa maqsadlarda
            ishlatilmaydi.
          </Text>
        </View>
        <View style={sh.note}>
          <Ionicons name="chatbubble-ellipses-outline" size={17} color={COLORS.orange} />
          <Text style={sh.noteTxt}>
            Tasdiqlash kodi SMS orqali bir necha soniya ichida yetib boradi.
          </Text>
        </View>
      </ScrollView>
      <View style={sh.footer}>
        <CtaBtn label="SMS kod yuborish" onPress={onNext} disabled={!ok} loading={loading} />
      </View>
    </View>
  );
}

// ─── Step: OTP ───────────────────────────────────────────────────────────────
function StepCode({ data, set, onNext, devCode, onResend, resendLoading }) {
  const LEN = 6;
  const [digits, setDigits] = useState(Array(LEN).fill(''));
  const [secs, setSecs] = useState(59);
  const refs = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const onCh = (i, v) => {
    const val = v.replace(/\D/g, '').slice(-1);
    const nd = [...digits];
    nd[i] = val;
    setDigits(nd);
    set({ code: nd.join('') });
    if (val && i < LEN - 1) refs.current[i + 1]?.focus();
  };
  const onKey = (i, e) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[i] && i > 0)
      refs.current[i - 1]?.focus();
  };

  const handleResend = async () => {
    setSecs(59);
    setDigits(Array(LEN).fill(''));
    set({ code: '' });
    await onResend();
  };

  const ok = digits.every((d) => d !== '');
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <View style={sh.flex}>
      <ScrollView
        contentContainerStyle={sh.body}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../../../assets/afish-logo-vertical-pro.png')}
          style={{
            width: 220,
            height: 120,
            alignSelf: 'center',
            marginBottom: 20,
          }}
          resizeMode="contain"
        />
        <Text style={[sh.eyebrow, { textAlign: 'center' }]}>{CODE_STEP}-QADAM</Text>
        <Text style={[sh.h1, { textAlign: 'center' }]}>Tasdiqlash kodi</Text>
        <Text style={[sh.sub, { textAlign: 'center' }]}>
          <Text style={{ color: COLORS.white, fontWeight: '700' }}>
            +998 {formatPhone(data.phone) || '90 123 45 67'}
          </Text>{' '}
          raqamiga yuborilgan 6 xonali kodni kiriting.
        </Text>

        <View style={ot.row}>
          {digits.map((d, i) => (
            <TextInput
              key={i}
              ref={(el) => (refs.current[i] = el)}
              style={[ot.box, d && ot.boxFilled]}
              keyboardType="numeric"
              maxLength={1}
              value={d}
              onChangeText={(v) => onCh(i, v)}
              onKeyPress={(e) => onKey(i, e)}
              autoFocus={i === 0}
            />
          ))}
        </View>

        <View style={{ alignItems: 'center', marginBottom: 16 }}>
          {secs > 0 ? (
            <Text style={{ color: COLORS.muted, fontSize: 13.5 }}>
              Qayta yuborish{' '}
              <Text style={{ color: COLORS.orange, fontWeight: '700' }}>
                {mm}:{ss}
              </Text>
            </Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resendLoading}>
              {resendLoading ? (
                <ActivityIndicator size="small" color={COLORS.orange} />
              ) : (
                <Text
                  style={{
                    color: COLORS.orange,
                    fontSize: 13.5,
                    fontWeight: '600',
                  }}
                >
                  Qayta yuborish
                </Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {!!devCode && (
          <View style={sh.note}>
            <Ionicons
              name="information-circle-outline"
              size={17}
              color={COLORS.muted}
            />
            <Text style={sh.noteTxt}>
              Dev kod:{' '}
              <Text style={{ color: COLORS.orange, fontWeight: '700' }}>
                {devCode}
              </Text>
            </Text>
          </View>
        )}
      </ScrollView>
      <View style={sh.footer}>
        <CtaBtn label="Tasdiqlash" onPress={onNext} disabled={!ok} checkIcon />
      </View>
    </View>
  );
}
const ot = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    marginBottom: 16,
  },
  box: {
    width: 52,
    height: 60,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
  },
  boxFilled: {
    borderColor: COLORS.orange,
    backgroundColor: 'rgba(232,122,69,0.1)',
  },
});

// ─── Step: Personal info (minimal) ───────────────────────────────────────────
function StepInfo({ data, set, onFinish, loading }) {
  const passwordOk = PASSWORD_RULES.every((rule) => rule.test(data.password));
  const emailOk = EMAIL_REGEX.test(data.email.trim());
  const ok = data.first_name.trim() && data.last_name.trim() && emailOk && passwordOk;
  return (
    <View style={sh.flex}>
      <ScrollView
        contentContainerStyle={sh.body}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[sh.eyebrow, { textAlign: 'center' }]}>{INFO_STEP}-QADAM</Text>
        <Text style={[sh.h1, { textAlign: 'center' }]}>Shaxsiy ma'lumotlar</Text>
        <Text style={[sh.sub, { textAlign: 'center' }]}>
          Bo'lgani shu — qolganini keyinroq profilingizda to'ldirasiz.
        </Text>

        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 13 }}>
          <View style={{ flex: 1 }}>
            <Text style={sh.label}>
              Ism <Text style={sh.req}>*</Text>
            </Text>
            <View style={[sh.control, data.first_name && sh.controlFilled]}>
              <TextInput
                style={sh.input}
                placeholder="Ism"
                placeholderTextColor={COLORS.faint}
                value={data.first_name}
                onChangeText={(v) => set({ first_name: v })}
              />
            </View>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={sh.label}>
              Familiya <Text style={sh.req}>*</Text>
            </Text>
            <View style={[sh.control, data.last_name && sh.controlFilled]}>
              <TextInput
                style={sh.input}
                placeholder="Familiya"
                placeholderTextColor={COLORS.faint}
                value={data.last_name}
                onChangeText={(v) => set({ last_name: v })}
              />
            </View>
          </View>
        </View>

        <Text style={sh.label}>
          Email <Text style={sh.req}>*</Text>
        </Text>
        <View
          style={[
            sh.control,
            data.email && sh.controlFilled,
            data.email && !emailOk && { borderColor: '#e0473a' },
          ]}
        >
          <Ionicons name="mail-outline" size={19} color={COLORS.faint} />
          <TextInput
            style={sh.input}
            placeholder="email@misol.uz"
            placeholderTextColor={COLORS.faint}
            keyboardType="email-address"
            autoCapitalize="none"
            value={data.email}
            onChangeText={(v) => set({ email: v })}
          />
        </View>
        <Text
          style={{
            fontSize: 11.5,
            marginTop: 6,
            color: '#e0473a',
            opacity: data.email.length > 0 && !emailOk ? 1 : 0,
          }}
        >
          Email manzili noto'g'ri, masalan: email@misol.uz
        </Text>

        <Text style={[sh.label, { marginTop: 13 }]}>
          Parol <Text style={sh.req}>*</Text>
        </Text>
        <PasswordInput
          value={data.password}
          onChangeText={(v) => set({ password: v })}
          theme={{ isDark: true }}
          placeholder="Parol yarating"
        />
        <PasswordRules password={data.password} />

        <View style={sh.note}>
          <Ionicons name="shield-checkmark-outline" size={17} color={COLORS.success} />
          <Text style={sh.noteTxt}>
            Ma'lumotlaringiz xavfsiz saqlanadi va uchinchi shaxslarga berilmaydi.
          </Text>
        </View>
      </ScrollView>

      <View style={sh.footer}>
        <CtaBtn
          label="Ro'yxatdan o'tish"
          onPress={onFinish}
          disabled={!ok}
          loading={loading}
          checkIcon
        />
      </View>
    </View>
  );
}

// ─── OTP error modal ─────────────────────────────────────────────────────────
function OtpErrorModal({ message, onClose }) {
  return (
    <Modal
      transparent
      visible={!!message}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={oe.overlay}>
        <View style={oe.card}>
          <View style={oe.ring}>
            <View style={oe.badge}>
              <Ionicons name="hourglass-outline" size={30} color="#fff" />
            </View>
          </View>
          <Text style={oe.title}>Biroz kuting</Text>
          <Text style={oe.desc}>{message}</Text>
          <TouchableOpacity
            style={oe.btn}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={oe.btnTxt}>Tushunarli</Text>
            <Ionicons name="checkmark" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
const oe = StyleSheet.create({
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
    backgroundColor: 'rgba(232,122,69,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  badge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.orange,
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

// ─── Register error modal ────────────────────────────────────────────────────
function RegisterErrorModal({ message, onClose }) {
  return (
    <Modal
      transparent
      visible={!!message}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={ex.overlay}>
        <View style={ex.card}>
          <View style={ex.ring}>
            <View style={ex.badge}>
              <Ionicons name="alert-circle-outline" size={30} color="#fff" />
            </View>
          </View>
          <Text style={ex.title}>Xatolik yuz berdi</Text>
          <Text style={ex.desc}>{message}</Text>
          <TouchableOpacity
            style={ex.btn}
            onPress={onClose}
            activeOpacity={0.85}
          >
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

// ─── Main component ───────────────────────────────────────────────────────────
export default function WorkerRegisterStep({ onBack, onDone, initialPhone, initialCode }) {
  // OTP-login oqimida telefon allaqachon tasdiqlangan bo'lsa, to'g'ridan-to'g'ri
  // shaxsiy ma'lumot qadamiga o'tamiz — telefon/kod qayta so'ralmaydi.
  const preVerified = !!(initialPhone && initialCode);
  const [step, setStep] = useState(preVerified ? INFO_STEP : PHONE_STEP);
  const [loading, setLoading] = useState(false);
  const [devCode, setDevCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [finishError, setFinishError] = useState('');

  const [data, setData] = useState({
    phone: preVerified ? initialPhone.replace(/^\+998/, '').replace(/\D/g, '') : '',
    code: preVerified ? initialCode : '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const set = (patch) => setData((d) => ({ ...d, ...patch }));

  const sendOtp = async () => {
    const phone = '+998' + data.phone.replace(/\D/g, '');
    setLoading(true);
    try {
      const res = await requestWorkerRegisterOtp(phone);
      if (res.dev_code) setDevCode(res.dev_code);
      setStep((s) => s + 1);
    } catch (e) {
      setOtpError(e.message || 'OTP yuborishda muammo yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const afterCode = () => setStep((s) => s + 1);

  const back = () => {
    if (preVerified || step === PHONE_STEP) {
      onBack();
      return;
    }
    setStep((s) => s - 1);
  };

  const finish = async () => {
    const phone = '+998' + data.phone.replace(/\D/g, '');
    setLoading(true);
    try {
      const resp = await verifyWorkerRegisterOtp({
        phone,
        code: data.code,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        password: data.password,
        registration_source_id: WORKER_REGISTRATION_SOURCE_ID,
      });
      if (resp?.access_token) await saveToken(resp.access_token);
      if (resp?.refresh_token) await saveRefreshToken(resp.refresh_token);
      await saveActorType('worker');
      onDone();
    } catch (e) {
      setFinishError(
        e.message || "Ro'yxatdan o'tishni yakunlashda muammo yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      edges={['top', 'left', 'right']}
    >
      {!preVerified && <TopNav step={step} onBack={back} dimBack={step === PHONE_STEP} />}
      {preVerified && (
        <View style={tn.row}>
          <TouchableOpacity style={tn.backBtn} onPress={back} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {step === PHONE_STEP && !preVerified && (
          <StepPhone data={data} set={set} onNext={sendOtp} loading={loading} />
        )}
        {step === CODE_STEP && !preVerified && (
          <StepCode
            data={data}
            set={set}
            onNext={afterCode}
            devCode={devCode}
            onResend={sendOtp}
            resendLoading={loading}
          />
        )}
        {step === INFO_STEP && (
          <StepInfo data={data} set={set} onFinish={finish} loading={loading} />
        )}
      </KeyboardAvoidingView>
      <OtpErrorModal message={otpError} onClose={() => setOtpError('')} />
      <RegisterErrorModal message={finishError} onClose={() => setFinishError('')} />
    </SafeAreaView>
  );
}
