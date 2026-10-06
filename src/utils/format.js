export const MONTH_NAMES_UZ = [
  'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
  'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr',
];

export const pad2 = (n) => String(n).padStart(2, '0');

export const daysInMonth = (year, month) => new Date(year, month, 0).getDate();

/** 1234567 → "1 234 567" */
export const formatNumber = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Pul miqdori: butun so'mgacha yaxlitlab, minglik oralig'i bilan. */
export const formatAmount = (n) => formatNumber(Math.round(n));

/** "901234567" → "90 123 45 67" (faqat 9 ta raqamgacha) */
export const formatPhone = (raw = '') => {
  const d = raw.replace(/\D/g, '').slice(0, 9);
  let out = d.slice(0, 2);
  if (d.length > 2) out += ' ' + d.slice(2, 5);
  if (d.length > 5) out += ' ' + d.slice(5, 7);
  if (d.length > 7) out += ' ' + d.slice(7, 9);
  return out;
};
