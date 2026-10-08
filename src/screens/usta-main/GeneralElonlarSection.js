import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SectionHeader from '../../components/SectionHeader';

const GENERAL_CARD_W = 210;
const GENERAL_GAP = 12;

export default function GeneralElonlarSection({ t, elonlar, onOpenAll }) {
  const preview = elonlar.slice(0, 10);
  if (!preview.length) return null;

  return (
    <View style={{ marginTop: 26 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <SectionHeader theme={t} title="Yangi e'lonlar" action="Hammasi" onPress={onOpenAll} />
        <Text style={{ fontSize: 11.5, color: t.muted, marginTop: -6, marginBottom: 10 }}>
          Kategoriyangiz bo'yicha barcha ustalarga ochiq e'lonlar
        </Text>
      </View>
      <FlatList
        data={preview}
        keyExtractor={(e) => String(e.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: GENERAL_GAP }}
        renderItem={({ item: e }) => (
          <TouchableOpacity
            style={[
              s.generalCard,
              { width: GENERAL_CARD_W, backgroundColor: t.card, borderColor: t.border },
            ]}
            activeOpacity={0.85}
            onPress={onOpenAll}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <MaterialCommunityIcons name={e.icon} size={14} color={e.color} />
              <Text
                style={{ fontSize: 11, fontWeight: '700', color: e.color, flex: 1 }}
                numberOfLines={1}
              >
                {e.category}
              </Text>
              <Text style={{ fontSize: 10, color: t.faint }}>{e.postedAgo}</Text>
            </View>
            <Text
              style={{ fontSize: 13, fontWeight: '700', color: t.text, marginTop: 8 }}
              numberOfLines={1}
            >
              {e.title}
            </Text>
            <Text
              style={{ fontSize: 11.5, color: t.muted, marginTop: 3, lineHeight: 16 }}
              numberOfLines={2}
            >
              {e.description}
            </Text>
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
              <Text style={{ fontSize: 10.5, color: t.faint, flex: 1 }} numberOfLines={1}>
                {e.address}
              </Text>
              <Text style={{ fontSize: 12, fontWeight: '800', color: t.orange }}>
                {e.budget} so'm
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  generalCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
  },
});
