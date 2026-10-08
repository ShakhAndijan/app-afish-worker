import { useRef, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { COLORS } from "../../constants/colors";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "../../api/categories";

const ITEM_SLOT = 76;

export default function TaklifXizmatlar() {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
  const flatListRef = useRef(null);
  const activeIndexRef = useRef(0);

  useEffect(() => {
    if (categories.length === 0) return;
    const timer = setInterval(() => {
      const next = (activeIndexRef.current + 1) % categories.length;
      activeIndexRef.current = next;
      flatListRef.current?.scrollToOffset({
        offset: next * ITEM_SLOT,
        animated: true,
      });
    }, 1800);
    return () => clearInterval(timer);
  }, [categories.length]);

  if (categories.length === 0) return null;

  return (
    <View style={tx.container}>
      <View style={tx.header}>
        <Text style={tx.title}>Qaysi sohada ishlaysiz?</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={tx.link}>Barchasi</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        ref={flatListRef}
        data={categories}
        keyExtractor={(item) => String(item.id)}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={tx.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={tx.item} activeOpacity={0.8}>
            <View style={[tx.iconBox, { backgroundColor: item.color + "18" }]}>
              {item.icon ? (
                <Text style={tx.emoji}>{item.icon}</Text>
              ) : (
                <MaterialCommunityIcons
                  name="briefcase-outline"
                  size={24}
                  color={item.color}
                />
              )}
            </View>
            <Text style={tx.label} numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const tx = StyleSheet.create({
  container: { marginTop: 26, marginBottom: 6 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  title: { color: COLORS.white, fontSize: 18, fontWeight: "700" },
  link: { color: COLORS.orange, fontSize: 14, fontWeight: "600" },
  list: { paddingHorizontal: 16, gap: 10 },
  item: { width: 66, alignItems: "center" },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  label: {
    color: COLORS.gray,
    fontSize: 11,
    fontWeight: "500",
    textAlign: "center",
  },
  emoji: { fontSize: 24 },
});
