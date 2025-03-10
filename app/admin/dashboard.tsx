import { View, Text, StyleSheet } from "react-native";
import { theme } from "../../theme/theme";

export default function AdminDashboard() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Panel de Administrador</Text>
      <Text style={styles.stat}>👥 Usuarios registrados: 120</Text>
      <Text style={styles.stat}>📚 Cursos activos: 15</Text>
      <Text style={styles.stat}>🎓 Tutores disponibles: 8</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: theme.colors.backgroundLight,
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 20,
  },
  stat: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    marginBottom: 10,
  },
});

