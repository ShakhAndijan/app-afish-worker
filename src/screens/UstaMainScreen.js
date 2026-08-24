import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useProfileCompletion } from '../hooks/useProfileCompletion';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import SectionHeader from '../components/SectionHeader';
import ProfileCompletionCard from '../components/ProfileCompletionCard';
import WorkDetailScreen from './WorkDetailScreen';
import ClientProfileScreen from './ClientProfileScreen';
import UstaProfileScreen from './UstaProfileScreen';
import CategoryDetailScreen from './CategoryDetailScreen';
import EarningsScreen from './EarningsScreen';
import PaymentHistoryScreen from './PaymentHistoryScreen';
import WithdrawScreen from './WithdrawScreen';
import BuyurtmalarScreen from './BuyurtmalarScreen';
import ReviewDetailSheet from '../components/ReviewDetailSheet';

const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const BALANCE = 1840000;

const WEEK = [
  ['Du', 40],
  ['Se', 65],
  ['Ch', 55],
  ['Pa', 80],
  ['Ju', 70],
  ['Sh', 100],
  ['Ya', 45],
];
const MAX_WEEK = Math.max(...WEEK.map((d) => d[1]));

const STATS = [
  {
    key: 'kln',
    value: '247',
    label: 'Bajarilgan ish',
    colorKey: 'green',
    icon: 'checkmark-circle',
  },
  {
    key: 'str',
    value: '4.9',
    label: "O'rtacha reyting",
    colorKey: 'gold',
    icon: 'star',
  },
  {
    key: 'rsp',
    value: '12 daq',
    label: "O'rtacha javob",
    colorKey: 'blue',
    icon: 'time',
  },
];

const MY_CATEGORIES = [
  {
    id: 1,
    name: 'Santexnika',
    icon: 'wrench',
    price: '80 000',
    minPrice: '50 000',
    priceType: 'Ish uchun',
    experienceYears: 5,
    negotiable: true,
    isPrimary: true,
  },
  {
    id: 2,
    name: 'Isitish tizimlari',
    icon: 'radiator',
    price: '120 000',
    minPrice: '90 000',
    priceType: 'Ish uchun',
    experienceYears: 3,
    negotiable: false,
    isPrimary: false,
  },
  {
    id: 3,
    name: "Konditsioner o'rnatish",
    icon: 'air-conditioner',
    price: '150 000',
    minPrice: '100 000',
    priceType: 'Ish uchun',
    experienceYears: 4,
    negotiable: true,
    isPrimary: false,
  },
];

const CLIENTS = {
  sardor: {
    id: 'c1',
    name: 'Sardor Aliyev',
    initial: 'S',
    color: '#3f7fd4',
    phone: '+998 90 123 45 67',
    location: 'Chilonzor tumani',
    fullAddress: "Chilonzor tumani, 19-mavze, 12-uy",
    memberSince: '2024-yil, mart',
    totalOrders: 2,
    totalSpent: '155 000',
    note: "Ish kunlari soat 18:00 dan keyin uyda bo'ladi. Kirish uchun domofon kodi: 245B.",
  },
  nodira: {
    id: 'c2',
    name: 'Nodira Karimova',
    initial: 'N',
    color: '#9b6cd1',
    phone: '+998 91 234 56 78',
    location: 'Yunusobod tumani',
    fullAddress: "Yunusobod tumani, Amir Temur ko'chasi, 45-uy",
    memberSince: '2025-yil, yanvar',
    totalOrders: 1,
    totalSpent: '450 000',
    note: "To'lovni faqat plastik karta orqali amalga oshiradi.",
  },
  javlon: {
    id: 'c3',
    name: 'Javlon Mirzayev',
    initial: 'J',
    color: '#2fa37a',
    phone: '+998 93 345 67 89',
    location: "Mirzo Ulug'bek tumani",
    fullAddress: "Mirzo Ulug'bek tumani, Buyuk Ipak Yo'li, 7-uy",
    memberSince: '2023-yil, iyun',
    totalOrders: 1,
    totalSpent: '620 000',
    note: "Uyda it bor — kirishdan oldin oldindan xabar berish kerak.",
  },
  otabek: {
    id: 'c4',
    name: 'Otabek Rustamov',
    initial: 'O',
    color: '#e0473a',
    phone: '+998 94 456 78 90',
    location: 'Sergeli tumani',
    fullAddress: 'Sergeli tumani, Bunyodkor shoh ko\'chasi, 3-uy',
    memberSince: '2025-yil, may',
    totalOrders: 1,
    totalSpent: '120 000',
    note: null,
  },
};

