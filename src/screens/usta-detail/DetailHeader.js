import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Share } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { C } from './theme';

export default function DetailHeader({ name, trade, rating, onBack, isLoggedIn }) {
  const [liked, setLiked] = useState(false);

  return (
    <View style={st.header}>
      <TouchableOpacity
        onPress={onBack}
        style={st.iconBtn}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={22} color={C.txt} />
      </TouchableOpacity>
      <Text style={st.headerTitle}>Usta profili</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity
          style={st.iconBtn}
          activeOpacity={0.7}
          onPress={() =>
            Share.share({
              message: `${name} — ${trade} ustasi, reyting ${rating} ★. Ilovada ko'ring!`,
            }).catch(() => {})
          }
        >
          <Feather name="share-2" size={18} color={C.txt} />
        </TouchableOpacity>
        {isLoggedIn && (
          <TouchableOpacity
            style={st.iconBtn}
            activeOpacity={0.7}
            onPress={() => setLiked((v) => !v)}
          >
            <Ionicons
              name={liked ? 'heart' : 'heart-outline'}
              size={20}
              color={liked ? C.orange : C.txt}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.card3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { color: C.txt, fontSize: 17, fontWeight: '700' },
});
