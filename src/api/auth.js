import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { File, UploadType } from 'expo-file-system';
import { ENDPOINTS } from '../constants/config';
import { request } from './http';

// Login/ro'yxatdan o'tish so'rovlari tokensiz yuboriladi.
const publicPost = (url, body, errorMessage) =>
  request(url, { method: 'POST', body, auth: false, errorMessage });

export const requestRegisterOtp = (phone) =>
  publicPost(ENDPOINTS.REGISTER_REQUEST_OTP, { phone }, 'OTP yuborishda xatolik yuz berdi');

/** @returns {Promise<{ upload_url: string, temp_key: string, expires_in: number }>} */
export const getRegisterUploadUrl = (phone, code, contentType) =>
  publicPost(
    ENDPOINTS.REGISTER_UPLOAD_URL,
    { phone, code, content_type: contentType },
    'Yuklash URL olishda xatolik',
  );

export const verifyRegisterOtp = (payload) =>
  publicPost(
    ENDPOINTS.REGISTER_VERIFY_OTP,
    payload,
    "Ro'yxatdan o'tishni yakunlashda xatolik",
  );

export async function uploadImageToPresignedUrl(uploadUrl, imageUri, contentType) {
  // Fayl native qatlamdan to'g'ridan-to'g'ri oqim sifatida yuboriladi —
  // base64 ga o'tkazib xotiraga yuklash shart emas.
  const result = await new File(imageUri).upload(uploadUrl, {
    httpMethod: 'PUT',
    uploadType: UploadType.BINARY_CONTENT,
    headers: { 'Content-Type': contentType || 'image/jpeg' },
  });

  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Rasmni yuklashda xatolik: HTTP ${result.status}`);
  }
}

export const loginCustomer = (phone, password) =>
  publicPost(ENDPOINTS.CUSTOMER_LOGIN, { phone, password }, 'Kirishda xatolik yuz berdi');

export const loginWorker = (phone, password) =>
  publicPost(ENDPOINTS.WORKER_LOGIN, { phone, password }, 'Kirishda xatolik yuz berdi');

/** @returns {Promise<{ sent: boolean, dev_code: string }>} */
export const requestLoginOtp = (phone) =>
  publicPost(ENDPOINTS.LOGIN_REQUEST_OTP, { phone }, 'Kod yuborishda xatolik yuz berdi');

// Yagona kirish/ro'yxatdan o'tish oqimi: start -> verify -> complete.
// Ikkita holat bor: (1) mutlaqo yangi raqam — ism-familiya so'raladi, yoki
// (2) raqam avval boshqa actorda topilgan — bu holda backend
// suggested_first_name/last_name qaytaradi va complete o'sha nom bilan
// so'ramasdan chaqiriladi. Claim endpointi ishlatilmaydi. Har bir actor_type
// (worker/customer) o'zining URL nomfazosiga ega, lekin so'rov shakli bir xil.
function authEndpoint(actorType, name) {
  const prefix = actorType === 'customer' ? 'CUSTOMER_AUTH_' : 'WORKER_AUTH_';
  return ENDPOINTS[`${prefix}${name}`];
}

export const authStart = (identifier, channel = 'sms', actorType = 'worker') =>
  publicPost(
    authEndpoint(actorType, 'START'),
    { identifier, channel },
    'Kod yuborishda xatolik yuz berdi',
  );

/** @returns {Promise<{ status, access_token?, refresh_token?, ticket?, other_actor? }>} */
export const authVerify = (identifier, code, actorType = 'worker') =>
  publicPost(
    authEndpoint(actorType, 'VERIFY'),
    { identifier, code },
    'Tasdiqlashda xatolik yuz berdi',
  );

/** @returns {Promise<{ access_token, refresh_token, token_type, already_registered }>} */
export const authComplete = (ticket, firstName, lastName, actorType = 'worker') =>
  publicPost(
    authEndpoint(actorType, 'COMPLETE'),
    { ticket, first_name: firstName, last_name: lastName },
    "Ro'yxatdan o'tishni yakunlashda xatolik",
  );

/** @returns {Promise<{ sent: boolean, dev_code: string }>} */
export const requestResetPasswordOtp = (phone) =>
  publicPost(
    ENDPOINTS.RESET_PASSWORD_REQUEST_OTP,
    { phone, actor_type: 'customer' },
    'Kod yuborishda xatolik yuz berdi',
  );

export const verifyResetPasswordOtp = (phone, code, newPassword) =>
  publicPost(
    ENDPOINTS.RESET_PASSWORD_VERIFY_OTP,
    { phone, actor_type: 'customer', code, new_password: newPassword },
    'Parolni saqlashda xatolik yuz berdi',
  );

/** @returns {Promise<{ enabled, bot_id, bot_username }>} */
export const getTelegramConfig = () =>
  request(ENDPOINTS.TELEGRAM_CONFIG, {
    auth: false,
    errorMessage: 'Telegram sozlamalarini olishda xatolik',
  });

// `data` — Telegram Login Widget'ning xom callback obyekti (id, first_name,
// username, photo_url, auth_date, hash — hammasi, chunki imzo shu maydonlarning
// hammasini qamrab oladi).
/** @returns {Promise<{ access_token, refresh_token, token_type, actor_type, actor_id, already_registered }>} */
export const telegramVerify = (actorType, data) =>
  publicPost(
    ENDPOINTS.TELEGRAM_VERIFY,
    { actor_type: actorType, data },
    'Telegram orqali kirishda xatolik',
  );

export async function googleLogin(actorType = 'customer') {
  const redirectUri = Linking.createURL('auth/callback');
  const loginUrl =
    `${ENDPOINTS.AUTH_GOOGLE_LOGIN}?actor_type=${actorType}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}`;

  const result = await WebBrowser.openAuthSessionAsync(loginUrl, redirectUri);

  if (result.type !== 'success') {
    throw new Error('cancelled');
  }

  const parsed = Linking.parse(result.url);
  const params = parsed.queryParams ?? {};
  const token = params.token || params.access_token;

  if (!token) {
    throw new Error('Tokenni olishda xatolik');
  }

  return { token, refreshToken: params.refresh_token };
}
