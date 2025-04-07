import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  AccessibilityInfo,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import MessageModal from "../../components/MessageModal";
import { theme } from "../../theme/theme";
import { mockUsers } from "../../mocks/users";
import { UserRole } from "../../models/User";
import { useDevice } from "../../hooks/useDevice";

const roleRoutes: Record<UserRole, "/admin/dashboard" | "/tutor/dashboard" | "/student/dashboard"> = {
  Administrador: "/admin/dashboard",
  Tutor: "/tutor/dashboard",
  Estudiante: "/student/dashboard",
};

export default function LoginScreen() {
  const router = useRouter();
  const { isMobile, isTabletOrDesktop } = useDevice();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  useEffect(() => {
    const checkSession = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        router.replace(roleRoutes[user.role as UserRole]);
      }
    };
    checkSession();
  }, []);

  const handleLogin = async () => {
    const user = mockUsers.find((u) => u.email === email && u.password === password);

    if (user) {
      await AsyncStorage.setItem("user", JSON.stringify(user));

      setModalMessage("Inicio de sesión exitoso");
      setModalType("success");
      setModalVisible(true);
      AccessibilityInfo.announceForAccessibility("Inicio de sesión exitoso");

      setTimeout(() => router.replace(roleRoutes[user.role]), 1000);
    } else {
      setModalMessage("Usuario o contraseña incorrectos");
      setModalType("error");
      setModalVisible(true);
      AccessibilityInfo.announceForAccessibility("Usuario o contraseña incorrectos");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}
    >
      <View
        style={[styles.container, { width: isTabletOrDesktop ? "40%" : "100%" }]}
        accessible
        accessibilityLabel="Formulario de inicio de sesión"
      >
        <Text style={styles.title} accessibilityRole="header">
          Inicio de Sesión
        </Text>

        <Text style={styles.subtitle}>
          Ingresa tu correo y contraseña para continuar
        </Text>

        <CustomInput
          label="Correo Electrónico"
          placeholder="Ingrese su correo"
          value={email}
          onChangeText={setEmail}
          accessibilityLabel="Campo de correo electrónico"
        />
        <CustomInput
          label="Contraseña"
          placeholder="Ingrese su contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Campo de contraseña"
        />

        <View style={styles.containerButton}>
          <CustomButton
            title="Ingresar"
            onPress={handleLogin}
            variant="primary"
            accessibilityLabel="Botón para ingresar al sistema"
          />
          <CustomButton
            title="Registrarse"
            onPress={() => router.push("/register")}
            variant="primary"
            outline
            accessibilityLabel="Botón para ir al registro de nuevos usuarios"
          />
        </View>

        <MessageModal
          visible={modalVisible}
          message={modalMessage}
          type={modalType}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.backgroundLight,
    paddingHorizontal: 16,
  },
  container: {
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.textLight,
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    textAlign: "center",
    marginBottom: 24,
  },
  containerButton: {
    gap: 16,
    marginTop: 12,
  },
});
