import { View, Text, Image, StyleSheet, ActivityIndicator, AppState } from 'react-native';
import { useState, useEffect, useRef } from 'react';

import { COLORS } from '../../constants/colors';
import BackBtn from '../../components/login/BackBtn';
import OtpInput from '../../components/login/OtpInput';
import PrimaryBtn from '../../components/login/PrimaryBtn';

import { formatPhone } from '../../utils/format';
const TIMER_SECONDS = 60;

export default function CodeStep({
  phone,
  email,
  onBack,
  onConfirm,
  devCode,
  onResend,
  resendLoading,
  error,
  confirmLoading,
  onChangeCode,
}) {
  const [code, setCode] = useState('');
  const [timer, setTimer] = useState(TIMER_SECONDS);
  const deadlineRef = useRef(Date.now() + TIMER_SECONDS * 1000);

  // Real vaqtga (deadline) asoslangan hisoblash — oddiy "t - 1" dekrement
  // ilova fonda turganda JS taymerlari to'xtab qolgani sabab noto'g'ri
  // bo'lardi (foydalanuvchi qaytganda sanoq to'xtagan joyidan davom etardi).
  const recomputeTimer = () => {
    const remaining = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
    setTimer(remaining);
  };

  useEffect(() => {
    if (timer === 0) return;
    const id = setTimeout(recomputeTimer, 1000);
    return () => clearTimeout(id);
  }, [timer]);

  // Ilova fondan qaytganda haqiqiy o'tgan vaqtga qarab darhol to'g'irlaymiz,
  // taymerning navbatdagi tikida emas — shu bilan 1 daqiqadan ko'p vaqt
  // o'tgan bo'lsa "qayta yuborish" darhol chiqadi.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') recomputeTimer();
    });
    return () => sub.remove();
  }, []);

  const handleBack = () => { setCode(''); onBack(); };
  const handleChangeCode = (v) => {
    setCode(v);
    onChangeCode?.();
  };
  const resend = async () => {
    setCode('');
    deadlineRef.current = Date.now() + TIMER_SECONDS * 1000;
    setTimer(TIMER_SECONDS);
    if (onResend) await onResend();
  };

  return (
    <View style={styles.container}>
      <BackBtn onPress={handleBack} />

      <View style={styles.header}>
        <Image
          source={require('../../../assets/afish-logo-vertical-pro.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Tasdiqlash kodi</Text>
        <Text style={styles.subtitle}>
          {email ? (
            <>
              <Text style={styles.phone}>{email}</Text>
              {' '}manziliga yuborilgan 6 xonali kodni kiriting.
            </>
          ) : (
            <>
              <Text style={styles.phone}>+998 {formatPhone(phone)}</Text>
              {' '}raqamiga yuborilgan 6 xonali kodni kiriting.
            </>
          )}
        </Text>
      </View>

      <OtpInput value={code} onChange={handleChangeCode} length={6} />

      {!!devCode && (
        <Text style={styles.devCode}>
          Dev kod: <Text style={styles.devCodeVal}>{devCode}</Text>
        </Text>
      )}

      {!!error && <Text style={styles.errorTxt}>{error}</Text>}

      <Text style={styles.timerText}>
        {timer > 0 ? (
          <>Qayta yuborish <Text style={styles.timerCount}>00:{String(timer).padStart(2, '0')}</Text></>
        ) : resendLoading ? (
          <ActivityIndicator size="small" color={COLORS.orange} />
        ) : (
          <Text style={styles.resend} onPress={resend}>Kodni qayta yuborish</Text>
        )}
      </Text>

      <PrimaryBtn
        label={confirmLoading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
        disabled={code.length < 6 || confirmLoading}
        onPress={() => onConfirm?.(code)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 26,
    paddingTop: 18,
    gap: 26,
  },
  header: { gap: 12, marginTop: 8, alignItems: 'center' },
  logo: {
    width: 200,
    height: 130,
  },
  title: {
    color: COLORS.white,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  phone: {
    color: COLORS.white,
    fontWeight: '700',
  },
  timerText: {
    color: COLORS.muted,
    fontSize: 13.5,
    textAlign: 'center',
    marginTop: -8,
  },
  devCode: {
    color: COLORS.muted,
    fontSize: 13,
    textAlign: 'center',
    marginTop: -8,
  },
  devCodeVal: {
    color: COLORS.orange,
    fontWeight: '700',
  },
  errorTxt: {
    color: COLORS.red ?? '#e0473a',
    fontSize: 13,
    textAlign: 'center',
    marginTop: -8,
    fontWeight: '600',
  },
  timerCount: {
    color: COLORS.white,
    fontWeight: '700',
  },
  resend: {
    color: COLORS.orange,
    fontWeight: '700',
  },
});
