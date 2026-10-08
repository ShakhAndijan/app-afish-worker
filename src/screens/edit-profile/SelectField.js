import { View, Text, TouchableOpacity } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { shared } from './styles';

/* ── Tappable field that opens a picker sheet ── */
export default function SelectField({ label, value, placeholder, onPress, t, disabled }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={[shared.fieldLabel, { color: t.muted }]}>{label}</Text>
      <TouchableOpacity
        style={[
          shared.inputWrap,
          {
            backgroundColor: t.inputBg,
            borderColor: t.border,
            opacity: disabled ? 0.5 : 1,
          },
        ]}
        onPress={disabled ? undefined : onPress}
        activeOpacity={0.7}
      >
        <Text
          style={[shared.input, { color: value ? t.text : t.faint }]}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={18}
          color={t.faint}
        />
      </TouchableOpacity>
    </View>
  );
}
