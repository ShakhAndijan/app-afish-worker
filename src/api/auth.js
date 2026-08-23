import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import * as FileSystem from 'expo-file-system/legacy';
import { ENDPOINTS } from '../constants/config';

export async function requestRegisterOtp(phone) {
  const res = await fetch(ENDPOINTS.REGISTER_REQUEST_OTP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'OTP yuborishda xatolik yuz berdi');
  }
  const data = await res.json();
  return data.response_data;
}

export async function getRegisterUploadUrl(phone, code, contentType) {
  const res = await fetch(ENDPOINTS.REGISTER_UPLOAD_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, code, content_type: contentType }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Yuklash URL olishda xatolik');
  }
  const data = await res.json();
  return data.response_data; // { upload_url, temp_key, expires_in }
}

export async function verifyRegisterOtp(payload) {
  const res = await fetch(ENDPOINTS.REGISTER_VERIFY_OTP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Ro'yxatdan o'tishni yakunlashda xatolik");
  }
  const data = await res.json();
  return data.response_data;
}

export async function uploadImageToPresignedUrl(
  uploadUrl,
  imageUri,
  contentType
) {
  const ct = contentType || 'image/jpeg';

  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // base64 → binary bytes (React Native da data: URI yo'q, XHR kerak)
  const binaryStr = atob(base64);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }

  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', ct);
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Rasmni yuklashda xatolik: HTTP ${xhr.status}`));
      }
    };
    xhr.onerror = () => reject(new Error('Rasmni yuklashda tarmoq xatosi'));
    xhr.send(bytes.buffer);
  });
}

export async function loginCustomer(phone, password) {
  const res = await fetch(ENDPOINTS.CUSTOMER_LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Kirishda xatolik yuz berdi');
  }
  const data = await res.json();
  return data.response_data;
}

export async function loginWorker(phone, password) {
  const res = await fetch(ENDPOINTS.WORKER_LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, password }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Kirishda xatolik yuz berdi');
  }
  const data = await res.json();
  return data.response_data;
}

export async function requestLoginOtp(phone) {
  const res = await fetch(ENDPOINTS.LOGIN_REQUEST_OTP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Kod yuborishda xatolik yuz berdi');
  }
  const data = await res.json();
  return data.response_data; // { sent, dev_code }
}

// Yagona kirish/ro'yxatdan o'tish oqimi: start -> verify -> complete
// (yoki verify "other_actor" qaytarsa -> claim). Har bir actor_type
// (worker/customer) o'zining URL nomfazosiga ega, lekin so'rov shakli bir xil.
function authEndpoint(actorType, name) {
  const prefix = actorType === 'customer' ? 'CUSTOMER_AUTH_' : 'WORKER_AUTH_';
  return ENDPOINTS[`${prefix}${name}`];
}

function logAuth(step, phase, payload) {
  console.log(`[auth:${step}] ${phase}`, payload);
}

export async function authStart(identifier, channel = 'sms', actorType = 'worker') {
  const url = authEndpoint(actorType, 'START');
  logAuth('start', '-> so\'rov', { url, identifier, channel, actorType });
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, channel }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    logAuth('start', '<- xatolik', { status: res.status, err });
    throw new Error(err.message || 'Kod yuborishda xatolik yuz berdi');
  }
  const data = await res.json();
  logAuth('start', '<- javob', data.response_data);
  return data.response_data;
}

export async function authVerify(identifier, code, actorType = 'worker') {
  const url = authEndpoint(actorType, 'VERIFY');
  logAuth('verify', '-> so\'rov', { url, identifier, code, actorType });
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, code }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    logAuth('verify', '<- xatolik', { status: res.status, err });
    throw new Error(err.message || 'Tasdiqlashda xatolik yuz berdi');
  }
  const data = await res.json();
  logAuth('verify', '<- javob', data.response_data); // { status, access_token?, refresh_token?, ticket?, other_actor? }
  return data.response_data;
}

export async function authComplete(ticket, firstName, lastName, actorType = 'worker') {
  const url = authEndpoint(actorType, 'COMPLETE');
  logAuth('complete', '-> so\'rov', { url, ticket, firstName, lastName, actorType });
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ticket,
      first_name: firstName,
      last_name: lastName,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    logAuth('complete', '<- xatolik', { status: res.status, err });
    throw new Error(err.message || "Ro'yxatdan o'tishni yakunlashda xatolik");
  }
  const data = await res.json();
  logAuth('complete', '<- javob', data.response_data); // { access_token, refresh_token, token_type, already_registered }
  return data.response_data;
}

// actorType shu yerda "qaysi tomonga kirilyapti"ni bildiradi — verify
// "other_actor" bilan qaytargan actor_type shu yerga beriladi.
export async function authClaim(ticket, actorType) {
  const url = authEndpoint(actorType, 'CLAIM');
  logAuth('claim', '-> so\'rov', { url, ticket, actorType });
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ticket }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    logAuth('claim', '<- xatolik', { status: res.status, err });
    throw new Error(err.message || 'Hisobga kirishda xatolik yuz berdi');
  }
  const data = await res.json();
  logAuth('claim', '<- javob', data.response_data); // { access_token, refresh_token, token_type, already_registered }
  return data.response_data;
}

export async function requestResetPasswordOtp(phone) {
  const res = await fetch(ENDPOINTS.RESET_PASSWORD_REQUEST_OTP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone, actor_type: 'customer' }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Kod yuborishda xatolik yuz berdi');
  }
  const data = await res.json();
  return data.response_data; // { sent, dev_code }
}

export async function verifyResetPasswordOtp(phone, code, newPassword) {
  const res = await fetch(ENDPOINTS.RESET_PASSWORD_VERIFY_OTP, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      phone,
      actor_type: 'customer',
      code,
      new_password: newPassword,
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Parolni saqlashda xatolik yuz berdi');
  }
  const data = await res.json();
  return data.response_data;
}

export async function getTelegramConfig() {
  const res = await fetch(ENDPOINTS.TELEGRAM_CONFIG);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Telegram sozlamalarini olishda xatolik");
  }
  const data = await res.json();
  console.log('[auth:telegram] config', data.response_data);
  return data.response_data; // { enabled, bot_id, bot_username }
}

// `data` — Telegram Login Widget'ning xom callback obyekti (id, first_name,
// username, photo_url, auth_date, hash — hammasi, chunki imzo shu maydonlarning
// hammasini qamrab oladi).
export async function telegramVerify(actorType, data) {
  console.log('[auth:telegram] verify -> so\'rov', { actorType, data });
  const res = await fetch(ENDPOINTS.TELEGRAM_VERIFY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actor_type: actorType, data }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.log('[auth:telegram] verify <- xatolik', { status: res.status, err });
    throw new Error(err.message || 'Telegram orqali kirishda xatolik');
  }
  const resp = await res.json();
  console.log('[auth:telegram] verify <- javob', resp.response_data);
  return resp.response_data; // { access_token, refresh_token, token_type, actor_type, actor_id, already_registered }
}

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
