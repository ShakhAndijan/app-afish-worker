import { pad2 } from '../../utils/format';

export const parseIsoDate = (str) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || '');
  if (!m) return null;
  const [, yyyy, mm, dd] = m;
  return { year: Number(yyyy), month: Number(mm), day: Number(dd) };
};
export const formatDisplayDate = (iso) => {
  const p = parseIsoDate(iso);
  if (!p) return '';
  return `${pad2(p.day)}.${pad2(p.month)}.${p.year}`;
};
