import { Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

const STEPS = [
  {
    num: 1,
    title: "Ro'yxatdan o'ting",
    desc: "Kasbingiz va tajribangiz bo'yicha profil yarating.",
  },
  {
    num: 2,
    title: "E'lon joylang",
    desc: "Xizmatingiz, narxingiz va tajribangiz haqida e'lon yarating.",
  },
  {
    num: 3,
    title: "Pul ishlang",
    desc: "Ishni sifatli bajaring va darhol to'lovingizni oling.",
  },
];

export default function HowItWorks() {
  return (
    <View style={{ paddingHorizontal: 16, marginBottom: 32, gap: 16 }}>
      {STEPS.map((s) => (
        <View
          key={s.num}
          style={{ flexDirection: "row", alignItems: "flex-start", gap: 14 }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 11,
              backgroundColor: COLORS.orange + "22",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Text
              style={{ color: COLORS.orange, fontWeight: "800", fontSize: 15 }}
            >
              {s.num}
            </Text>
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
              {s.title}
            </Text>
            <Text style={{ color: COLORS.gray, fontSize: 13, lineHeight: 19 }}>
              {s.desc}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
