import { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { COLORS } from "../../constants/colors";
import { getWorkers } from "../../api/workers";

export default function EngZorUstalar({ onSelectUsta }) {
  const [workers, setWorkers] = useState([]);

  useEffect(() => {
    getWorkers({ limit: 5 })
      .then(setWorkers)
      .catch(() => {});
  }, []);

  if (workers.length === 0) return null;

  return (
    <View style={eu.container}>
      <View style={eu.header}>
        <Text style={eu.title}>Eng yuqori reytingli ustalar</Text>
        <TouchableOpacity activeOpacity={0.7}>
          <Text style={eu.link}>Reyting</Text>
        </TouchableOpacity>
      </View>
      {workers.map((worker, i) => (
        <TouchableOpacity
          key={worker.id}
          style={[eu.card, i < workers.length - 1 && { marginBottom: 11 }]}
          activeOpacity={0.8}
          onPress={() => onSelectUsta?.(worker)}
        >
          {/* Avatar + rank badge + online dot */}
          <View style={{ marginRight: 13 }}>
            <View style={[eu.avatar, { backgroundColor: worker.color }]}>
              <Text style={eu.avatarText}>{worker.initial}</Text>
            </View>
            {i === 0 && (
              <View style={eu.rankBadge}>
                <Text style={eu.rankText}>#1</Text>
              </View>
            )}
            {worker.is_online && <View style={eu.onlineDot} />}
          </View>

          {/* Info */}
          <View style={eu.info}>
            <Text style={eu.name}>{worker.name}</Text>
            <View style={eu.metaRow}>
              <Text style={eu.prof} numberOfLines={1}>
                {worker.profession}
              </Text>
              <MaterialCommunityIcons
                name="shield-check"
                size={12}
                color="#22C55E"
              />
              <Text style={eu.loc}>{worker.location}</Text>
            </View>
            <Text style={eu.price}>
              Narx:{" "}
              <Text style={eu.priceBold}>{worker.startingPrice} so'm</Text> dan
            </Text>
          </View>

          {/* Rating */}
          <View style={{ alignItems: "flex-end", gap: 6 }}>
            <View style={eu.ratingBox}>
              <Ionicons name="star" size={13} color="#FBBF24" />
              <Text style={eu.ratingText}>{worker.rating.toFixed(1)}</Text>
            </View>
            <Text style={eu.exp}>{worker.experience}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const eu = StyleSheet.create({
  container: { marginTop: 28 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 13,
  },
  title: { color: COLORS.white, fontSize: 18, fontWeight: "700" },
  link: { color: COLORS.orange, fontSize: 14, fontWeight: "600" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    marginHorizontal: 16,
    borderRadius: 18,
    padding: 13,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  rankBadge: {
    position: "absolute",
    top: -7,
    left: -7,
    backgroundColor: "#f5c451",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 7,
  },
  rankText: { fontSize: 9, fontWeight: "800", color: "#3a2a08" },
  onlineDot: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: COLORS.white, fontSize: 19, fontWeight: "700" },
  info: { flex: 1 },
  name: {
    color: COLORS.white,
    fontSize: 14.5,
    fontWeight: "700",
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 3,
  },
  prof: { color: COLORS.gray, fontSize: 12 },
  loc: { color: COLORS.gray, fontSize: 11.5 },
  price: { fontSize: 12, color: COLORS.gray },
  priceBold: { color: COLORS.white, fontWeight: "800" },
  ratingBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245,196,81,0.13)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 3,
  },
  ratingText: { color: "#FBBF24", fontSize: 12.5, fontWeight: "700" },
  exp: { fontSize: 12, color: COLORS.gray },
});
