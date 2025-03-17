import React, { useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter } from "expo-router";
import { useDevice } from "../../hooks/useDevice";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import MessageModal from "../../components/MessageModal";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../theme/theme";
import { addMockUser } from "../../mocks/users";
import { UserRole } from "../../models/User";

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
      return;
    }

    if (!email.includes("@")) {
      setModalMessage("Ingrese un correo válido");
      setModalType("error");
      setModalVisible(true);
      return;
    }

    if (password.length < 6) {
      setModalMessage("La contraseña debe tener al menos 6 caracteres");
      setModalType("error");
      setModalVisible(true);
      return;
    }

    addMockUser(name, email, password, role);

    setModalMessage("Usuario registrado correctamente");
    setModalType("success");
    setModalVisible(true);

    setTimeout(() => router.replace("/login"), 5000); // Redirigir después del mensaje
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.wrapper}>
      <View style={[styles.container, isTabletOrDesktop ? styles.containerDesktop : styles.containerMobile]}>
        <Text style={styles.title}>Registro de Usuario</Text>

        <CustomInput label="Nombre Completo" placeholder="Ingrese su nombre" value={name} onChangeText={setName} />
        <CustomInput label="Correo Electrónico" placeholder="Ingrese su correo" value={email} onChangeText={setEmail} />
        <CustomInput label="Contraseña" placeholder="Ingrese su contraseña" value={password} onChangeText={setPassword} secureTextEntry />

        <Text style={styles.label}>Selecciona tu rol</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue as UserRole)} style={styles.picker}>
            <Picker.Item label="Estudiante" value="Estudiante" />
            <Picker.Item label="Tutor" value="Tutor" />
            <Picker.Item label="Administrador" value="Administrador" />
          </Picker>
        </View>

        <View style={styles.containerButton}>
          <CustomButton title="Registrarse" onPress={handleRegister} variant="primary" fullWidth />
          <CustomButton title="Ya tengo cuenta" onPress={() => router.push("/login")} variant="primary" outline fullWidth />
        </View>

        <MessageModal visible={modalVisible} message={modalMessage} type={modalType} onClose={() => setModalVisible(false)} />
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
    marginHorizontal: 16
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
    marginBottom: 16,
    textAlign: "center",
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
  },
});
