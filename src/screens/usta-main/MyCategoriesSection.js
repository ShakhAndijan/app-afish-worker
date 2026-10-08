import { useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import SectionHeader from '../../components/SectionHeader';

const CAT_CARD_W = 132;
const CAT_GAP = 10;
const CAT_SLOT = CAT_CARD_W + CAT_GAP;

export default function MyCategoriesSection({ t, categories, onSelect }) {
  const flatListRef = useRef(null);
  const indexRef = useRef(0);
  const autoScroll = categories.length > 3;

  useEffect(() => {
    if (!autoScroll) return;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % categories.length;
      indexRef.current = next;
      flatListRef.current?.scrollToOffset({
        offset: next * CAT_SLOT,
        animated: true,
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [autoScroll, categories.length]);

  return (
    <View style={{ marginTop: 26 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <SectionHeader theme={t} title="Mening kategoriyalarim" />
      </View>
      <FlatList
        ref={flatListRef}
        data={categories}
        keyExtractor={(c) => String(c.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CAT_SLOT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20, gap: CAT_GAP }}
        renderItem={({ item: c }) => (
          <TouchableOpacity
            style={[
              s.catCard,
              {
                backgroundColor: t.card,
                borderColor: c.isPrimary ? t.orange : t.border,
              },
            ]}
            activeOpacity={0.8}
            onPress={() => onSelect?.(c)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View
                style={[
                  s.catIconBox,
                  { backgroundColor: c.isPrimary ? t.orange : t.rowIconBg },
                ]}
              >
                <MaterialCommunityIcons
                  name={c.icon}
                  size={20}
                  color={c.isPrimary ? '#fff' : t.orange}
                />
              </View>
              <Ionicons name="chevron-forward" size={15} color={t.faint} />
            </View>
            <Text
              style={{ fontSize: 12.5, fontWeight: '700', color: t.text }}
              numberOfLines={1}
            >
              {c.name}
            </Text>
            <Text style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>
              {c.price} so'mdan
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  catCard: {
    width: 132,
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 13,
  },
  catIconBox: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },
});
