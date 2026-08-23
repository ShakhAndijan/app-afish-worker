import { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../context/ThemeContext';
import {
  googleLogin,
  loginWorker,
  authStart,
  authVerify,
  getTelegramConfig,
  telegramVerify,
  requestResetPasswordOtp,
  verifyResetPasswordOtp,
} from '../api/auth';
import { saveToken, saveRefreshToken, saveActorType } from '../utils/token';
import PhoneOtpStep from './steps/PhoneOtpStep';
import PhoneStep from './steps/PhoneStep';
import ForgotPasswordStep from './steps/ForgotPasswordStep';
import CodeStep from './steps/CodeStep';
import NewPasswordStep from './steps/NewPasswordStep';
import TelegramLoginModal from './steps/TelegramLoginModal';
import WorkerRegisterStep from './steps/WorkerRegisterStep';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ onBack, onLoginSuccess }) {
  const { theme } = useTheme();
  const [step, setStep] = useState('phone');
  const [identifierMode, setIdentifierMode] = useState('idle');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpRequestError, setOtpRequestError] = useState('');
  const [otpDevCode, setOtpDevCode] = useState('');
  const [otpResendLoading, setOtpResendLoading] = useState(false);
  const [otpConfirmLoading, setOtpConfirmLoading] = useState(false);
  const [otpConfirmError, setOtpConfirmError] = useState('');
  const [ticket, setTicket] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotDevCode, setForgotDevCode] = useState('');
  const [forgotResendLoading, setForgotResendLoading] = useState(false);
  const [forgotCode, setForgotCode] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [actorType] = useState('worker');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [telegramBotUsername, setTelegramBotUsername] = useState('');
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [telegramConfigLoading, setTelegramConfigLoading] = useState(true);
  const [telegramModalVisible, setTelegramModalVisible] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const cfg = await getTelegramConfig();
        setTelegramEnabled(!!cfg?.enabled);
        setTelegramBotUsername(cfg?.bot_username || '');
      } catch (e) {
        console.log('[LoginScreen] telegram config olishda xatolik', e.message);
        setTelegramEnabled(false);
      } finally {
        setTelegramConfigLoading(false);
      }
    })();
  }, []);

  const fullPhone = () => '+998' + phone.replace(/\D/g, '');
  const identifier = () => (identifierMode === 'email' ? email.trim() : fullPhone());

  const handleRequestOtp = async () => {
    const channel = identifierMode === 'email' ? null : 'sms';
    console.log('[LoginScreen] 1-jarayon: kod so\'ralmoqda', { identifier: identifier(), identifierMode, actorType });
    try {
      setOtpLoading(true);
      setOtpRequestError('');
      const data = await authStart(identifier(), channel, actorType);
      setOtpDevCode(data?.dev_code || '');
      console.log('[LoginScreen] kod yuborildi -> "code" bosqichiga o\'tildi');
      setStep('code');
    } catch (e) {
      console.log('[LoginScreen] kod so\'rashda xatolik', e.message);
      setOtpRequestError(e.message || 'Kod yuborishda xatolik yuz berdi');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    const channel = identifierMode === 'email' ? null : 'sms';
    console.log('[LoginScreen] kod qayta so\'ralmoqda', { identifier: identifier(), identifierMode, actorType });
    try {
      setOtpResendLoading(true);
      const data = await authStart(identifier(), channel, actorType);
      setOtpDevCode(data?.dev_code || '');
    } catch (e) {
      console.log('[LoginScreen] kod qayta so\'rashda xatolik', e.message);
      Alert.alert('Xato', e.message || 'Kod yuborishda xatolik yuz berdi');
    } finally {
      setOtpResendLoading(false);
    }
  };

  const handleTelegramPress = () => {
    if (!telegramBotUsername) return;
    console.log('[LoginScreen] Telegram login ochilmoqda', { botUsername: telegramBotUsername, actorType });
    setTelegramModalVisible(true);
  };

  const handleTelegramAuth = async (widgetData) => {
    console.log('[LoginScreen] Telegram widget javob berdi', widgetData);
    try {
      const data = await telegramVerify(actorType, widgetData);
      if (data?.access_token) await saveToken(data.access_token);
      if (data?.refresh_token) await saveRefreshToken(data.refresh_token);
      const finalActorType = data?.actor_type || actorType;
      await saveActorType(finalActorType);
      setTelegramModalVisible(false);
      console.log('[LoginScreen] Telegram orqali kirildi', { actorType: finalActorType });
      (onLoginSuccess ?? onBack)(finalActorType);
    } catch (e) {
      console.log('[LoginScreen] Telegram verify xatolik', e.message);
      setTelegramModalVisible(false);
      Alert.alert('Xato', e.message || 'Telegram orqali kirishda xatolik');
    }
  };

  const handleConfirmOtp = async (code) => {
    console.log('[LoginScreen] 2-jarayon: kod tasdiqlanmoqda', { identifier: identifier(), code, actorType });
    try {
      setOtpConfirmLoading(true);
      setOtpConfirmError('');
      const data = await authVerify(identifier(), code, actorType);
      console.log('[LoginScreen] 3-jarayon: verify natijasi', { status: data?.status, other_actor: data?.other_actor });
      if (data?.status === 'signed_in') {
        if (data.access_token) await saveToken(data.access_token);
        if (data.refresh_token) await saveRefreshToken(data.refresh_token);
        await saveActorType(actorType);
        console.log('[LoginScreen] hisob mavjud edi -> to\'g\'ridan-to\'g\'ri kirildi');
        (onLoginSuccess ?? onBack)(actorType);
        return;
      }
      if (data?.status === 'needs_name') {
        setTicket(data.ticket || '');
        console.log('[LoginScreen] hisob topilmadi -> "register" (ism-familiya) bosqichiga o\'tildi');
        setStep('register');
        return;
      }
      if (data?.status === 'other_actor') {
        console.log('[LoginScreen] raqam boshqa actorda topilgan -> usta sifatida ro\'yxatdan o\'tish davom etadi', { otherActor: data.other_actor });
        setTicket(data.ticket || '');
        setStep('register');
        return;
      }
      console.log('[LoginScreen] kutilmagan status', data?.status);
      setOtpConfirmError('Kutilmagan javob qaytdi');
    } catch (e) {
      console.log('[LoginScreen] kod tasdiqlashda xatolik', e.message);
      setOtpConfirmError(e.message || 'Tasdiqlashda xatolik yuz berdi');
    } finally {
      setOtpConfirmLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setLoginLoading(true);
      setLoginError('');
      const data = await loginWorker(fullPhone(), password);
      if (data?.access_token) await saveToken(data.access_token);
      if (data?.refresh_token) await saveRefreshToken(data.refresh_token);
      await saveActorType(actorType);
      (onLoginSuccess ?? onBack)(actorType);
    } catch (e) {
      setLoginError(e.message || 'Kirishda xatolik yuz berdi');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleForgotSubmit = async () => {
    try {
      setForgotLoading(true);
      setForgotError('');
      const fullPhone = '+998' + forgotPhone.replace(/\D/g, '');
      const data = await requestResetPasswordOtp(fullPhone);
      setForgotDevCode(data?.dev_code || '');
      setStep('forgotCode');
    } catch (e) {
      setForgotError(e.message || 'Kod yuborishda xatolik yuz berdi');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleForgotResend = async () => {
    try {
      setForgotResendLoading(true);
      const fullPhone = '+998' + forgotPhone.replace(/\D/g, '');
      const data = await requestResetPasswordOtp(fullPhone);
      setForgotDevCode(data?.dev_code || '');
    } catch (e) {
      Alert.alert('Xato', e.message || 'Kod yuborishda xatolik yuz berdi');
    } finally {
      setForgotResendLoading(false);
    }
  };

  const handleResetPasswordSubmit = async (newPassword) => {
    try {
      setResetLoading(true);
      setResetError('');
      const fullPhone = '+998' + forgotPhone.replace(/\D/g, '');
      const data = await verifyResetPasswordOtp(
        fullPhone,
        forgotCode,
        newPassword
      );
      setStep('phone');
      return data;
    } catch (e) {
      setResetError(e.message || 'Parolni saqlashda xatolik yuz berdi');
    } finally {
      setResetLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGoogleLoading(true);
      const { token, refreshToken } = await googleLogin(actorType);
      if (token) await saveToken(token);
      if (refreshToken) await saveRefreshToken(refreshToken);
      await saveActorType(actorType);
      (onLoginSuccess ?? onBack)(actorType);
    } catch (e) {
      if (e.message !== 'cancelled') {
        Alert.alert('Xato', e.message || 'Google orqali kirishda xatolik');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const showTelegram = telegramEnabled && !!telegramBotUsername;

  const steps = {
    phone: (
      <PhoneOtpStep
        identifierMode={identifierMode}
        onChangeIdentifierMode={(m) => {
          setIdentifierMode(m);
          setOtpRequestError('');
        }}
        phone={phone}
        onChangePhone={(v) => {
          setPhone(v);
          setOtpRequestError('');
        }}
        email={email}
        onChangeEmail={(v) => {
          setEmail(v);
          setOtpRequestError('');
        }}
        onContinue={handleRequestOtp}
        loading={otpLoading}
        error={otpRequestError}
        onAltLogin={() => setStep('altLogin')}
        onBack={onBack}
        onGoogle={handleGoogle}
        googleLoading={googleLoading}
        onTelegram={handleTelegramPress}
        telegramLoading={telegramConfigLoading}
        showTelegram={showTelegram}
      />
    ),
    code: (
      <CodeStep
        phone={identifierMode === 'email' ? '' : phone}
        email={identifierMode === 'email' ? email.trim() : ''}
        devCode={otpDevCode}
        onBack={() => {
          setOtpConfirmError('');
          setStep('phone');
        }}
        onConfirm={handleConfirmOtp}
        onResend={handleResendOtp}
        resendLoading={otpResendLoading}
        confirmLoading={otpConfirmLoading}
        error={otpConfirmError}
      />
    ),
    altLogin: (
      <PhoneStep
        phone={phone}
        onChange={(v) => {
          setPhone(v);
          setLoginError('');
        }}
        password={password}
        onPasswordChange={(v) => {
          setPassword(v);
          setLoginError('');
        }}
        onLogin={handleLogin}
        loginLoading={loginLoading}
        error={loginError}
        onForgot={() => {
          setForgotPhone(phone);
          setStep('forgot');
        }}
        onBack={() => setStep('phone')}
        onGoogle={handleGoogle}
        googleLoading={googleLoading}
        onTelegram={handleTelegramPress}
        telegramLoading={telegramConfigLoading}
        showTelegram={showTelegram}
        onRegister={() => setStep('phone')}
        actorType={actorType}
      />
    ),
    forgot: (
      <ForgotPasswordStep
        phone={forgotPhone}
        onChange={(v) => {
          setForgotPhone(v);
          setForgotError('');
        }}
        onSubmit={handleForgotSubmit}
        loading={forgotLoading}
        error={forgotError}
        onBack={() => setStep('altLogin')}
        actorType={actorType}
      />
    ),
    forgotCode: (
      <CodeStep
        phone={forgotPhone}
        devCode={forgotDevCode}
        onBack={() => setStep('forgot')}
        onConfirm={(code) => {
          setForgotCode(code);
          setResetError('');
          setStep('newPassword');
        }}
        onResend={handleForgotResend}
        resendLoading={forgotResendLoading}
      />
    ),
    newPassword: (
      <NewPasswordStep
        onBack={() => setStep('forgotCode')}
        onSubmit={handleResetPasswordSubmit}
        loading={resetLoading}
        error={resetError}
      />
    ),
    register: (
      <WorkerRegisterStep
        ticket={ticket}
        onBack={() => {
          setTicket('');
          setStep('phone');
        }}
        onDone={() => (onLoginSuccess ?? onBack)('worker')}
      />
    ),
  };

  return (
    <SafeAreaView
      style={[styles.safe, { backgroundColor: theme.bg }]}
      edges={['top', 'left', 'right', 'bottom']}
    >
      {steps[step]}
      <TelegramLoginModal
        visible={telegramModalVisible}
        botUsername={telegramBotUsername}
        loading={telegramConfigLoading}
        onClose={() => setTelegramModalVisible(false)}
        onAuth={handleTelegramAuth}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
