import { useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome to the App!</Text>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && { opacity: 0.8 }]}
          onPress={() => router.push("/calendar")}
        >
          <Text style={styles.buttonText}>GO TO TODO PAGE</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f6fa",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "80%",
    paddingVertical: 40,
    paddingHorizontal: 24,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
    color: "#1f1f1f",
  },

  button: {
    backgroundColor: "#247bff",
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 8,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
