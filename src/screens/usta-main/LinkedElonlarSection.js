import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import Avatar from '../../components/Avatar';
import SectionHeader from '../../components/SectionHeader';

export default function LinkedElonlarSection({ t, elonlar, onOpen }) {
  if (!elonlar.length) return null;

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 26 }}>
      <SectionHeader theme={t} title="Sizga tegishli e'lonlar" />

      <View
        style={[
          s.exclusiveBanner,
          {
            backgroundColor: 'rgba(232,122,69,0.12)',
            borderColor: 'rgba(232,122,69,0.35)',
          },
        ]}
      >
        <Ionicons name="lock-closed" size={14} color={t.orange} />
        <Text
          style={{
            flex: 1,
            fontSize: 11,
            fontWeight: '600',
            color: t.orange,
            marginLeft: 8,
            lineHeight: 15,
          }}
        >
          Bu mijozlar faqat sizga bog'langan — ular boshqa ustaga buyurtma bera olmaydi.
        </Text>
      </View>

      <View style={{ gap: 10, marginTop: 12 }}>
        {elonlar.map((e) => (
          <TouchableOpacity
            key={e.id}
            style={[s.elonCard, { backgroundColor: t.card, borderColor: t.border }]}
            activeOpacity={0.8}
            onPress={() => onOpen(e)}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Avatar letter={e.client.initial} bgColor={e.client.color} size={36} />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text
                    style={{ fontSize: 13.5, fontWeight: '700', color: t.text }}
                    numberOfLines={1}
                  >
                    {e.client.name}
                  </Text>
                  <View style={[s.exclusiveTag, { backgroundColor: t.rowIconBg }]}>
                    <Ionicons name="lock-closed" size={9} color={t.orange} />
                    <Text
                      style={{ fontSize: 9.5, fontWeight: '700', color: t.orange, marginLeft: 3 }}
                    >
                      Faqat sizga
                    </Text>
                  </View>
                </View>
                <Text style={{ fontSize: 11, color: t.muted, marginTop: 2 }}>
                  {e.postedAgo}
                  {e.isNewClient ? ' • Yangi mijoz' : ''}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 }}>
              <MaterialCommunityIcons name={e.icon} size={14} color={e.color} />
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: e.color }}>
                {e.category}
              </Text>
            </View>
            <Text
              style={{ fontSize: 13, fontWeight: '700', color: t.text, marginTop: 6 }}
              numberOfLines={1}
            >
              {e.title}
            </Text>
            <Text
              style={{ fontSize: 12, color: t.muted, marginTop: 3, lineHeight: 17 }}
              numberOfLines={2}
            >
              {e.description}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 10,
                paddingTop: 10,
                borderTopWidth: 1,
                borderTopColor: t.border,
              }}
            >
              <Text style={{ fontSize: 11, color: t.faint, flex: 1 }} numberOfLines={1}>
                {e.address}
              </Text>
              <Text style={{ fontSize: 12.5, fontWeight: '800', color: t.orange }}>
                {e.budget} so'm
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  exclusiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginTop: 10,
  },
  exclusiveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
  },
  elonCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
  },
});
