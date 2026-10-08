import { View, Text } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { C } from './theme';
import { shared } from './styles';

export default function CertificatesSection({ certs }) {
  return (
    <>
      <Text style={shared.secTitle}>Sertifikatlar</Text>
      {certs.length > 0 ? (
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {certs.map((c, i) => (
            <View key={i} style={[shared.card, { flex: 1, padding: 13 }]}>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 8,
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor: 'rgba(39,165,103,0.14)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <MaterialCommunityIcons
                    name="shield-check"
                    size={18}
                    color={C.green}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontSize: 12.5,
                      fontWeight: '700',
                      color: C.txt,
                      lineHeight: 17,
                    }}
                  >
                    {c.name}
                  </Text>
                  <Text
                    style={{ fontSize: 11, color: C.dim, marginTop: 2 }}
                  >
                    {c.year}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={[shared.card, { padding: 16, alignItems: 'center' }]}>
          <Text style={{ fontSize: 12.5, color: C.dim }}>
            Bu yo'nalish bo'yicha sertifikat yo'q
          </Text>
        </View>
      )}
    </>
  );
}
