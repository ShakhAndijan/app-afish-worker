import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../constants/colors";

export default function PromoBanner({ onPress }) {
  return (
    <View style={pb.wrap}>
      <View style={pb.glow} />
      <View style={pb.iconBg}>
        <MaterialCommunityIcons
          name="shield-check"
          size={140}
          color="#fff"
          style={{ opacity: 0.12 }}
        />
      </View>
      <Text style={pb.heading}>Bugun ustaga{"\n"}aylaning</Text>
      <Text style={pb.sub}>
        1 200+ usta AFISH orqali doimiy{"\n"}buyurtma va barqaror daromad
        topmoqda.
      </Text>
      <TouchableOpacity style={pb.cta} activeOpacity={0.85} onPress={onPress}>
        <Text style={pb.ctaTxt}>Ro'yxatdan o'tish</Text>
        <Ionicons name="arrow-forward" size={16} color={COLORS.orange} />
      </TouchableOpacity>
    </View>
  );
}

const pb = StyleSheet.create({
  wrap: {
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
    borderRadius: 22,
    backgroundColor: COLORS.orange,
    padding: 22,
    overflow: "hidden",
  },
  glow: {
    position: "absolute",
    top: -60,
    right: -50,
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "rgba(255,255,255,0.10)",
  },
  iconBg: { position: "absolute", right: -12, bottom: -20 },
  heading: {
    fontSize: 21,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 28,
    marginBottom: 8,
  },
  sub: {
    fontSize: 13.5,
    color: "rgba(255,255,255,0.92)",
    lineHeight: 20,
    marginBottom: 18,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  ctaTxt: { color: COLORS.orange, fontWeight: "700", fontSize: 14 },
});
