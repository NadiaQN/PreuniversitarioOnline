import { View, Text, StyleSheet, FlatList } from "react-native";
import { theme } from "../../theme/theme";
import CustomButton from "../../components/Button";

// Mock de usuarios
const users = [
  { id: "1", name: "Juan Pérez", role: "Estudiante" },
  { id: "2", name: "María González", role: "Tutor" },
  { id: "3", name: "Carlos López", role: "Estudiante" },
];

export default function ManageUsers() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Usuarios</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{item.name}</Text>
              <Text style={styles.userRole}>{item.role}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <CustomButton
                title="Eliminar"
                onPress={() => {}}
                variant="error"
                outline
                style={styles.button}
              />
              <CustomButton
                title="Editar"
                onPress={() => {}}
                variant="primary"
                style={styles.button}
              />
            </View>
          </View>
        )}
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
    flex: 4
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8,
  },
  button: {
    width: 48,
  },
});

