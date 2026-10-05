import Feather from "@expo/vector-icons/Feather";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  type ViewStyle,
  type StyleProp,
  type ColorValue,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useStore } from "./store";
export const colors = {
  ink: "#302239",
  plum: "#64366E",
  muted: "#706375",
  lavender: "#EEE7F5",
  paper: "#FBFAFD",
  border: "#E4DEE9",
  white: "#FFFFFF",
  green: "#226744",
  red: "#A12B38",
};
export const images = {
  cup: require("../assets/products/cup.jpg"),
  vase: require("../assets/products/vase.jpg"),
  bowl: require("../assets/products/bowl.jpg"),
  plant: require("../assets/products/plant.jpg"),
};
export function Icon({
  name,
  color = colors.ink,
  size = 22,
}: {
  name: React.ComponentProps<typeof Feather>["name"];
  color?: ColorValue;
  size?: number;
}) {
  return <Feather name={name} color={color} size={size} accessible={false} />;
}
export function Button({
  label,
  onPress,
  secondary = false,
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        secondary && styles.secondary,
        disabled && { opacity: 0.5 },
        pressed && { opacity: 0.8 },
      ]}
    >
      <Text style={[styles.buttonText, secondary && { color: colors.plum }]}>
        {label}
      </Text>
    </Pressable>
  );
}
export function Screen({
  title,
  subtitle,
  children,
  style,
  showError = true,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  showError?: boolean;
}) {
  const { error, ready } = useStore();
  return (
    <SafeAreaView style={styles.safe} edges={["top", "left", "right"]}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={[styles.screen, style]}
      >
        <View>
          <Text accessibilityRole="header" style={styles.title}>
            {title}
          </Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {!ready ? (
          <Text accessibilityLiveRegion="polite">Carregando seus dados…</Text>
        ) : null}
        {showError && error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
export const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  screen: {
    padding: 22,
    paddingBottom: 32,
    gap: 24,
    width: "100%",
    maxWidth: 880,
    alignSelf: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    letterSpacing: -1,
    color: colors.ink,
  },
  subtitle: { color: colors.muted, lineHeight: 22, fontSize: 14, marginTop: 6 },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.ink,
    letterSpacing: -0.5,
  },
  body: { fontSize: 15, lineHeight: 24, color: colors.muted },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  button: {
    minHeight: 50,
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: colors.plum,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: { backgroundColor: colors.lavender },
  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  label: {
    color: colors.ink,
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: colors.ink,
    minHeight: 50,
  },
  error: {
    color: colors.red,
    backgroundColor: "#FCECEE",
    borderRadius: 10,
    padding: 14,
    lineHeight: 22,
  },
  note: {
    color: colors.plum,
    backgroundColor: colors.lavender,
    borderRadius: 12,
    padding: 16,
    lineHeight: 22,
    fontSize: 14,
  },
  divider: { height: 1, backgroundColor: colors.border },
  empty: { alignItems: "center", paddingVertical: 42, gap: 16 },
});
