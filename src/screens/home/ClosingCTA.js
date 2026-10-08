import { Text, View, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { COLORS } from "../../constants/colors";

export default function ClosingCTA({ onPress }) {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 24,
        backgroundColor: COLORS.card,
        borderRadius: 22,
        padding: 24,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: 220,
          height: 180,
          backgroundColor: "rgba(232,122,69,0.10)",
          borderRadius: 110,
        }}
      />
      <Text
        style={{
          color: COLORS.white,
          fontWeight: "800",
          fontSize: 20,
          marginBottom: 8,
          textAlign: "center",
          lineHeight: 27,
        }}
      >
        Bugun ustalar oilasiga qo'shiling
      </Text>
      <Text
        style={{
          color: COLORS.gray,
          fontSize: 13.5,
          textAlign: "center",
          marginBottom: 20,
          lineHeight: 20,
        }}
      >
        Ro'yxatdan o'ting va birinchi e'loningizni joylashtiring.
      </Text>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: COLORS.orange,
          borderRadius: 14,
          paddingVertical: 14,
          gap: 8,
          width: "100%",
        }}
      >
        <Feather name="user-plus" size={18} color="#fff" />
        <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
          Kirish / Ro'yxatdan o'tish
        </Text>
      </TouchableOpacity>
    </View>
  );
}
