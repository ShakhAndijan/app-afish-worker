import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';

const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
const toNumber = (price) => parseInt(String(price).replace(/\D/g, ''), 10) || 0;
const BAR_COLORS = ['orange', 'blue', 'green', 'violet', 'gold', 'red'];

const UZ_MONTHS = [
  'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
  'iyul', 'avgust', 'sentyabr', 'oktyabr', 'noyabr', 'dekabr',
];
const MONTH_SHORT = [
  'Yan', 'Fev', 'Mar', 'Apr', 'May', 'Iyun',
  'Iyul', 'Avg', 'Sen', 'Okt', 'Noy', 'Dek',
];
const WEEKDAY_FULL = {
  Du: 'Dushanba',
  Se: 'Seshanba',
  Ch: 'Chorshanba',
  Pa: 'Payshanba',
  Ju: 'Juma',
  Sh: 'Shanba',
  Ya: 'Yakshanba',
};
const parseWorkDate = (str) => {
  const m = /(\d+)-([a-zA-Z]+),?\s*(\d{4})/.exec(str || '');
  if (!m) return null;
  const monthIdx = UZ_MONTHS.indexOf(m[2].toLowerCase());
  if (monthIdx === -1) return null;
  return { day: Number(m[1]), monthIdx, year: Number(m[3]) };
};

