import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function ProfileHeader({ title, onBack, t }) {
  return (
    <View style={[s.header, { backgroundColor: t.bg }]}>
      <TouchableOpacity
        style={[
          s.backBtn,
          { backgroundColor: t.card, borderColor: t.border },
        ]}
        onPress={onBack}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="chevron-left"
          size={24}
          color={t.text}
        />
      </TouchableOpacity>
      <Text style={[s.headerTitle, { color: t.text }]}>
        {title}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontWeight: '700', fontSize: 20 },
});
