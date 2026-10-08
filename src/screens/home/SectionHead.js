import { Text, View } from "react-native";
import { COLORS } from "../../constants/colors";

export default function SectionHead({ title, link }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        marginBottom: 14,
        marginTop: 28,
      }}
    >
      <Text style={{ color: COLORS.white, fontSize: 18, fontWeight: "700" }}>
        {title}
      </Text>
      {link && (
        <Text style={{ color: COLORS.orange, fontSize: 14, fontWeight: "600" }}>
          {link}
        </Text>
      )}
    </View>
  );
}
