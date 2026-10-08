import { View, Text, TouchableOpacity } from 'react-native';
import { C } from './theme';
import { shared } from './styles';

export default function SpecializationChips({ specs, selectedSpec, onSelect }) {
  return (
    <>
      <Text style={shared.secTitle}>Mutaxassislik</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        <TouchableOpacity
          style={[shared.chip, !selectedSpec && shared.chipActive]}
          onPress={() => onSelect(null)}
          activeOpacity={0.8}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: '700',
              color: !selectedSpec ? C.orange : C.txt,
            }}
          >
            Barchasi
          </Text>
        </TouchableOpacity>
        {specs.map((s, i) => (
          <TouchableOpacity
            key={i}
            style={[shared.chip, selectedSpec === s && shared.chipActive]}
            onPress={() => onSelect(s)}
            activeOpacity={0.8}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '700',
                color: selectedSpec === s ? C.orange : C.txt,
              }}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}