const MY_WORKS = [
  {
    id: 1,
    title: 'Kran almashtirish',
    client: CLIENTS.sardor,
    rating: 5.0,
    date: '14-avgust, 2026',
    category: 'Santexnika',
    icon: 'wrench',
    color: '#3f7fd4',
    price: '80 000',
    duration: '45 daqiqa',
    address: 'Chilonzor tumani',
    description:
      "Eskirgan va oqib turgan kran butunlay yangisiga almashtirildi. Barcha ulanishlar germetik qilib mahkamlandi, suv bosimi tekshirildi.",
    materials: ['Kran (Grohe)', 'Germetik lenta', 'Ulagichlar'],
    beforePhotos: [
      { icon: 'pipe-leak', label: 'Eski kran' },
      { icon: 'water-alert-outline', label: 'Suv oqishi' },
      { icon: 'wrench-clock', label: 'Zanglagan ulagich' },
      { icon: 'ruler-square', label: "O'lcham olish" },
    ],
    afterPhotos: [
      { icon: 'water-pump', label: 'Yangi kran' },
      { icon: 'link-variant', label: 'Germetik ulanish' },
      { icon: 'check-decagram', label: "Sinovdan o'tgan" },
      { icon: 'sparkles', label: 'Yakuniy ko\'rinish' },
    ],
    clientReview: {
      rating: 5,
      text: "Juda tez keldi va sifatli ishladi. Narxi ham kelishilgandek bo'ldi, rahmat!",
    },
    workerReview: {
      rating: 5,
      text: "Mijoz vaqtida uyda kutib oldi, to'lovni darhol amalga oshirdi. Yana ishlashdan xursand bo'laman.",
    },
  },
  {
    id: 2,
    title: 'Isitish tizimi montaji',
    client: CLIENTS.nodira,
    rating: 4.8,
    date: '9-avgust, 2026',
    category: 'Isitish tizimlari',
    icon: 'radiator',
    color: '#e87a45',
    price: '450 000',
    duration: '3 soat',
    address: 'Yunusobod tumani',
    description:
      "Yashash xonasi va oshxonaga 2 ta radiator o'rnatildi, quvurlar ulandi va tizim bosim ostida sinovdan o'tkazildi.",
    materials: ['Radiator (2 dona)', 'Polipropilen quvur', 'Krepej'],
    beforePhotos: [
      { icon: 'radiator-disabled', label: 'Radiatorsiz xona' },
      { icon: 'pipe', label: 'Eski quvurlar' },
      { icon: 'ruler-square', label: "O'lchov olish" },
      { icon: 'wall', label: 'Devor tayyorlash' },
    ],
    afterPhotos: [
      { icon: 'radiator', label: "O'rnatilgan radiator" },
      { icon: 'pipe-wrench', label: 'Quvur ulanishi' },
      { icon: 'thermometer', label: 'Isitish testi' },
      { icon: 'check-decagram', label: 'Yakuniy natija' },
    ],
    clientReview: {
      rating: 5,
      text: "Muomilasi yoqdi, ishni ozgina kechikib boshlasa ham natija a'lo darajada.",
    },
    workerReview: {
      rating: 4,
      text: 'Mijoz aniq talab bilan kutib oldi, ish jarayoni qulay o\'tdi. To\'lov naqd amalga oshirildi.',
    },
  },
  {
    id: 3,
    title: "Vannaxona ta'miri",
    client: CLIENTS.javlon,
    rating: 5.0,
    date: '2-avgust, 2026',
    category: 'Sanitariya jihozlari',
    icon: 'shower',
    color: '#2fa37a',
    price: '620 000',
    duration: '1 kun',
    address: 'Mirzo Ulug\'bek tumani',
    description:
      "Vannaxonada unitaz va dush kabinasi to'liq yangilandi, kafel orasidagi choklar yangilanib, gidroizolyatsiya qayta ishlandi.",
    materials: ['Unitaz', 'Dush kabina', 'Gidroizolyatsiya', 'Silikon'],
    beforePhotos: [
      { icon: 'toilet', label: 'Eski unitaz' },
      { icon: 'grid-off', label: 'Yorilgan kafel' },
      { icon: 'shower-head', label: 'Eski dush' },
      { icon: 'water-alert-outline', label: 'Namlik izlari' },
    ],
    afterPhotos: [
      { icon: 'shower-head', label: 'Yangi dush kabina' },
      { icon: 'toilet', label: 'Yangi unitaz' },
      { icon: 'grid', label: 'Yangi kafel' },
      { icon: 'water-check-outline', label: 'Gidroizolyatsiya' },
      { icon: 'check-decagram', label: 'Yakunlangan ish' },
    ],
    clientReview: {
      rating: 4,
      text: "Yaxshi usta, lekin biroz band ekan, navbat kutishga to'g'ri keldi.",
    },
    workerReview: {
      rating: 4,
      text: "Ish hajmi katta edi, mijoz sabr bilan kutdi. Yakunda natijadan mamnun bo'lishdi.",
    },
  },
  {
    id: 4,
    title: 'Konditsioner tozalash',
    client: CLIENTS.otabek,
    rating: 4.9,
    date: '27-iyul, 2026',
    category: "Konditsioner o'rnatish",
    icon: 'air-conditioner',
    color: '#9b6cd1',
    price: '120 000',
    duration: '1 soat',
    address: 'Sergeli tumani',
    description:
      "Konditsionerning ichki va tashqi bloklari to'liq tozalandi, filtrlar yuvildi, freon darajasi tekshirildi.",
    materials: ['Tozalash eritmasi', 'Filtr yuvish vositasi'],
    beforePhotos: [
      { icon: 'air-filter', label: 'Kirlangan filtr' },
      { icon: 'weather-dust', label: 'Changlangan blok' },
    ],
    afterPhotos: [
      { icon: 'air-filter', label: 'Yangi filtr' },
      { icon: 'check-decagram', label: 'Tozalangan blok' },
    ],
    clientReview: null,
    workerReview: {
      rating: 5,
      text: "Mijoz do'stona munosabatda bo'ldi, kirish-chiqish qulay tashkil etildi.",
    },
  },
  {
    id: 5,
    title: "Suv isitgich o'rnatish",
    client: CLIENTS.sardor,
    rating: 4.9,
    date: '2-iyun, 2026',
    category: 'Santexnika',
    icon: 'water-boiler',
    color: '#3f7fd4',
    price: '75 000',
    duration: '1.5 soat',
    address: 'Chilonzor tumani',
    description:
      "Oshxonaga yangi protochniy suv isitgich o'rnatildi, elektr va suv ulanishi xavfsizlik talablariga muvofiq bajarildi.",
    materials: ['Suv isitgich', 'Elektr kabel', 'Ulagichlar'],
    beforePhotos: [
      { icon: 'water-off-outline', label: 'Isitgichsiz nuqta' },
      { icon: 'pipe', label: 'Eski ulanish' },
    ],
    afterPhotos: [
      { icon: 'water-boiler', label: "O'rnatilgan isitgich" },
      { icon: 'flash-outline', label: 'Elektr ulanishi' },
      { icon: 'check-decagram', label: 'Sinov muvaffaqiyatli' },
    ],
    clientReview: {
      rating: 5,
      text: "Ikkinchi marta chaqirdim, yana ham tez va aniq ishladi. Doim shu ustani tavsiya qilaman!",
    },
    workerReview: {
      rating: 5,
      text: "Doimiy mijoz, har doim aniq vaqtda kutib oladi va ishni tushunib turadi.",
    },
  },
];

