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
  FlatList,
  Image,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import PhoneInput from '../../components/login/PhoneInput';
import {
  requestWorkerRegisterOtp,
  getWorkerRegisterUploadUrl,
  uploadImageToPresignedUrl,
  verifyWorkerRegisterOtp,
} from '../../api/auth';
import {
  getGenders,
  getRegions,
  getDistricts,
  getLanguages,
  getPriceTypes,
} from '../../api/reference';
import { getCategories } from '../../api/categories';

const TOTAL_STEPS = 8;
const POST_OTP_SECONDS = 300;
const WORKER_REGISTRATION_SOURCE_ID = 1;

// Step render order: index+1 = step number shown to the user (progress bar, "N-QADAM").
const STEP_ORDER = [
  'info',
  'address',
  'bio',
  'categories',
  'phone',
  'code',
  'certificates',
  'passport',
];
const INFO_STEP = STEP_ORDER.indexOf('info') + 1; // 1
const CATEGORIES_STEP = STEP_ORDER.indexOf('categories') + 1; // 4
const PHONE_STEP = STEP_ORDER.indexOf('phone') + 1; // 5
const CERTIFICATES_STEP = STEP_ORDER.indexOf('certificates') + 1; // 7
const PASSPORT_STEP = STEP_ORDER.indexOf('passport') + 1; // 8
const DONE_STEP = TOTAL_STEPS + 1; // 9

function loadInto(setter, fetcher) {
  setter((s) => ({ ...s, loading: true, error: null }));
  fetcher()
    .then((items) => setter({ items, loading: false, error: null }))
    .catch((e) =>
      setter({
        items: [],
        loading: false,
        error: e.message || "Ma'lumotlarni yuklab bo'lmadi",
      })
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

// ─── ToggleRow ───────────────────────────────────────────────────────────────
function ToggleRow({ label, desc, value, onChange, disabled }) {
  return (
    <View style={tg.row}>
      <View style={{ flex: 1 }}>
        <Text style={tg.label}>{label}</Text>
        {!!desc && <Text style={tg.desc}>{desc}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={disabled ? undefined : onChange}
        disabled={disabled}
        trackColor={{ false: COLORS.border, true: 'rgba(232,122,69,0.5)' }}
        thumbColor={value ? COLORS.orange : '#9aa8bd'}
      />
    </View>
  );
}
const tg = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  label: { fontSize: 14, fontWeight: '600', color: COLORS.white },
  desc: { fontSize: 11.5, color: COLORS.muted, marginTop: 2 },
});

// ─── Step: Phone ───────────────────────────────────────────────────────────
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
        <Text style={[sh.eyebrow, { textAlign: 'center' }]}>5-QADAM</Text>
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
          <MaterialCommunityIcons name="shield-check" size={17} color={COLORS.success} />
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
        <CtaBtn
          label="SMS kod yuborish"
          onPress={onNext}
          disabled={!ok}
          loading={loading}
        />
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
        <Text style={[sh.eyebrow, { textAlign: 'center' }]}>6-QADAM</Text>
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

// ─── Upload card + image picker (shared by passport & certificates) ──────────
function UploadCard({ uri, onPress, icon, title, desc, uploading }) {
  return (
    <TouchableOpacity
      style={[ul.card, uri && !uploading && ul.cardDone]}
      onPress={uploading ? undefined : onPress}
      activeOpacity={uploading ? 1 : 0.8}
    >
      {uploading ? (
        <View style={ul.inner}>
          {uri && (
            <Image source={{ uri }} style={ul.preview} resizeMode="cover" />
          )}
          <View
            style={[
              ul.overlay,
              !uri && { position: 'relative', backgroundColor: 'transparent' },
            ]}
          >
            <ActivityIndicator size="large" color={COLORS.orange} />
            <Text style={{ color: COLORS.white, fontSize: 12, marginTop: 8 }}>
              Yuklanmoqda...
            </Text>
          </View>
        </View>
      ) : uri ? (
        <View style={ul.inner}>
          <Image source={{ uri }} style={ul.preview} resizeMode="cover" />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginTop: 8,
            }}
          >
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={COLORS.success}
            />
            <Text style={[ul.title, { color: COLORS.success }]}>
              {title} yuklandi
            </Text>
          </View>
          <Text style={ul.desc}>O'zgartirish uchun bosing</Text>
        </View>
      ) : (
        <View style={ul.inner}>
          <View style={ul.iconBox}>
            <MaterialCommunityIcons
              name={icon}
              size={28}
              color={COLORS.orange}
            />
          </View>
          <Text style={ul.title}>{title}</Text>
          <Text style={ul.desc}>{desc}</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 5,
              marginTop: 4,
            }}
          >
            <Ionicons name="camera-outline" size={13} color={COLORS.faint} />
            <Text style={{ fontSize: 12, color: COLORS.faint }}>
              Rasmga olish yoki yuklash
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
const ul = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 12,
    backgroundColor: COLORS.inputBg,
    minHeight: 130,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardDone: {
    borderStyle: 'solid',
    borderColor: COLORS.success,
    backgroundColor: 'rgba(47,163,122,0.08)',
  },
  inner: { alignItems: 'center', gap: 7, alignSelf: 'stretch' },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: 'rgba(232,122,69,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontSize: 14.5, fontWeight: '700', color: COLORS.white },
  desc: { fontSize: 12, color: COLORS.muted, textAlign: 'center' },
  preview: { width: '100%', height: 120, borderRadius: 10 },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.55)',
    borderRadius: 10,
  },
});

async function pickImage(onPicked) {
  Alert.alert(
    'Rasm tanlang',
    'Qayerdan yuklaysiz?',
    [
      {
        text: 'Galereya',
        onPress: async () => {
          const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (!perm.granted) {
            Alert.alert('Ruxsat kerak', 'Galereya uchun ruxsat bering.');
            return;
          }
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: true,
            aspect: [4, 3],
          });
          if (!result.canceled) {
            const asset = result.assets[0];
            onPicked(asset.uri, asset.mimeType || 'image/jpeg');
          }
        },
      },
      {
        text: 'Kamera',
        onPress: async () => {
          const perm = await ImagePicker.requestCameraPermissionsAsync();
          if (!perm.granted) {
            Alert.alert('Ruxsat kerak', 'Kamera uchun ruxsat bering.');
            return;
          }
          const result = await ImagePicker.launchCameraAsync({
            quality: 0.8,
            allowsEditing: true,
            aspect: [4, 3],
          });
          if (!result.canceled) {
            const asset = result.assets[0];
            onPicked(asset.uri, asset.mimeType || 'image/jpeg');
          }
        },
      },
      { text: 'Bekor qilish', style: 'cancel' },
    ],
    { cancelable: true }
  );
}

