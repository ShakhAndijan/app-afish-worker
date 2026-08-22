import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useProfileCompletion } from '../hooks/useProfileCompletion';

// Usta profilini to'ldirish holatini ko'rsatadigan karta — UstaMainScreen
// (Asosiy tab) va UstaProfileScreen'da bir xil ko'rinishda ishlatiladi.
export default function ProfileCompletionCard({ user, theme: t, onPressComplete }) {
  const { checklist, checklistDone, profilePercent, isComplete } = useProfileCompletion(user);

  return (
    <View style={[s.profCard, { backgroundColor: t.card, borderColor: t.border }]}>
      {isComplete ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <MaterialCommunityIcons name="check-decagram" size={22} color={t.green} />
          <Text style={{ flex: 1, fontSize: 13, fontWeight: '700', color: t.text }}>
            Profilingiz to'liq to'ldirilgan
          </Text>
        </View>
      ) : (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: t.text }}>
              Profilingiz {profilePercent}% to'ldirilgan
            </Text>
            <View style={[s.profBadge, { backgroundColor: t.orange }]}>
              <Text style={s.profBadgeTxt}>{profilePercent}%</Text>
            </View>
          </View>
          <View style={[s.profTrack, { backgroundColor: t.rowIconBg }]}>
            <View
              style={[s.profFill, { width: `${profilePercent}%`, backgroundColor: t.orange }]}
            />
          </View>
          <Text style={{ fontSize: 11.5, color: t.muted, marginTop: 10, lineHeight: 17 }}>
            Buyurtma qabul qilishni boshlash uchun quyidagi ma'lumotlarni to'ldiring —
            mijozlar aynan shu profil orqali sizni topadi va bog'lanadi.
          </Text>
          <View style={{ marginTop: 12, gap: 8 }}>
            {checklist.map((item) => {
              const done = checklistDone[item.key];
              return (
                <View
                  key={item.key}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
                >
                  <Ionicons
                    name={done ? 'checkmark-circle' : 'ellipse-outline'}
                    size={16}
                    color={done ? t.green : t.faint}
                  />
                  <Text
                    style={{
                      fontSize: 12.5,
                      color: done ? t.text : t.muted,
                      fontWeight: done ? '600' : '400',
                    }}
                  >
                    {item.label}
                  </Text>
                </View>
              );
            })}
          </View>
          <TouchableOpacity
            style={[s.profBtn, { backgroundColor: t.orange }]}
            activeOpacity={0.85}
            onPress={onPressComplete}
          >
            <Text style={s.profBtnTxt}>Profilni to'ldirish</Text>
            <Ionicons name="arrow-forward" size={15} color="#fff" />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  profCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
  },
  profBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
  },
  profBadgeTxt: { fontSize: 11.5, fontWeight: '800', color: '#fff' },
  profTrack: {
    height: 7,
    borderRadius: 4,
    overflow: 'hidden',
  },
  profFill: {
    height: '100%',
    borderRadius: 4,
  },
  profBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    height: 44,
    borderRadius: 13,
    marginTop: 14,
  },
  profBtnTxt: { color: '#fff', fontWeight: '700', fontSize: 13 },
});
