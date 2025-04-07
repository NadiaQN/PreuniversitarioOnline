import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useDevice } from "../../hooks/useDevice";
import { theme } from "../../theme/theme";
import { Cita } from "../../models/Cita";
import { User } from "../../models/User";
import {
  getCitasByUser,
  updateCita,
} from "../../services/citaService";
import { getUserFromStorage } from "../../utils/storage";
import { LINK_MEET } from "../../utils/constants";
import { getUsers } from "@/services/userService";

export default function Citas() {
  const { isTabletOrDesktop } = useDevice();
  const [citas, setCitas] = useState<Cita[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  useEffect(() => {
    const load = async () => {
      const user = await getUserFromStorage();
      if (!user) return;
      setLoggedUser(user);
      setUsuarios(getUsers());
      const citasFiltradas = getCitasByUser(user.id, "estudiante").sort(
        (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
      );
      setCitas(citasFiltradas);
    };
    load();
  }, []);

  const handleCancelarCita = (id: number) => {
    updateCita(id, { estado: "Cancelada" });
    const citasActualizadas = getCitasByUser(loggedUser!.id, "estudiante").sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
    setCitas(citasActualizadas);
  };

  const getNombreTutor = (id: number) => {
    return usuarios.find((u) => u.id === id)?.name || "Tutor Desconocido";
  };

  const getBadgeStyle = (estado: string) => {
    switch (estado) {
      case "Confirmada":
        return styles.badgeConfirmada;
      case "Cancelada":
        return styles.badgeCancelada;
      case "Pendiente":
        return styles.badgePendiente;
      default:
        return {};
    }
  };

  const formatDate = (fecha: string) => {
    const d = new Date(fecha);
    return `${d.getDate().toString().padStart(2, "0")}-${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${d.getFullYear()}`;
  };

  const isPast = (fecha: string) => {
    return new Date(fecha).getTime() < new Date().getTime();
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={[styles.container, isTabletOrDesktop && styles.desktopContainer]}>
        <Text style={styles.title} accessibilityRole="header">
          Mis Citas
        </Text>

        {citas.length === 0 ? (
          <Text style={styles.noCitas}>Aún no tienes citas agendadas.</Text>
        ) : (
          citas.map((cita) => (
            <View
              key={cita.id}
              style={[
                styles.card,
                isPast(cita.fecha) && cita.estado !== "Cancelada" && { opacity: 0.5 },
              ]}
            >
              <View style={styles.row}>
                <Icon name="calendar" size={18} color={theme.colors.primary} />
                <Text style={styles.cardText}>
                  {formatDate(cita.fecha)} a las {cita.hora} hr.
                </Text>
              </View>

              <View style={styles.row}>
                <Icon name="account" size={18} color={theme.colors.primary} />
                <Text style={styles.cardText}>{getNombreTutor(cita.id_tutor)}</Text>
              </View>

              <View style={styles.row}>
                <View style={[styles.badge, getBadgeStyle(cita.estado)]}>
                  <Text style={styles.badgeText}>{cita.estado}</Text>
                </View>
              </View>

              <View style={styles.row}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(LINK_MEET)}
                  style={styles.meetButton}
                  accessibilityLabel={`Abrir reunión de cita el ${formatDate(cita.fecha)} a las ${cita.hora} horas con ${getNombreTutor(cita.id_tutor)}`}
                  accessibilityRole="button"
                >
                  <Icon name="video" size={16} color="#fff" />
                  <Text style={styles.meetButtonText}>Ir a la reunión</Text>
                </TouchableOpacity>
              </View>

              {cita.estado !== "Cancelada" && !isPast(cita.fecha) && (
                <TouchableOpacity
                  onPress={() => handleCancelarCita(cita.id)}
                  style={styles.cancelBtn}
                  accessibilityLabel={`Cancelar cita con ${getNombreTutor(cita.id_tutor)} el ${formatDate(cita.fecha)} a las ${cita.hora} horas`}
                  accessibilityRole="button"
                >
                  <Text style={styles.cancelText}>Cancelar cita</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    backgroundColor: theme.colors.backgroundLight,
    padding: 16,
  },
  container: {
    backgroundColor: theme.colors.textLight,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignSelf: "center",
    width: "100%",
  },
  desktopContainer: {
    width: "60%",
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  noCitas: {
    fontSize: theme.sizes.md,
    color: theme.colors.textDark,
    textAlign: "center",
    marginTop: 24,
  },
  card: {
    backgroundColor: theme.colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  cardText: {
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
  },
  link: {
    color: theme.colors.primary,
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  badgeText: {
    color: "#fff",
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
  },
  badgeConfirmada: {
    backgroundColor: "#4CAF50",
  },
  badgeCancelada: {
    backgroundColor: "#F44336",
  },
  badgePendiente: {
    backgroundColor: "#FFC107",
  },
  cancelBtn: {
    marginTop: 12,
    alignSelf: "flex-start",
  },
  cancelText: {
    color: theme.colors.error,
    fontFamily: theme.fonts.regular,
    fontSize: theme.sizes.sm,
  },
  meetButton: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  meetButtonText: {
    color: "#fff",
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
  },
});
