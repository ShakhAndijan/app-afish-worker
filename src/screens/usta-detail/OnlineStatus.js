import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { C } from './theme';

export default function OnlineStatus() {
  return (
    <View
      style={[
        st.card2,
        {
          marginTop: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 12,
          paddingHorizontal: 15,
        },
      ]}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
      >
        <View
          style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: C.green,
          }}
        />
        <Text
          style={{ fontSize: 13.5, fontWeight: '700', color: C.green }}
        >
          Hozir onlayn
        </Text>
      </View>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}
      >
        <Ionicons name="time-outline" size={14} color={C.dim} />
        <Text style={{ fontSize: 12.5, color: C.dim }}>
          ~5 daqiqada javob beradi
        </Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  card2: {
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 16,
  },
});
