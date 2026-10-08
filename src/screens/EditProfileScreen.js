import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import SuccessModal from '../components/SuccessModal';
import AfishLoader from '../components/AfishLoader';
import { getGenders, getRegions, getDistricts } from '../api/reference';
import { getCustomerMe, updateCustomerMe } from '../api/user';
import { formatDisplayDate } from './edit-profile/dates';
import { FALLBACK_GENDERS, FALLBACK_REGIONS, FALLBACK_DISTRICTS } from './edit-profile/constants';
import TextField from './edit-profile/TextField';
import GenderToggle from './edit-profile/GenderToggle';
import SelectField from './edit-profile/SelectField';
import OptionSheet from './edit-profile/OptionSheet';
import BirthDateSheet from './edit-profile/BirthDateSheet';
import LocationField from './edit-profile/LocationField';
import GroupLabel from './edit-profile/GroupLabel';
import ProfileHeader from './edit-profile/ProfileHeader';

export default function EditProfileScreen({ onBack }) {
  const { theme: t } = useTheme();
  const { refreshUser } = useUser();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [genderId, setGenderId] = useState(null);
  const [birthDate, setBirthDate] = useState('');
  const [regionId, setRegionId] = useState(null);
  const [districtId, setDistrictId] = useState(null);
  const [address, setAddress] = useState('');
  const [gpsLat, setGpsLat] = useState(null);
  const [gpsLng, setGpsLng] = useState(null);
  const [landmark, setLandmark] = useState('');

  const [genders, setGenders] = useState(FALLBACK_GENDERS);
  const [regions, setRegions] = useState(FALLBACK_REGIONS);
  const [districts, setDistricts] = useState([]);
  const [gendersLoading, setGendersLoading] = useState(true);
  const [regionsLoading, setRegionsLoading] = useState(true);
  const [districtsLoading, setDistrictsLoading] = useState(false);

  const [showRegionSheet, setShowRegionSheet] = useState(false);
  const [showDistrictSheet, setShowDistrictSheet] = useState(false);
  const [showDateSheet, setShowDateSheet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let alive = true;
    getCustomerMe()
      .then((data) => {
        if (!alive || !data) return;
        setFirstName(data.first_name || '');
        setLastName(data.last_name || '');
        setEmail(data.email || '');
        setGenderId(
          data.gender && typeof data.gender === 'object'
            ? data.gender.id ?? null
            : data.gender ?? null
        );
        setBirthDate(data.birth_date || '');
        setRegionId(
          data.region && typeof data.region === 'object'
            ? data.region.id ?? null
            : data.region ?? null
        );
        setDistrictId(
          data.district && typeof data.district === 'object'
            ? data.district.id ?? null
            : data.district ?? null
        );
        setAddress(data.address || '');
        setGpsLat(
          data.default_gps_lat != null ? Number(data.default_gps_lat) : null
        );
        setGpsLng(
          data.default_gps_lng != null ? Number(data.default_gps_lng) : null
        );
        setLandmark(data.default_landmark || '');
      })
      .catch((e) => {
        Alert.alert(
          'Xatolik',
          e.message || "Profil ma'lumotlarini yuklab bo'lmadi"
        );
      })
      .finally(() => alive && setInitialLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    let alive = true;
    getGenders()
      .then((list) => {
        if (alive && list?.length) setGenders(list);
      })
      .catch(() => {})
      .finally(() => alive && setGendersLoading(false));
    getRegions()
      .then((list) => {
        if (alive && list?.length) setRegions(list);
      })
      .catch(() => {})
      .finally(() => alive && setRegionsLoading(false));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!regionId) {
      setDistricts([]);
      return;
    }
    let alive = true;
    setDistrictsLoading(true);
    getDistricts(regionId)
      .then((list) => {
        if (alive) setDistricts(list?.length ? list : FALLBACK_DISTRICTS);
      })
      .catch(() => {
        if (alive) setDistricts(FALLBACK_DISTRICTS);
      })
      .finally(() => alive && setDistrictsLoading(false));
    return () => {
      alive = false;
    };
  }, [regionId]);

  const selectedRegion = regions.find((r) => r.id === regionId);
  const selectedDistrict = districts.find((d) => d.id === districtId);

  const isReady =
    firstName.trim().length > 0 && lastName.trim().length > 0 && !saving;

  const handleLocate = async () => {
    setLocating(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Ruxsat kerak', 'Joylashuv uchun ruxsat bering.');
        return;
      }
      const pos = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setGpsLat(pos.coords.latitude);
      setGpsLng(pos.coords.longitude);
    } catch {
      Alert.alert(
        'Xato',
        "Joylashuvni aniqlab bo'lmadi. Qayta urinib ko'ring."
      );
    } finally {
      setLocating(false);
    }
  };

  const handleSave = async () => {
    if (!isReady) return;
    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      gender_id: genderId,
      birth_date: birthDate,
      region_id: regionId,
      district_id: districtId,
      address: address.trim(),
      default_gps_lat: gpsLat,
      default_gps_lng: gpsLng,
      default_landmark: landmark.trim(),
    };
    setSaving(true);
    try {
      await updateCustomerMe(payload);
      await refreshUser();
      setShowSuccess(true);
    } catch (e) {
      Alert.alert(
        'Xatolik',
        e.message || 'Profilni saqlashda xatolik yuz berdi'
      );
    } finally {
      setSaving(false);
    }
  };

  if (initialLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: t.bg }}
        edges={['top', 'left', 'right']}
      >
        <StatusBar style={t.isDark ? 'light' : 'dark'} />
        <ProfileHeader title="Profilni tahrirlash" onBack={onBack} t={t} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <AfishLoader size={120} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: t.bg }}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={t.isDark ? 'light' : 'dark'} />

      <ProfileHeader title="Profilni tahrirlash" onBack={onBack} t={t} />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <GroupLabel t={t}>SHAXSIY MA'LUMOTLAR</GroupLabel>
          <View
            style={[s.card, { backgroundColor: t.card, borderColor: t.border }]}
          >
            <TextField
              label="Ism"
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Ismingiz"
              t={t}
            />
            <TextField
              label="Familiya"
              value={lastName}
              onChangeText={setLastName}
              placeholder="Familiyangiz"
              t={t}
            />
            <GenderToggle
              genders={genders}
              selectedId={genderId}
              onSelect={setGenderId}
              loading={gendersLoading}
              t={t}
            />
            <SelectField
              label="Tug'ilgan sana"
              value={formatDisplayDate(birthDate)}
              placeholder="Kun.Oy.Yil"
              onPress={() => setShowDateSheet(true)}
              t={t}
            />
          </View>

          <GroupLabel t={t}>ALOQA</GroupLabel>
          <View
            style={[s.card, { backgroundColor: t.card, borderColor: t.border }]}
          >
            <TextField
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              t={t}
              keyboardType="email-address"
            />
          </View>

          <GroupLabel t={t}>MANZIL</GroupLabel>
          <View
            style={[s.card, { backgroundColor: t.card, borderColor: t.border }]}
          >
            <SelectField
              label="Viloyat"
              value={selectedRegion?.name}
              placeholder="Viloyatni tanlang"
              onPress={() => setShowRegionSheet(true)}
              t={t}
            />
            <SelectField
              label="Tuman"
              value={selectedDistrict?.name}
              placeholder={
                regionId ? 'Tumanni tanlang' : 'Avval viloyatni tanlang'
              }
              onPress={() => setShowDistrictSheet(true)}
              t={t}
              disabled={!regionId}
            />
            <TextField
              label="To'liq manzil"
              value={address}
              onChangeText={setAddress}
              placeholder="Ko'cha, uy raqami"
              t={t}
            />
            <LocationField
              lat={gpsLat}
              lng={gpsLng}
              locating={locating}
              onLocate={handleLocate}
              t={t}
            />
            <TextField
              label="Mo'ljal"
              value={landmark}
              onChangeText={setLandmark}
              placeholder="Masalan: Mega Planet ro'parasida"
              t={t}
            />
          </View>

          <TouchableOpacity
            style={[
              s.saveBtn,
              { backgroundColor: isReady ? t.orange : t.orange + '55' },
            ]}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={!isReady}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={s.saveBtnText}>Saqlash</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <OptionSheet
        visible={showRegionSheet}
        onClose={() => setShowRegionSheet(false)}
        title="Viloyatni tanlang"
        options={regions}
        selectedId={regionId}
        onSelect={(item) => setRegionId(item.id)}
        t={t}
        loading={regionsLoading}
      />
      <OptionSheet
        visible={showDistrictSheet}
        onClose={() => setShowDistrictSheet(false)}
        title="Tumanni tanlang"
        options={districts}
        selectedId={districtId}
        onSelect={(item) => setDistrictId(item.id)}
        t={t}
        loading={districtsLoading}
      />
      <BirthDateSheet
        visible={showDateSheet}
        onClose={() => setShowDateSheet(false)}
        value={birthDate}
        onChange={setBirthDate}
        t={t}
      />
      <SuccessModal
        visible={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onBack();
        }}
        t={t}
        message="Profil ma'lumotlari muvaffaqiyatli yangilandi."
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  saveBtn: {
    height: 54,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 26,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
