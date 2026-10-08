import { View, Text } from 'react-native';
import { C } from './theme';

export default function BadgesRow() {
  return (
    <View
      style={{
        flexDirection: 'row',
        gap: 8,
        marginTop: 12,
        flexWrap: 'wrap',
      }}
    >
      {[
        {
          emoji: '🏆',
          label: 'Top 5%',
          bg: 'rgba(240,180,41,0.14)',
          color: C.gold,
        },
        {
          emoji: '⚡',
          label: 'Tezkor',
          bg: 'rgba(61,130,212,0.14)',
          color: C.blue,
        },
        {
          emoji: '🛡',
          label: 'Kafolatli',
          bg: 'rgba(39,165,103,0.14)',
          color: C.green,
        },
      ].map((b, i) => (
        <View
          key={i}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            backgroundColor: b.bg,
            paddingHorizontal: 11,
            paddingVertical: 7,
            borderRadius: 10,
          }}
        >
          <Text style={{ fontSize: 13 }}>{b.emoji}</Text>
          <Text
            style={{ fontSize: 12.5, fontWeight: '800', color: b.color }}
          >
            {b.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
