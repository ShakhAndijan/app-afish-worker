import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { shared } from './styles';

/* ── Ikkita tugmali jins tanlash ── */
export default function GenderToggle({ genders, selectedId, onSelect, loading, t }) {
  const iconFor = (code) =>
    code === 'female' ? 'gender-female' : code === 'male' ? 'gender-male' : 'account';

  return (
    <View style={{ gap: 8 }}>
      <Text style={[shared.fieldLabel, { color: t.muted }]}>Jinsi</Text>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={t.orange}
          style={{ alignSelf: 'flex-start' }}
        />
      ) : (
        <View style={s.genderRow}>
          {genders.map((g) => {
            const on = g.id === selectedId;
            return (
              <TouchableOpacity
                key={g.id}
                style={[
                  s.genderBtn,
                  {
                    backgroundColor: on ? t.orange : t.inputBg,
                    borderColor: on ? t.orange : t.border,
                  },
                ]}
                activeOpacity={0.8}
                onPress={() => onSelect(g.id)}
              >
                <MaterialCommunityIcons
                  name={iconFor(g.code)}
                  size={17}
                  color={on ? '#fff' : t.muted}
                />
                <Text
                  style={[s.genderBtnText, { color: on ? '#fff' : t.text }]}
                >
                  {g.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  genderRow: { flexDirection: 'row', gap: 10 },
  genderBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 13,
    borderWidth: 1.5,
  },
  genderBtnText: { fontSize: 14, fontWeight: '700' },
});