// "Sizga tegishli e'lonlar" — platforma qoidasiga ko'ra har bir zakazchik
// faqat bitta ustaga bog'langan bo'ladi va shu ustadan boshqasiga buyurtma
// bera olmaydi. Shu sabab bu ro'yxatdagi barcha mijozlar aynan shu ustaga
// "faqat sizga" tarzida ulangan — umumiy bozordagi ochiq e'lonlardan farqli.
const LINKED_ELONLAR = [
  {
    id: 1,
    client: CLIENTS.sardor,
    category: 'Santexnika',
    icon: 'wrench',
    color: '#3f7fd4',
    title: 'Vannaxonada trubadan suv oqmoqda',
    description:
      "Hammomdagi trubalardan suv oqyapti, tezroq kelib ko'rib berishingiz kerak.",
    address: 'Chilonzor tumani, 19-mavze',
    budget: '70 000 – 100 000',
    postedAgo: '12 daqiqa oldin',
    isNewClient: false,
  },
  {
    id: 2,
    client: CLIENTS.javlon,
    category: 'Isitish tizimlari',
    icon: 'radiator',
    color: '#e87a45',
    title: 'Radiatorni tozalash va sozlash',
    description:
      "Isitish mavsumidan oldin barcha radiatorlarni tekshirib, tozalab berishingizni so'rayman.",
    address: "Mirzo Ulug'bek tumani",
    budget: '150 000',
    postedAgo: '40 daqiqa oldin',
    isNewClient: false,
  },
  {
    id: 3,
    client: { id: 'c5', name: 'Diyor Nazarov', initial: 'D', color: '#e0473a' },
    category: "Konditsioner o'rnatish",
    icon: 'air-conditioner',
    color: '#9b6cd1',
    title: "Yangi konditsioner o'rnatish",
    description:
      "Yotoqxonaga yangi split konditsioner o'rnatib berish kerak, jihoz tayyor turibdi.",
    address: 'Yashnobod tumani',
    budget: '200 000',
    postedAgo: '1 soat oldin',
    isNewClient: true,
  },
];

const MY_REVIEWS = [
  {
    id: 1,
    workId: 1,
    name: 'Sardor Aliyev',
    rating: 5,
    time: '2 kun oldin',
    text: 'Juda tez keldi va sifatli ishladi. Narxi ham kelishilgandek bo\'ldi, rahmat!',
  },
  {
    id: 2,
    workId: 2,
    name: 'Nodira Karimova',
    rating: 5,
    time: '1 hafta oldin',
    text: "Muomilasi yoqdi, ishni ozgina kechikib boshlasa ham natija a'lo darajada.",
  },
  {
    id: 3,
    workId: 3,
    name: 'Javlon Mirzayev',
    rating: 4,
    time: '2 hafta oldin',
    text: "Yaxshi usta, lekin biroz band ekan, navbat kutishga to'g'ri keldi.",
  },
];

const CAT_CARD_W = 132;
const CAT_GAP = 10;
const CAT_SLOT = CAT_CARD_W + CAT_GAP;

