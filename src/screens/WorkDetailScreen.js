import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Avatar from '../components/Avatar';

const SLIDE_W = Dimensions.get('window').width - 40;
const SLIDE_H = 230;

function PhotoCarousel({ photos, tint, tone, t, autoMs = 2400 }) {
  const slides = photos.length
    ? photos
    : [{ icon: 'image-off-outline', label: "Rasm yo'q" }];

  const listRef = useRef(null);
  const indexRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    indexRef.current = 0;
    setActive(0);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % slides.length;
      indexRef.current = next;
      setActive(next);
      listRef.current?.scrollToOffset({ offset: next * SLIDE_W, animated: true });
    }, autoMs);
    return () => clearInterval(timer);
  }, [slides.length, autoMs]);

  const onScrollEnd = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SLIDE_W);
    indexRef.current = idx;
    setActive(idx);
  };

  return (
    <View>
      <FlatList
        ref={listRef}
        data={slides}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        renderItem={({ item }) => (
          <View style={{ width: SLIDE_W }}>
            <View style={[s.slide, { backgroundColor: tone, borderColor: tint + '40' }]}>
              <MaterialCommunityIcons name={item.icon} size={64} color={tint} />
              <Text style={[s.slideLabel, { color: tint }]} numberOfLines={2}>
                {item.label}
              </Text>
            </View>
          </View>
        )}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
        {slides.length > 1 ? (
          <View style={s.dots}>
            {slides.map((_, i) => (
              <View
                key={i}
                style={[
                  s.dot,
                  { backgroundColor: t.border },
                  i === active && { backgroundColor: tint, width: 18 },
                ]}
              />
            ))}
          </View>
        ) : (
          <View />
        )}
        <Text style={{ fontSize: 11, color: t.faint, fontWeight: '600' }}>
          {active + 1}/{slides.length}
        </Text>
      </View>
    </View>
  );
}

