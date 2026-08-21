import { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import Avatar from '../components/Avatar';
import BottomNav from '../components/BottomNav';
import SectionHeader from '../components/SectionHeader';
import WorkDetailScreen from './WorkDetailScreen';
import ClientProfileScreen from './ClientProfileScreen';

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
  { id: 1, name: 'Santexnika', icon: 'wrench', price: '80 000', isPrimary: true },
  { id: 2, name: 'Isitish tizimlari', icon: 'radiator', price: '120 000', isPrimary: false },
  { id: 3, name: "Konditsioner o'rnatish", icon: 'air-conditioner', price: '150 000', isPrimary: false },
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

const MY_REVIEWS = [
  {
    id: 1,
    name: 'Sardor Aliyev',
    rating: 5,
    time: '2 kun oldin',
    text: 'Juda tez keldi va sifatli ishladi. Narxi ham kelishilgandek bo\'ldi, rahmat!',
  },
  {
    id: 2,
    name: 'Nodira Karimova',
    rating: 5,
    time: '1 hafta oldin',
    text: "Muomilasi yoqdi, ishni ozgina kechikib boshlasa ham natija a'lo darajada.",
  },
  {
    id: 3,
    name: 'Javlon Mirzayev',
    rating: 4,
    time: '2 hafta oldin',
    text: "Yaxshi usta, lekin biroz band ekan, navbat kutishga to'g'ri keldi.",
  },
];

const PROFILE_CHECKLIST = [
  { key: 'photo', label: 'Profil rasmi', icon: 'account-circle-outline' },
  { key: 'bio', label: "O'zingiz haqingizda", icon: 'text-box-outline' },
  { key: 'categories', label: 'Kamida 1 kategoriya', icon: 'briefcase-outline' },
  { key: 'certificates', label: 'Sertifikat', icon: 'certificate-outline' },
];

const CAT_CARD_W = 132;
const CAT_GAP = 10;
const CAT_SLOT = CAT_CARD_W + CAT_GAP;

function MyCategoriesSection({ t }) {
  const flatListRef = useRef(null);
  const indexRef = useRef(0);
  const autoScroll = MY_CATEGORIES.length > 3;

  useEffect(() => {
    if (!autoScroll) return;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % MY_CATEGORIES.length;
      indexRef.current = next;
      flatListRef.current?.scrollToOffset({
        offset: next * CAT_SLOT,
        animated: true,
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [autoScroll]);

  return (
    <View style={{ marginTop: 26 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <SectionHeader theme={t} title="Mening kategoriyalarim" action="Tahrirlash" />
      </View>
      <FlatList
        ref={flatListRef}
        data={MY_CATEGORIES}
        keyExtractor={(c) => String(c.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CAT_SLOT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20, gap: CAT_GAP }}
        renderItem={({ item: c }) => (
          <View
            style={[
              s.catCard,
              {
                backgroundColor: t.card,
                borderColor: c.isPrimary ? t.orange : t.border,
              },
            ]}
          >
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
            <Text
              style={{ fontSize: 12.5, fontWeight: '700', color: t.text }}
              numberOfLines={1}
            >
              {c.name}
            </Text>
            <Text style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>
              {c.price} so'mdan
            </Text>
          </View>
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
        <SectionHeader theme={t} title="Oxirgi bajarilgan ishlar" action="Barchasi" />
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

const USTA_TABS = [
  { key: 'home', label: 'Asosiy', on: 'home', off: 'home-outline' },
  { key: 'orders', label: 'Buyurtmalar', on: 'grid', off: 'grid-outline' },
  { key: 'wallet', label: 'Hamyon', on: 'wallet', off: 'wallet-outline' },
  { key: 'profile', label: 'Profil', on: 'person', off: 'person-outline' },
];

export default function UstaMainScreen({ onLogout }) {
  const { theme: t } = useTheme();
  const { user } = useUser();
  const [online, setOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedWork, setSelectedWork] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);

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

  const fullName =
    [user?.first_name, user?.last_name].filter(Boolean).join(' ') || 'Usta';
  const initial = (user?.first_name ?? user?.last_name ?? 'U')
    .charAt(0)
    .toUpperCase();

  const checklistDone = {
    photo: !!user?.profile_photo,
    bio: !!(user?.bio && user.bio.trim()),
    categories: (user?.categories?.length ?? 0) > 0,
    certificates: (user?.certificates?.length ?? 0) > 0,
  };
  const doneCount = Object.values(checklistDone).filter(Boolean).length;
  const profilePercent = Math.round((doneCount / PROFILE_CHECKLIST.length) * 100);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: t.bg }}
      edges={['top', 'left', 'right']}
    >
      <StatusBar style={t.isDark ? 'light' : 'dark'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
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
              onPress={() => setOnline((o) => !o)}
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
          <View style={[s.profCard, { backgroundColor: t.card, borderColor: t.border }]}>
            {profilePercent === 100 ? (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <MaterialCommunityIcons name="check-decagram" size={22} color={t.green} />
                <Text style={{ flex: 1, fontSize: 13, fontWeight: '700', color: t.text }}>
                  Profilingiz to'liq to'ldirilgan
                </Text>
              </View>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>
                    Profilingiz {profilePercent}% to'ldirilgan
                  </Text>
                  <View style={[s.profBadge, { backgroundColor: t.orange }]}>
                    <Text style={s.profBadgeTxt}>{profilePercent}%</Text>
                  </View>
                </View>
                <View style={[s.profTrack, { backgroundColor: t.rowIconBg }]}>
                  <View
                    style={[
                      s.profFill,
                      { width: `${profilePercent}%`, backgroundColor: t.orange },
                    ]}
                  />
                </View>
                <Text style={{ fontSize: 11.5, color: t.muted, marginTop: 10, lineHeight: 17 }}>
                  Bu ma'lumotlar — mijozlarga ko'rinadigan ommaviy profilingiz. Alohida
                  e'lon joylashning hojati yo'q: mijozlar aynan shu profil orqali sizni
                  topadi va bog'lanadi.
                </Text>
                <View style={{ marginTop: 12, gap: 8 }}>
                  {PROFILE_CHECKLIST.map((item) => {
                    const done = checklistDone[item.key];
                    return (
                      <View
                        key={item.key}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                      >
                        <Ionicons
                          name={done ? 'checkmark-circle' : 'ellipse-outline'}
                          size={16}
                          color={done ? t.green : t.faint}
                        />
                        <Text
                          style={{
                            fontSize: 12.5,
                            color: done ? t.text : t.muted,
                            fontWeight: done ? '600' : '400',
                          }}
                        >
                          {item.label}
                        </Text>
                      </View>
                    );
                  })}
                </View>
                <TouchableOpacity
                  style={[s.profBtn, { backgroundColor: t.orange }]}
                  activeOpacity={0.85}
                  onPress={() => setActiveTab('profile')}
                >
                  <Text style={s.profBtnTxt}>Profilni to'ldirish</Text>
                  <Ionicons name="arrow-forward" size={15} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {/* ── Moliya ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
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
              1 840 000 <Text style={s.balanceCur}>so'm</Text>
            </Text>
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={s.btnWhite} activeOpacity={0.8}>
                <Text
                  style={{ color: t.orangeD, fontWeight: '700', fontSize: 13 }}
                >
                  Pul yechish
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnOutline} activeOpacity={0.8}>
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
          <View style={[s.miniCard, { backgroundColor: t.card, borderColor: t.border }]}>
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
          </View>
        </View>

        {/* ── Mening kategoriyalarim ── */}
        <MyCategoriesSection t={t} />

        {/* ── Bajarilgan ishlar ── */}
        <RecentWorksSection t={t} onSelect={setSelectedWork} />

        {/* ── So'nggi sharhlar ── */}
        <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
          <SectionHeader theme={t} title="So'nggi sharhlar" action="Barchasi" />
          <View style={{ gap: 10 }}>
            {MY_REVIEWS.map((r) => (
              <View
                key={r.id}
                style={[s.reviewCard, { backgroundColor: t.card, borderColor: t.border }]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Avatar letter={r.name.charAt(0)} bgColor={t.blue} size={34} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>
                      {r.name}
                    </Text>
                    <Text style={{ fontSize: 10.5, color: t.muted, marginTop: 1 }}>
                      {r.time}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 1 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Ionicons
                        key={i}
                        name="star"
                        size={12}
                        color={i < r.rating ? t.gold : t.border}
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
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

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

  profCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  profBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  profBadgeTxt: { fontSize: 11.5, fontWeight: '800', color: '#fff' },
  profTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  profFill: {
    height: '100%',
    borderRadius: 4,
  },
  profBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 44,
    borderRadius: 13,
    marginTop: 14,
  },
  profBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },

  reviewCard: {
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
