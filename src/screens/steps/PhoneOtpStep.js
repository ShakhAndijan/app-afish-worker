import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import PhoneInput from '../../components/login/PhoneInput';

export default function PhoneOtpStep({
  phone,
  onChange,
  onContinue,
  loading,
  error,
  onAltLogin,
  onBack,
  onGoogle,
  googleLoading,
  onEmail,
}) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme.isDark !== false;
  const isReady = phone.length === 9 && !loading;

  return (
    <KeyboardAvoidingView
      style={[s.flex, { backgroundColor: theme.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Top bar ── */}
        <View style={s.topBar}>
          <TouchableOpacity
            style={[s.iconBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={onBack}
            activeOpacity={0.75}
          >
            <Feather name="arrow-left" size={20} color={theme.text} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[s.iconBtn, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={toggleTheme}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name="cog-outline"
              size={20}
              color={isDark ? theme.muted : theme.orange}
            />
          </TouchableOpacity>
        </View>

        <View style={s.body}>
          {/* ── Hero ── */}
          <View style={s.hero}>
            <View
              style={[
                s.orb,
                isDark
                  ? { backgroundColor: 'rgba(63,127,212,0.16)' }
                  : { backgroundColor: 'rgba(63,127,212,0.10)' },
              ]}
            />
            <Image
              source={require('../../../assets/afish-logo-vertical-pro.png')}
              style={s.logo}
              resizeMode="contain"
            />
            <Text style={[s.h1, { color: theme.text }]}>Ishni boshlaymizmi?</Text>
            <Text style={[s.sub, { color: theme.muted }]}>
              Telefon raqamingizni kiriting — tasdiqlash kodini yuboramiz.
            </Text>
          </View>

          {/* ── Phone field ── */}
          <View style={s.fieldWrap}>
            <Text style={[s.fieldLabel, { color: theme.muted }]}>Telefon raqami</Text>
            <PhoneInput value={phone} onChangeText={onChange} theme={theme} autoFocus />
          </View>

          {/* ── Error ── */}
          {!!error && (
            <View
              style={[
                s.errorBox,
                {
                  backgroundColor: isDark ? 'rgba(224,71,58,0.13)' : 'rgba(224,71,58,0.08)',
                  borderColor: 'rgba(224,71,58,0.32)',
                },
              ]}
            >
              <MaterialCommunityIcons name="alert-circle" size={18} color={theme.red} />
              <Text style={[s.errorTxt, { color: theme.red }]}>{error}</Text>
            </View>
          )}

          {/* ── Social ── */}
          <View style={s.orWrap}>
            <View style={[s.line, { backgroundColor: theme.border }]} />
            <Text style={[s.orTxt, { color: theme.muted }]}>yoki</Text>
            <View style={[s.line, { backgroundColor: theme.border }]} />
          </View>

          <View style={s.socialRow}>
            <TouchableOpacity
              style={[s.socBtn, { borderColor: theme.border, backgroundColor: isDark ? theme.card : '#fff' }]}
              onPress={googleLoading ? undefined : onGoogle}
              activeOpacity={0.85}
            >
              {googleLoading
                ? <ActivityIndicator size="small" color="#4285F4" />
                : <MaterialCommunityIcons name="google" size={20} color="#4285F4" />
              }
              <Text style={[s.socTxt, { color: isDark ? theme.text : '#1f2937' }]}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.socBtn, { borderColor: theme.border, backgroundColor: theme.card }]}
              onPress={onEmail}
              activeOpacity={0.85}
            >
              <Ionicons name="mail-outline" size={20} color={theme.text} />
              <Text style={[s.socTxt, { color: theme.text }]}>Email</Text>
            </TouchableOpacity>
          </View>

          {/* ── Footer ── */}
          <View style={s.footer}>
            <Text style={[s.terms, { color: theme.muted }]}>
              Davom etish orqali{' '}
              <Text style={{ color: theme.text, fontWeight: '700' }}>Shartlar</Text>
              {' va '}
              <Text style={{ color: theme.text, fontWeight: '700' }}>Maxfiylik siyosati</Text>
              ga rozilik bildirasiz.
            </Text>
            <TouchableOpacity onPress={onAltLogin} activeOpacity={0.7}>
              <Text style={[s.altLink, { color: theme.orange }]}>
                Boshqa yo'l bilan kirish
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* ── CTA (har doim klaviatura ustida ko'rinadi) ── */}
      <View style={[s.ctaFooter, { backgroundColor: theme.bg, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[s.cta, !isReady && s.ctaDisabled]}
          onPress={isReady ? onContinue : undefined}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Text style={[s.ctaTxt, !isReady && s.ctaTxtDisabled]}>Davom etish</Text>
              <Feather name="arrow-right" size={18} color={isReady ? '#fff' : '#7a6253'} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  flex: { flex: 1 },
  scroll: { flexGrow: 1 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 4,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 13,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  body: {
    flex: 1,
    paddingHorizontal: 22,
    paddingBottom: 32,
    gap: 22,
  },

  hero: {
    position: 'relative',
    alignItems: 'center',
    paddingTop: 16,
    gap: 8,
  },
  orb: {
    position: 'absolute',
    top: -20,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  logo: { width: 220, height: 120 },
  h1: {
    fontSize: 27,
    fontWeight: '800',
    letterSpacing: -0.5,
    lineHeight: 34,
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    maxWidth: 300,
  },

  fieldWrap: { gap: 8 },
  fieldLabel: { fontSize: 13, fontWeight: '600' },

  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    borderWidth: 1,
    borderRadius: 13,
    paddingVertical: 11,
    paddingHorizontal: 13,
  },
  errorTxt: { flex: 1, fontSize: 12.5, fontWeight: '600', lineHeight: 17 },

  ctaFooter: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    borderRadius: 15,
    gap: 8,
    backgroundColor: '#e87a45',
    shadowColor: '#e87a45',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 16,
    elevation: 9,
  },
  ctaDisabled: {
    backgroundColor: '#3a2a22',
    shadowOpacity: 0,
    elevation: 0,
  },
  ctaTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
  ctaTxtDisabled: { color: '#7a6253' },

  footer: { gap: 14, alignItems: 'center' },
  terms: { fontSize: 12, textAlign: 'center', lineHeight: 18 },
  altLink: { fontSize: 14, fontWeight: '700' },

  orWrap: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: 1 },
  orTxt: { fontSize: 13 },

  socialRow: { flexDirection: 'row', gap: 12 },
  socBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    gap: 8,
  },
  socTxt: { fontSize: 14, fontWeight: '700' },
});
