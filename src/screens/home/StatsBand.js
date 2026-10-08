import { Text, View } from "react-native";
import { COLORS } from "../../constants/colors";
import { useQuery } from "@tanstack/react-query";
import { getSystemStats } from "../../api/system";

const DEFAULT_STATS = [
  ["1 200+", "Faol usta"],
  ["8 500+", "Bajarilgan buyurtma"],
  ["4.8★", "O'rtacha reyting"],
];

const toStats = ({ worker_count, order_count, average_rating }) => [
  [`${worker_count}+`, "Faol usta"],
  [`${order_count}+`, "Bajarilgan buyurtma"],
  [`${average_rating.toFixed(1)}★`, "O'rtacha reyting"],
];

export default function StatsBand() {
  // So'rov muvaffaqiyatsiz bo'lsa, standart qiymatlar ko'rsatilaveradi.
  const { data } = useQuery({
    queryKey: ["system-stats"],
    queryFn: getSystemStats,
  });
  const stats = data ? toStats(data) : DEFAULT_STATS;

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 32,
        marginBottom: 28,
        backgroundColor: COLORS.card,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.06)",
        borderRadius: 18,
        paddingVertical: 18,
        flexDirection: "row",
      }}
    >
      {stats.map(([v, l], i) => (
        <View
          key={i}
          style={{
            flex: 1,
            alignItems: "center",
            borderRightWidth: i < 2 ? 1 : 0,
            borderRightColor: "rgba(255,255,255,0.06)",
          }}
        >
          <Text
            style={{ fontSize: 19, fontWeight: "800", color: COLORS.white }}
          >
            {v}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: COLORS.gray,
              marginTop: 3,
              textAlign: "center",
              paddingHorizontal: 4,
            }}
          >
            {l}
          </Text>
        </View>
      ))}
    </View>
  );
}
