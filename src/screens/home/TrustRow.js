import { Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../constants/colors";

const TRUST_ITEMS = [
  { icon: "wallet", color: "#2ecc71", label: "Tezkor to'lov" },
  { icon: "briefcase-check", color: "#3b82f6", label: "Ko'p buyurtma" },
  {
    icon: "lightning-bolt",
    color: "#f5b81f",
    label: "24/7 qo'llab-quvvatlash",
  },
];

export default function TrustRow() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        gap: 10,
        marginBottom: 10,
        paddingHorizontal: 16,
      }}
    >
      {TRUST_ITEMS.map((item, i) => (
        <View
          key={i}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
            backgroundColor: COLORS.card,
            paddingHorizontal: 13,
            paddingVertical: 9,
            borderRadius: 22,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.07)",
          }}
        >
          <MaterialCommunityIcons
            name={item.icon}
            size={14}
            color={item.color}
          />
          <Text
            style={{ fontSize: 12, color: COLORS.white, fontWeight: "600" }}
          >
            {item.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
