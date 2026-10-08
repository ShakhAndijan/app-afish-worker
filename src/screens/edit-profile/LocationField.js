import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { shared } from './styles';

/* ── GPS joylashuvni aniqlash tugmasi ── */
export default function LocationField({ lat, lng, locating, onLocate, t }) {
  const hasCoords = lat != null && lat !== '' && lng != null && lng !== '';
  return (
    <View style={{ gap: 8 }}>
      <Text style={[shared.fieldLabel, { color: t.muted }]}>Joylashuv (GPS)</Text>
      <TouchableOpacity
        style={[
          s.locateBtn,
          { backgroundColor: t.inputBg, borderColor: t.border },
        ]}
        onPress={onLocate}
        activeOpacity={0.7}
        disabled={locating}
      >
        <Feather name="navigation" size={16} color={t.orange} />
        <Text
          style={[s.locateBtnText, { color: t.text }]}
          numberOfLines={1}
        >
          {locating
            ? 'Aniqlanmoqda...'
            : hasCoords
            ? `${Number(lat).toFixed(5)}, ${Number(lng).toFixed(5)}`
            : 'Joriy joylashuvni aniqlash'}
        </Text>
        {locating && <ActivityIndicator size="small" color={t.orange} />}
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  locateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 52,
    borderRadius: 13,
    borderWidth: 1.5,
    paddingHorizontal: 14,
  },
  locateBtnText: { flex: 1, fontSize: 13.5, fontWeight: '600' },
});
