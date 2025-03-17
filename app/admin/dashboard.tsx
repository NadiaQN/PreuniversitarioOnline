import React from "react";
import { View, Text, StyleSheet } from "react-native";
import CustomButton from "../../components/Button";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { theme } from "../../theme/theme";
import { useDevice } from "@/hooks/useDevice";

export default function AdminDashboard() {
  const router = useRouter();
  const { isMobile } = useDevice();

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <View style={[styles.logoutContainer, isMobile && styles.logoutContainerMobile]}>
        <CustomButton title="Salir" onPress={handleLogout} variant="error" outline iconName="logout" />
      </View>

      <Text style={styles.title}>Panel de Administrador</Text>
      <Text style={styles.subtitle}>Bienvenido al sistema de gestión</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.backgroundLight,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  logoutContainerMobile: {
    top: 10,
    right: 10,
  },
  title: {
    fontSize: theme.sizes.xl,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    textAlign: "center",
  },
});
