import { useRef, useEffect } from "react";
import { Text, View, FlatList } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../constants/colors";

const INCOME_SAMPLES = [
  {
    icon: "water-pump",
    color: "#3b82f6",
    title: "Santexnik",
    range: "4 000 000 – 7 000 000 so'm",
  },
  {
    icon: "flash",
    color: "#f5b81f",
    title: "Elektrik",
    range: "3 500 000 – 6 500 000 so'm",
  },
  {
    icon: "hammer-wrench",
    color: "#2ecc71",
    title: "Montajchi",
    range: "4 500 000 – 8 000 000 so'm",
  },
  {
    icon: "broom",
    color: "#a78bfa",
    title: "Tozalash",
    range: "2 500 000 – 4 500 000 so'm",
  },
];

const INCOME_CARD_W = 168;
const INCOME_GAP = 12;
const INCOME_SLOT = INCOME_CARD_W + INCOME_GAP;

export default function EarningsSection() {
  const flatListRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % INCOME_SAMPLES.length;
      indexRef.current = next;
      flatListRef.current?.scrollToOffset({
        offset: next * INCOME_SLOT,
        animated: true,
      });
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <View style={{ marginTop: 8, marginBottom: 6 }}>
      <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
        <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: "700" }}>
          O'rtacha oylik daromad
        </Text>
        <Text style={{ color: COLORS.gray, fontSize: 12.5, marginTop: 4 }}>
          Kasbingiz bo'yicha taxminiy daromad
        </Text>
      </View>
      <FlatList
        ref={flatListRef}
        data={INCOME_SAMPLES}
        keyExtractor={(item) => item.title}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 12,
          gap: INCOME_GAP,
        }}
        renderItem={({ item }) => (
          <View
            style={{
              width: INCOME_CARD_W,
              backgroundColor: COLORS.card,
              borderRadius: 18,
              padding: 14,
              borderWidth: 1,
              borderColor: COLORS.border,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: item.color + "22",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={20}
                color={item.color}
              />
            </View>
            <Text
              style={{
                color: COLORS.white,
                fontWeight: "700",
                fontSize: 13.5,
                marginBottom: 6,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                color: COLORS.orange,
                fontWeight: "800",
                fontSize: 12.5,
              }}
            >
              {item.range}
            </Text>
            <Text style={{ color: COLORS.faint, fontSize: 10.5, marginTop: 2 }}>
              oyiga
            </Text>
          </View>
        )}
      />
    </View>
  );
}
