import { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Image, RefreshControl } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";
import { COLORS } from "../../constants/colors";
import TaklifXizmatlar from "./TaklifXizmatlar";
import EngZorUstalar from "./EngZorUstalar";
import EngZorIshlar from "./EngZorIshlar";
import PromoBanner from "./PromoBanner";
import TrustRow from "./TrustRow";
import StatsBand from "./StatsBand";
import HowItWorks from "./HowItWorks";
import ReviewsSection from "./ReviewsSection";
import BenefitsSection from "./BenefitsSection";
import EarningsSection from "./EarningsSection";
import RequirementsSection from "./RequirementsSection";
import ReferralSection from "./ReferralSection";
import ClosingCTA from "./ClosingCTA";
import SectionHead from "./SectionHead";

export default function HomeScreen({ onLogin, onSelectUsta }) {
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((k) => k + 1);
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView
          key={refreshKey}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={COLORS.orange}
              colors={[COLORS.orange]}
            />
          }
        >
          {/* ── Header ── */}
          <View style={styles.header}>
            <Image
              source={require("../../../assets/afish-logo-horizontal-pro.png")}
              style={styles.logoImg}
              resizeMode="contain"
            />
            <TouchableOpacity
              style={styles.loginBtn}
              activeOpacity={0.8}
              onPress={onLogin}
            >
              <Feather
                name="log-in"
                size={16}
                color={COLORS.white}
                style={{ marginRight: 6 }}
              />
              <Text style={styles.loginBtnTxt}>Kirish</Text>
            </TouchableOpacity>
          </View>

          {/* ── Search ── */}
          <View style={styles.searchRow}>
            <View style={styles.searchInner}>
              <Feather
                name="search"
                size={18}
                color={COLORS.gray}
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Kasbingizni qidiring"
                placeholderTextColor={COLORS.gray}
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            <TouchableOpacity style={styles.filterBtn} activeOpacity={0.8}>
              <Feather name="sliders" size={18} color={COLORS.gray} />
            </TouchableOpacity>
          </View>

          {/* ── Promo + Trust ── */}
          <PromoBanner onPress={onLogin} />
          <TrustRow />

          {/* ── Taklif xizmatlar ── */}
          <TaklifXizmatlar />

          {/* ── Eng zo'r ustalar ── */}
          <EngZorUstalar onSelectUsta={onSelectUsta} />

          {/* ── Eng zo'r ishlar ── */}
          <EngZorIshlar />

          {/* ── Daromad namunasi ── */}
          <EarningsSection />

          {/* ── Statistika ── */}
          <StatsBand />

          {/* ── Qanday ishlaydi ── */}
          <SectionHead title="Qanday ishlaydi" />
          <HowItWorks />

          {/* ── Talablar ── */}
          <SectionHead title="Ro'yxatdan o'tish uchun kerak bo'ladi" />
          <RequirementsSection />

          {/* ── Mijozlar fikri ── */}
          <SectionHead title="Mijozlar fikri" />
          <ReviewsSection />

          {/* ── Nega AFISH? ── */}
          <SectionHead title="Nega AFISH?" />
          <BenefitsSection />

          {/* ── Do'stni taklif qilish ── */}
          <ReferralSection />

          {/* ── Closing CTA ── */}
          <ClosingCTA onPress={onLogin} />
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { paddingBottom: 110 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  logoImg: { width: 170, height: 47 },

  loginBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.orange,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 24,
  },
  loginBtnTxt: { color: COLORS.white, fontWeight: "600", fontSize: 14 },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 4,
    gap: 10,
  },
  searchInner: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  searchInput: { flex: 1, color: COLORS.white, fontSize: 15, padding: 0 },
  filterBtn: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
    justifyContent: "center",
  },
});
