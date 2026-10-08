import { StyleSheet } from 'react-native';
import { C } from './theme';

// Bir nechta bo'limda birgalikda ishlatiladigan stillar.
export const shared = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 18,
  },
  secTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: C.txt,
    marginTop: 22,
    marginBottom: 11,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.line,
  },
  chipActive: {
    backgroundColor: 'rgba(232,123,62,0.16)',
    borderColor: C.orange,
  },
});
