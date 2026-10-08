import { useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import SectionHeader from '../../components/SectionHeader';
import { MY_WORKS } from './data';

const WORK_CARD_W = 150;
const WORK_GAP = 12;
const WORK_SLOT = WORK_CARD_W + WORK_GAP;

export default function RecentWorksSection({ t, onSelect }) {
  const flatListRef = useRef(null);
  const indexRef = useRef(0);
  const autoScroll = MY_WORKS.length > 3;

  useEffect(() => {
    if (!autoScroll) return;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % MY_WORKS.length;
      indexRef.current = next;
      flatListRef.current?.scrollToOffset({
        offset: next * WORK_SLOT,
        animated: true,
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [autoScroll]);

  return (
    <View style={{ marginTop: 26 }}>
      <View style={{ paddingHorizontal: 20 }}>
        <SectionHeader theme={t} title="Oxirgi bajarilgan ishlar" />
      </View>
      <FlatList
        ref={flatListRef}
        data={MY_WORKS}
        keyExtractor={(w) => String(w.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={WORK_SLOT}
        decelerationRate="fast"
        contentContainerStyle={{ paddingHorizontal: 20, gap: WORK_GAP }}
        renderItem={({ item: w }) => (
          <TouchableOpacity
            style={[s.workCard, { backgroundColor: t.card, borderColor: t.border }]}
            activeOpacity={0.85}
            onPress={() => onSelect?.(w)}
          >
            <View style={[s.workImg, { backgroundColor: t.rowIconBg }]}>
              <MaterialCommunityIcons name="image-outline" size={30} color={t.faint} />
              <View style={s.workRating}>
                <Ionicons name="star" size={11} color={t.gold} />
                <Text
                  style={{
                    fontSize: 11,
                    fontWeight: '700',
                    color: t.gold,
                    marginLeft: 3,
                  }}
                >
                  {w.rating.toFixed(1)}
                </Text>
              </View>
            </View>
            <View style={{ padding: 12 }}>
              <Text
                style={{ fontWeight: '700', fontSize: 13, color: t.text }}
                numberOfLines={1}
              >
                {w.title}
              </Text>
              <Text
                style={{ fontSize: 11, color: t.muted, marginTop: 3 }}
                numberOfLines={1}
              >
                {w.client.name}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  workCard: {
    width: 150,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  workImg: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workRating: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10,19,34,0.7)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 999,
  },
});
