import { View, Text, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { C } from './theme';

export default function UstaHero({ initial, bgColor, name, trade, location, rating, reviewCount }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 14,
        marginTop: 14,
        alignItems: 'center',
      }}
    >
      <View style={[st.avatar, { backgroundColor: bgColor }]}>
        <Text style={st.avatarTxt}>{initial}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          <Text style={{ fontSize: 19, fontWeight: '800', color: C.txt }}>
            {name}
          </Text>
          <MaterialCommunityIcons
            name="shield-check"
            size={18}
            color={C.green}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
            marginTop: 3,
          }}
        >
          <Ionicons name="location-outline" size={13} color={C.dim} />
          <Text style={{ fontSize: 13, color: C.dim }} numberOfLines={1}>
            {trade} · {location} · 1.2 km
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
            marginTop: 7,
          }}
        >
          <View style={st.ratingBadge}>
            <Ionicons name="star" size={13} color={C.gold} />
            <Text
              style={{ color: C.gold, fontSize: 12, fontWeight: '800' }}
            >
              {rating}
            </Text>
          </View>
          <Text style={{ fontSize: 12.5, color: C.dim }}>
            · {reviewCount} ta sharh
          </Text>
        </View>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarTxt: { color: '#fff', fontSize: 26, fontWeight: '800' },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(240,180,41,0.15)',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
});