// ─── Step: Identity verification (passport) ───────────────────────────────────
function StepPassport({ data, set, onNext, secs, urgent }) {
  const [uploading, setUploading] = useState({ passport: false });
  const phone = '+998' + data.phone.replace(/\D/g, '');

  const handlePick = (imageField, keyField, uploadKey) => {
    pickImage(async (uri, mimeType) => {
      const contentType = mimeType || 'image/jpeg';
      set({ [imageField]: uri, [keyField]: null });
      setUploading((u) => ({ ...u, [uploadKey]: true }));
      try {
        const { upload_url, temp_key } = await getWorkerRegisterUploadUrl(
          phone,
          data.code,
          contentType
        );
        await uploadImageToPresignedUrl(upload_url, uri, contentType);
        set({ [keyField]: temp_key });
      } catch (e) {
        Alert.alert(
          'Xatolik',
          e.message || "Rasm yuklanmadi, qayta urinib ko'ring"
        );
        set({ [imageField]: null, [keyField]: null });
      } finally {
        setUploading((u) => ({ ...u, [uploadKey]: false }));
      }
    });
  };

  const ok = !!data.passport_image_key;
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <View style={sh.flex}>
      <ScrollView contentContainerStyle={sh.body}>
        <Text style={[sh.eyebrow, { textAlign: 'center' }]}>8-QADAM</Text>
        <Text style={[sh.h1, { textAlign: 'center' }]}>Shaxsni tasdiqlash</Text>
        <Text style={[sh.sub, { textAlign: 'center', marginBottom: 12 }]}>
          Xavfsizlik uchun pasportingiz rasmini yuklang.
        </Text>

        <View
          style={[
            sh.note,
            { marginTop: 0, marginBottom: 16 },
            urgent && { borderColor: '#e03131' },
          ]}
        >
          <Ionicons
            name="time-outline"
            size={17}
            color={urgent ? '#e03131' : COLORS.orange}
          />
          <Text style={sh.noteTxt}>
            Rasmlarni yuklash uchun{' '}
            <Text
              style={{
                color: urgent ? '#e03131' : COLORS.orange,
                fontWeight: '700',
              }}
            >
              {mm}:{ss}
            </Text>{' '}
            vaqtingiz bor. Vaqt tugasa, ro'yxatdan o'tishni qaytadan
            boshlashingiz kerak bo'ladi.
          </Text>
        </View>

        <UploadCard
          uri={data.passport_image}
          uploading={uploading.passport}
          onPress={() =>
            handlePick('passport_image', 'passport_image_key', 'passport')
          }
          icon="card-account-details-outline"
          title="Pasport rasmi"
          desc="Ma'lumotlar sahifasi, aniq va to'liq"
        />

        <View style={sh.note}>
          <MaterialCommunityIcons
            name="shield-check"
            size={17}
            color={COLORS.success}
          />
          <Text style={sh.noteTxt}>
            Hujjatlar faqat shaxsingizni tasdiqlash uchun ishlatiladi va
            shifrlangan holda saqlanadi.
          </Text>
        </View>
      </ScrollView>
      <View style={sh.footer}>
        <CtaBtn label="Yakunlash" onPress={onNext} disabled={!ok} checkIcon />
      </View>
    </View>
  );
}

const pad2 = (n) => String(n).padStart(2, '0');

const parseDotDate = (str) => {
  const m = /^(\d{2})\.(\d{2})\.(\d{4})$/.exec(str || '');
  if (!m) return null;
  const [, dd, mm, yyyy] = m;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  if (month < 1 || month > 12) return null;
  const d = new Date(year, month - 1, day);
  return Number.isNaN(d.getTime()) ? null : { day, month, year };
};

const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

const MONTH_NAMES_UZ = [
  'Yanvar',
  'Fevral',
  'Mart',
  'Aprel',
  'May',
  'Iyun',
  'Iyul',
  'Avgust',
  'Sentyabr',
  'Oktyabr',
  'Noyabr',
  'Dekabr',
];

const DATE_ROW_H = 42;

