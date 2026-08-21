import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function SectionHeader({ title, action, onPress, theme: t, style }) {
  return (
    <View style={[s.row, style]}>
      <Text style={[s.title, { color: t.text }]}>{title}</Text>
      {!!action &&
        (onPress ? (
          <TouchableOpacity activeOpacity={0.7} onPress={onPress}>
            <Text style={[s.action, { color: t.orange }]}>{action}</Text>
          </TouchableOpacity>
        ) : (
          <Text style={[s.action, { color: t.orange }]}>{action}</Text>
        ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 13,
  },
  title: { fontWeight: '700', fontSize: 16.5 },
  action: { fontSize: 12.5, fontWeight: '600' },
});
