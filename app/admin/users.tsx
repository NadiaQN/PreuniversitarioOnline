import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { theme } from "../../theme/theme";
import { getUsers, deleteUser } from "../../services/userService";
import MessageModal from "../../components/MessageModal";
import { User } from "../../models/User";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../../components/Button";

export default function ManageUsers() {
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    const data = getUsers();
    setUsers(data);
    setFilteredUsers(data);
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

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUser(selectedUser.id);
      const updatedUsers = getUsers();
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setModalMessage("Usuario eliminado correctamente");
      setModalType("success");
      setModalVisible(true);
      setSelectedUser(null);
      setConfirmVisible(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Usuarios</Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar usuario por nombre o correo..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <View style={styles.addButtonContainer}>
        <CustomButton
          title="Agregar Usuario"
          onPress={() => router.push("/(adminPages)/usersForm")}
          variant="success"
        />
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

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() =>
                  router.push(`/(adminPages)/usersForm?userId=${item.id}`)
                }
                style={styles.iconButton}
              >
                <Icon
                  name="pencil-outline"
                  size={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setSelectedUser(item);
                  setConfirmVisible(true);
                }}
                style={styles.iconButton}
              >
                <Icon
                  name="trash-can-outline"
                  size={24}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* 🔹 Modal de Confirmación */}
      {selectedUser && confirmVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.confirmModal}>
            <Text style={styles.confirmTitle}>¿Eliminar Usuario?</Text>
            <Text style={styles.confirmText}>
              ¿Deseas eliminar a {selectedUser.name}?
            </Text>

            <View style={styles.confirmButtons}>
              <CustomButton
                title="Cancelar"
                onPress={() => setConfirmVisible(false)}
                variant="error"
                outline
              />
              <CustomButton
                title="Eliminar"
                onPress={handleDeleteUser}
                variant="error"
              />
            </View>
          </View>
        </View>
      )}

      {/* 🔹 Modal de éxito */}
      <MessageModal
        visible={modalVisible}
        message={modalMessage}
        type={modalType}
        onClose={() => setModalVisible(false)}
      />
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
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  confirmModal: {
    backgroundColor: theme.colors.textLight,
    padding: 24,
    borderRadius: 12,
    width: "80%",
    gap: 12,
    elevation: 5,
  },
  confirmTitle: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.error,
    textAlign: "center",
  },
  confirmText: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    textAlign: "center",
  },
  confirmButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 8,
  },
});
