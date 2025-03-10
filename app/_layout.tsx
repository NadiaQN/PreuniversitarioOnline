import { Stack } from "expo-router";
import { useFonts, Lexend_400Regular, Lexend_700Bold } from "@expo-google-fonts/lexend";
import { ActivityIndicator, View, Text } from "react-native";
import { useState } from "react";

export default function Layout() {
  const [userType, setUserType] = useState<"student" | "tutor" | "admin" | null>(null);
  
  const [fontsLoaded] = useFonts({
    Lexend_400Regular,
    Lexend_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="student/dashboard" />
      <Stack.Screen name="tutor/dashboard" />
      <Stack.Screen name="admin/dashboard" />
    </Stack>
  );
}







