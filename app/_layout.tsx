import { Stack } from "expo-router";
import { LogBox } from "react-native";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  return (
      <>
      <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen name="calendar" options={{ title: "Calendar" }} />

        <Stack.Screen name="not-found" options={{}} />
      </Stack>
      </QueryClientProvider>
    </>
  );
}
