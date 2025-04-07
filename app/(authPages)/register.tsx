import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  AccessibilityInfo,
} from "react-native";
import { useRouter } from "expo-router";
import { useDevice } from "../../hooks/useDevice";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import MessageModal from "../../components/MessageModal";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../theme/theme";
import { UserRole } from "../../models/User";
import { addUser } from "@/services/userService";

export default function RegisterScreen() {
  const router = useRouter();
  const { isTabletOrDesktop } = useDevice();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Estudiante");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  const handleRegister = () => {
    if (!name || !email || !password) {
      setModalMessage("Todos los campos son obligatorios");
      setModalType("error");
      setModalVisible(true);
      AccessibilityInfo.announceForAccessibility("Todos los campos son obligatorios");
      return;
    }

    if (!email.includes("@")) {
      setModalMessage("Ingrese un correo válido");
      setModalType("error");
      setModalVisible(true);
      AccessibilityInfo.announceForAccessibility("Correo inválido");
      return;
    }

    if (password.length < 6) {
      setModalMessage("La contraseña debe tener al menos 6 caracteres");
      setModalType("error");
      setModalVisible(true);
      AccessibilityInfo.announceForAccessibility("Contraseña demasiado corta");
      return;
    }

    addUser(name, email, password, role);
    setModalMessage("Usuario registrado correctamente");
    setModalType("success");
    setModalVisible(true);
    AccessibilityInfo.announceForAccessibility("Usuario registrado correctamente");

    setTimeout(() => router.replace("/login"), 5000);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.wrapper}
    >
      <View
        style={[
          styles.container,
          isTabletOrDesktop ? styles.containerDesktop : styles.containerMobile,
        ]}
        accessible
        accessibilityLabel="Formulario de registro de usuario"
      >
        <Text style={styles.title} accessibilityRole="header">
          Registro de Usuario
        </Text>
        <Text style={styles.subtitle}>Completa el formulario para crear tu cuenta</Text>

        <CustomInput
          label="Nombre Completo"
          placeholder="Ingrese su nombre"
          value={name}
          onChangeText={setName}
          accessibilityLabel="Campo de nombre completo"
        />
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

        <Text style={styles.label}>Selecciona tu rol</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={role}
            onValueChange={(itemValue) => setRole(itemValue as UserRole)}
            style={styles.picker}
            accessibilityLabel="Selector de rol de usuario"
          >
            <Picker.Item label="Estudiante" value="Estudiante" />
            <Picker.Item label="Tutor" value="Tutor" />
            <Picker.Item label="Administrador" value="Administrador" />
          </Picker>
        </View>

        <View style={styles.containerButton}>
          <CustomButton
            title="Registrarse"
            onPress={handleRegister}
            variant="primary"
            accessibilityLabel="Botón para completar el registro"
          />
          <CustomButton
            title="Ya tengo cuenta"
            onPress={() => router.push("/login")}
            variant="primary"
            outline
            accessibilityLabel="Botón para ir a la pantalla de inicio de sesión"
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
    marginHorizontal: 16,
  },
  container: {
    width: "100%",
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.textLight,
  },
  containerDesktop: {
    maxWidth: "40%",
  },
  containerMobile: {
    width: "100%",
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
  label: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  pickerContainer: {
    backgroundColor: theme.colors.textLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginBottom: 16,
  },
  picker: {
    height: 48,
    fontSize: theme.sizes.md,
  },
  containerButton: {
    gap: 16,
    marginTop: 12,
  },
});
