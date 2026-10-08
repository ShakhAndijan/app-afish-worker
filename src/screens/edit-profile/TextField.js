import { View, Text, TextInput, StyleSheet } from 'react-native';
import { shared } from './styles';

/* ── Text / textarea field ── */
export default function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  t,
  keyboardType,
  multiline,
  maxLength,
}) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={[shared.fieldLabel, { color: t.muted }]}>{label}</Text>
      <View
        style={[
          shared.inputWrap,
          multiline && s.inputWrapMultiline,
          { backgroundColor: t.inputBg, borderColor: t.border },
        ]}
      >
        <TextInput
          style={[shared.input, multiline && s.inputMultiline, { color: t.text }]}
          placeholder={placeholder}
          placeholderTextColor={t.faint}
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || 'default'}
          multiline={multiline}
          maxLength={maxLength}
          textAlignVertical={multiline ? 'top' : 'center'}
        />
      </View>
      {maxLength ? (
        <Text style={[s.counter, { color: t.faint }]}>
          {(value || '').length}/{maxLength}
        </Text>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  inputWrapMultiline: {
    height: 96,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  inputMultiline: { height: '100%' },
  counter: { fontSize: 11, textAlign: 'right' },
});
