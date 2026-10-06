import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { formatPhone } from '../../utils/format';
// Bitta maydon, ikki ma'no — backend "identifier" shunday qabul qiladi.
// Bo'sh holatda "email yoki telefon" so'raydi; birinchi kiritilgan belgi
// raqam bo'lsa telefon inputiga (prefiks + formatlash bilan), harf/belgi
// bo'lsa email inputiga aylanadi. Maydon butunlay bo'shatilsa, yana boshlang'ich
// holatga qaytadi.
export default function IdentifierInput({
  mode,
  onChangeMode,
  phone,
  onChangePhone,
  email,
  onChangeEmail,
  theme,
  autoFocus,
}) {
  const isDark = !theme || theme.isDark !== false;
  const boxStyle = [
    styles.container,
    {
      backgroundColor: isDark ? '#0a1626' : '#ffffff',
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.10)',
    },
  ];
  const placeholderColor = isDark ? '#6c7f9a' : '#8a97ab';
  const textColor = isDark ? '#fff' : '#0f1117';

  const handleIdleChange = (text) => {
    if (!text) return;
    if (/\d/.test(text[0])) {
      onChangeMode('phone');
      onChangePhone(text.replace(/\D/g, '').slice(0, 9));
    } else {
      onChangeMode('email');
      onChangeEmail(text);
    }
  };

  if (mode === 'phone') {
    return (
      <View style={boxStyle}>
        <View style={styles.prefix}>
          <Text style={styles.flag}>🇺🇿</Text>
          <Text style={[styles.code, { color: textColor }]}>+998</Text>
        </View>
        <View style={[styles.separator, { backgroundColor: isDark ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.10)' }]} />
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder="90 123 45 67"
          placeholderTextColor={placeholderColor}
          keyboardType="phone-pad"
          value={formatPhone(phone)}
          onChangeText={(t) => {
            const digits = t.replace(/\D/g, '').slice(0, 9);
            if (!digits) {
              onChangeMode('idle');
              onChangePhone('');
              return;
            }
            onChangePhone(digits);
          }}
          autoFocus={autoFocus}
          maxLength={12}
        />
      </View>
    );
  }

  if (mode === 'email') {
    return (
      <View style={boxStyle}>
        <Ionicons name="mail-outline" size={19} color={placeholderColor} style={{ marginRight: 10 }} />
        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholder="siz@email.com"
          placeholderTextColor={placeholderColor}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={(t) => {
            if (!t) {
              onChangeMode('idle');
              onChangeEmail('');
              return;
            }
            onChangeEmail(t);
          }}
          autoFocus={autoFocus}
        />
      </View>
    );
  }

  return (
    <View style={boxStyle}>
      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder="Email yoki telefon raqam"
        placeholderTextColor={placeholderColor}
        autoCapitalize="none"
        autoFocus={autoFocus}
        value=""
        onChangeText={handleIdleChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    borderRadius: 16,
    borderWidth: 1.5,
    paddingHorizontal: 15,
  },
  prefix: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingRight: 13,
  },
  flag: { fontSize: 18 },
  code: { fontSize: 15, fontWeight: '700' },
  separator: { width: 1, height: 24, marginRight: 13 },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
    padding: 0,
  },
});
