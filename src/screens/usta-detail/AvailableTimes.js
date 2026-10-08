import { View, Text } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { C } from './theme';
import { shared } from './styles';

export default function AvailableTimes({ times }) {
  return (
    <>
      <Text style={shared.secTitle}>Bo'sh vaqtlar</Text>
      {times.length > 0 ? (
        <View
          style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}
        >
          {times.map((tm, i) => (
            <View key={i} style={[shared.chip, i === 0 && shared.chipActive]}>
              <Ionicons
                name="time-outline"
                size={14}
                color={i === 0 ? C.orange : C.dim}
              />
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '700',
                  color: i === 0 ? C.orange : C.txt,
                }}
              >
                {tm.label}
              </Text>
            </View>
          ))}
        </View>
      ) : (
        <Text style={{ fontSize: 12.5, color: C.dim }}>
          Bu yo'nalish bo'yicha bo'sh vaqt yo'q
        </Text>
      )}
    </>
  );
}
