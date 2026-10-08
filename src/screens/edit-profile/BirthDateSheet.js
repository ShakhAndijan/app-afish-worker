import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { MONTH_NAMES_UZ, pad2, daysInMonth } from '../../utils/format';
import { shared } from './styles';
import { parseIsoDate } from './dates';
import DateColumn from './DateColumn';

export default function BirthDateSheet({ visible, onClose, value, onChange, t }) {
  const currentYear = new Date().getFullYear();
  const parsed = parseIsoDate(value);
  const [day, setDay] = useState(parsed?.day ?? 1);
  const [month, setMonth] = useState(parsed?.month ?? 1);
  const [year, setYear] = useState(parsed?.year ?? currentYear - 25);

  useEffect(() => {
    if (visible) {
      const p = parseIsoDate(value);
      setDay(p?.day ?? 1);
      setMonth(p?.month ?? 1);
      setYear(p?.year ?? currentYear - 25);
    }
  }, [visible]);

  const maxDay = daysInMonth(year, month);
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: currentYear - 1940 + 1 },
    (_, i) => currentYear - i
  );

  const changeMonth = (m) => {
    setMonth(m);
    if (day > daysInMonth(year, m)) setDay(daysInMonth(year, m));
  };
  const changeYear = (y) => {
    setYear(y);
    if (day > daysInMonth(y, month)) setDay(daysInMonth(y, month));
  };

  const confirm = () => {
    onChange(`${year}-${pad2(month)}-${pad2(day)}`);
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
        <View style={shared.overlay} />
      </TouchableWithoutFeedback>

      <View
        style={[shared.sheet, { backgroundColor: t.card, borderColor: t.border }]}
      >
        <View style={shared.grabberRow}>
          <View style={[shared.grabber, { backgroundColor: t.border }]} />
        </View>
        <View style={shared.sheetHeaderRow}>
          <Text style={[shared.sheetTitle, { color: t.text }]}>Tug'ilgan sana</Text>
          <TouchableOpacity
            style={[shared.sheetCloseBtn, { backgroundColor: t.rowIconBg }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="close" size={16} color={t.muted} />
          </TouchableOpacity>
        </View>

        <View style={s.dateWheelWrap}>
          <View
            style={[s.dateHighlight, { backgroundColor: t.rowIconBg }]}
            pointerEvents="none"
          />
          <DateColumn values={days} value={day} onChange={setDay} t={t} />
          <DateColumn
            values={months}
            value={month}
            onChange={changeMonth}
            format={(m) => MONTH_NAMES_UZ[m - 1]}
            t={t}
          />
          <DateColumn values={years} value={year} onChange={changeYear} t={t} />
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 6 }}>
          <TouchableOpacity
            style={[s.confirmBtn, { backgroundColor: t.orange }]}
            activeOpacity={0.85}
            onPress={confirm}
          >
            <Text style={s.confirmBtnText}>Tasdiqlash</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  dateWheelWrap: {
    flexDirection: 'row',
    height: 200,
    paddingHorizontal: 20,
    position: 'relative',
  },
  dateHighlight: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 80,
    height: 40,
    borderRadius: 10,
  },
  confirmBtn: {
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
