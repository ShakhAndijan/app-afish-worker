import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const onlyDigits = (str) => (str || '').replace(/\D/g, '');
const PRICE_TYPES = ['Ish uchun', 'Soatlik', 'Kvadrat metr uchun', 'Kunlik'];

function CategoryEditSheet({ visible, category, onClose, onSave, t }) {
  const [price, setPrice] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [priceType, setPriceType] = useState(PRICE_TYPES[0]);
  const [experienceYears, setExperienceYears] = useState(0);
  const [negotiable, setNegotiable] = useState(false);
  const [isPrimary, setIsPrimary] = useState(false);

  useEffect(() => {
    if (visible && category) {
      setPrice(onlyDigits(category.price));
      setMinPrice(onlyDigits(category.minPrice));
      setPriceType(category.priceType || PRICE_TYPES[0]);
      setExperienceYears(category.experienceYears ?? 0);
      setNegotiable(!!category.negotiable);
      setIsPrimary(!!category.isPrimary);
    }
  }, [visible, category]);

  if (!category) return null;

  const handleSave = () => {
    const cleanPrice = onlyDigits(price);
    const cleanMinPrice = onlyDigits(minPrice);
    onSave({
      price: cleanPrice ? fmt(cleanPrice) : category.price,
      minPrice: cleanMinPrice ? fmt(cleanMinPrice) : category.minPrice,
      priceType,
      experienceYears,
      negotiable,
      isPrimary,
    });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={es.overlay} />
      </TouchableWithoutFeedback>

      <KeyboardAvoidingView
        style={es.sheetWrap}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        pointerEvents="box-none"
      >
        <View style={[es.sheet, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={es.grabberRow}>
            <View style={[es.grabber, { backgroundColor: t.border }]} />
          </View>

          <View style={es.headerRow}>
            <Text style={{ fontWeight: '700', fontSize: 17, color: t.text }}>
              Yo'nalishni tahrirlash
            </Text>
            <TouchableOpacity
              style={[es.closeBtn, { backgroundColor: t.rowIconBg }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="close" size={17} color={t.muted} />
            </TouchableOpacity>
          </View>
          <Text style={[es.subtitle, { color: t.muted }]}>{category.name}</Text>

          <ScrollView
            style={{ maxHeight: '100%' }}
            contentContainerStyle={es.body}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Tajriba */}
            <Text style={[es.fieldLabel, { color: t.muted }]}>
              Shu yo'nalishdagi tajriba
            </Text>
            <View style={[es.stepperRow, { backgroundColor: t.inputBg, borderColor: t.border }]}>
              <TouchableOpacity
                style={[es.stepBtn, { backgroundColor: t.rowIconBg }]}
                activeOpacity={0.8}
                onPress={() => setExperienceYears((v) => Math.max(0, v - 1))}
              >
                <Ionicons name="remove" size={17} color={t.text} />
              </TouchableOpacity>
              <Text style={{ fontSize: 16, fontWeight: '800', color: t.text }}>
                {experienceYears} yil
              </Text>
              <TouchableOpacity
                style={[es.stepBtn, { backgroundColor: t.rowIconBg }]}
                activeOpacity={0.8}
                onPress={() => setExperienceYears((v) => Math.min(50, v + 1))}
              >
                <Ionicons name="add" size={17} color={t.text} />
              </TouchableOpacity>
            </View>

            {/* Narx turi */}
            <Text style={[es.fieldLabel, { color: t.muted }]}>Narx turi</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {PRICE_TYPES.map((pt) => {
                const on = pt === priceType;
                return (
                  <TouchableOpacity
                    key={pt}
                    style={[
                      es.chip,
                      {
                        backgroundColor: on ? t.orange + '1c' : t.rowIconBg,
                        borderColor: on ? t.orange : t.border,
                      },
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setPriceType(pt)}
                  >
                    <Text
                      style={{
                        fontSize: 12.5,
                        fontWeight: '700',
                        color: on ? t.orange : t.muted,
                      }}
                    >
                      {pt}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Narx / Minimal narx */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={[es.fieldLabel, { color: t.muted }]}>Narx (so'm)</Text>
                <View style={[es.inputWrap, { backgroundColor: t.inputBg, borderColor: t.border }]}>
                  <TextInput
                    style={[es.input, { color: t.text }]}
                    value={price}
                    onChangeText={(v) => setPrice(onlyDigits(v))}
                    keyboardType="number-pad"
                    placeholder="80000"
                    placeholderTextColor={t.faint}
                  />
                </View>
              </View>
              <View style={{ flex: 1, gap: 8 }}>
                <Text style={[es.fieldLabel, { color: t.muted }]}>Minimal narx</Text>
                <View style={[es.inputWrap, { backgroundColor: t.inputBg, borderColor: t.border }]}>
                  <TextInput
                    style={[es.input, { color: t.text }]}
                    value={minPrice}
                    onChangeText={(v) => setMinPrice(onlyDigits(v))}
                    keyboardType="number-pad"
                    placeholder="50000"
                    placeholderTextColor={t.faint}
                  />
                </View>
              </View>
            </View>
            {!!price && (
              <Text style={{ fontSize: 11.5, color: t.faint, marginTop: -4 }}>
                Ko'rinishi: {fmt(price)} so'mdan boshlab · {priceType}
              </Text>
            )}

            {/* Narx kelishiladi */}
            <TouchableOpacity
              style={[
                es.toggleRow,
                {
                  backgroundColor: negotiable ? t.orange + '14' : t.rowIconBg,
                  borderColor: negotiable ? t.orange : t.border,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setNegotiable((v) => !v)}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13.5, fontWeight: '700', color: t.text }}>
                  Narx kelishiladi
                </Text>
                <Text style={{ fontSize: 11.5, color: t.muted, marginTop: 2, lineHeight: 16 }}>
                  Mijoz bilan kelishib narxni o'zgartirish mumkin
                </Text>
              </View>
              <View
                style={[
                  es.checkbox,
                  {
                    backgroundColor: negotiable ? t.orange : 'transparent',
                    borderColor: negotiable ? t.orange : t.faint,
                  },
                ]}
              >
                {negotiable && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
              </View>
            </TouchableOpacity>

            {/* Asosiy yo'nalish */}
            <TouchableOpacity
              style={[
                es.toggleRow,
                {
                  backgroundColor: isPrimary ? t.orange + '14' : t.rowIconBg,
                  borderColor: isPrimary ? t.orange : t.border,
                },
              ]}
              activeOpacity={0.8}
              onPress={() => setIsPrimary((v) => !v)}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13.5, fontWeight: '700', color: t.text }}>
                  Asosiy yo'nalish qilib belgilash
                </Text>
                <Text style={{ fontSize: 11.5, color: t.muted, marginTop: 2, lineHeight: 16 }}>
                  Mijozlarga profilingizda birinchi bo'lib shu yo'nalish ko'rsatiladi
                </Text>
              </View>
              <View
                style={[
                  es.checkbox,
                  {
                    backgroundColor: isPrimary ? t.orange : 'transparent',
                    borderColor: isPrimary ? t.orange : t.faint,
                  },
                ]}
              >
                {isPrimary && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
              </View>
            </TouchableOpacity>
          </ScrollView>

          <View style={{ paddingHorizontal: 22, paddingTop: 14 }}>
            <TouchableOpacity
              style={[es.saveBtn, { backgroundColor: t.orange }]}
              onPress={handleSave}
              activeOpacity={0.85}
            >
              <Text style={{ color: '#fff', fontWeight: '700', fontSize: 15 }}>
                Saqlash
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export default function CategoryDetailScreen({ category, works = [], t, onBack, onSelectWork, onUpdate }) {
  const insets = useSafeAreaInsets();
  const [showEdit, setShowEdit] = useState(false);
  if (!category) return null;

  const sortedWorks = [...works].sort((a, b) => b.id - a.id);

  const totalEarned = works.reduce(
    (sum, w) => sum + (parseInt(String(w.price).replace(/\s/g, ''), 10) || 0),
    0
  );
  const avgRating = works.length
    ? (works.reduce((sum, w) => sum + w.rating, 0) / works.length).toFixed(1)
    : null;

  const stats = [
    { icon: 'briefcase-check-outline', value: String(works.length), label: 'Bajarilgan ish' },
    { icon: 'cash-multiple', value: `${fmt(totalEarned)}`, label: "So'm daromad" },
    { icon: 'star-outline', value: avgRating ?? '—', label: "O'rtacha baho" },
  ];

  const detailRows = [
    {
      icon: 'tag-outline',
      label: `${category.price} so'm`,
      sub: `Boshlang'ich narx${category.priceType ? ' · ' + category.priceType : ''}`,
    },
    ...(category.minPrice
      ? [{ icon: 'cash-minus', label: `${category.minPrice} so'm`, sub: 'Minimal narx' }]
      : []),
    ...(category.experienceYears != null
      ? [{ icon: 'medal-outline', label: `${category.experienceYears} yil`, sub: "Shu yo'nalishdagi tajriba" }]
      : []),
    {
      icon: category.negotiable ? 'handshake-outline' : 'lock-outline',
      label: category.negotiable ? 'Ha, kelishiladi' : "Yo'q, belgilangan",
      sub: 'Narx kelishiladimi',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['top', 'left', 'right']}>
      <StatusBar style={t.isDark ? 'light' : 'dark'} />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={onBack}
          style={[s.iconBtn, { backgroundColor: t.card, borderColor: t.border }]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={t.text} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: t.text }]} numberOfLines={1}>
          Yo'nalish tafsilotlari
        </Text>
        <TouchableOpacity
          onPress={() => setShowEdit(true)}
          style={[s.iconBtn, { backgroundColor: t.card, borderColor: t.border }]}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons name="pencil-outline" size={18} color={t.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 14) + 24,
        }}
      >
        {/* ── Hero ── */}
        <View style={{ alignItems: 'center', marginTop: 10 }}>
          <View
            style={[
              s.heroIcon,
              { backgroundColor: category.isPrimary ? t.orange : t.rowIconBg },
            ]}
          >
            <MaterialCommunityIcons
              name={category.icon}
              size={34}
              color={category.isPrimary ? '#fff' : t.orange}
            />
          </View>
          <Text style={{ fontSize: 19, fontWeight: '800', color: t.text, marginTop: 12 }}>
            {category.name}
          </Text>
          <Text style={{ fontSize: 13.5, color: t.muted, marginTop: 4 }}>
            {category.price} so'mdan boshlab
          </Text>

          {category.isPrimary && (
            <View style={[s.badge, { backgroundColor: 'rgba(232,122,69,0.14)', marginTop: 12 }]}>
              <MaterialCommunityIcons name="star-check" size={13} color={t.orange} />
              <Text style={{ fontSize: 11.5, fontWeight: '800', color: t.orange }}>
                Asosiy yo'nalish
              </Text>
            </View>
          )}
        </View>

        {/* ── Stats ── */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 22 }}>
          {stats.map((st, i) => (
            <View
              key={i}
              style={[s.miniCard, { flex: 1, backgroundColor: t.card, borderColor: t.border }]}
            >
              <MaterialCommunityIcons name={st.icon} size={18} color={t.orange} />
              <Text
                style={{ fontSize: 14.5, fontWeight: '800', color: t.text, marginTop: 8 }}
                numberOfLines={1}
              >
                {st.value}
              </Text>
              <Text style={{ fontSize: 10, color: t.muted, marginTop: 2, textAlign: 'center' }}>
                {st.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Ro'yxatdan o'tishda kiritilgan ma'lumotlar ── */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 22, marginBottom: 11 }}>
          <Text style={[s.secTitle, { color: t.text, marginTop: 0 }]}>Narx va shartlar</Text>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}
            activeOpacity={0.7}
            onPress={() => setShowEdit(true)}
          >
            <MaterialCommunityIcons name="pencil-outline" size={14} color={t.orange} />
            <Text style={{ fontSize: 12.5, fontWeight: '700', color: t.orange }}>Tahrirlash</Text>
          </TouchableOpacity>
        </View>
        <View style={[s.card, { backgroundColor: t.card, borderColor: t.border, padding: 0 }]}>
          {detailRows.map((row, i) => (
            <View key={i}>
              <View style={s.detailRow}>
                <View style={[s.contactIconBox, { backgroundColor: t.rowIconBg }]}>
                  <MaterialCommunityIcons name={row.icon} size={16} color={t.muted} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: t.text }}>
                    {row.label}
                  </Text>
                  <Text style={{ fontSize: 11.5, color: t.muted, marginTop: 1 }}>{row.sub}</Text>
                </View>
              </View>
              {i < detailRows.length - 1 && (
                <View style={[s.rowDivider, { backgroundColor: t.border }]} />
              )}
            </View>
          ))}
        </View>

        {/* ── Ushbu yo'nalishdagi ishlar ── */}
        <Text style={[s.secTitle, { color: t.text }]}>Ushbu yo'nalishdagi ishlar</Text>

        {sortedWorks.length === 0 ? (
          <View style={[s.emptyCard, { backgroundColor: t.card, borderColor: t.border }]}>
            <MaterialCommunityIcons name="briefcase-off-outline" size={26} color={t.faint} />
            <Text style={{ fontSize: 12.5, color: t.muted, marginTop: 8, textAlign: 'center' }}>
              Hali bu yo'nalishda bajarilgan ish yo'q
            </Text>
          </View>
        ) : (
          <View style={{ gap: 10 }}>
            {sortedWorks.map((w) => (
              <TouchableOpacity
                key={w.id}
                style={[s.workRow, { backgroundColor: t.card, borderColor: t.border }]}
                activeOpacity={0.8}
                onPress={() => onSelectWork?.(w)}
              >
                <View style={[s.workIconBox, { backgroundColor: w.color + '20' }]}>
                  <MaterialCommunityIcons name={w.icon} size={19} color={w.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }} numberOfLines={1}>
                    {w.title}
                  </Text>
                  <Text style={{ fontSize: 11, color: t.muted, marginTop: 2 }} numberOfLines={1}>
                    {w.client?.name} · {w.date}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={{ fontSize: 12.5, fontWeight: '800', color: t.text }}>
                    {w.price} so'm
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Ionicons name="star" size={11} color={t.gold} />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: t.gold }}>
                      {w.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={16} color={t.faint} />
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <CategoryEditSheet
        visible={showEdit}
        category={category}
        onClose={() => setShowEdit(false)}
        onSave={(updates) => onUpdate?.(updates)}
        t={t}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'transparent',
  },
  headerTitle: { fontSize: 16.5, fontWeight: '700', flex: 1, textAlign: 'center' },

  heroIcon: {
    width: 78,
    height: 78,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 9,
  },

  miniCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
    alignItems: 'center',
  },

  secTitle: { fontSize: 15, fontWeight: '800', marginTop: 22, marginBottom: 11 },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  rowDivider: { height: 1, marginLeft: 14 + 34 + 12 },

  contactIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },

  workRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 16,
    borderWidth: 1,
    padding: 12,
  },
  workIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const es = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,8,14,0.65)',
  },
  sheetWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -16 },
    shadowOpacity: 0.35,
    shadowRadius: 40,
    elevation: 24,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  grabberRow: { paddingTop: 12, alignItems: 'center' },
  grabber: { width: 42, height: 5, borderRadius: 3 },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 12.5,
    paddingHorizontal: 22,
    paddingBottom: 14,
  },

  body: { paddingHorizontal: 22, gap: 10, paddingBottom: 6 },

  fieldLabel: { fontSize: 12, fontWeight: '700' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: { flex: 1, fontSize: 15, fontWeight: '700', padding: 0 },

  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  stepBtn: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  chip: {
    borderWidth: 1.5,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1.5,
    borderRadius: 14,
    padding: 14,
    marginTop: 6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveBtn: {
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#e87a45',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 8,
  },
});