function ReviewCard({ title, icon, name, bgColor, rating, text, t, empty }) {
  return (
    <>
      <Text style={[s.secTitle, { color: t.text }]}>{title}</Text>
      {empty ? (
        <View style={[s.card, { backgroundColor: t.card, borderColor: t.border, alignItems: 'center' }]}>
          <Text style={{ fontSize: 12.5, color: t.muted }}>Hali sharh qoldirilmagan</Text>
        </View>
      ) : (
        <View style={[s.card, { backgroundColor: t.card, borderColor: t.border, padding: 14 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {name ? (
              <Avatar letter={name.charAt(0)} bgColor={bgColor} size={34} />
            ) : (
              <View style={[s.reviewIconBox, { backgroundColor: bgColor + '22' }]}>
                <MaterialCommunityIcons name={icon} size={18} color={bgColor} />
              </View>
            )}
            <View style={{ flex: 1 }}>
              {!!name && (
                <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>{name}</Text>
              )}
              <View style={{ flexDirection: 'row', gap: 1, marginTop: name ? 3 : 0 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star"
                    size={11}
                    color={i < rating ? t.gold : t.border}
                  />
                ))}
              </View>
            </View>
          </View>
          <Text
            style={{
              fontSize: 13,
              color: t.muted,
              marginTop: 11,
              lineHeight: 19,
              fontStyle: 'italic',
            }}
          >
            "{text}"
          </Text>
        </View>
      )}
    </>
  );
}

export default function WorkDetailScreen({ work, t, onBack, onOpenClient }) {
  const insets = useSafeAreaInsets();
  if (!work) return null;

  const {
    title,
    client,
    rating,
    date,
    category,
    icon = 'briefcase-outline',
    color = t.orange,
    price,
    duration,
    address,
    description,
    materials = [],
    beforePhotos = [],
    afterPhotos = [],
    clientReview,
    workerReview,
  } = work;

  const metaStats = [
    { icon: 'cash-outline', value: `${price} so'm`, label: 'Narx' },
    { icon: 'time-outline', value: duration, label: 'Davomiylik' },
    { icon: 'location-outline', value: address, label: 'Manzil' },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: t.bg }}
      edges={['top', 'left', 'right']}
    >
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
          Bajarilgan ish
        </Text>
        <View style={s.iconBtn} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: Math.max(insets.bottom, 14) + 24,
        }}
      >
        {/* ── Ishga kirishdan oldingi holat (auto-carousel) ── */}
        <View style={{ marginTop: 6 }}>
          <Text style={[s.secTitle, { color: t.text, marginTop: 0, marginBottom: 10 }]}>
            Ishdan oldingi holat
          </Text>
          <PhotoCarousel photos={beforePhotos} tint={t.faint} tone={t.rowIconBg} t={t} />
        </View>

        {/* ── Sarlavha, kategoriya va meta ── */}
        <View style={{ marginTop: 22 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <View style={[s.catChip, { backgroundColor: color + '20' }]}>
              <MaterialCommunityIcons name={icon} size={13} color={color} />
              <Text style={{ fontSize: 11.5, fontWeight: '700', color }}>{category}</Text>
            </View>
            <Text style={{ fontSize: 11.5, color: t.muted }}>{date}</Text>
          </View>

          <Text style={{ fontSize: 20, fontWeight: '800', color: t.text, marginTop: 10 }}>
            {title}
          </Text>

          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12 }}
            activeOpacity={0.7}
            onPress={() => onOpenClient?.(client)}
          >
            <Avatar letter={client.initial} bgColor={client.color} size={34} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13.5, color: t.text, fontWeight: '700' }}>
                {client.name}
              </Text>
              <Text style={{ fontSize: 11, color: t.muted, marginTop: 1 }}>
                Mijoz profilini ko'rish
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginRight: 4 }}>
              <Ionicons name="star" size={14} color={t.gold} />
              <Text style={{ fontSize: 13.5, fontWeight: '800', color: t.text }}>
                {rating.toFixed(1)}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={t.faint} />
          </TouchableOpacity>
        </View>

        {/* ── Narx / Davomiylik / Manzil ── */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
          {metaStats.map((m, i) => (
            <View
              key={i}
              style={[
                s.miniCard,
                { flex: 1, backgroundColor: t.card, borderColor: t.border },
              ]}
            >
              <Ionicons name={m.icon} size={17} color={t.orange} />
              <Text
                style={{ fontSize: 12.5, fontWeight: '800', color: t.text, marginTop: 8 }}
                numberOfLines={1}
              >
                {m.value}
              </Text>
              <Text style={{ fontSize: 10, color: t.muted, marginTop: 2 }}>{m.label}</Text>
            </View>
          ))}
        </View>

        {/* ── Ish tavsifi ── */}
        <Text style={[s.secTitle, { color: t.text }]}>Ish tavsifi</Text>
        <View style={[s.card, { backgroundColor: t.card, borderColor: t.border }]}>
          <Text style={{ fontSize: 13, color: t.muted, lineHeight: 20 }}>{description}</Text>
        </View>

        {/* ── Ish natijasi (auto-carousel) ── */}
        <Text style={[s.secTitle, { color: t.text }]}>Ish natijasi</Text>
        <PhotoCarousel
          photos={afterPhotos.length ? afterPhotos : [{ icon: 'check-decagram', label: 'Yakunlandi' }]}
          tint={color}
          tone={color + '16'}
          t={t}
        />

        {/* ── Materiallar ── */}
        {materials.length > 0 && (
          <>
            <Text style={[s.secTitle, { color: t.text }]}>Ishlatilgan materiallar</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {materials.map((m, i) => (
                <View
                  key={i}
                  style={[s.matChip, { backgroundColor: t.rowIconBg, borderColor: t.border }]}
                >
                  <MaterialCommunityIcons name="cube-outline" size={13} color={t.muted} />
                  <Text style={{ fontSize: 12, color: t.text, fontWeight: '600' }}>{m}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── Mijoz sharhi ── */}
        <ReviewCard
          title="Mijoz sharhi"
          name={clientReview ? client.name : null}
          bgColor={client.color}
          rating={clientReview?.rating}
          text={clientReview?.text}
          t={t}
          empty={!clientReview}
        />

        {/* ── Usta izohi ── */}
        <ReviewCard
          title="Sizning izohingiz"
          icon="account-hard-hat-outline"
          bgColor={t.orange}
          rating={workerReview?.rating}
          text={workerReview?.text}
          t={t}
          empty={!workerReview}
        />
      </ScrollView>
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

  slide: {
    height: SLIDE_H,
    marginHorizontal: 2,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  slideLabel: { fontSize: 14, fontWeight: '700', marginTop: 14 },

  dots: {
    flexDirection: 'row',
    gap: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },

  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },

  miniCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
    alignItems: 'flex-start',
  },

  secTitle: { fontSize: 15, fontWeight: '800', marginTop: 22, marginBottom: 11 },

  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },

  reviewIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  matChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
});
