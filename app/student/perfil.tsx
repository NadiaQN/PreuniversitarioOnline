import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../../components/Button";
import { User } from "../../models/User";
import { theme } from "../../theme/theme";
import { useDevice } from "../../hooks/useDevice";

export default function PerfilScreen() {
  const [user, setUser] = useState<User | null>(null);
  const { isMobile, isTabletOrDesktop } = useDevice();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
    };
    fetchUser();
  }, []);

  if (!user) return null;

  return (
    <View style={[styles.container, { width: isTabletOrDesktop ? "60%" : "100%" }]}>
      <Text style={styles.title}>Mi Perfil</Text>

      <View style={styles.infoRow}>
        <Icon name="account" size={24} color={theme.colors.primary} />
        <Text style={styles.infoText}>{user.name}</Text>
      </View>

      <View style={styles.infoRow}>
        <Icon name="email-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.infoText}>{user.email}</Text>
      </View>

      <CustomButton
        title="Editar Perfil"
        iconName="pencil-outline"
        onPress={() => {}}
        variant="primary"
        outline
        style={{ marginTop: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    backgroundColor: theme.colors.textLight,
    padding: 24,
    borderRadius: 12,
    marginTop: Platform.OS === "ios" ? 60 : 30,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  infoText: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
  },
});
