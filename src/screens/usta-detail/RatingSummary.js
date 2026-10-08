import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { C } from './theme';
import { shared } from './styles';
import RatingBar from './RatingBar';

export default function RatingSummary({ ratingValue, ratingCount, bars }) {
  return (
    <>
      <Text style={[shared.secTitle, { marginTop: 22 }]}>Reyting</Text>
      <View style={shared.card}>
        <View
          style={{
            flexDirection: 'row',
            gap: 18,
            alignItems: 'center',
            padding: 16,
          }}
        >
          <View style={{ alignItems: 'center', minWidth: 68 }}>
            <Text
              style={{
                fontSize: 38,
                fontWeight: '800',
                color: C.txt,
                lineHeight: 42,
              }}
            >
              {ratingValue}
            </Text>
            <View style={{ flexDirection: 'row', gap: 2, marginTop: 6 }}>
              {[...Array(5)].map((_, k) => (
                <Ionicons key={k} name="star" size={13} color={C.gold} />
              ))}
            </View>
            <Text style={{ fontSize: 11.5, color: C.dim, marginTop: 5 }}>
              {ratingCount} sharh
            </Text>
          </View>
          <View style={{ flex: 1, gap: 7 }}>
            {bars.map((b, i) => (
              <RatingBar key={i} label={b.label} pct={b.pct} />
            ))}
          </View>
        </View>
      </View>
    </>
  );
}
