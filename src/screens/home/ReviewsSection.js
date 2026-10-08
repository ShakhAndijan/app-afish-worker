import { useState, useRef, useEffect } from "react";
import { Text, View, FlatList } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../constants/colors";
import { getTopComments } from "../../api/reviews";

const REVIEW_CARD_W = 240;
const REVIEW_CARD_GAP = 12;
const REVIEW_SLOT = REVIEW_CARD_W + REVIEW_CARD_GAP;

export default function ReviewsSection() {
  const [reviews, setReviews] = useState([]);
  const listRef = useRef(null);
  const idxRef = useRef(0);

  useEffect(() => {
    getTopComments({ limit: 10 })
      .then((data) => {
        setReviews(data);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    if (reviews.length === 0) return;
    const timer = setInterval(() => {
      const next = (idxRef.current + 1) % reviews.length;
      idxRef.current = next;
      listRef.current?.scrollToOffset({
        offset: next * REVIEW_SLOT,
        animated: true,
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  return (
    <FlatList
      ref={listRef}
      data={reviews}
      keyExtractor={(_, i) => String(i)}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={REVIEW_SLOT}
      decelerationRate="fast"
      contentContainerStyle={{
        paddingHorizontal: 16,
        gap: 12,
        paddingBottom: 4,
      }}
      style={{ marginBottom: 32 }}
      renderItem={({ item: r }) => (
        <View
          style={{
            width: 240,
            backgroundColor: COLORS.card,
            borderRadius: 18,
            padding: 16,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.06)",
          }}
        >
          <View style={{ flexDirection: "row", gap: 3, marginBottom: 10 }}>
            {[0, 1, 2, 3, 4].map((j) => (
              <Ionicons
                key={j}
                name="star"
                size={14}
                color={j < r.stars ? "#f5b81f" : "#2a3a4a"}
              />
            ))}
          </View>
          <Text
            style={{
              color: "#c4cdd8",
              fontSize: 13.5,
              lineHeight: 20,
              marginBottom: 14,
            }}
          >
            {r.text}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: r.color,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 14 }}>
                {r.initial}
              </Text>
            </View>
            <View>
              <Text
                style={{ color: COLORS.white, fontWeight: "600", fontSize: 13 }}
              >
                {r.name}
              </Text>
              <Text
                style={{ color: COLORS.gray, fontSize: 11.5, marginTop: 1 }}
              >
                {r.location}
              </Text>
            </View>
          </View>
        </View>
      )}
    />
  );
}
