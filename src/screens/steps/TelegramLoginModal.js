import { Modal, View, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';

// Telegram Login Widget faqat veb sahifada ishlaydi — shu sabab uni WebView
// ichida ochamiz. Widget o'z callback'ini (onTelegramAuth) chaqirganda, biz
// shu ma'lumotni window.ReactNativeWebView.postMessage orqali RN tomonga
// uzatamiz (data maydonlarini o'zgartirmasdan — imzo hammasini qamrab oladi).
function buildHtml(botUsername) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    html, body { margin: 0; height: 100%; background: #0a1626; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  <script>
    function onTelegramAuth(user) {
      window.ReactNativeWebView.postMessage(JSON.stringify(user));
    }
  </script>
  <script async src="https://telegram.org/js/telegram-widget.js?22"
    data-telegram-login="${botUsername}"
    data-size="large"
    data-radius="12"
    data-onauth="onTelegramAuth(user)"
    data-request-access="write"></script>
</body>
</html>`;
}

export default function TelegramLoginModal({ visible, botUsername, loading, onClose, onAuth }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose} transparent>
      <View style={s.overlay}>
        <View style={s.card}>
          <TouchableOpacity style={s.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Ionicons name="close" size={22} color={COLORS.white} />
          </TouchableOpacity>
          {loading || !botUsername ? (
            <View style={s.loadingWrap}>
              <ActivityIndicator size="large" color={COLORS.orange} />
            </View>
          ) : (
            <WebView
              source={{ html: buildHtml(botUsername) }}
              style={s.webview}
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  onAuth(data);
                } catch (e) {
                  console.log('[TelegramLoginModal] callback parse xatolik', e.message);
                }
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    height: 220,
    backgroundColor: COLORS.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  closeBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webview: { flex: 1, backgroundColor: 'transparent' },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
