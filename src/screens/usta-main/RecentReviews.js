import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Avatar from '../../components/Avatar';
import SectionHeader from '../../components/SectionHeader';
import { MY_WORKS, MY_REVIEWS } from './data';

export default function RecentReviews({ t, onSelect }) {
  return (
    <>
      {/* ── So'nggi sharhlar ── */}
      <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
        <SectionHeader theme={t} title="So'nggi sharhlar" />
        <View style={{ gap: 10 }}>
          {MY_REVIEWS.map((r, i) => {
            const avatarColor = [t.blue, t.violet, t.green][i % 3];
            const linkedWork = MY_WORKS.find((w) => w.id === r.workId);
            return (
              <TouchableOpacity
                key={r.id}
                style={[s.reviewCard, { backgroundColor: t.card, borderColor: t.border }]}
                activeOpacity={0.75}
                onPress={() => onSelect(r)}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Avatar letter={r.name.charAt(0)} bgColor={avatarColor} size={34} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: t.text }}>
                      {r.name}
                    </Text>
                    <Text style={{ fontSize: 10.5, color: t.muted, marginTop: 1 }}>
                      {r.time}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 1 }}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Ionicons
                        key={j}
                        name="star"
                        size={12}
                        color={j < r.rating ? t.gold : t.border}
                      />
                    ))}
                  </View>
                </View>
                <Text
                  style={{ fontSize: 12.5, color: t.muted, marginTop: 9, lineHeight: 18 }}
                  numberOfLines={3}
                >
                  {r.text}
                </Text>
                {linkedWork && (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 10,
                      paddingTop: 10,
                      borderTopWidth: 1,
                      borderTopColor: t.border,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1 }}>
                      <MaterialCommunityIcons
                        name={linkedWork.icon}
                        size={13}
                        color={linkedWork.color}
                      />
                      <Text
                        style={{ fontSize: 11, fontWeight: '600', color: t.muted, flex: 1 }}
                        numberOfLines={1}
                      >
                        {linkedWork.title}
                      </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={15} color={t.faint} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  reviewCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
  },
});