function MyCategoriesSection({ t, categories, onSelect }) {
  const flatListRef = useRef(null);
  const indexRef = useRef(0);
  const autoScroll = categories.length > 3;

  useEffect(() => {
    if (!autoScroll) return;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % categories.length;
      indexRef.current = next;
      flatListRef.current?.scrollToOffset({
        offset: next * CAT_SLOT,
        animated: true,
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [autoScroll, categories.length]);

  return (
    <View style={{ marginTop: 26 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <SectionHeader theme={t} title="Mening kategoriyalarim" />
      </View>
      <FlatList
        ref={flatListRef}
        data={categories}
        keyExtractor={(c) => String(c.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CAT_SLOT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20, gap: CAT_GAP }}
        renderItem={({ item: c }) => (
          <TouchableOpacity
            style={[
              s.catCard,
              {
                backgroundColor: t.card,
                borderColor: c.isPrimary ? t.orange : t.border,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => onSelect?.(c)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View
                style={[
                  s.catIconBox,
                  { backgroundColor: c.isPrimary ? t.orange : t.rowIconBg },
                ]}
              >
                <MaterialCommunityIcons
                  name={c.icon}
                  size={20}
                  color={c.isPrimary ? '#fff' : t.orange}
                />
              </View>
              <Ionicons name="chevron-forward" size={15} color={t.faint} />
            </View>
            <Text
              style={{ fontSize: 12.5, fontWeight: '700', color: t.text }}
              numberOfLines={1}
            >
              {c.name}
            </Text>
            <Text style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>
              {c.price} so'mdan
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const WORK_CARD_W = 150;
const WORK_GAP = 12;
const WORK_SLOT = WORK_CARD_W + WORK_GAP;

function RecentWorksSection({ t, onSelect }) {
  const flatListRef = useRef(null);
  const indexRef = useRef(0);
  const autoScroll = MY_WORKS.length > 3;

  useEffect(() => {
    if (!autoScroll) return;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % MY_WORKS.length;
      indexRef.current = next;
      flatListRef.current?.scrollToOffset({
        offset: next * WORK_SLOT,
        animated: true,
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [autoScroll]);

  return (
    <View style={{ marginTop: 26 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <SectionHeader theme={t} title="Oxirgi bajarilgan ishlar" />
      </View>
      <FlatList
        ref={flatListRef}
        data={MY_WORKS}
        keyExtractor={(w) => String(w.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={WORK_SLOT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20, gap: WORK_GAP }}
        renderItem={({ item: w }) => (
          <TouchableOpacity
            style={[s.workCard, { backgroundColor: t.card, borderColor: t.border }]}
            activeOpacity={0.85}
            onPress={() => onSelect?.(w)}
          >
            <View style={[s.workImg, { backgroundColor: t.rowIconBg }]}>
              <MaterialCommunityIcons name="image-outline" size={30} color={t.faint} />
              <View style={s.workRating}>
                <Ionicons name="star" size={11} color={t.gold} />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: t.gold,
                    marginLeft: 3,
                  }}
                >
                  {w.rating.toFixed(1)}
                </Text>
              </View>
            </View>
            <View style={{ padding: 12 }}>
              <Text
                style={{ fontWeight: '700', fontSize: 13, color: t.text }}
                numberOfLines={1}
              >
                {w.title}
              </Text>
              <Text
                style={{ fontSize: 11, color: t.muted, marginTop: 3 }}
                numberOfLines={1}
              >
                {w.client.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

function LinkedElonlarSection({ t, elonlar, onOpen }) {
  if (!elonlar.length) return null;

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
      <SectionHeader theme={t} title="Sizga tegishli e'lonlar" />

      <View
        style={[
          s.exclusiveBanner,
          {
            backgroundColor: 'rgba(232,122,69,0.12)',
            borderColor: 'rgba(232,122,69,0.35)',
          },
        ]}
      >
        <Ionicons name="lock-closed" size={14} color={t.orange} />
        <Text
          style={{
            flex: 1,
            fontSize: 11,
            fontWeight: '600',
            color: t.orange,
            marginLeft: 8,
            lineHeight: 15,
          }}
        >
          Bu mijozlar faqat sizga bog'langan — ular boshqa ustaga buyurtma bera olmaydi.
        </Text>
      </View>

      <View style={{ gap: 10, marginTop: 12 }}>
        {elonlar.map((e) => (
          <TouchableOpacity
            key={e.id}
            style={[s.elonCard, { backgroundColor: t.card, borderColor: t.border }]}
            activeOpacity={0.8}
            onPress={() => onOpen(e)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Avatar letter={e.client.initial} bgColor={e.client.color} size={36} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text
                    style={{ fontSize: 13.5, fontWeight: '700', color: t.text }}
                    numberOfLines={1}
                  >
                    {e.client.name}
                  </Text>
                  <View style={[s.exclusiveTag, { backgroundColor: t.rowIconBg }]}>
                    <Ionicons name="lock-closed" size={9} color={t.orange} />
                    <Text
                      style={{ fontSize: 9.5, fontWeight: '700', color: t.orange, marginLeft: 3 }}
                    >
                      Faqat sizga
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>
                  {e.postedAgo}
                  {e.isNewClient ? ' • Yangi mijoz' : ''}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <MaterialCommunityIcons name={e.icon} size={14} color={e.color} />
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: e.color }}>
                {e.category}
              </Text>
            </View>
            <Text
              style={{ fontSize: 13, fontWeight: '700', color: t.text, marginTop: 6 }}
              numberOfLines={1}
            >
              {e.title}
            </Text>
            <Text
              style={{ fontSize: 12, color: t.muted, marginTop: 3, lineHeight: 17 }}
              numberOfLines={2}
            >
              {e.description}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: t.border,
              }}
            >
              <Text style={{ fontSize: 11, color: t.faint, flex: 1 }} numberOfLines={1}>
                {e.address}
              </Text>
              <Text style={{ fontSize: 12.5, fontWeight: '800', color: t.orange }}>
                {e.budget} so'm
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

// "Yangi e'lonlar" — umumiy bozor: zakazchiklar tomonidan o'z kategoriyasi
// bo'yicha tushirilgan, hali hech qaysi ustaga bog'lanmagan ochiq e'lonlar.
// Bularni shu kategoriyadagi barcha ustalar ko'radi; qabul qilingandan
// so'nggina mijoz o'sha ustaga eksklyuziv bog'lanadi.
export const ALL_ELONLAR = [
  {
    id: 101,
    client: { name: 'Baxtiyor Yusupov', initial: 'B', color: '#3f7fd4' },
    category: 'Santexnika',
    icon: 'wrench',
    color: '#3f7fd4',
    title: 'Oshxonada kran singan',
    description: "Idish yuvish qismidagi kran singan, tezroq almashtirish kerak.",
    address: 'Yunusobod tumani',
    budget: '60 000 – 90 000',
    postedAgo: '5 daqiqa oldin',
  },
  {
    id: 102,
    client: { name: 'Zarina Nortojiyeva', initial: 'Z', color: '#e87a45' },
    category: 'Isitish tizimlari',
    icon: 'radiator',
    color: '#e87a45',
    title: 'Kotyol ishlamayapti',
    description: "Uy sovib ketdi, kotyol yonmayapti — bugun kelib ko'rib berish kerak.",
    address: 'Yashnobod tumani',
    budget: '150 000 – 200 000',
    postedAgo: '10 daqiqa oldin',
  },
  {
    id: 103,
    client: { name: 'Davron Islomov', initial: 'D', color: '#9b6cd1' },
    category: "Konditsioner o'rnatish",
    icon: 'air-conditioner',
    color: '#9b6cd1',
    title: "2 xonaga konditsioner o'rnatish",
    description: "Ikkita split konditsioner sotib olindi, o'rnatib berish kerak.",
    address: 'Chilonzor tumani',
    budget: '350 000',
    postedAgo: '8 daqiqa oldin',
  },
  {
    id: 104,
    client: { name: 'Gulnora Tosheva', initial: 'G', color: '#2fa37a' },
    category: 'Santexnika',
    icon: 'wrench',
    color: '#3f7fd4',
    title: 'Unitaz tagidan suv sizmoqda',
    description: "Bir necha kundan beri tagidan asta suv sizib chiqyapti.",
    address: 'Chilonzor tumani',
    budget: '80 000',
    postedAgo: '18 daqiqa oldin',
  },
  {
    id: 105,
    client: { name: 'Aziz Rahimov', initial: 'A', color: '#e0473a' },
    category: 'Isitish tizimlari',
    icon: 'radiator',
    color: '#e87a45',
    title: 'Radiatorlarni almashtirish',
    description: "Eskirgan 4 ta radiatorni yangisiga almashtirish kerak.",
    address: "Mirzo Ulug'bek tumani",
    budget: '400 000',
    postedAgo: '22 daqiqa oldin',
  },
  {
    id: 106,
    client: { name: 'Shahnoza Yusupova', initial: 'S', color: '#3f7fd4' },
    category: "Konditsioner o'rnatish",
    icon: 'air-conditioner',
    color: '#9b6cd1',
    title: 'Konditsioner freonini quyish',
    description: "Konditsioner soveutmay qoldi, freon quyilishi kerak.",
    address: 'Yunusobod tumani',
    budget: '130 000',
    postedAgo: '25 daqiqa oldin',
  },
  {
    id: 107,
    client: { name: 'Rustam Qodirov', initial: 'R', color: '#9b6cd1' },
    category: 'Santexnika',
    icon: 'wrench',
    color: '#3f7fd4',
    title: 'Yangi kvartirada santexnika ulash',
    description: "Yangi qurilgan kvartirada barcha santexnika jihozlarini ulab berish kerak.",
    address: 'Sergeli tumani',
    budget: '250 000',
    postedAgo: '35 daqiqa oldin',
  },
  {
    id: 108,
    client: { name: 'Feruza Mahmudova', initial: 'F', color: '#2fa37a' },
    category: 'Isitish tizimlari',
    icon: 'radiator',
    color: '#e87a45',
    title: 'Isitish tizimida havo yig\'ilgan',
    description: "Radiatorlar isimayapti, tizimdan havo chiqarish kerak bo'lishi mumkin.",
    address: 'Shayxontohur tumani',
    budget: '90 000',
    postedAgo: '45 daqiqa oldin',
  },
  {
    id: 109,
    client: { name: 'Bekzod Nazarov', initial: 'B', color: '#e0473a' },
    category: "Konditsioner o'rnatish",
    icon: 'air-conditioner',
    color: '#9b6cd1',
    title: "Eski konditsionerni ko'chirish",
    description: "Konditsioner boshqa xonaga ko'chirilishi, quvurlar qayta tortilishi kerak.",
    address: 'Sergeli tumani',
    budget: '180 000',
    postedAgo: '40 daqiqa oldin',
  },
  {
    id: 110,
    client: { name: 'Malika Yoqubova', initial: 'M', color: '#3f7fd4' },
    category: 'Santexnika',
    icon: 'wrench',
    color: '#3f7fd4',
    title: 'Dush kabinasidan suv oqmoqda',
    description: "Dush kabinasi tagidan pol ustiga suv oqib chiqyapti.",
    address: 'Uchtepa tumani',
    budget: '70 000',
    postedAgo: '50 daqiqa oldin',
  },
  {
    id: 111,
    client: { name: 'Jasur Ergashev', initial: 'J', color: '#9b6cd1' },
    category: 'Isitish tizimlari',
    icon: 'radiator',
    color: '#e87a45',
    title: 'Yangi qavat uchun isitish montaji',
    description: "Uy ustiga qurilgan yangi qavatga isitish tizimi o'tkazilishi kerak.",
    address: 'Olmazor tumani',
    budget: '600 000',
    postedAgo: '1 soat 10 daqiqa oldin',
  },
  {
    id: 112,
    client: { name: 'Madina Qosimova', initial: 'M', color: '#e87a45' },
    category: "Konditsioner o'rnatish",
    icon: 'air-conditioner',
    color: '#9b6cd1',
    title: "Ofisga 3 ta konditsioner o'rnatish",
    description: "Yangi ochilgan ofisga 3 ta split konditsioner o'rnatish kerak.",
    address: "Mirzo Ulug'bek tumani",
    budget: '900 000',
    postedAgo: '55 daqiqa oldin',
  },
  {
    id: 113,
    client: { name: 'Sherzod Aliqulov', initial: 'S', color: '#2fa37a' },
    category: 'Santexnika',
    icon: 'wrench',
    color: '#3f7fd4',
    title: 'Trubalarni izolyatsiya qilish',
    description: "Qish oldidan tashqi trubalarni sovuqdan izolyatsiya qilish kerak.",
    address: 'Bektemir tumani',
    budget: '120 000',
    postedAgo: '1 soat oldin',
  },
  {
    id: 114,
    client: { name: 'Nilufar Sattorova', initial: 'N', color: '#e0473a' },
    category: 'Isitish tizimlari',
    icon: 'radiator',
    color: '#e87a45',
    title: "Termostat o'rnatish",
    description: "Isitish tizimiga avtomatik termostat o'rnatib berish kerak.",
    address: 'Yakkasaroy tumani',
    budget: '110 000',
    postedAgo: '1 soat 30 daqiqa oldin',
  },
  {
    id: 115,
    client: { name: 'Otabek Toshpulatov', initial: 'O', color: '#3f7fd4' },
    category: "Konditsioner o'rnatish",
    icon: 'air-conditioner',
    color: '#9b6cd1',
    title: 'Konditsioner tozalash va servis',
    description: "Yozgi mavsum oldidan konditsionerni to'liq tozalab, servis qilish kerak.",
    address: 'Bektemir tumani',
    budget: '100 000',
    postedAgo: '2 soat oldin',
  },
];

const GENERAL_CARD_W = 210;
const GENERAL_GAP = 12;

function GeneralElonlarSection({ t, elonlar, onOpenAll }) {
  const preview = elonlar.slice(0, 10);
  if (!preview.length) return null;

  return (
    <View style={{ marginTop: 26 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <SectionHeader theme={t} title="Yangi e'lonlar" action="Hammasi" onPress={onOpenAll} />
        <Text style={{ fontSize: 11.5, color: t.muted, marginTop: -6, marginBottom: 10 }}>
          Kategoriyangiz bo'yicha barcha ustalarga ochiq e'lonlar
        </Text>
      </View>
      <FlatList
        data={preview}
        keyExtractor={(e) => String(e.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: GENERAL_GAP }}
        renderItem={({ item: e }) => (
          <TouchableOpacity
            style={[
              s.generalCard,
              { width: GENERAL_CARD_W, backgroundColor: t.card, borderColor: t.border },
            ]}
            activeOpacity={0.85}
            onPress={onOpenAll}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialCommunityIcons name={e.icon} size={14} color={e.color} />
              <Text
                style={{ fontSize: 11, fontWeight: '700', color: e.color, flex: 1 }}
                numberOfLines={1}
              >
                {e.category}
              </Text>
              <Text style={{ fontSize: 10, color: t.faint }}>{e.postedAgo}</Text>
            </View>
            <Text
              style={{ fontSize: 13, fontWeight: '700', color: t.text, marginTop: 8 }}
              numberOfLines={1}
            >
              {e.title}
            </Text>
            <Text
              style={{ fontSize: 11.5, color: t.muted, marginTop: 3, lineHeight: 16 }}
              numberOfLines={2}
            >
              {e.description}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: t.border,
              }}
            >
              <Text style={{ fontSize: 10.5, color: t.faint, flex: 1 }} numberOfLines={1}>
                {e.address}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '800', color: t.orange }}>
                {e.budget} so'm
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const USTA_TABS = [
  { key: 'home', label: 'Asosiy', on: 'home', off: 'home-outline' },
  { key: 'orders', label: 'Buyurtmalar', on: 'grid', off: 'grid-outline' },
  { key: 'wallet', label: 'Hamyon', on: 'wallet', off: 'wallet-outline' },
  { key: 'profile', label: 'Profil', on: 'person', off: 'person-outline' },
];

export default function UstaMainScreen({ onLogout }) {
  const { theme: t } = useTheme();
  const { user, refreshUser } = useUser();
  const { isComplete: profileComplete } = useProfileCompletion(user);
  const [online, setOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedReview, setSelectedReview] = useState(null);
  const [categories, setCategories] = useState(MY_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [linkedElonlar, setLinkedElonlar] = useState(LINKED_ELONLAR);
  const [showEarnings, setShowEarnings] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshUser();
    setRefreshing(false);
  };

  // Profil to'liq bo'lmagan hisob "onlayn" holatida ochilib qolmasin.
  useEffect(() => {
    if (user && !profileComplete) setOnline(false);
  }, [user, profileComplete]);

  const handleToggleOnline = () => {
    if (!online && !profileComplete) {
      Alert.alert(
        "Profilni to'ldiring",
        "Buyurtma qabul qilish uchun avval ma'lumotlaringizni to'ldirishingiz kerak.",
        [
          { text: 'Bekor qilish', style: 'cancel' },
          { text: "To'ldirish", onPress: () => setActiveTab('profile') },
        ]
      );
      return;
    }
    setOnline((o) => !o);
  };

  const selectedCategory = categories.find((c) => c.id === selectedCategoryId) || null;

  const handleLinkedElonDecision = (elon, accepted) => {
    setLinkedElonlar((prev) => prev.filter((e) => e.id !== elon.id));
    if (accepted) {
      Alert.alert('Qabul qilindi', `${elon.client.name} bilan buyurtma tasdiqlandi.`);
    }
  };

  const openLinkedElon = (elon) => {
    Alert.alert(
      elon.client.name,
      `${elon.title}\n\n${elon.description}\n\n${elon.address} • ${elon.budget} so'm`,
      [
        { text: 'Rad etish', style: 'destructive', onPress: () => handleLinkedElonDecision(elon, false) },
        { text: 'Qabul qilish', onPress: () => handleLinkedElonDecision(elon, true) },
        { text: 'Bekor qilish', style: 'cancel' },
      ]
    );
  };

  const updateCategory = (id, updates) => {
    setCategories((prev) =>
      prev.map((c) => {
        if (c.id === id) return { ...c, ...updates };
        if (updates.isPrimary) return { ...c, isPrimary: false };
        return c;
      })
    );
  };

  const reviewWork = selectedReview
    ? MY_WORKS.find((w) => w.id === selectedReview.workId)
    : null;

  const openClientFromReview = (client) => {
    if (!client) return;
    setSelectedReview(null);
    setSelectedClient(client);
  };

  const openWorkFromReview = (work) => {
    if (!work) return;
    setSelectedReview(null);
    setSelectedWork(work);
  };

  if (showEarnings) {
    return (
      <EarningsScreen
        t={t}
        week={WEEK}
        works={MY_WORKS}
        categories={categories}
        onBack={() => setShowEarnings(false)}
        onSelectWork={(w) => {
          setShowEarnings(false);
          setSelectedWork(w);
        }}
      />
    );
  }

  if (showPaymentHistory) {
    return <PaymentHistoryScreen onBack={() => setShowPaymentHistory(false)} />;
  }

  if (showWithdraw) {
    return (
      <WithdrawScreen
        t={t}
        balance={BALANCE}
        onBack={() => setShowWithdraw(false)}
      />
    );
  }

  if (activeTab === 'profile') {
    return (
      <UstaProfileScreen
        onTabChange={setActiveTab}
        onLogout={onLogout}
        onOpenEarnings={() => setShowEarnings(true)}
      />
    );
  }

  if (activeTab === 'orders') {
    return (
      <BuyurtmalarScreen
        t={t}
        categories={categories}
        elonlar={ALL_ELONLAR}
        onTabChange={setActiveTab}
      />
    );
  }

  if (selectedClient) {
    const clientWorks = MY_WORKS.filter((w) => w.client.id === selectedClient.id);
    return (
      <ClientProfileScreen
        client={selectedClient}
        works={clientWorks}
        t={t}
        onBack={() => setSelectedClient(null)}
        onSelectWork={(w) => {
          setSelectedClient(null);
          setSelectedWork(w);
        }}
      />
    );
  }

  if (selectedWork) {
    return (
      <WorkDetailScreen
        work={selectedWork}
        t={t}
        onBack={() => setSelectedWork(null)}
        onOpenClient={(client) => setSelectedClient(client)}
      />
    );
  }

  if (selectedCategory) {
    const categoryWorks = MY_WORKS.filter((w) => w.category === selectedCategory.name);
    return (
      <CategoryDetailScreen
        category={selectedCategory}
        works={categoryWorks}
        t={t}
        onBack={() => setSelectedCategoryId(null)}
        onSelectWork={(w) => {
          setSelectedCategoryId(null);
          setSelectedWork(w);
        }}
        onUpdate={(updates) => updateCategory(selectedCategory.id, updates)}
      />
    );
  }

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Usta';
  const initial = (user?.first_name ?? user?.last_name ?? 'U')
    .charAt(0)
    .toUpperCase();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: t.bg }}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={t.isDark ? 'light' : 'dark'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={t.orange}
            colors={[t.orange]}
          />
        }
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerRow}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 11 }}
            >
              <Avatar letter={initial} bgColor={t.orange} uri={user?.profile_photo} />
              <View>
                <Text style={{ fontSize: 11.5, color: t.muted }}>
                  Usta kabineti
                </Text>
                <Text
                  style={{ fontWeight: '700', fontSize: 15.5, color: t.text }}
                >
                  {fullName}
                </Text>
              </View>
            </View>
            <View style={[s.bellBtn, { backgroundColor: t.card, borderColor: t.border }]}>
              <Ionicons
                name="notifications-outline"
                size={20}
                color={t.muted}
              />
              <View style={[s.bellDot, { backgroundColor: t.orange, borderColor: t.card }]} />
            </View>
          </View>

          {/* Online toggle */}
          <View
            style={[
              s.onlineRow,
              {
                backgroundColor: online
                  ? 'rgba(47,163,122,0.13)'
                  : t.rowIconBg,
                borderColor: online ? 'rgba(47,163,122,0.4)' : t.border,
              },
            ]}
          >
            <View
              style={[
                s.onlineDot,
                { backgroundColor: online ? t.green : t.faint },
              ]}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 13.5,
                  color: online ? t.green : t.text,
                }}
              >
                {online ? 'Onlayn — buyurtma qabul qilinmoqda' : 'Oflayn'}
              </Text>
              <Text
                style={{
                  fontSize: 11.5,
                  color: t.muted,
                  fontWeight: '600',
                  marginTop: 2,
                }}
              >
                {online
                  ? "Mijozlar sizni qidiruvda ko'radi"
                  : 'Yangi buyurtmalar kelmaydi'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleToggleOnline}
              style={[
                s.track,
                { backgroundColor: online ? t.green : '#33425a' },
              ]}
              activeOpacity={0.85}
            >
              <View style={[s.thumb, { left: online ? 21 : 3 }]} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Profil to'ldirilishi ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 18 }}>
          <ProfileCompletionCard
            user={user}
            theme={t}
            onPressComplete={() => setActiveTab('profile')}
          />
        </View>

        {/* ── Sizga tegishli e'lonlar ── */}
        <LinkedElonlarSection t={t} elonlar={linkedElonlar} onOpen={openLinkedElon} />

        {/* ── Ish faoliyati ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
          <SectionHeader theme={t} title="Ish faoliyati" />
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            gap: 10,
          }}
        >
          {STATS.map((st) => (
            <View
              key={st.key}
              style={[
                s.miniCard,
                {
                  flex: 1,
                  alignItems: 'center',
                  paddingVertical: 14,
                  paddingHorizontal: 8,
                  backgroundColor: t.card,
                  borderColor: t.border,
                },
              ]}
            >
              <Ionicons name={st.icon} size={19} color={t[st.colorKey]} />
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 17,
                  color: t.text,
                  marginTop: 8,
                }}
              >
                {st.value}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: t.muted,
                  marginTop: 3,
                  textAlign: 'center',
                }}
              >
                {st.label}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Weekly chart ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <TouchableOpacity
            style={[s.miniCard, { backgroundColor: t.card, borderColor: t.border }]}
            activeOpacity={0.8}
            onPress={() => setShowEarnings(true)}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <Text style={{ fontWeight: '700', fontSize: 14, color: t.text }}>
                Haftalik daromad
              </Text>
              <Text style={{ fontSize: 11.5, color: t.muted }}>
                so'm (ming)
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                height: 80,
                marginTop: 16,
                gap: 6,
              }}
            >
              {WEEK.map((d, i) => (
                <View
                  key={i}
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end',
                  }}
                >
                  <View
                    style={{
                      width: '75%',
                      height: Math.round((d[1] / MAX_WEEK) * 72),
                      borderRadius: 6,
                      backgroundColor:
                        d[1] === MAX_WEEK ? t.orange : 'rgba(232,122,69,0.28)',
                    }}
                  />
                  <Text style={{ fontSize: 9.5, color: t.faint, marginTop: 6 }}>
                    {d[0]}
                  </Text>
                </View>
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                marginTop: 14,
              }}
            >
              <Text style={{ fontSize: 11, fontWeight: '700', color: t.orange }}>
                Barcha daromadlarni ko'rish
              </Text>
              <Ionicons name="chevron-forward" size={13} color={t.orange} />
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Mening kategoriyalarim ── */}
        <MyCategoriesSection
          t={t}
          categories={categories}
          onSelect={(c) => setSelectedCategoryId(c.id)}
        />

        {/* ── Bajarilgan ishlar ── */}
        <RecentWorksSection t={t} onSelect={setSelectedWork} />

        {/* ── So'nggi sharhlar ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
          <SectionHeader theme={t} title="So'nggi sharhlar" />
          <View style={{ gap: 10 }}>
            {MY_REVIEWS.map((r, i) => {
              const avatarColor = [t.blue, t.violet, t.green][i % 3];
              const linkedWork = MY_WORKS.find((w) => w.id === r.workId);
              return (
                <TouchableOpacity
                  key={r.id}
                  style={[s.reviewCard, { backgroundColor: t.card, borderColor: t.border }]}
                  activeOpacity={0.75}
                  onPress={() => setSelectedReview(r)}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Avatar letter={r.name.charAt(0)} bgColor={avatarColor} size={34} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>
                        {r.name}
                      </Text>
                      <Text style={{ fontSize: 10.5, color: t.muted, marginTop: 1 }}>
                        {r.time}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 1 }}>
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Ionicons
                          key={j}
                          name="star"
                          size={12}
                          color={j < r.rating ? t.gold : t.border}
                        />
                      ))}
                    </View>
                  </View>
                  <Text
                    style={{ fontSize: 12.5, color: t.muted, marginTop: 9, lineHeight: 18 }}
                    numberOfLines={3}
                  >
                    {r.text}
                  </Text>
                  {linkedWork && (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: 10,
                        paddingTop: 10,
                        borderTopWidth: 1,
                        borderTopColor: t.border,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                        <MaterialCommunityIcons
                          name={linkedWork.icon}
                          size={13}
                          color={linkedWork.color}
                        />
                        <Text
                          style={{ fontSize: 11, fontWeight: '600', color: t.muted, flex: 1 }}
                          numberOfLines={1}
                        >
                          {linkedWork.title}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={15} color={t.faint} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Moliya ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
          <SectionHeader theme={t} title="Moliya" />
        </View>

        {/* ── Balance card ── */}
        <View style={{ paddingHorizontal: 20 }}>
          <View style={[s.balanceCard, { backgroundColor: t.orange }]}>
            <View style={s.balanceCircle} />
            <View
              style={{
                position: 'absolute',
                right: 14,
                bottom: 14,
                opacity: 0.16,
              }}
            >
              <MaterialCommunityIcons name="wallet" size={56} color="#fff" />
            </View>
            <Text style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.92)' }}>
              Hisobingizdagi mablag'
            </Text>
            <Text style={s.balanceAmt}>
              {fmt(BALANCE)} <Text style={s.balanceCur}>so'm</Text>
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                style={s.btnWhite}
                activeOpacity={0.8}
                onPress={() => setShowWithdraw(true)}
              >
                <Text
                  style={{ color: t.orangeD, fontWeight: '700', fontSize: 13 }}
                >
                  Pul yechish
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.btnOutline}
                activeOpacity={0.8}
                onPress={() => setShowPaymentHistory(true)}
              >
                <Text
                  style={{ color: '#fff', fontWeight: '700', fontSize: 13 }}
                >
                  Tarix
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Today / Week ── */}
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            marginTop: 16,
            gap: 12,
          }}
        >
          {[
            { label: 'Bugun', val: '340 000', sub: '4 buyurtma' },
            { label: 'Bu hafta', val: '1.8M', sub: "↑ 12% o'sish" },
          ].map((item, i) => (
            <View
              key={i}
              style={[s.miniCard, { flex: 1, backgroundColor: t.card, borderColor: t.border }]}
            >
              <Text style={{ fontSize: 11.5, color: t.muted }}>
                {item.label}
              </Text>
              <Text
                style={{
                  fontWeight: '800',
                  fontSize: 20,
                  color: t.text,
                  marginTop: 5,
                }}
              >
                {item.val}
              </Text>
              <Text style={{ fontSize: 10.5, color: t.green, marginTop: 2 }}>
                {item.sub}
              </Text>
            </View>
          ))}
        </View>

        {/* ── Yangi e'lonlar (umumiy) ── */}
        <GeneralElonlarSection
          t={t}
          elonlar={ALL_ELONLAR}
          onOpenAll={() => setActiveTab('orders')}
        />
      </ScrollView>

      <ReviewDetailSheet
        visible={!!selectedReview}
        review={selectedReview}
        work={reviewWork}
        client={reviewWork?.client}
        onClose={() => setSelectedReview(null)}
        onOpenClient={openClientFromReview}
        onOpenWork={openWorkFromReview}
        t={t}
      />

      {/* ── Bottom nav ── */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={USTA_TABS}
        accent={t.orange}
        background={t.navBg}
        border={t.border}
        muted={t.faint}
        ringColor={t.bg}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bellBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
  },
  onlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 15,
    padding: 13,
    paddingHorizontal: 15,
    marginTop: 16,
    borderWidth: 1,
  },
  onlineDot: { width: 10, height: 10, borderRadius: 5, flexShrink: 0 },
  track: { width: 44, height: 26, borderRadius: 999, justifyContent: 'center' },
  thumb: {
    position: 'absolute',
    top: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },

  balanceCard: {
    borderRadius: 22,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  balanceCircle: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  balanceAmt: {
    fontWeight: '800',
    fontSize: 32,
    color: '#fff',
    marginTop: 6,
    letterSpacing: -0.5,
  },
  balanceCur: { fontSize: 16, fontWeight: '600' },
  btnWhite: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  btnOutline: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 11,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
    backgroundColor: 'transparent',
    alignItems: 'center',
  },

  miniCard: {
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
  },

  reviewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
  },

  exclusiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
  },
  exclusiveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  elonCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
  },
  generalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
  },

  catCard: {
    width: 132,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 13,
  },
  catIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  workCard: {
    width: 150,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  workImg: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workRating: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10,19,34,0.7)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
});
