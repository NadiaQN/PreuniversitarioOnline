import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from "react-native";
import { useEffect, useState } from "react";
import { getUserFromStorage, removeFromStorage } from "../../utils/storage";
import { theme } from "../../theme/theme";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import ConfirmModal from "../../components/ConfirmModal";

export default function Perfil() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [rol, setRol] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUserFromStorage();
      if (user) {
        setNombre(user.name);
        setCorreo(user.email);
        setRol(user.role);
      }
    };
    loadUser();
  }, []);

  const handleCerrarSesion = () => {
    setModalVisible(true);
  };

  const confirmCerrarSesion = async () => {
    await removeFromStorage("user");
    router.replace("/(authPages)/login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} accessibilityRole="header">
        Mi Perfil
      </Text>

      <View
        style={[styles.card, isDesktop && styles.desktopCard]}
        accessible
        accessibilityLabel={`Nombre: ${nombre}. Correo electrónico: ${correo}.`}
      >
        <Text style={styles.label}>Nombre</Text>
        <Text style={styles.value}>{nombre}</Text>

        <Text style={styles.label}>Correo electrónico</Text>
        <Text style={styles.value}>{correo}</Text>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleCerrarSesion}
        accessibilityLabel="Cerrar sesión"
        accessibilityRole="button"
      >
        <View style={styles.logoutContent}>
          <Icon name="logout" size={20} color={theme.colors.error} />
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </View>
      </TouchableOpacity>

      <ConfirmModal
        visible={modalVisible}
        message="¿Estás seguro que deseas cerrar sesión?"
        onCancel={() => setModalVisible(false)}
        onConfirm={confirmCerrarSesion}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 16,
    backgroundColor: theme.colors.backgroundLight,
    flex: 1,
    alignItems: "center",
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 16,
    alignSelf: "center",
  },
  card: {
    backgroundColor: theme.colors.textLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 24,
    width: "100%",
  },
  desktopCard: {
    maxWidth: "50%",
  },
  label: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.sm,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  value: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.sizes.md,
    color: theme.colors.textDark,
    marginBottom: 12,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: theme.colors.error,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    maxWidth: "50%",
  },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoutButtonText: {
    color: theme.colors.error,
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.md,
  },
});
