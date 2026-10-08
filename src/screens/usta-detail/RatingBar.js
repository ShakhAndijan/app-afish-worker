import { View, Text } from 'react-native';
import { C } from './theme';

export default function RatingBar({ label, pct }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Text
        style={{
          width: 28,
          color: C.dim,
          fontSize: 12,
          fontWeight: '700',
          textAlign: 'right',
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flex: 1,
          height: 7,
          borderRadius: 9,
          backgroundColor: C.card3,
          overflow: 'hidden',
        }}
      >
        {pct > 0 && (
          <View
            style={{
              width: pct + '%',
              height: 7,
              borderRadius: 9,
              backgroundColor: C.gold,
            }}
          />
        )}
      </View>
      <Text
        style={{
          width: 30,
          color: C.dim,
          fontSize: 12,
          fontWeight: '600',
          textAlign: 'right',
        }}
      >
        {pct}%
      </Text>
    </View>
  );
}
