import { View, Text, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, FlatList, ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { shared } from './styles';

/* ── Generic single-select bottom sheet (gender / region / district) ── */
export default function OptionSheet({
  visible,
  onClose,
  title,
  options,
  selectedId,
  onSelect,
  t,
  loading,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={shared.overlay} />
      </TouchableWithoutFeedback>

      <View
        style={[shared.sheet, { backgroundColor: t.card, borderColor: t.border }]}
      >
        <View style={shared.grabberRow}>
          <View style={[shared.grabber, { backgroundColor: t.border }]} />
        </View>
        <View style={shared.sheetHeaderRow}>
          <Text style={[shared.sheetTitle, { color: t.text }]}>{title}</Text>
          <TouchableOpacity
            style={[shared.sheetCloseBtn, { backgroundColor: t.rowIconBg }]}
            onPress={onClose}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="close" size={16} color={t.muted} />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator
            size="small"
            color={t.orange}
            style={{ marginVertical: 30 }}
          />
        ) : options.length === 0 ? (
          <Text style={[s.sheetEmpty, { color: t.muted }]}>
            Ma'lumot topilmadi
          </Text>
        ) : (
          <FlatList
            data={options}
            keyExtractor={(item) => String(item.id)}
            style={{ maxHeight: 380 }}
            contentContainerStyle={{ paddingBottom: 12 }}
            ItemSeparatorComponent={() => (
              <View style={[s.sheetDivider, { backgroundColor: t.border }]} />
            )}
            renderItem={({ item }) => {
              const on = item.id === selectedId;
              return (
                <TouchableOpacity
                  style={s.sheetRow}
                  activeOpacity={0.7}
                  onPress={() => {
                    onSelect(item);
                    onClose();
                  }}
                >
                  <Text style={[s.sheetRowText, { color: t.text }]}>
                    {item.name}
                  </Text>
                  {on && (
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={19}
                      color={t.orange}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        )}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  sheetEmpty: { textAlign: 'center', paddingVertical: 30, fontSize: 13 },
  sheetDivider: { height: 1, marginHorizontal: 20 },
  sheetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sheetRowText: { fontSize: 15, fontWeight: '600' },
});
