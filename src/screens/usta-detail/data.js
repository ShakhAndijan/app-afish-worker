import { C } from './theme';

export const DEFAULT_SPECS = [
  'Kran va smesitel',
  'Quvur tizimlari',
  'Isitish tizimi',
  'Sanitariya jihozlari',
];

export const DEFAULT_SERVICES = [
  { name: "Kran ta'miri", price: '30 000', spec: 'Kran va smesitel' },
  { name: 'Smesitel almashtirish', price: '35 000', spec: 'Kran va smesitel' },
  { name: 'Quvur almashtirish', price: '60 000', spec: 'Quvur tizimlari' },
  { name: 'Quvur payvandlash', price: '45 000', spec: 'Quvur tizimlari' },
  { name: 'Qozon ulanishi', price: '80 000', spec: 'Isitish tizimi' },
  { name: "Radiator o'rnatish", price: '55 000', spec: 'Isitish tizimi' },
  { name: "Unitaz o'rnatish", price: '120 000', spec: 'Sanitariya jihozlari' },
  {
    name: "Dush kabinasi o'rnatish",
    price: '95 000',
    spec: 'Sanitariya jihozlari',
  },
];

export const DEFAULT_TIMES = [
  { label: 'Bugun 14:00', spec: 'Kran va smesitel' },
  { label: 'Bugun 16:30', spec: 'Quvur tizimlari' },
  { label: 'Ertaga 09:00', spec: 'Isitish tizimi' },
  { label: 'Ertaga 11:00', spec: 'Sanitariya jihozlari' },
];

export const DEFAULT_CERTS = [
  {
    name: 'Santexnika litsenziyasi',
    year: '2021',
    spec: 'Sanitariya jihozlari',
  },
  { name: 'Gaz xavfsizligi', year: '2023', spec: 'Isitish tizimi' },
];

export const DEFAULT_REVIEWS = [
  {
    initial: 'M',
    name: 'Madina K.',
    rating: 5,
    time: '2 hafta oldin',
    hasPhoto: true,
    text: 'Juda xushmuomala usta, narxi ham arzon. Ishni tez va sifatli bajardi, albatta yana chaqiraman.',
    bgColor: C.green,
    spec: 'Kran va smesitel',
  },
  {
    initial: 'J',
    name: 'Jasur R.',
    rating: 5,
    time: '3 hafta oldin',
    hasPhoto: false,
    text: 'Tez keldi, hammasini puxta qildi. Rahmat!',
    bgColor: C.green,
    spec: 'Quvur tizimlari',
  },
  {
    initial: 'O',
    name: 'Otabek S.',
    rating: 4,
    time: '1 oy oldin',
    hasPhoto: false,
    text: 'Yaxshi usta, vaqtida keldi. Ishdan mamnunman.',
    bgColor: C.blue,
    spec: 'Isitish tizimi',
  },
  {
    initial: 'N',
    name: 'Nilufar A.',
    rating: 5,
    time: '1 oy oldin',
    hasPhoto: true,
    text: "Zo'r usta! Muammoni tezda hal qildi.",
    bgColor: C.purple,
    spec: 'Sanitariya jihozlari',
  },
  {
    initial: 'B',
    name: 'Bobur T.',
    rating: 5,
    time: '2 oy oldin',
    hasPhoto: false,
    text: 'Narxi adolatli, sifat yuqori. Tavsiya qilaman!',
    bgColor: C.orange,
    spec: 'Kran va smesitel',
  },
];

export function ratingBarsFor(reviewList) {
  const total = reviewList.length;
  return [5, 4, 3, 2, 1].map((star) => ({
    label: `${star}★`,
    pct: total
      ? Math.round(
          (reviewList.filter((r) => r.rating === star).length / total) * 100
        )
      : 0,
  }));
}

export const DEFAULT_WORKS = [
  {
    id: 1,
    title: "Vannaxona ta'miri",
    icon: 'water-pump',
    color: '#e87b3e',
    rating: 5.0,
    spec: 'Sanitariya jihozlari',
  },
  {
    id: 2,
    title: 'Quvur almashtirish',
    icon: 'pipe',
    color: '#3d82d4',
    rating: 4.9,
    spec: 'Quvur tizimlari',
  },
  {
    id: 3,
    title: "Kran o'rnatish",
    icon: 'wrench',
    color: '#27a567',
    rating: 5.0,
    spec: 'Kran va smesitel',
  },
  {
    id: 4,
    title: 'Qozon ulanishi',
    icon: 'radiator',
    color: '#9466cf',
    rating: 4.8,
    spec: 'Isitish tizimi',
  },
  {
    id: 5,
    title: "Dush o'rnatish",
    icon: 'shower',
    color: '#f0b429',
    rating: 4.9,
    spec: 'Sanitariya jihozlari',
  },
  {
    id: 6,
    title: 'Unitaz almashtirish',
    icon: 'toilet',
    color: '#e8533e',
    rating: 5.0,
    spec: 'Sanitariya jihozlari',
  },
  {
    id: 7,
    title: "Suv o'tkazgich",
    icon: 'water',
    color: '#42a5f5',
    rating: 4.8,
    spec: 'Quvur tizimlari',
  },
  {
    id: 8,
    title: "Filtr o'rnatish",
    icon: 'water-pump',
    color: '#26a69a',
    rating: 4.9,
    spec: 'Kran va smesitel',
  },
  {
    id: 9,
    title: 'Isitish tizimi',
    icon: 'fire',
    color: '#ff7043',
    rating: 5.0,
    spec: 'Isitish tizimi',
  },
  {
    id: 10,
    title: "Sanitariya ta'miri",
    icon: 'hammer-wrench',
    color: '#78909c',
    rating: 4.7,
    spec: 'Sanitariya jihozlari',
  },
];
