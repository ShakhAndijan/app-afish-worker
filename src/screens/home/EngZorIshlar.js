import { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../constants/colors";
import { getTopOrders } from "../../api/reviews";

const EI_CARD_W = 160;
const EI_GAP = 12;
const EI_SLOT = EI_CARD_W + EI_GAP;

export default function EngZorIshlar() {
  const [works, setWorks] = useState([]);
  const flatListRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    getTopOrders({ limit: 10 })
      .then((data) => {
        setWorks(data);
      })
      .catch((error) => {});
  }, []);

  useEffect(() => {
    if (works.length === 0) return;
    const timer = setInterval(() => {
      const next = (indexRef.current + 1) % works.length;
      indexRef.current = next;
      flatListRef.current?.scrollToOffset({
        offset: next * EI_SLOT,
        animated: true,
      });
    }, 2000);
    return () => clearInterval(timer);
  }, [works.length]);

  if (works.length === 0) return null;

  return (
    <View style={ei.container}>
      <View style={ei.header}>
        <Text style={ei.title}>So'nggi bajarilgan ishlar</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={ei.link}>Galereya</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={works}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={EI_SLOT}
        decelerationRate="fast"
        contentContainerStyle={ei.list}
        renderItem={({ item }) => <WorkCard item={item} />}
      />
    </View>
  );
}

function WorkCard({ item }) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const total = item.photos.length;

  const goPrev = () => setPhotoIndex((i) => (i - 1 + total) % total);
  const goNext = () => setPhotoIndex((i) => (i + 1) % total);

  return (
    <TouchableOpacity style={ei.card} activeOpacity={0.85}>
      <View style={ei.imgBox}>
        <Image source={{ uri: item.photos[photoIndex] }} style={ei.img} />
        <View style={ei.ratingBadge}>
          <Ionicons name="star" size={11} color="#FBBF24" />
          <Text style={ei.ratingBadgeText}>{item.rating.toFixed(1)}</Text>
        </View>
        {total > 1 && (
          <>
            <TouchableOpacity
              style={[ei.navBtn, ei.navBtnLeft]}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={goPrev}
            >
              <Ionicons name="chevron-back" size={14} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[ei.navBtn, ei.navBtnRight]}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={goNext}
            >
              <Ionicons name="chevron-forward" size={14} color="#fff" />
            </TouchableOpacity>
            <View style={ei.dots}>
              {item.photos.map((_, i) => (
                <View
                  key={i}
                  style={[ei.dot, i === photoIndex && ei.dotActive]}
                />
              ))}
            </View>
          </>
        )}
      </View>
      <Text style={ei.cardTitle} numberOfLines={1}>
        {item.title}
      </Text>
      <Text style={ei.cardSub} numberOfLines={1}>
        {item.worker}
      </Text>
    </TouchableOpacity>
  );
}

const ei = StyleSheet.create({
  container: { marginTop: 28, marginBottom: 6 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: { color: COLORS.white, fontSize: 18, fontWeight: "700" },
  link: { color: COLORS.orange, fontSize: 14, fontWeight: "600" },
  list: { paddingHorizontal: 16, gap: EI_GAP },
  card: { width: EI_CARD_W },
  imgBox: {
    width: EI_CARD_W,
    height: 140,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    marginBottom: 8,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  ratingBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
  },
  ratingBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: "700" },
  navBtn: {
    position: "absolute",
    top: "50%",
    marginTop: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  navBtnLeft: { left: 6 },
  navBtnRight: { right: 6 },
  dots: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.4)",
  },
  dotActive: {
    backgroundColor: COLORS.white,
    width: 12,
  },
  cardTitle: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 3,
  },
  cardSub: { color: COLORS.gray, fontSize: 11 },
});
