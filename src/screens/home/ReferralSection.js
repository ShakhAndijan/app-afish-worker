import { Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../constants/colors";

export default function ReferralSection() {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 32,
        backgroundColor: COLORS.card,
        borderRadius: 22,
        padding: 22,
        borderWidth: 1,
        borderColor: COLORS.border,
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
      }}
    >
      <View
        style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          backgroundColor: COLORS.orange + "22",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <MaterialCommunityIcons
          name="gift-outline"
          size={26}
          color={COLORS.orange}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: COLORS.white,
            fontWeight: "700",
            fontSize: 15,
            marginBottom: 4,
          }}
        >
          Do'stingizni taklif qiling
        </Text>
        <Text style={{ color: COLORS.gray, fontSize: 12.5, lineHeight: 18 }}>
          Har bir taklif qilingan va faollashgan usta uchun bonus qo'lga
          kiriting.
        </Text>
      </View>
    </View>
  );
}
