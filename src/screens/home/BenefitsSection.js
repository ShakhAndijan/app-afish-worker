import { Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../constants/colors";

const BENEFITS_DATA = [
  {
    icon: "wallet",
    color: "#2ecc71",
    title: "Tezkor to'lov",
    desc: "Ishni yakunlagach, to'lov darhol hamyoningizga tushadi.",
  },
  {
    icon: "bullhorn-outline",
    color: "#3b82f6",
    title: "Ko'proq mijozlar",
    desc: "E'loningiz platformadagi minglab mijozlarga ko'rinadi.",
  },
  {
    icon: "clock-time-four",
    color: "#f5b81f",
    title: "Erkin jadval",
    desc: "Qachon va qancha ishlashni o'zingiz belgilaysiz.",
  },
];

export default function BenefitsSection() {
  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 32, gap: 12 }}>
      {BENEFITS_DATA.map((b, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 14,
            backgroundColor: COLORS.card,
            borderRadius: 18,
            padding: 16,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 13,
              backgroundColor: b.color + "22",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <MaterialCommunityIcons name={b.icon} size={24} color={b.color} />
          </View>
          <View style={{ flex: 1, paddingTop: 2 }}>
            <Text
              style={{
                color: COLORS.white,
                fontWeight: "700",
                fontSize: 14.5,
                marginBottom: 4,
              }}
            >
              {b.title}
            </Text>
            <Text style={{ color: COLORS.gray, fontSize: 13, lineHeight: 19 }}>
              {b.desc}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
