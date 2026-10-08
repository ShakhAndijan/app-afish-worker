import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { C } from './theme';
import { shared } from './styles';

export default function ReviewsSection({ reviews, filter, onFilterChange }) {
  return (
    <>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 22,
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 15, fontWeight: '800', color: C.txt }}>
          Sharhlar
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[
            ['all', 'Hammasi'],
            ['photo', 'Fotoli'],
          ].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => onFilterChange(key)}
              style={[
                st.filterChip,
                filter === key && st.filterChipOn,
              ]}
              activeOpacity={0.75}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: '700',
                  color: filter === key ? C.orange : C.txt,
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={{ gap: 12 }}>
        {reviews.map((r, i) => (
          <View key={i} style={[shared.card, { padding: 14 }]}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                }}
              >
                <View style={[st.revAv, { backgroundColor: r.bgColor }]}>
                  <Text style={st.revAvTxt}>{r.initial}</Text>
                </View>
                <View>
                  <Text
                    style={{
                      fontWeight: '700',
                      fontSize: 14,
                      color: C.txt,
                    }}
                  >
                    {r.name}
                  </Text>
                  <Text
                    style={{ fontSize: 11, color: C.dim, marginTop: 1 }}
                  >
                    {r.time}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 2 }}>
                {[...Array(r.rating)].map((_, k) => (
                  <Ionicons key={k} name="star" size={13} color={C.gold} />
                ))}
              </View>
            </View>
            <Text
              style={{
                fontSize: 13.5,
                color: '#c4cdd8',
                marginTop: 10,
                lineHeight: 20,
              }}
            >
              {r.text}
            </Text>
            {r.hasPhoto && (
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                {[0, 1].map((_, k) => (
                  <View key={k} style={st.revPhoto}>
                    <MaterialCommunityIcons
                      name="image-outline"
                      size={22}
                      color={C.dim2}
                    />
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
        {reviews.length === 0 && (
          <View style={[shared.card, { padding: 16, alignItems: 'center' }]}>
            <Text style={{ fontSize: 12.5, color: C.dim }}>
              Bu yo'nalish bo'yicha sharhlar hali yo'q
            </Text>
          </View>
        )}
      </View>
    </>
  );
}

const st = StyleSheet.create({
  filterChip: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipOn: {
    backgroundColor: 'rgba(232,123,62,0.16)',
    borderColor: C.orange,
  },
  revAv: {
    width: 36,
    height: 36,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revAvTxt: { color: '#fff', fontSize: 14, fontWeight: '700' },
  revPhoto: {
    width: 60,
    height: 60,
    borderRadius: 11,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
