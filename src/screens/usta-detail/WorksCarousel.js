import { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { C } from './theme';

const CARD_W = 148;
const CARD_GAP = 10;
const CARD_SLOT = CARD_W + CARD_GAP;

export default function WorksCarousel({ works }) {
  const listRef = useRef(null);
  const idxRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (works.length === 0) return;
    const t = setInterval(() => {
      const next = (idxRef.current + 1) % works.length;
      idxRef.current = next;
      setActive(next);
      listRef.current?.scrollToOffset({
        offset: next * CARD_SLOT,
        animated: true,
      });
    }, 2200);
    return () => clearInterval(t);
  }, [works.length]);

  return (
    <View>
      <FlatList
        ref={listRef}
        data={works}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_SLOT}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingLeft: 20,
          paddingRight: 10,
          gap: CARD_GAP,
        }}
        renderItem={({ item }) => (
          <TouchableOpacity style={st.workCard} activeOpacity={0.85}>
            <View style={[st.workImg, { backgroundColor: item.color + '22' }]}>
              <MaterialCommunityIcons
                name={item.icon}
                size={44}
                color={item.color + 'bb'}
              />
              <View style={st.workBadge}>
                <Ionicons name="star" size={11} color={C.gold} />
                <Text style={st.workBadgeTxt}>{item.rating.toFixed(1)}</Text>
              </View>
            </View>
            <View style={{ padding: 10 }}>
              <Text style={st.workTitle} numberOfLines={2}>
                {item.title}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <View style={st.dots}>
        {works.map((_, i) => (
          <View key={i} style={[st.dot, i === active && st.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  workCard: {
    width: CARD_W,
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.line,
    overflow: 'hidden',
  },
  workImg: { height: 110, alignItems: 'center', justifyContent: 'center' },
  workBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(10,19,34,0.72)',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  workBadgeTxt: { color: '#fff', fontSize: 11, fontWeight: '700' },
  workTitle: {
    color: C.txt,
    fontSize: 12.5,
    fontWeight: '600',
    lineHeight: 17,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
    gap: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.card3 },
  dotActive: { width: 18, backgroundColor: C.orange },
});
