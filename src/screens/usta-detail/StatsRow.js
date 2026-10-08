import { View, Text } from 'react-native';
import { C } from './theme';
import { shared } from './styles';

export default function StatsRow({ jobs, experience, repeatRate }) {
  return (
    <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
      {[
        [jobs, 'Bajarilgan'],
        [experience, 'Tajriba'],
        [repeatRate, 'Qayta chaqiruv'],
      ].map(([v, l], i) => (
        <View
          key={i}
          style={[
            shared.card,
            { flex: 1, alignItems: 'center', paddingVertical: 13 },
          ]}
        >
          <Text style={{ fontSize: 17, fontWeight: '800', color: C.txt }}>
            {v}
          </Text>
          <Text
            style={{
              fontSize: 11.5,
              color: C.dim,
              marginTop: 2,
              textAlign: 'center',
            }}
          >
            {l}
          </Text>
        </View>
      ))}
    </View>
  );
}
