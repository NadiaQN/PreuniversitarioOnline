import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await AsyncStorage.removeItem("user");
      router.replace("/login");
    };
    logout();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Cerrando sesión...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
