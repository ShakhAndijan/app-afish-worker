import { Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

/* ── Birth date wheel picker ── */
export default function DateColumn({ values, value, onChange, format, t }) {
  const idx = Math.max(0, values.indexOf(value));
  return (
    <FlatList
      data={values}
      keyExtractor={(v) => String(v)}
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      initialScrollIndex={idx}
      getItemLayout={(_, i) => ({ length: 40, offset: 40 * i, index: i })}
      renderItem={({ item }) => {
        const selected = item === value;
        return (
          <TouchableOpacity
            style={s.dateCell}
            onPress={() => onChange(item)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                s.dateCellText,
                {
                  color: selected ? t.orange : t.muted,
                  fontWeight: selected ? '700' : '400',
                },
              ]}
            >
              {format ? format(item) : item}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const s = StyleSheet.create({
  dateCell: { height: 40, alignItems: 'center', justifyContent: 'center' },
  dateCellText: { fontSize: 15 },
});
