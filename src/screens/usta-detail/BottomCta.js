import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { C } from './theme';

export default function BottomCta({ startingPrice, isLoggedIn, onGoToLogin }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[st.bottomBar, { paddingBottom: Math.max(insets.bottom, 14) }]}
    >
      <TouchableOpacity style={st.chatBtn} activeOpacity={0.8}>
        <Ionicons name="chatbubble-outline" size={22} color={C.txt} />
      </TouchableOpacity>
      <TouchableOpacity
        style={st.callBtn}
        activeOpacity={0.85}
        onPress={isLoggedIn ? undefined : onGoToLogin}
      >
        <MaterialCommunityIcons
          name="lightning-bolt"
          size={18}
          color="#fff"
        />
        <Text style={st.callBtnTxt}>Chaqirish · {startingPrice} dan</Text>
      </TouchableOpacity>
    </View>
  );
}

const st = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderColor: C.line2,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  chatBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: C.card3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtn: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: C.orange,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  callBtnTxt: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
