import { useState } from 'react';
import { StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as WebBrowser from 'expo-web-browser';
import { useTheme } from '../context/ThemeContext';
import {
  googleLogin,
  loginWorker,
  requestWorkerLoginOtp,
  verifyWorkerLoginOtp,
  isNotRegisteredError,
  requestResetPasswordOtp,
  verifyResetPasswordOtp,
} from '../api/auth';
import { saveToken, saveRefreshToken, saveActorType } from '../utils/token';
import PhoneOtpStep from './steps/PhoneOtpStep';
import PhoneStep from './steps/PhoneStep';
import ForgotPasswordStep from './steps/ForgotPasswordStep';
import CodeStep from './steps/CodeStep';
import NewPasswordStep from './steps/NewPasswordStep';
import EmailStep from './steps/EmailStep';
import WorkerRegisterStep from './steps/WorkerRegisterStep';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ onBack, onLoginSuccess }) {
  const { theme } = useTheme();
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpRequestError, setOtpRequestError] = useState('');
  const [otpDevCode, setOtpDevCode] = useState('');
  const [otpResendLoading, setOtpResendLoading] = useState(false);
  const [otpConfirmLoading, setOtpConfirmLoading] = useState(false);
  const [otpConfirmError, setOtpConfirmError] = useState('');
  const [verifiedCode, setVerifiedCode] = useState('');
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

  const fullPhone = () => '+998' + phone.replace(/\D/g, '');

  const handleRequestOtp = async () => {
    try {
      setOtpLoading(true);
      setOtpRequestError('');
      const data = await requestWorkerLoginOtp(fullPhone());
      setOtpDevCode(data?.dev_code || '');
      setStep('code');
    } catch (e) {
      setOtpRequestError(e.message || 'Kod yuborishda xatolik yuz berdi');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setOtpResendLoading(true);
      const data = await requestWorkerLoginOtp(fullPhone());
      setOtpDevCode(data?.dev_code || '');
    } catch (e) {
      Alert.alert('Xato', e.message || 'Kod yuborishda xatolik yuz berdi');
    } finally {
      setOtpResendLoading(false);
    }
  };

  const handleConfirmOtp = async (code) => {
    try {
      setOtpConfirmLoading(true);
      setOtpConfirmError('');
      const data = await verifyWorkerLoginOtp(fullPhone(), code);
      if (data?.access_token) await saveToken(data.access_token);
      if (data?.refresh_token) await saveRefreshToken(data.refresh_token);
      await saveActorType(actorType);
      (onLoginSuccess ?? onBack)(actorType);
    } catch (e) {
      if (isNotRegisteredError(e)) {
        setVerifiedCode(code);
        setStep('register');
        return;
      }
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

  const steps = {
    phone: (
      <PhoneOtpStep
        phone={phone}
        onChange={(v) => {
          setPhone(v);
          setOtpRequestError('');
        }}
        onContinue={handleRequestOtp}
        loading={otpLoading}
        error={otpRequestError}
        onAltLogin={() => setStep('altLogin')}
        onBack={onBack}
        onGoogle={handleGoogle}
        googleLoading={googleLoading}
        onEmail={() => setStep('email')}
      />
    ),
    code: (
      <CodeStep
        phone={phone}
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
        onEmail={() => setStep('email')}
        onRegister={() => setStep('register')}
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
    email: (
      <EmailStep
        onBack={() => setStep('phone')}
        onLogin={() => setStep('done')}
      />
    ),
    register: (
      <WorkerRegisterStep
        initialPhone={verifiedCode ? phone : undefined}
        initialCode={verifiedCode || undefined}
        onBack={() => {
          const cameFromOtp = !!verifiedCode;
          setVerifiedCode('');
          setStep(cameFromOtp ? 'phone' : 'altLogin');
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
});
