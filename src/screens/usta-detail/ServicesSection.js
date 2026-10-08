import { View, Text, StyleSheet } from 'react-native';
import { C } from './theme';
import { shared } from './styles';

export default function ServicesSection({ services }) {
  return (
    <>
      <Text style={shared.secTitle}>Xizmatlar narxi</Text>
      {services.length > 0 ? (
        <View style={shared.card}>
          {services.map((svc, i) => (
            <View
              key={i}
              style={[
                st.svcRow,
                i < services.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: C.line,
                },
              ]}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: C.txt,
                  flex: 1,
                  marginRight: 8,
                }}
              >
                {svc.name}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'baseline',
                  gap: 2,
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: '800', color: C.txt }}
                >
                  {svc.price}
                </Text>
                <Text style={{ fontSize: 11.5, color: C.dim }}>
                  {' '}
                  so'm dan
                </Text>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={[shared.card, { padding: 16, alignItems: 'center' }]}>
          <Text style={{ fontSize: 12.5, color: C.dim }}>
            Bu yo'nalish bo'yicha xizmatlar hali qo'shilmagan
          </Text>
        </View>
      )}
    </>
  );
}

const st = StyleSheet.create({
  svcRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
});
