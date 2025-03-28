import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, Alert, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../../theme/theme";
import CustomButton from "../../components/Button";
import { useDevice } from "../../hooks/useDevice";
import { getUsers, deleteUser } from "../../services/userService";
import MessageModal from "../../components/MessageModal";
import { User } from "../../models/User";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function ManageUsers() {
  const { isMobile } = useDevice();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  useEffect(() => {
    setUsers(getUsers());
    setFilteredUsers(getUsers());
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  const handleDeleteUser = (userId: number) => {
    Alert.alert("Confirmar eliminación", "¿Estás seguro de que deseas eliminar este usuario?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          deleteUser(userId);
          const updatedUsers = getUsers();
          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
          setModalMessage("Usuario eliminado correctamente");
          setModalType("success");
          setModalVisible(true);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Usuarios</Text>

      {/* 🔹 Campo de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar usuario por nombre o correo..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 🔹 Botón para agregar usuario (CON TEXTO) */}
      <View style={styles.addButtonContainer}>
        <CustomButton title="Agregar Usuario" onPress={() => router.push("../admin/usersForm")} variant="success" />
      </View>

      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userRole}>{item.role}</Text>
            </View>

            {/* 🔹 Botones de acción SOLO ICONOS */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => router.push(`../admin/usersForm?userId=${item.id}`)} style={styles.iconButton}>
                <Icon name="pencil-outline" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteUser(item.id)} style={styles.iconButton}>
                <Icon name="trash-can-outline" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* 🔹 Modal de confirmación */}
      <MessageModal visible={modalVisible} message={modalMessage} type={modalType} onClose={() => setModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: theme.colors.backgroundLight,
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  searchInput: {
    fontSize: theme.sizes.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: theme.colors.textLight,
  },
  addButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  userCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: theme.colors.textLight,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  userInfo: {
    flex: 3,
  },
  userName: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
  },
  userRole: {
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
    marginBottom: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
});