function PeriodDetailSheet({ visible, detail, onClose, onSelectWork, t }) {
  if (!detail) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={ps.overlay} />
      </TouchableWithoutFeedback>

      <View style={ps.sheetWrap} pointerEvents="box-none">
        <View style={[ps.sheet, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={ps.grabberRow}>
            <View style={[ps.grabber, { backgroundColor: t.border }]} />
          </View>

          <View style={ps.headerRow}>
            <Text style={{ fontWeight: '700', fontSize: 17, color: t.text }}>
              {detail.title}
            </Text>
            <TouchableOpacity
              style={[ps.closeBtn, { backgroundColor: t.rowIconBg }]}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <MaterialCommunityIcons name="close" size={17} color={t.muted} />
            </TouchableOpacity>
          </View>
          {!!detail.subtitle && (
            <Text style={[ps.subtitle, { color: t.muted }]}>{detail.subtitle}</Text>
          )}

          <ScrollView contentContainerStyle={ps.body} showsVerticalScrollIndicator={false}>
            <View style={[ps.amountCard, { backgroundColor: t.orange }]}>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)' }}>
                {detail.amountLabel}
              </Text>
              <Text style={{ fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 4 }}>
                {fmt(detail.amount)} <Text style={{ fontSize: 14, fontWeight: '600' }}>so'm</Text>
              </Text>
            </View>

            {detail.meta.map((row, i) => (
              <View key={i} style={[ps.metaRow, { borderColor: t.border }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <MaterialCommunityIcons name={row.icon} size={15} color={t.muted} />
                  <Text style={{ fontSize: 12.5, color: t.muted }}>{row.label}</Text>
                </View>
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: row.color || t.text }}>
                  {row.value}
                </Text>
              </View>
            ))}

            {!!detail.works && (
              <>
                <Text style={[ps.worksLabel, { color: t.faint }]}>
                  {detail.works.length > 0 ? "SHU DAVRDAGI ISHLAR" : ''}
                </Text>
                {detail.works.length === 0 ? (
                  <View style={[ps.emptyBox, { backgroundColor: t.rowIconBg }]}>
                    <MaterialCommunityIcons name="calendar-blank-outline" size={22} color={t.faint} />
                    <Text style={{ fontSize: 12, color: t.muted, marginTop: 6 }}>
                      Aniq ish yozuvlari ulanmagan — bu qiymat umumiy statistikadan
                    </Text>
                  </View>
                ) : (
                  <View style={{ gap: 8 }}>
                    {detail.works.map((w) => (
                      <TouchableOpacity
                        key={w.id}
                        style={[ps.workRow, { backgroundColor: t.rowIconBg }]}
                        activeOpacity={0.8}
                        onPress={() => onSelectWork?.(w)}
                      >
                        <View style={[ps.workIconBox, { backgroundColor: w.color + '20' }]}>
                          <MaterialCommunityIcons name={w.icon} size={17} color={w.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12.5, fontWeight: '700', color: t.text }} numberOfLines={1}>
                            {w.title}
                          </Text>
                          <Text style={{ fontSize: 10.5, color: t.muted, marginTop: 1 }} numberOfLines={1}>
                            {w.client?.name} · {w.date}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 12, fontWeight: '800', color: t.green }}>
                          +{w.price}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const ps = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,8,14,0.65)',
  },
  sheetWrap: { position: 'absolute', left: 0, right: 0, bottom: 0 },
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
    maxHeight: '85%',
  },
  grabberRow: { paddingTop: 12, alignItems: 'center' },
  grabber: { width: 42, height: 5, borderRadius: 3 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
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
  subtitle: { fontSize: 12, paddingHorizontal: 20, paddingTop: 2 },
  body: { paddingHorizontal: 20, paddingTop: 16, gap: 10 },
  amountCard: { borderRadius: 16, padding: 16 },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  worksLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, marginTop: 4 },
  emptyBox: { borderRadius: 14, padding: 18, alignItems: 'center' },
  workRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 14,
    padding: 10,
  },
  workIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function EarningsScreen({
  t,
  week = [],
  works = [],
  categories = [],
  todayEarned = 340000,
  balance = '1 840 000',
  onBack,
  onSelectWork,
}) {
  const insets = useSafeAreaInsets();
  const [detail, setDetail] = useState(null);

  const maxWeek = Math.max(1, ...week.map((d) => d[1]));
  const weekTotal = week.reduce((sum, d) => sum + d[1], 0) * 1000;
  const weekAvg = week.length ? weekTotal / week.length : 0;
  const bestDay = week.reduce((best, d) => (!best || d[1] > best[1] ? d : best), null);

  const totalEarned = works.reduce((sum, w) => sum + toNumber(w.price), 0);
  const avgPerJob = works.length ? totalEarned / works.length : 0;
  const topJob = works.reduce(
    (best, w) => (!best || toNumber(w.price) > toNumber(best.price) ? w : best),
    null
  );

  // ── Oylik guruhlash (ish sanasidan) ──
  const monthlyMap = new Map();
  works.forEach((w) => {
    const d = parseWorkDate(w.date);
    if (!d) return;
    const key = `${d.year}-${d.monthIdx}`;
    const entry = monthlyMap.get(key) || { year: d.year, monthIdx: d.monthIdx, amount: 0, count: 0, works: [] };
    entry.amount += toNumber(w.price);
    entry.count += 1;
    entry.works.push(w);
    monthlyMap.set(key, entry);
  });
  const monthly = Array.from(monthlyMap.values()).sort(
    (a, b) => a.year - b.year || a.monthIdx - b.monthIdx
  );
  const maxMonth = Math.max(1, ...monthly.map((m) => m.amount));
  const thisMonth = monthly[monthly.length - 1] || null;
  const bestMonth = monthly.reduce((best, m) => (!best || m.amount > best.amount ? m : best), null);
  const busiestMonth = monthly.reduce((best, m) => (!best || m.count > best.count ? m : best), null);
  const monthAvg = monthly.length
    ? monthly.reduce((s, m) => s + m.amount, 0) / monthly.length
    : 0;

  const openDay = (d, i) => {
    const pct = weekTotal ? Math.round(((d[1] * 1000) / weekTotal) * 100) : 0;
    const vsAvg = weekAvg ? Math.round((((d[1] * 1000) - weekAvg) / weekAvg) * 100) : 0;
    setDetail({
      title: WEEKDAY_FULL[d[0]] || d[0],
      subtitle: 'Haftalik daromad tafsiloti',
      amountLabel: `${WEEKDAY_FULL[d[0]] || d[0]} kunidagi daromad`,
      amount: d[1] * 1000,
      meta: [
        { icon: 'chart-donut', label: 'Haftalik ulush', value: `${pct}%` },
        {
          icon: 'trending-up',
          label: "Kunlik o'rtachadan",
          value: `${vsAvg >= 0 ? '+' : ''}${vsAvg}%`,
          color: vsAvg >= 0 ? t.green : t.red,
        },
        {
          icon: 'trophy-outline',
          label: 'Haftadagi o\'rni',
          value:
            d[1] === maxWeek
              ? "Eng yaxshi kun 🏆"
              : `${[...week].sort((a, b) => b[1] - a[1]).findIndex((x) => x[0] === d[0]) + 1}-o'rin`,
        },
      ],
    });
  };

  const openMonth = (m) => {
    const pct = totalEarned ? Math.round((m.amount / totalEarned) * 100) : 0;
    const vsAvg = monthAvg ? Math.round(((m.amount - monthAvg) / monthAvg) * 100) : 0;
    setDetail({
      title: `${MONTH_SHORT[m.monthIdx]} ${m.year}`,
      subtitle: 'Oylik daromad tafsiloti',
      amountLabel: `${MONTH_SHORT[m.monthIdx]} oyidagi daromad`,
      amount: m.amount,
      meta: [
        { icon: 'briefcase-check-outline', label: 'Bajarilgan ish', value: `${m.count} ta` },
        { icon: 'chart-donut', label: 'Umumiy ulush', value: `${pct}%` },
        {
          icon: 'trending-up',
          label: "Oylik o'rtachadan",
          value: `${vsAvg >= 0 ? '+' : ''}${vsAvg}%`,
          color: vsAvg >= 0 ? t.green : t.red,
        },
      ],
      works: [...m.works].sort((a, b) => b.id - a.id),
    });
  };

  const breakdown = categories
    .map((c) => {
      const catWorks = works.filter((w) => w.category === c.name);
      return {
        name: c.name,
        icon: c.icon,
        amount: catWorks.reduce((sum, w) => sum + toNumber(w.price), 0),
        count: catWorks.length,
      };
    })
    .filter((c) => c.amount > 0);
  const categorizedTotal = breakdown.reduce((s, c) => s + c.amount, 0);
  const categorizedCount = breakdown.reduce((s, c) => s + c.count, 0);
  if (totalEarned - categorizedTotal > 0) {
    breakdown.push({
      name: 'Boshqa xizmatlar',
      icon: 'dots-horizontal-circle-outline',
      amount: totalEarned - categorizedTotal,
      count: works.length - categorizedCount,
    });
  }
  breakdown.sort((a, b) => b.amount - a.amount);

  const sortedWorks = [...works].sort((a, b) => b.id - a.id);

  const periodStats = [
    { icon: 'calendar-today', value: fmt(todayEarned), label: 'Bugun' },
    { icon: 'calendar-week', value: fmt(weekTotal), label: 'Bu hafta' },
    { icon: 'calendar-month-outline', value: fmt(thisMonth?.amount ?? 0), label: 'Bu oy' },
    { icon: 'chart-line', value: fmt(weekAvg), label: "Kunlik o'rtacha" },
  ];

  const extraStats = [
    {
      icon: 'calculator-variant-outline',
      label: `${fmt(avgPerJob)} so'm`,
      sub: 'Har bir ish uchun o\'rtacha narx',
    },
    ...(topJob
      ? [{
          icon: 'trophy-outline',
          label: `${topJob.price} so'm`,
          sub: `Eng yuqori to'lov — ${topJob.title}`,
        }]
      : []),
    ...(bestMonth
      ? [{
          icon: 'calendar-star',
          label: `${fmt(bestMonth.amount)} so'm`,
          sub: `Eng daromadli oy — ${MONTH_SHORT[bestMonth.monthIdx]} ${bestMonth.year}`,
        }]
      : []),
    ...(busiestMonth
      ? [{
          icon: 'calendar-check-outline',
          label: `${busiestMonth.count} ta ish`,
          sub: `Eng faol oy — ${MONTH_SHORT[busiestMonth.monthIdx]} ${busiestMonth.year}`,
        }]
      : []),
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
          Daromadlarim
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
        {/* ── Butun vaqt davomida topilgan pul ── */}
        <View style={[s.heroCard, { overflow: 'hidden' }]}>
          <View style={s.heroCircle} />
          <View style={{ position: 'absolute', right: 16, bottom: 14, opacity: 0.16 }}>
            <MaterialCommunityIcons name="cash-multiple" size={64} color="#fff" />
          </View>
          <Text style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.9)' }}>
            Butun vaqt davomida ishlab topilgan pul
          </Text>
          <Text style={s.heroAmt}>
            {fmt(totalEarned)} <Text style={s.heroCur}>so'm</Text>
          </Text>
          <Text style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.85)', marginTop: 6 }}>
            {works.length} ta bajarilgan ish · Hisobingizda {balance} so'm
          </Text>
        </View>

        {/* ── Davr bo'yicha statistika ── */}
        <View style={{ marginTop: 16, gap: 10 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {periodStats.slice(0, 2).map((st, i) => (
              <View key={i} style={[s.statCard, { flex: 1, backgroundColor: t.card, borderColor: t.border }]}>
                <MaterialCommunityIcons name={st.icon} size={18} color={t.orange} />
                <Text style={{ fontSize: 15, fontWeight: '800', color: t.text, marginTop: 8 }} numberOfLines={1}>
                  {st.value}
                </Text>
                <Text style={{ fontSize: 10.5, color: t.muted, marginTop: 2, textAlign: 'center' }}>
                  {st.label} (so'm)
                </Text>
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {periodStats.slice(2, 4).map((st, i) => (
              <View key={i} style={[s.statCard, { flex: 1, backgroundColor: t.card, borderColor: t.border }]}>
                <MaterialCommunityIcons name={st.icon} size={18} color={t.orange} />
                <Text style={{ fontSize: 15, fontWeight: '800', color: t.text, marginTop: 8 }} numberOfLines={1}>
                  {st.value}
                </Text>
                <Text style={{ fontSize: 10.5, color: t.muted, marginTop: 2, textAlign: 'center' }}>
                  {st.label} (so'm)
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Haftalik grafik ── */}
        <Text style={[s.secTitle, { color: t.text }]}>Haftalik daromad</Text>
        <View style={[s.card, { backgroundColor: t.card, borderColor: t.border }]}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ fontSize: 13, color: t.muted }}>
              Jami: <Text style={{ fontWeight: '800', color: t.text }}>{fmt(weekTotal)} so'm</Text>
            </Text>
            {!!bestDay && (
              <Text style={{ fontSize: 11, color: t.green, fontWeight: '700' }}>
                Eng yaxshi kun: {bestDay[0]}
              </Text>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 100, marginTop: 18, gap: 8 }}>
            {week.map((d, i) => (
              <TouchableOpacity
                key={i}
                style={{ flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}
                activeOpacity={0.7}
                onPress={() => openDay(d, i)}
              >
                <Text style={{ fontSize: 8.5, color: t.faint, marginBottom: 4 }}>
                  {d[1]}k
                </Text>
                <View
                  style={{
                    width: '70%',
                    height: Math.round((d[1] / maxWeek) * 78),
                    borderRadius: 6,
                    backgroundColor: d[1] === maxWeek ? t.orange : 'rgba(232,122,69,0.28)',
                  }}
                />
                <Text style={{ fontSize: 9.5, color: t.faint, marginTop: 6 }}>{d[0]}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={{ fontSize: 10.5, color: t.faint, textAlign: 'center', marginTop: 12 }}>
            Batafsil ma'lumot uchun kunga bosing
          </Text>
        </View>

        {/* ── Oylik grafik ── */}
        {monthly.length > 0 && (
          <>
            <Text style={[s.secTitle, { color: t.text }]}>Oylik daromad</Text>
            <View style={[s.card, { backgroundColor: t.card, borderColor: t.border }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Text style={{ fontSize: 13, color: t.muted }}>
                  Jami: <Text style={{ fontWeight: '800', color: t.text }}>{fmt(totalEarned)} so'm</Text>
                </Text>
                {!!bestMonth && (
                  <Text style={{ fontSize: 11, color: t.green, fontWeight: '700' }}>
                    Eng yaxshi oy: {MONTH_SHORT[bestMonth.monthIdx]}
                  </Text>
                )}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 110, marginTop: 18, gap: 10 }}>
                {monthly.map((m, i) => (
                  <TouchableOpacity
                    key={i}
                    style={{ flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}
                    activeOpacity={0.7}
                    onPress={() => openMonth(m)}
                  >
                    <Text style={{ fontSize: 8.5, color: t.faint, marginBottom: 4 }} numberOfLines={1}>
                      {fmt(m.amount / 1000)}k
                    </Text>
                    <View
                      style={{
                        width: '55%',
                        height: Math.round((m.amount / maxMonth) * 86),
                        borderRadius: 7,
                        backgroundColor: m.amount === maxMonth ? t.orange : 'rgba(232,122,69,0.28)',
                      }}
                    />
                    <Text style={{ fontSize: 10, fontWeight: '600', color: t.faint, marginTop: 6 }}>
                      {MONTH_SHORT[m.monthIdx]}
                    </Text>
                    <Text style={{ fontSize: 9, color: t.faint }}>{m.count} ish</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ fontSize: 10.5, color: t.faint, textAlign: 'center', marginTop: 12 }}>
                Batafsil ma'lumot uchun oyga bosing
              </Text>
            </View>
          </>
        )}

        {/* ── Qo'shimcha statistika ── */}
        {extraStats.length > 0 && (
          <>
            <Text style={[s.secTitle, { color: t.text }]}>Qo'shimcha statistika</Text>
            <View style={[s.card, { backgroundColor: t.card, borderColor: t.border, padding: 0 }]}>
              {extraStats.map((row, i) => (
                <View key={i}>
                  <View style={s.detailRow}>
                    <View style={[s.iconBox, { backgroundColor: t.rowIconBg }]}>
                      <MaterialCommunityIcons name={row.icon} size={17} color={t.orange} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '800', color: t.text }} numberOfLines={1}>
                        {row.label}
                      </Text>
                      <Text style={{ fontSize: 11.5, color: t.muted, marginTop: 1 }} numberOfLines={1}>
                        {row.sub}
                      </Text>
                    </View>
                  </View>
                  {i < extraStats.length - 1 && (
                    <View style={[s.rowDivider, { backgroundColor: t.border }]} />
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {/* ── Yo'nalishlar bo'yicha daromad ── */}
        {breakdown.length > 0 && (
          <>
            <Text style={[s.secTitle, { color: t.text }]}>Yo'nalishlar bo'yicha daromad</Text>
            <View style={[s.card, { backgroundColor: t.card, borderColor: t.border, gap: 14 }]}>
              {breakdown.map((c, i) => {
                const pct = totalEarned ? Math.round((c.amount / totalEarned) * 100) : 0;
                const color = t[BAR_COLORS[i % BAR_COLORS.length]];
                return (
                  <View key={c.name}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <MaterialCommunityIcons name={c.icon} size={15} color={color} />
                      <Text style={{ fontSize: 12.5, fontWeight: '700', color: t.text, flex: 1 }} numberOfLines={1}>
                        {c.name}
                      </Text>
                      <Text style={{ fontSize: 12, fontWeight: '800', color: t.text }}>
                        {fmt(c.amount)} so'm
                      </Text>
                    </View>
                    <View style={[s.barTrack, { backgroundColor: t.rowIconBg }]}>
                      <View style={[s.barFill, { width: `${Math.max(pct, 3)}%`, backgroundColor: color }]} />
                    </View>
                    <Text style={{ fontSize: 10.5, color: t.faint, marginTop: 4 }}>
                      {pct}% · {c.count} ta ish
                    </Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* ── So'nggi to'lovlar ── */}
        <Text style={[s.secTitle, { color: t.text }]}>So'nggi to'lovlar</Text>
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
              <Text style={{ fontSize: 13, fontWeight: '800', color: t.green }}>
                +{w.price} so'm
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <PeriodDetailSheet
        visible={!!detail}
        detail={detail}
        onClose={() => setDetail(null)}
        onSelectWork={(w) => {
          setDetail(null);
          onSelectWork?.(w);
        }}
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

  heroCard: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: '#e87a45',
    position: 'relative',
  },
  heroCircle: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  heroAmt: {
    fontWeight: '800',
    fontSize: 28,
    color: '#fff',
    marginTop: 6,
    letterSpacing: -0.5,
  },
  heroCur: { fontSize: 15, fontWeight: '600' },

  statCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
    alignItems: 'center',
  },

  secTitle: { fontSize: 15, fontWeight: '800', marginTop: 22, marginBottom: 11 },

  card: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
  },

  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
  },
  rowDivider: { height: 1, marginLeft: 14 + 36 + 12 },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  barTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 4,
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
