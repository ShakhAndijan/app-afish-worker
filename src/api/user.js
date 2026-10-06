import { ENDPOINTS } from '../constants/config';
import { request } from './http';

/** `/auth/me` — joriy foydalanuvchi (rol bo'yicha umumiy ma'lumot). */
export const getMe = () => request(ENDPOINTS.AUTH_ME, { timeout: 10000 });

/** Profilni tahrirlash formasi uchun joriy mijoz ma'lumotlarini oladi. */
export const getCustomerMe = () => request(ENDPOINTS.CUSTOMER_ME, { timeout: 10000 });

/** Profilni tahrirlash formasidagi o'zgarishlarni backendga saqlaydi. */
export const updateCustomerMe = (payload) =>
  request(ENDPOINTS.CUSTOMER_ME, {
    method: 'PATCH',
    body: payload,
    errorMessage: 'Profilni saqlashda xatolik yuz berdi',
  });

/** Tizimga kirgan foydalanuvchi joriy parolini bilib turib yangisiga almashtiradi. */
export const setPassword = (currentPassword, newPassword) =>
  request(ENDPOINTS.AUTH_SET_PASSWORD, {
    method: 'POST',
    body: { current_password: currentPassword, new_password: newPassword },
    errorMessage: 'Parolni yangilashda xatolik yuz berdi',
  });

/**
 * Yangi telefon raqamiga tasdiqlash kodi yuborishni so'raydi.
 * @returns {Promise<{ sent: boolean, dev_code: string }>}
 */
export const requestChangePhoneOtp = (newPhone) =>
  request(ENDPOINTS.AUTH_CHANGE_PHONE_REQUEST_OTP, {
    method: 'POST',
    body: { new_phone: newPhone },
    errorMessage: 'Kod yuborishda xatolik yuz berdi',
  });

/**
 * Yangi telefon raqamini SMS orqali kelgan kod bilan tasdiqlaydi.
 * Muvaffaqiyatli bo'lsa backend `/auth/me`dagi phone'ni yangilaydi.
 */
export const verifyChangePhoneOtp = (newPhone, code) =>
  request(ENDPOINTS.AUTH_CHANGE_PHONE_VERIFY_OTP, {
    method: 'POST',
    body: { new_phone: newPhone, code },
    errorMessage: 'Kodni tasdiqlashda xatolik yuz berdi',
  });

/**
 * Avatar rasmini yuklash uchun presigned URL so'raydi.
 * @returns {Promise<{ upload_url: string, temp_key: string, expires_in: number }>}
 */
export const getAvatarUploadUrl = (contentType) =>
  request(ENDPOINTS.CUSTOMER_AVATAR_UPLOAD_URL, {
    method: 'POST',
    body: { content_type: contentType },
    errorMessage: "Avatar yuklash manzilini olib bo'lmadi",
  });

/**
 * Joriy avatar rasmini backenddan o'chiradi.
 * Muvaffaqiyatli bo'lsa backend `/auth/me`dagi profile_photo'ni ham tozalaydi.
 */
export const deleteAvatar = () =>
  request(ENDPOINTS.CUSTOMER_AVATAR, {
    method: 'DELETE',
    errorMessage: "Avatarni o'chirib bo'lmadi",
  });

/**
 * Presigned URL'ga yuklangan rasmni doimiy avatar sifatida tasdiqlaydi.
 * Muvaffaqiyatli bo'lsa backend `/auth/me`dagi profile_photo'ni yangilaydi.
 */
export const confirmAvatar = (tempKey) =>
  request(ENDPOINTS.CUSTOMER_AVATAR_CONFIRM, {
    method: 'POST',
    body: { temp_key: tempKey },
    errorMessage: 'Avatarni tasdiqlab bo\'lmadi',
  });
