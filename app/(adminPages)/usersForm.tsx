import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import MessageModal from "../../components/MessageModal";
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../theme/theme";
import { getUsers, addUser, updateUser } from "../../services/userService";
import { UserRole, User } from "../../models/User";

export default function UsersForm() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId?: string }>();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("Estudiante");
  const [isEditing, setIsEditing] = useState(false);

  // Estado del modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (userId) {
      const user = getUsers().find((u) => u.id === Number(userId));
      if (user) {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setIsEditing(true);
      } else {
        setModalMessage("Usuario no encontrado");
        setModalType("error");
        setModalVisible(true);
      }
    }
  }, [userId]);

  const handleSave = () => {
    if (!name || !email || (!isEditing && !password)) {
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

    if (!isEditing && password.length < 6) {
      setModalMessage("La contraseña debe tener al menos 6 caracteres");
      setModalType("error");
      setModalVisible(true);
      return;
    }

    if (isEditing) {
      updateUser(Number(userId), { name, email, role });
      setModalMessage("Usuario actualizado correctamente");
    } else {
      addUser(name, email, password, role);
      setModalMessage("Usuario agregado correctamente");
    }

    setModalType("success");
    setModalVisible(true);

    setTimeout(() => {
      setModalVisible(false);
      router.replace("/admin/users");
    }, 2000);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <Text style={styles.title}>{isEditing ? "Editar Usuario" : "Agregar Usuario"}</Text>

      <CustomInput label="Nombre Completo" placeholder="Ingrese el nombre" value={name} onChangeText={setName} />
      <CustomInput label="Correo Electrónico" placeholder="Ingrese el correo" value={email} onChangeText={setEmail} />

      {!isEditing && (
        <CustomInput label="Contraseña" placeholder="Ingrese la contraseña" value={password} onChangeText={setPassword} secureTextEntry />
      )}

      <Text style={styles.label}>Selecciona un rol</Text>
      <View style={styles.pickerContainer}>
        <Picker selectedValue={role} onValueChange={(itemValue) => setRole(itemValue as UserRole)} style={styles.picker}>
          <Picker.Item label="Estudiante" value="Estudiante" />
          <Picker.Item label="Tutor" value="Tutor" />
          <Picker.Item label="Administrador" value="Administrador" />
        </Picker>
      </View>

      <View style={styles.containerButton}>
        <CustomButton title={isEditing ? "Actualizar" : "Guardar"} onPress={handleSave} variant="primary"  />
        <CustomButton title="Cancelar" onPress={() => router.back()} variant="error" outline  />
      </View>

      <MessageModal visible={modalVisible} message={modalMessage} type={modalType} onClose={() => setModalVisible(false)} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "40%",
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: "center",
    margin: "auto",
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
    borderColor: theme.colors.primary,
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
