import { StyleSheet } from 'react-native';

// Bir nechta komponent birgalikda ishlatadigan stillar.
export const shared = StyleSheet.create({
  fieldLabel: { fontSize: 13, fontWeight: '600' },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 52,
    borderRadius: 13,
    borderWidth: 1.5,
    paddingHorizontal: 14,
  },
  input: { flex: 1, fontSize: 14.5, fontWeight: '500', padding: 0 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(4,8,14,0.55)',
  },
  sheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingBottom: 24,
    maxHeight: '78%',
  },
  grabberRow: { alignItems: 'center', paddingTop: 12, paddingBottom: 4 },
  grabber: { width: 36, height: 4, borderRadius: 2 },
  sheetHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  sheetTitle: { fontSize: 17, fontWeight: '700' },
  sheetCloseBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
