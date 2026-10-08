import { Text, StyleSheet } from 'react-native';

export default function GroupLabel({ children, t }) {
  return <Text style={[s.groupLabel, { color: t.faint }]}>{children}</Text>;
}

const s = StyleSheet.create({
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginTop: 18,
    marginBottom: 9,
    paddingLeft: 4,
  },
});
