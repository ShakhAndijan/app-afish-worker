import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import SectionHeader from '../../components/SectionHeader';
import { STATS } from './data';
import { shared } from './styles';

export default function ActivityStats({ t }) {
  return (
    <>
      {/* ── Ish faoliyati ── */}
      <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
        <SectionHeader theme={t} title="Ish faoliyati" />
      </View>
      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 20,
          gap: 10,
        }}
      >
        {STATS.map((st) => (
          <View
            key={st.key}
            style={[
              shared.miniCard,
              {
                flex: 1,
                alignItems: 'center',
                paddingVertical: 14,
                paddingHorizontal: 8,
                backgroundColor: t.card,
                borderColor: t.border,
              },
            ]}
          >
            <Ionicons name={st.icon} size={19} color={t[st.colorKey]} />
            <Text
              style={{
                fontWeight: '800',
                fontSize: 17,
                color: t.text,
                marginTop: 8,
              }}
            >
              {st.value}
            </Text>
            <Text
              style={{
                fontSize: 10,
                color: t.muted,
                marginTop: 3,
                textAlign: 'center',
              }}
            >
              {st.label}
            </Text>
          </View>
        ))}
      </View>
    </>
  );
}
