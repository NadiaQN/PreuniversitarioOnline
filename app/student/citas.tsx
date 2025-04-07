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
  const { isMobile } = useDevice();
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

  return (
    <ScrollView style={styles.wrapper}>
      <View style={styles.container}>
        {citas.map((cita) => {
          const isPast =
            new Date(cita.fecha).getTime() < new Date().setHours(0, 0, 0, 0);
          return (
            <View
              key={cita.id}
              style={[styles.card, isPast && styles.faded]}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardTitle}>
                  Cita con {getNombreTutor(cita.id_tutor)}
                </Text>
                <Icon name="calendar-check-outline" size={24} color={theme.colors.primary} />
              </View>

              <Text style={styles.cardText}>
                <Text style={styles.cardLabel}>Fecha: </Text>
                {cita.fecha}
              </Text>
              <Text style={styles.cardText}>
                <Text style={styles.cardLabel}>Hora: </Text>
                {cita.hora} hrs.
              </Text>

              <View style={styles.badgeContainer}>
                <View style={[styles.badge, getBadgeStyle(cita.estado)]}>
                  <Text style={styles.badgeText}>{cita.estado}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                {cita.estado !== "Cancelada" && (
                  <TouchableOpacity
                    onPress={() => Linking.openURL(cita.meetLink)}
                    style={styles.joinButton}
                  >
                    <Icon name="video" size={18} color={theme.colors.textLight} />
                    <Text style={styles.joinButtonText}>Unirse a la cita</Text>
                  </TouchableOpacity>
                )}
                {cita.estado === "Pendiente" && !isPast && (
                  <TouchableOpacity
                    onPress={() => handleCancelarCita(cita.id)}
                    style={styles.cancelButton}
                  >
                    <Text style={styles.cancelButtonText}>Cancelar cita</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: theme.colors.textLight,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
  },
  faded: {
    opacity: 0.4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: theme.sizes.md + 1,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  cardText: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  cardLabel: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
  },
  text: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
  },
  bold: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textLight,
  },
  badgeConfirmada: {
    backgroundColor: theme.colors.success,
  },
  badgeCancelada: {
    backgroundColor: theme.colors.error,
  },
  badgePendiente: {
    backgroundColor: theme.colors.warning,
  },
  cardFooter: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
    flexWrap: "wrap",
  },
  joinButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  joinButtonText: {
    color: theme.colors.textLight,
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    marginLeft: 6,
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.error,
    backgroundColor: theme.colors.backgroundLight,
  },
  cancelButtonText: {
    color: theme.colors.error,
    fontFamily: theme.fonts.bold,
  },
});
