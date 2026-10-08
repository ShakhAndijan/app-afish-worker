import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../constants/colors";

const REQUIREMENTS = [
  "Pasport yoki ID karta",
  "Kamida 1 yillik tajriba (yoki tegishli sertifikat)",
  "Ish uchun zarur asboblar",
  "Faol telefon raqami",
];

export default function RequirementsSection() {
  return (
    <View
      style={{
        marginHorizontal: 16,
        marginBottom: 32,
        backgroundColor: COLORS.card,
        borderRadius: 18,
        padding: 18,
        borderWidth: 1,
        borderColor: COLORS.border,
        gap: 13,
      }}
    >
      {REQUIREMENTS.map((text, i) => (
        <View
          key={i}
          style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
        >
          <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
          <Text style={{ color: COLORS.white, fontSize: 13.5, flex: 1 }}>
            {text}
          </Text>
        </View>
      ))}
    </View>
  );
}