// ─── Date wheel column, shared by every date field below ─────────────────────
function DateColumn({ values, value, onChange, format }) {
  const idx = Math.max(0, values.indexOf(value));
  return (
    <FlatList
      data={values}
      keyExtractor={(v) => String(v)}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      initialScrollIndex={idx}
      getItemLayout={(_, i) => ({
        length: DATE_ROW_H,
        offset: DATE_ROW_H * i,
        index: i,
      })}
      renderItem={({ item }) => {
        const selected = item === value;
        return (
          <TouchableOpacity
            style={{
              height: DATE_ROW_H,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => onChange(item)}
            activeOpacity={0.7}
          >
            <Text
              style={{
                fontSize: 14.5,
                fontWeight: selected ? '700' : '400',
                color: selected ? COLORS.orange : COLORS.muted,
              }}
            >
              {format ? format(item) : item}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

// ─── Generic dd.mm.yyyy field (birth date, certificate dates, ...) ───────────
function DateField({
  value,
  onChange,
  minYear = 1940,
  maxYear = new Date().getFullYear(),
  title = "Sanani tanlang",
  placeholder = 'KK.OO.YYYY',
  optional,
}) {
  const [show, setShow] = useState(false);
  const parsed = parseDotDate(value);
  const [day, setDay] = useState(parsed?.day ?? 1);
  const [month, setMonth] = useState(parsed?.month ?? 1);
  const [year, setYear] = useState(parsed?.year ?? maxYear);

  const maxDay = daysInMonth(year, month);
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: maxYear - minYear + 1 },
    (_, i) => maxYear - i
  );

  const open = () => {
    const p = parseDotDate(value);
    setDay(p?.day ?? 1);
    setMonth(p?.month ?? 1);
    setYear(p?.year ?? maxYear);
    setShow(true);
  };

  const changeMonth = (m) => {
    setMonth(m);
    if (day > daysInMonth(year, m)) setDay(daysInMonth(year, m));
  };
  const changeYear = (y) => {
    setYear(y);
    if (day > daysInMonth(y, month)) setDay(daysInMonth(y, month));
  };

  const confirm = () => {
    onChange(`${pad2(day)}.${pad2(month)}.${year}`);
    setShow(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[sh.control, value && sh.controlFilled]}
        onPress={open}
        activeOpacity={0.8}
      >
        <Ionicons name="calendar-outline" size={19} color={COLORS.faint} />
        <Text
          style={{
            fontSize: 15,
            color: value ? COLORS.white : COLORS.faint,
            fontWeight: value ? '500' : '400',
          }}
        >
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        transparent
        visible={show}
        animationType="slide"
        onRequestClose={() => setShow(false)}
      >
        <TouchableOpacity
          style={pk.overlay}
          activeOpacity={1}
          onPress={() => setShow(false)}
        >
          <TouchableOpacity style={pk.sheet} activeOpacity={1}>
            <View style={pk.header}>
              <Text style={pk.title}>{title}</Text>
              <TouchableOpacity
                onPress={() => setShow(false)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name="close" size={22} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', height: DATE_ROW_H * 5 }}>
              <DateColumn
                values={days}
                value={day}
                onChange={setDay}
                format={pad2}
              />
              <DateColumn
                values={months}
                value={month}
                onChange={changeMonth}
                format={(m) => MONTH_NAMES_UZ[m - 1]}
              />
              <DateColumn values={years} value={year} onChange={changeYear} />
            </View>
            <View style={{ padding: 16, gap: 8 }}>
              <CtaBtn label="Tayyor" onPress={confirm} checkIcon />
              {optional && (
                <TouchableOpacity
                  style={{ alignItems: 'center', paddingVertical: 6 }}
                  onPress={() => {
                    onChange('');
                    setShow(false);
                  }}
                >
                  <Text style={{ color: COLORS.muted, fontSize: 13, fontWeight: '600' }}>
                    Muddatsiz qilib qoldirish
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ─── Step: Personal info ───────────────────────────────────────────────────
function StepInfo({ data, set, onNext, genders }) {
  const genderRequired = !genders.error && genders.items.length > 0;
  const emailOk = EMAIL_REGEX.test(data.email.trim());
  const ok =
    data.first_name.trim() &&
    data.last_name.trim() &&
    emailOk &&
    data.birth_date &&
    (!genderRequired || data.gender_id);
  return (
    <View style={sh.flex}>
      <ScrollView
        contentContainerStyle={sh.body}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[sh.eyebrow, { textAlign: 'center' }]}>1-QADAM</Text>
        <Text style={[sh.h1, { textAlign: 'center' }]}>
          Shaxsiy ma'lumotlar
        </Text>
        <Text style={[sh.sub, { textAlign: 'center' }]}>
          Pasportingizdagi ma'lumotlarga mos ravishda to'ldiring.
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
          Jinsi {genderRequired && <Text style={sh.req}>*</Text>}
        </Text>
        <GenderRadioGroup
          genders={genders}
          value={data.gender_id}
          onChange={(item) =>
            set({ gender_id: item.id, gender_name: item.name })
          }
        />

        <Text style={sh.label}>
          Tug'ilgan sana <Text style={sh.req}>*</Text>
        </Text>
        <DateField
          value={data.birth_date}
          onChange={(v) => set({ birth_date: v })}
          title="Tug'ilgan sanani tanlang"
        />

        <View style={sh.note}>
          <MaterialCommunityIcons
            name="shield-check"
            size={17}
            color={COLORS.success}
          />
          <Text style={sh.noteTxt}>
            Ma'lumotlaringiz xavfsiz saqlanadi va uchinchi shaxslarga
            berilmaydi.
          </Text>
        </View>
      </ScrollView>

      <View style={sh.footer}>
        <CtaBtn label="Davom etish" onPress={onNext} disabled={!ok} />
      </View>
    </View>
  );
}

// ─── Gender radio group ───────────────────────────────────────────────────────
function GenderRadioGroup({ genders, value, onChange }) {
  if (genders.loading) {
    return (
      <View style={[gr.wrap, { justifyContent: 'center' }]}>
        <ActivityIndicator size="small" color={COLORS.orange} />
      </View>
    );
  }
  if (genders.error || genders.items.length === 0) {
    return null;
  }
  return (
    <View style={gr.wrap}>
      {genders.items.map((item) => {
        const selected = value === item.id;
        return (
          <TouchableOpacity
            key={item.id}
            style={[gr.option, selected && gr.optionSelected]}
            onPress={() => onChange(item)}
            activeOpacity={0.8}
          >
            <Text style={[gr.optionTxt, selected && gr.optionTxtSelected]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const gr = StyleSheet.create({
  wrap: { flexDirection: 'row', gap: 10, marginBottom: 13 },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: 16,
    paddingHorizontal: 15,
  },
  optionSelected: {
    borderColor: COLORS.orange,
    backgroundColor: 'rgba(232,122,69,0.28)',
  },
  optionTxt: { fontSize: 14.5, fontWeight: '500', color: COLORS.faint },
  optionTxtSelected: { color: COLORS.white, fontWeight: '700' },
});

// ─── Picker modal (generic {id, name} list picker) ────────────────────────────
function PickerModal({
  visible,
  items,
  onSelect,
  onClose,
  title,
  loading,
  error,
}) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity style={pk.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={pk.sheet} activeOpacity={1}>
          <View style={pk.header}>
            <Text style={pk.title}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={22} color={COLORS.muted} />
            </TouchableOpacity>
          </View>
          {loading ? (
            <View style={{ padding: 30, alignItems: 'center' }}>
              <ActivityIndicator size="small" color={COLORS.orange} />
            </View>
          ) : error ? (
            <View style={{ padding: 24, alignItems: 'center' }}>
              <Text
                style={{
                  color: COLORS.muted,
                  fontSize: 13,
                  textAlign: 'center',
                }}
              >
                {error}
              </Text>
            </View>
          ) : (
            <FlatList
              data={items}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={pk.item}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={pk.itemTxt}>{item.name}</Text>
                  <Ionicons
                    name="chevron-forward"
                    size={16}
                    color={COLORS.faint}
                  />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <Text
                  style={{
                    color: COLORS.muted,
                    textAlign: 'center',
                    padding: 24,
                  }}
                >
                  Ma'lumot topilmadi
                </Text>
              }
            />
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
const pk = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: COLORS.card,
    maxHeight: '70%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  title: { color: COLORS.white, fontWeight: '700', fontSize: 16 },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemTxt: { color: COLORS.white, fontSize: 14.5 },
});

// ─── Expired modal ─────────────────────────────────────────────────────────────
function ExpiredModal({ visible, onClose }) {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={ex.overlay}>
        <View style={ex.card}>
          <View style={ex.ring}>
            <View style={ex.badge}>
              <Ionicons name="alarm-outline" size={30} color="#fff" />
            </View>
          </View>
          <Text style={ex.title}>Vaqt tugadi</Text>
          <Text style={ex.desc}>
            Rasm yuklash uchun berilgan tasdiqlash kodi vaqti tugadi.{'\n'}
            Ro'yxatdan o'tishni qaytadan boshlang.
          </Text>
          <TouchableOpacity
            style={ex.btn}
            onPress={onClose}
            activeOpacity={0.85}
          >
            <Text style={ex.btnTxt}>Qaytadan boshlash</Text>
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

// ─── Step: Address ──────────────────────────────────────────────────────────
function StepAddress({ data, set, onNext, regions, districts }) {
  const [showRegion, setShowRegion] = useState(false);
  const [showDistrict, setShowDistrict] = useState(false);
  const regionRequired = !regions.error && regions.items.length > 0;
  const districtRequired =
    !!data.region_id && !districts.error && districts.items.length > 0;
  const ok =
    (!regionRequired || data.region_id) &&
    (!districtRequired || data.district_id) &&
    data.address.trim();

  return (
    <View style={sh.flex}>
      <ScrollView
        contentContainerStyle={sh.body}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[sh.eyebrow, { textAlign: 'center' }]}>2-QADAM</Text>
        <Text style={[sh.h1, { textAlign: 'center' }]}>Manzilingiz</Text>
        <Text style={[sh.sub, { textAlign: 'center' }]}>
          Xizmat ko'rsatadigan asosiy manzilingizni kiriting.
        </Text>

        <Text style={sh.label}>
          Viloyat / shahar {regionRequired && <Text style={sh.req}>*</Text>}
        </Text>
        <TouchableOpacity
          style={[
            sh.control,
            { justifyContent: 'space-between' },
            data.region_id && sh.controlFilled,
            { marginBottom: 13 },
          ]}
          onPress={() => setShowRegion(true)}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Feather name="map-pin" size={18} color={COLORS.faint} />
            <Text
              style={{
                fontSize: 15,
                color: data.region_name ? COLORS.white : COLORS.faint,
                fontWeight: data.region_name ? '500' : '400',
              }}
            >
              {data.region_name || 'Tanlang'}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={18} color={COLORS.faint} />
        </TouchableOpacity>

        <Text style={sh.label}>
          Tuman {districtRequired && <Text style={sh.req}>*</Text>}
        </Text>
        <TouchableOpacity
          style={[
            sh.control,
            {
              justifyContent: 'space-between',
              opacity: data.region_id ? 1 : 0.4,
            },
            data.district_id && sh.controlFilled,
            { marginBottom: 13 },
          ]}
          onPress={data.region_id ? () => setShowDistrict(true) : undefined}
          activeOpacity={0.8}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Feather name="map" size={18} color={COLORS.faint} />
            <Text
              style={{
                fontSize: 15,
                color: data.district_name ? COLORS.white : COLORS.faint,
                fontWeight: data.district_name ? '500' : '400',
              }}
            >
              {data.district_name ||
                (data.region_id ? 'Tuman tanlang' : 'Avval viloyat tanlang')}
            </Text>
          </View>
          <Ionicons name="chevron-down" size={18} color={COLORS.faint} />
        </TouchableOpacity>

        <Text style={sh.label}>
          To'liq manzil <Text style={sh.req}>*</Text>
        </Text>
        <View
          style={[
            sh.control,
            { height: 80, alignItems: 'flex-start', paddingTop: 12 },
            data.address && sh.controlFilled,
          ]}
        >
          <TextInput
            style={[sh.input, { flex: 1 }]}
            placeholder="Ko'cha, uy, kvartira raqami"
            placeholderTextColor={COLORS.faint}
            multiline
            value={data.address}
            onChangeText={(v) => set({ address: v })}
          />
        </View>
      </ScrollView>

      <PickerModal
        visible={showRegion}
        items={regions.items}
        loading={regions.loading}
        error={regions.error}
        onSelect={(item) =>
          set({
            region_id: item.id,
            region_name: item.name,
            district_id: null,
            district_name: '',
          })
        }
        onClose={() => setShowRegion(false)}
        title="Viloyat tanlang"
      />
      <PickerModal
        visible={showDistrict}
        items={districts.items}
        loading={districts.loading}
        error={districts.error}
        onSelect={(item) =>
          set({ district_id: item.id, district_name: item.name })
        }
        onClose={() => setShowDistrict(false)}
        title="Tuman tanlang"
      />

      <View style={sh.footer}>
        <CtaBtn label="Davom etish" onPress={onNext} disabled={!ok} />
      </View>
    </View>
  );
}

// ─── Step: Bio / experience / languages ───────────────────────────────────────
function LanguageChips({ languages, selected, onToggle }) {
  if (languages.loading) {
    return (
      <View style={[lc.card, { alignItems: 'center', paddingVertical: 22 }]}>
        <ActivityIndicator size="small" color={COLORS.orange} />
      </View>
    );
  }
  if (languages.error || languages.items.length === 0) return null;
  return (
    <View style={lc.card}>
      <View style={lc.header}>
        <View style={lc.iconBadge}>
          <MaterialCommunityIcons name="translate" size={15} color={COLORS.orange} />
        </View>
        <Text style={lc.headerTxt}>Bir nechtasini tanlashingiz mumkin</Text>
        {selected.length > 0 && (
          <View style={lc.countBadge}>
            <Text style={lc.countTxt}>{selected.length}</Text>
          </View>
        )}
      </View>
      <View style={lc.grid}>
        {languages.items.map((item) => {
          const on = selected.includes(item.id);
          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => onToggle(item.id)}
              activeOpacity={0.8}
              style={[lc.chip, on && lc.chipOn]}
            >
              {on ? (
                <Ionicons name="checkmark-circle" size={15} color={COLORS.orange} />
              ) : (
                <View style={lc.dot} />
              )}
              <Text style={[lc.chipTxt, on && lc.chipTxtOn]}>{item.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
const lc = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 16,
    marginBottom: 13,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  iconBadge: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: 'rgba(232,122,69,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTxt: { flex: 1, fontSize: 12.5, fontWeight: '600', color: COLORS.muted },
  countBadge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 6,
    borderRadius: 11,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countTxt: { fontSize: 11.5, fontWeight: '800', color: '#fff' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
  },
  chipOn: { borderColor: COLORS.orange, backgroundColor: 'rgba(232,122,69,0.16)' },
  dot: {
    width: 15,
    height: 15,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  chipTxt: { fontSize: 13, fontWeight: '600', color: COLORS.faint },
  chipTxtOn: { color: COLORS.white, fontWeight: '700' },
});

const EXPERIENCE_PRESETS = [1, 2, 3, 5, 7, 10, 15, 20];

function ExperienceStepper({ value, onChange }) {
  const num = value === '' ? 0 : Number(value);
  const dec = () => onChange(String(Math.max(0, num - 1)));
  const inc = () => onChange(String(Math.min(60, num + 1)));

  return (
    <View style={es.card}>
      <View style={es.row}>
        <TouchableOpacity
          style={[es.btn, num <= 0 && es.btnDisabled]}
          onPress={dec}
          activeOpacity={0.8}
          disabled={num <= 0}
        >
          <Ionicons name="remove" size={20} color={num <= 0 ? COLORS.faint : COLORS.white} />
        </TouchableOpacity>

        <View style={es.valueWrap}>
          <TextInput
            style={es.valueInput}
            keyboardType="number-pad"
            value={value}
            onChangeText={(v) => onChange(v.replace(/\D/g, '').slice(0, 2))}
            placeholder="0"
            placeholderTextColor={COLORS.faint}
            textAlign="center"
          />
          <Text style={es.unit}>yil tajriba</Text>
        </View>

        <TouchableOpacity style={[es.btn, es.btnPrimary]} onPress={inc} activeOpacity={0.8}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={es.presetsRow}>
        {EXPERIENCE_PRESETS.map((p) => {
          const on = value === String(p);
          return (
            <TouchableOpacity
              key={p}
              onPress={() => onChange(String(p))}
              activeOpacity={0.8}
              style={[es.chip, on && es.chipOn]}
            >
              <Text style={[es.chipTxt, on && es.chipTxtOn]}>{p}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
const es = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 20,
    padding: 18,
    marginBottom: 13,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 22,
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.inputBg,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnDisabled: { opacity: 0.5 },
  btnPrimary: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
    shadowColor: COLORS.orange,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 5,
  },
  valueWrap: { alignItems: 'center', minWidth: 96 },
  valueInput: {
    fontSize: 40,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: -1,
    padding: 0,
    minWidth: 70,
  },
  unit: { fontSize: 12, color: COLORS.muted, fontWeight: '600', marginTop: 2 },
  presetsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
    marginTop: 18,
  },
  chip: {
    minWidth: 40,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.inputBg,
    alignItems: 'center',
  },
  chipOn: { borderColor: COLORS.orange, backgroundColor: 'rgba(232,122,69,0.28)' },
  chipTxt: { fontSize: 13, fontWeight: '700', color: COLORS.faint },
  chipTxtOn: { color: COLORS.white },
});

function StepBio({ data, set, onNext, languages }) {
  const expOk = data.experience_years !== '' && Number(data.experience_years) >= 0;
  const bioOk = data.bio.trim().length > 0;
  const ok = expOk && bioOk;

  const toggleLanguage = (id) => {
    const has = data.languages.includes(id);
    set({
      languages: has
        ? data.languages.filter((x) => x !== id)
        : [...data.languages, id],
    });
  };

  return (
    <View style={sh.flex}>
      <ScrollView
        contentContainerStyle={sh.body}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={[sh.eyebrow, { textAlign: 'center' }]}>3-QADAM</Text>
        <Text style={[sh.h1, { textAlign: 'center' }]}>Kasbiy ma'lumot</Text>
        <Text style={[sh.sub, { textAlign: 'center' }]}>
          O'zingiz va tajribangiz haqida qisqacha yozing.
        </Text>

        <Text style={sh.label}>
          Umumiy ish tajribasi <Text style={sh.req}>*</Text>
        </Text>
        <ExperienceStepper
          value={data.experience_years}
          onChange={(v) => set({ experience_years: v })}
        />

        <Text style={sh.label}>
          O'zingiz haqingizda <Text style={sh.req}>*</Text>
        </Text>
        <View
          style={[
            sh.control,
            { height: 100, alignItems: 'flex-start', paddingTop: 12 },
            data.bio && sh.controlFilled,
          ]}
        >
          <TextInput
            style={[sh.input, { flex: 1 }]}
            placeholder="Ish tajribangiz, ko'nikmalaringiz haqida yozing"
            placeholderTextColor={COLORS.faint}
            multiline
            maxLength={500}
            value={data.bio}
            onChangeText={(v) => set({ bio: v })}
          />
        </View>

        <Text style={sh.label}>Tillar</Text>
        <LanguageChips languages={languages} selected={data.languages} onToggle={toggleLanguage} />

        <Text style={sh.label}>Taklif kodi</Text>
        <View style={[sh.control, data.referrer_code && sh.controlFilled]}>
          <MaterialCommunityIcons name="gift-outline" size={18} color={COLORS.faint} />
          <TextInput
            style={sh.input}
            autoCapitalize="characters"
            placeholder="Ixtiyoriy"
            placeholderTextColor={COLORS.faint}
            value={data.referrer_code}
            onChangeText={(v) => set({ referrer_code: v })}
          />
        </View>
      </ScrollView>
      <View style={sh.footer}>
        <CtaBtn label="Davom etish" onPress={onNext} disabled={!ok} />
      </View>
    </View>
  );
}

// ─── Step: Categories (kasb yo'nalishlari) ────────────────────────────────────
function CategoryFormModal({ visible, onClose, onSave, categoryItems, priceTypeItems, forcePrimary }) {
  const [category, setCategory] = useState(null);
  const [expYears, setExpYears] = useState('');
  const [priceType, setPriceType] = useState(null);
  const [price, setPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [primary, setPrimary] = useState(forcePrimary);
  const [showCatPicker, setShowCatPicker] = useState(false);
  const [showPriceTypePicker, setShowPriceTypePicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setCategory(null);
      setExpYears('');
      setPriceType(null);
      setPrice('');
      setMinPrice('');
      setNegotiable(false);
      setPrimary(forcePrimary);
    }
  }, [visible, forcePrimary]);

  const ok = category && expYears.trim() !== '' && priceType && price.trim() && minPrice.trim();

  const save = () => {
    if (!ok) return;
    onSave({
      _key: `cat-${Date.now()}`,
      category_id: category.id,
      category_name: category.name,
      experience_years: Number(expYears) || 0,
      is_primary: primary,
      price_type_id: priceType.id,
      price_type_name: priceType.name,
      price: Number(price) || 0,
      min_price: Number(minPrice) || 0,
      currency: 'UZS',
      is_negotiable: negotiable,
    });
  };

  return (
    <>
      <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
        <TouchableOpacity style={pk.overlay} activeOpacity={1} onPress={onClose}>
          <TouchableOpacity style={[pk.sheet, { maxHeight: '88%' }]} activeOpacity={1}>
            <View style={pk.header}>
              <Text style={pk.title}>Kategoriya qo'shish</Text>
              <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name="close" size={22} color={COLORS.muted} />
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ padding: 20, gap: 13 }} keyboardShouldPersistTaps="handled">
              <View>
                <Text style={sh.label}>
                  Kategoriya <Text style={sh.req}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[sh.control, { justifyContent: 'space-between' }, category && sh.controlFilled]}
                  onPress={() => setShowCatPicker(true)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: category ? COLORS.white : COLORS.faint,
                      fontWeight: category ? '500' : '400',
                    }}
                  >
                    {category?.name || 'Tanlang'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={COLORS.faint} />
                </TouchableOpacity>
              </View>

              <View>
                <Text style={sh.label}>
                  Shu yo'nalishdagi tajriba <Text style={sh.req}>*</Text>
                </Text>
                <ExperienceStepper value={expYears} onChange={setExpYears} />
              </View>

              <View>
                <Text style={sh.label}>
                  Narx turi <Text style={sh.req}>*</Text>
                </Text>
                <TouchableOpacity
                  style={[sh.control, { justifyContent: 'space-between' }, priceType && sh.controlFilled]}
                  onPress={() => setShowPriceTypePicker(true)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: priceType ? COLORS.white : COLORS.faint,
                      fontWeight: priceType ? '500' : '400',
                    }}
                  >
                    {priceType?.name || 'Tanlang'}
                  </Text>
                  <Ionicons name="chevron-down" size={18} color={COLORS.faint} />
                </TouchableOpacity>
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={sh.label}>
                    Narx (so'm) <Text style={sh.req}>*</Text>
                  </Text>
                  <View style={sh.control}>
                    <TextInput
                      style={sh.input}
                      keyboardType="number-pad"
                      placeholder="150000"
                      placeholderTextColor={COLORS.faint}
                      value={price}
                      onChangeText={setPrice}
                    />
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={sh.label}>
                    Minimal narx <Text style={sh.req}>*</Text>
                  </Text>
                  <View style={sh.control}>
                    <TextInput
                      style={sh.input}
                      keyboardType="number-pad"
                      placeholder="100000"
                      placeholderTextColor={COLORS.faint}
                      value={minPrice}
                      onChangeText={setMinPrice}
                    />
                  </View>
                </View>
              </View>

              <ToggleRow
                label="Narx kelishiladi"
                desc="Mijoz bilan kelishib narxni o'zgartirish mumkin"
                value={negotiable}
                onChange={setNegotiable}
              />
              <ToggleRow
                label="Asosiy kasb"
                desc="Profilingizda birinchi ko'rsatiladi"
                value={primary}
                onChange={setPrimary}
                disabled={forcePrimary}
              />
            </ScrollView>
            <View style={{ padding: 20, paddingTop: 8 }}>
              <CtaBtn label="Qo'shish" onPress={save} disabled={!ok} checkIcon />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <PickerModal
        visible={showCatPicker}
        items={categoryItems}
        onSelect={setCategory}
        onClose={() => setShowCatPicker(false)}
        title="Kategoriya tanlang"
      />
      <PickerModal
        visible={showPriceTypePicker}
        items={priceTypeItems}
        onSelect={setPriceType}
        onClose={() => setShowPriceTypePicker(false)}
        title="Narx turini tanlang"
      />
    </>
  );
}

const formatSom = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

function StepCategories({ data, set, onNext, categories, priceTypes }) {
  const [showModal, setShowModal] = useState(false);
  const availableCategories = categories.items.filter(
    (c) => !data.categories.some((x) => x.category_id === c.id)
  );

  const addCategory = (cat) => {
    let list = [...data.categories, cat];
    if (cat.is_primary) {
      list = list.map((c) => (c._key === cat._key ? c : { ...c, is_primary: false }));
    }
    set({ categories: list });
    setShowModal(false);
  };

  const removeCategory = (key) => {
    let list = data.categories.filter((c) => c._key !== key);
    if (list.length && !list.some((c) => c.is_primary)) {
      list = list.map((c, i) => (i === 0 ? { ...c, is_primary: true } : c));
    }
    set({ categories: list });
  };

  const ok = data.categories.length > 0;

  return (
    <View style={sh.flex}>
      <ScrollView contentContainerStyle={sh.body}>
        <Text style={[sh.eyebrow, { textAlign: 'center' }]}>4-QADAM</Text>
        <Text style={[sh.h1, { textAlign: 'center' }]}>Kasb yo'nalishlaringiz</Text>
        <Text style={[sh.sub, { textAlign: 'center' }]}>
          Xizmat ko'rsatadigan kategoriyalaringizni va narxlaringizni qo'shing.
        </Text>

        {data.categories.map((c) => (
          <View key={c._key} style={cg.card}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Text style={cg.name}>{c.category_name}</Text>
                {c.is_primary && (
                  <View style={cg.badge}>
                    <Text style={cg.badgeTxt}>Asosiy</Text>
                  </View>
                )}
              </View>
              <Text style={cg.meta}>
                {c.price_type_name} · {c.experience_years} yil tajriba
              </Text>
              <Text style={cg.price}>
                {formatSom(c.price)} so'm{c.is_negotiable ? ' · Kelishiladi' : ''}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeCategory(c._key)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="trash-outline" size={19} color="#e0473a" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={cg.addBtn} onPress={() => setShowModal(true)} activeOpacity={0.8}>
          <Ionicons name="add-circle-outline" size={20} color={COLORS.orange} />
          <Text style={cg.addTxt}>Kategoriya qo'shish</Text>
        </TouchableOpacity>

        {data.categories.length === 0 && (
          <View style={sh.note}>
            <Ionicons name="information-circle-outline" size={17} color={COLORS.muted} />
            <Text style={sh.noteTxt}>Davom etish uchun kamida 1 ta kategoriya qo'shing.</Text>
          </View>
        )}
      </ScrollView>

      <CategoryFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={addCategory}
        categoryItems={availableCategories}
        priceTypeItems={priceTypes.items}
        forcePrimary={data.categories.length === 0}
      />

      <View style={sh.footer}>
        <CtaBtn label="Davom etish" onPress={onNext} disabled={!ok} />
      </View>
    </View>
  );
}
const cg = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  name: { fontSize: 14.5, fontWeight: '700', color: COLORS.white },
  badge: {
    backgroundColor: 'rgba(47,163,122,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeTxt: { fontSize: 10.5, fontWeight: '700', color: COLORS.success },
  meta: { fontSize: 12, color: COLORS.muted, marginBottom: 2 },
  price: { fontSize: 13, color: COLORS.orange, fontWeight: '700' },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.border,
    marginBottom: 6,
  },
  addTxt: { color: COLORS.orange, fontWeight: '700', fontSize: 14 },
});

// ─── Step: Certificates (optional) ────────────────────────────────────────────
function CertificateFormModal({ visible, onClose, onSave, phone, code }) {
  const [title, setTitle] = useState('');
  const [issuedBy, setIssuedBy] = useState('');
  const [issuedAt, setIssuedAt] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const [photoKey, setPhotoKey] = useState(null);
  const [uploading, setUploading] = useState(false);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (visible) {
      setTitle('');
      setIssuedBy('');
      setIssuedAt('');
      setExpiresAt('');
      setPhotoUri(null);
      setPhotoKey(null);
    }
  }, [visible]);

  const handlePickPhoto = () => {
    pickImage(async (uri, mimeType) => {
      const contentType = mimeType || 'image/jpeg';
      setPhotoUri(uri);
      setPhotoKey(null);
      setUploading(true);
      try {
        const { upload_url, temp_key } = await getWorkerRegisterUploadUrl(phone, code, contentType);
        await uploadImageToPresignedUrl(upload_url, uri, contentType);
        setPhotoKey(temp_key);
      } catch (e) {
        Alert.alert('Xatolik', e.message || "Rasm yuklanmadi, qayta urinib ko'ring");
        setPhotoUri(null);
        setPhotoKey(null);
      } finally {
        setUploading(false);
      }
    });
  };

  const ok = title.trim() && issuedBy.trim() && issuedAt && photoKey;

  const save = () => {
    if (!ok) return;
    onSave({
      _key: `cert-${Date.now()}`,
      title: title.trim(),
      issued_by: issuedBy.trim(),
      issued_at: issuedAt,
      expires_at: expiresAt || null,
      photo_url: photoKey,
      photo_preview: photoUri,
    });
  };

  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={pk.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[pk.sheet, { maxHeight: '90%' }]} activeOpacity={1}>
          <View style={pk.header}>
            <Text style={pk.title}>Sertifikat qo'shish</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color={COLORS.muted} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 13 }} keyboardShouldPersistTaps="handled">
            <UploadCard
              uri={photoUri}
              uploading={uploading}
              onPress={handlePickPhoto}
              icon="certificate-outline"
              title="Sertifikat rasmi"
              desc="Aniq va to'liq ko'rinishda"
            />
            <View>
              <Text style={sh.label}>
                Sertifikat nomi <Text style={sh.req}>*</Text>
              </Text>
              <View style={sh.control}>
                <TextInput
                  style={sh.input}
                  placeholder="Masalan: Santexnika montaji"
                  placeholderTextColor={COLORS.faint}
                  value={title}
                  onChangeText={setTitle}
                />
              </View>
            </View>
            <View>
              <Text style={sh.label}>
                Muassasa <Text style={sh.req}>*</Text>
              </Text>
              <View style={sh.control}>
                <TextInput
                  style={sh.input}
                  placeholder="Bergan tashkilot"
                  placeholderTextColor={COLORS.faint}
                  value={issuedBy}
                  onChangeText={setIssuedBy}
                />
              </View>
            </View>
            <View>
              <Text style={sh.label}>
                Olingan sana <Text style={sh.req}>*</Text>
              </Text>
              <DateField
                value={issuedAt}
                onChange={setIssuedAt}
                minYear={1980}
                maxYear={currentYear}
                title="Olingan sanani tanlang"
              />
            </View>
            <View>
              <Text style={sh.label}>Amal qilish muddati</Text>
              <DateField
                value={expiresAt}
                onChange={setExpiresAt}
                minYear={currentYear}
                maxYear={currentYear + 20}
                title="Amal qilish muddatini tanlang"
                placeholder="Muddatsiz"
                optional
              />
            </View>
          </ScrollView>
          <View style={{ padding: 20, paddingTop: 8 }}>
            <CtaBtn label="Qo'shish" onPress={save} disabled={!ok} checkIcon />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

function StepCertificates({ data, set, onNext, phone, code, secs, urgent }) {
  const [showModal, setShowModal] = useState(false);
  const addCert = (cert) => {
    set({ certificates: [...data.certificates, cert] });
    setShowModal(false);
  };
  const removeCert = (key) => set({ certificates: data.certificates.filter((c) => c._key !== key) });
  const mm = String(Math.floor(secs / 60)).padStart(2, '0');
  const ss = String(secs % 60).padStart(2, '0');

  return (
    <View style={sh.flex}>
      <ScrollView contentContainerStyle={sh.body}>
        <Text style={[sh.eyebrow, { textAlign: 'center' }]}>7-QADAM</Text>
        <Text style={[sh.h1, { textAlign: 'center' }]}>Sertifikatlar</Text>
        <Text style={[sh.sub, { textAlign: 'center' }]}>
          Mavjud bo'lsa, malaka sertifikatlaringizni qo'shing. Bu qadamni o'tkazib yuborish ham mumkin.
        </Text>

        <View style={[sh.note, { marginTop: 0, marginBottom: 16 }, urgent && { borderColor: '#e03131' }]}>
          <Ionicons name="time-outline" size={17} color={urgent ? '#e03131' : COLORS.orange} />
          <Text style={sh.noteTxt}>
            Ro'yxatdan o'tishni yakunlash uchun{' '}
            <Text style={{ color: urgent ? '#e03131' : COLORS.orange, fontWeight: '700' }}>
              {mm}:{ss}
            </Text>{' '}
            vaqtingiz bor.
          </Text>
        </View>

        {data.certificates.map((c) => (
          <View key={c._key} style={cg.card}>
            {!!c.photo_preview && (
              <Image source={{ uri: c.photo_preview }} style={{ width: 44, height: 44, borderRadius: 10 }} />
            )}
            <View style={{ flex: 1 }}>
              <Text style={cg.name}>{c.title}</Text>
              <Text style={cg.meta}>
                {c.issued_by} · {c.issued_at}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeCert(c._key)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="trash-outline" size={19} color="#e0473a" />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity style={cg.addBtn} onPress={() => setShowModal(true)} activeOpacity={0.8}>
          <Ionicons name="add-circle-outline" size={20} color={COLORS.orange} />
          <Text style={cg.addTxt}>Sertifikat qo'shish</Text>
        </TouchableOpacity>
      </ScrollView>

      <CertificateFormModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSave={addCert}
        phone={phone}
        code={code}
      />

      <View style={sh.footer}>
        <CtaBtn label="Davom etish" onPress={onNext} />
      </View>
    </View>
  );
}

// ─── Done ────────────────────────────────────────────────────────────────────
function StepDone({ data, onFinish, onEdit, submitting }) {
  const rows = [
    {
      icon: 'person-outline',
      label: 'Foydalanuvchi',
      value: `${data.first_name} ${data.last_name}${
        data.gender_name ? ' · ' + data.gender_name : ''
      }`,
    },
    { icon: 'call-outline', label: 'Telefon', value: `+998 ${data.phone}` },
    {
      icon: 'location-outline',
      label: 'Manzil',
      value: `${data.region_name || '—'}, ${data.district_name || '—'}`,
    },
    {
      icon: 'briefcase-outline',
      label: 'Kasblar',
      value: data.categories.map((c) => c.category_name).join(', ') || '—',
    },
    {
      icon: 'shield-checkmark-outline',
      label: 'Tasdiqlash',
      value: 'Pasport rasmi yuklandi',
    },
  ];
  return (
    <ScrollView contentContainerStyle={[sh.body, { alignItems: 'center' }]}>
      <View style={dn.ring}>
        <View style={dn.badge}>
          <Ionicons name="checkmark" size={36} color="#fff" />
        </View>
      </View>
      <Text style={dn.h}>Ro'yxatdan o'tdingiz!</Text>
      <Text style={dn.p}>
        Tabriklaymiz,{' '}
        <Text style={{ color: COLORS.white, fontWeight: '700' }}>
          {data.first_name || 'foydalanuvchi'}
        </Text>
        !{'\n'}
        Hisobingiz tekshiruvga yuborildi va tez orada faollashtiriladi.
      </Text>

      <View style={dn.summary}>
        {rows.map(({ icon, label, value }, i) => (
          <View
            key={label}
            style={[dn.row, i === rows.length - 1 && { borderBottomWidth: 0 }]}
          >
            <View style={dn.iconBox}>
              <Ionicons name={icon} size={19} color={COLORS.orange} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={dn.rowLbl}>{label}</Text>
              <Text style={dn.rowVal}>{value}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={[
          ct.btn,
          { width: '100%', marginHorizontal: 0 },
          submitting && ct.disabled,
        ]}
        onPress={submitting ? undefined : onFinish}
        activeOpacity={0.85}
      >
        {submitting ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <>
            <Text style={ct.txt}>Ilovaga kirish</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={dn.editBtn}
        onPress={submitting ? undefined : onEdit}
        activeOpacity={0.7}
        disabled={submitting}
      >
        <Ionicons name="create-outline" size={17} color={COLORS.orange} />
        <Text style={dn.editTxt}>Ma'lumotlarni tahrirlash</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
const dn = StyleSheet.create({
  ring: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(47,163,122,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  badge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.success,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.success,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 10,
  },
  h: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  p: {
    color: COLORS.muted,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 21,
    marginBottom: 24,
  },
  summary: {
    width: '100%',
    backgroundColor: COLORS.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: 'rgba(232,122,69,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLbl: { fontSize: 11.5, color: COLORS.muted, marginBottom: 2 },
  rowVal: { fontSize: 13.5, fontWeight: '600', color: COLORS.white },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    marginTop: 14,
    paddingVertical: 10,
  },
  editTxt: { color: COLORS.orange, fontSize: 13.5, fontWeight: '600' },
});

// ─── Shared styles ────────────────────────────────────────────────────────────
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
  prefix: { fontSize: 18, fontWeight: '700', color: COLORS.white },
  sep: { width: 1, height: 22, backgroundColor: COLORS.border },
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
export default function WorkerRegisterStep({ onBack, onDone }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [devCode, setDevCode] = useState('');
  const [showExpired, setShowExpired] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [finishError, setFinishError] = useState('');
  const [editing, setEditing] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [postOtpSecs, setPostOtpSecs] = useState(POST_OTP_SECONDS);

  const [genders, setGenders] = useState({ items: [], loading: true, error: null });
  const [regions, setRegions] = useState({ items: [], loading: true, error: null });
  const [districts, setDistricts] = useState({ items: [], loading: false, error: null });
  const [categoriesList, setCategoriesList] = useState({ items: [], loading: true, error: null });
  const [priceTypes, setPriceTypes] = useState({ items: [], loading: true, error: null });
  const [languages, setLanguages] = useState({ items: [], loading: true, error: null });

  useEffect(() => {
    loadInto(setGenders, getGenders);
    loadInto(setRegions, getRegions);
    loadInto(setCategoriesList, getCategories);
    loadInto(setPriceTypes, getPriceTypes);
    loadInto(setLanguages, getLanguages);
  }, []);

  const [data, setData] = useState({
    phone: '',
    code: '',
    passport_image: null,
    passport_image_key: null,
    first_name: '',
    last_name: '',
    email: '',
    gender_id: null,
    gender_name: '',
    birth_date: '',
    region_id: null,
    region_name: '',
    district_id: null,
    district_name: '',
    address: '',
    bio: '',
    experience_years: '',
    languages: [],
    referrer_code: '',
    categories: [],
    certificates: [],
  });
  const set = (patch) => setData((d) => ({ ...d, ...patch }));

  useEffect(() => {
    if (!data.region_id) {
      setDistricts({ items: [], loading: false, error: null });
      return;
    }
    loadInto(setDistricts, () => getDistricts(data.region_id));
  }, [data.region_id]);

  // Countdown that spans every post-OTP step (certificates + passport upload).
  useEffect(() => {
    if (!otpVerified) return;
    const t = setInterval(() => setPostOtpSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [otpVerified]);

  useEffect(() => {
    if (otpVerified && postOtpSecs === 0) handlePostOtpExpire();
  }, [postOtpSecs, otpVerified]);

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

  const next = () => setStep((s) => s + 1);

  const afterCategories = () => {
    if (editing) {
      setEditing(false);
      setStep(DONE_STEP);
    } else {
      next();
    }
  };

  const afterCode = () => {
    setOtpVerified(true);
    setPostOtpSecs(POST_OTP_SECONDS);
    next();
  };

  const back = () => {
    if (step === 1) {
      if (editing) {
        setEditing(false);
        setStep(DONE_STEP);
      } else {
        onBack();
      }
    } else if (step === CERTIFICATES_STEP) {
      setOtpVerified(false);
      setStep(PHONE_STEP);
    } else {
      setStep((s) => s - 1);
    }
  };

  const editFromDone = () => {
    setEditing(true);
    setStep(INFO_STEP);
  };

  const handlePostOtpExpire = () => {
    set({
      code: '',
      passport_image: null,
      passport_image_key: null,
      certificates: [],
    });
    setDevCode('');
    setOtpVerified(false);
    setStep(PHONE_STEP);
    setShowExpired(true);
  };

  const toIsoDate = (str) => {
    const [d, m, y] = str.split('.');
    return `${y}-${m}-${d}`;
  };

  const finish = async () => {
    const phone = '+998' + data.phone.replace(/\D/g, '');
    setLoading(true);
    try {
      await verifyWorkerRegisterOtp({
        phone,
        code: data.code,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        birth_date: toIsoDate(data.birth_date),
        address: data.address,
        verification_temp_key: data.passport_image_key,
        bio: data.bio,
        experience_years: Number(data.experience_years) || 0,
        languages: data.languages,
        gender_id: data.gender_id,
        region_id: data.region_id,
        district_id: data.district_id,
        registration_source_id: WORKER_REGISTRATION_SOURCE_ID,
        referrer_code: data.referrer_code.trim(),
        categories: data.categories.map((c) => ({
          category_id: c.category_id,
          experience_years: c.experience_years,
          is_primary: c.is_primary,
          price_type_id: c.price_type_id,
          price: c.price,
          min_price: c.min_price,
          currency: c.currency,
          is_negotiable: c.is_negotiable,
        })),
        certificates: data.certificates.map((c) => ({
          title: c.title,
          issued_by: c.issued_by,
          issued_at: toIsoDate(c.issued_at),
          expires_at: c.expires_at ? toIsoDate(c.expires_at) : null,
          photo_url: c.photo_url,
        })),
      });
      onDone();
    } catch (e) {
      setFinishError(
        e.message || "Ro'yxatdan o'tishni yakunlashda muammo yuz berdi"
      );
    } finally {
      setLoading(false);
    }
  };

  const certPhone = '+998' + data.phone.replace(/\D/g, '');
  const urgent = postOtpSecs <= 30;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: COLORS.bg }}
      edges={['top', 'left', 'right']}
    >
      {step <= TOTAL_STEPS && (
        <TopNav step={step} onBack={back} dimBack={step === 1 && !editing} />
      )}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {step === INFO_STEP && (
          <StepInfo data={data} set={set} onNext={next} genders={genders} />
        )}
        {STEP_ORDER[step - 1] === 'address' && (
          <StepAddress
            data={data}
            set={set}
            onNext={next}
            regions={regions}
            districts={districts}
          />
        )}
        {STEP_ORDER[step - 1] === 'bio' && (
          <StepBio data={data} set={set} onNext={next} languages={languages} />
        )}
        {step === CATEGORIES_STEP && (
          <StepCategories
            data={data}
            set={set}
            onNext={afterCategories}
            categories={categoriesList}
            priceTypes={priceTypes}
          />
        )}
        {step === PHONE_STEP && (
          <StepPhone data={data} set={set} onNext={sendOtp} loading={loading} />
        )}
        {STEP_ORDER[step - 1] === 'code' && (
          <StepCode
            data={data}
            set={set}
            onNext={afterCode}
            devCode={devCode}
            onResend={sendOtp}
            resendLoading={loading}
          />
        )}
        {step === CERTIFICATES_STEP && (
          <StepCertificates
            data={data}
            set={set}
            onNext={next}
            phone={certPhone}
            code={data.code}
            secs={postOtpSecs}
            urgent={urgent}
          />
        )}
        {step === PASSPORT_STEP && (
          <StepPassport
            data={data}
            set={set}
            onNext={next}
            secs={postOtpSecs}
            urgent={urgent}
          />
        )}
        {step === DONE_STEP && (
          <StepDone
            data={data}
            onFinish={finish}
            onEdit={editFromDone}
            submitting={loading}
          />
        )}
      </KeyboardAvoidingView>
      <ExpiredModal
        visible={showExpired}
        onClose={() => setShowExpired(false)}
      />
      <OtpErrorModal message={otpError} onClose={() => setOtpError('')} />
      <RegisterErrorModal
        message={finishError}
        onClose={() => setFinishError('')}
      />
    </SafeAreaView>
  );
}
