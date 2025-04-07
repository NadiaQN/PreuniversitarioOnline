import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  useWindowDimensions,
} from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { getUserFromStorage } from "../../utils/storage";
import { getCitasByUser, updateCita } from "../../services/citaService";
import { mockUsers } from "../../mocks/users";
import { Cita } from "../../models/Cita";
import { theme } from "../../theme/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { LINK_MEET } from "../../utils/constants";
import ConfirmModal from "../../components/ConfirmModal";

export default function Sessions() {
  const [citas, setCitas] = useState<(Cita & { nombre_estudiante: string })[]>([]);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<number | null>(null);

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  useFocusEffect(
    useCallback(() => {
      const loadCitas = async () => {
        const user = await getUserFromStorage();
        if (!user) return;

        const citasTutor = getCitasByUser(user.id, "tutor")
          .map((cita) => {
            const estudiante = mockUsers.find(
              (u) => u.id === cita.id_estudiante && u.role === "Estudiante"
            );
            return {
              ...cita,
              nombre_estudiante: estudiante ? estudiante.name : "Estudiante desconocido",
            };
          })
          .sort(
            (a, b) =>
              new Date(a.fecha + "T" + a.hora).getTime() -
              new Date(b.fecha + "T" + b.hora).getTime()
          );

        setCitas(citasTutor);
      };

      loadCitas();
    }, [])
  );

  const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();
    return `${dia}-${mes}-${anio}`;
  };

  const isPast = (fecha: string, hora: string) => {
    const citaDate = new Date(`${fecha}T${hora}`);
    return citaDate.getTime() < Date.now();
  };

  const handleCancelar = (id: number) => {
    setCitaSeleccionada(id);
    setConfirmVisible(true);
  };

  const handleConfirmarCancelacion = () => {
    if (citaSeleccionada !== null) {
      updateCita(citaSeleccionada, { estado: "Cancelada" });
      setCitas((prev) =>
        prev.map((cita) =>
          cita.id === citaSeleccionada ? { ...cita, estado: "Cancelada" } : cita
        )
      );
    }
    setCitaSeleccionada(null);
    setConfirmVisible(false);
  };

  const getEstadoStyle = (estado: string) => {
    switch (estado) {
      case "Confirmada":
        return styles.estadoConfirmada;
      case "Pendiente":
        return styles.estadoPendiente;
      case "Cancelada":
        return styles.estadoCancelada;
      default:
        return {};
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Citas Agendadas</Text>

      {citas.length === 0 && (
        <Text style={styles.noCitas}>No tienes citas agendadas.</Text>
      )}

      {citas.map((cita) => {
        const pasada = isPast(cita.fecha, cita.hora);
        return (
          <View
            key={cita.id}
            style={[
              styles.card,
              isDesktop && { maxWidth: 600, alignSelf: "flex-start" },
              pasada && { opacity: 0.5 },
            ]}
          >
            <View style={styles.cardHeader}>
              <Icon name="account" size={20} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>{cita.nombre_estudiante}</Text>
            </View>

            <Text style={styles.text}>
              Fecha: {formatFecha(cita.fecha)} a las {cita.hora} hrs.
            </Text>

            <View style={[styles.badge, getEstadoStyle(cita.estado)]}>
              <Text style={styles.badgeText}>{cita.estado}</Text>
            </View>

            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => Linking.openURL(LINK_MEET)}
            >
              <Text style={styles.joinButtonText}>Unirse a la cita</Text>
            </TouchableOpacity>

            {cita.estado !== "Cancelada" && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelar(cita.id)}
              >
                <Text style={styles.cancelButtonText}>Cancelar cita</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      })}

      <ConfirmModal
        visible={confirmVisible}
        message="¿Estás seguro que deseas cancelar esta cita?"
        onCancel={() => {
          setCitaSeleccionada(null);
          setConfirmVisible(false);
        }}
        onConfirm={handleConfirmarCancelacion}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.backgroundLight,
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  noCitas: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.sizes.md,
    color: theme.colors.textDark,
    textAlign: "center",
  },
  card: {
    backgroundColor: theme.colors.textLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  cardTitle: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.md,
    color: theme.colors.textDark,
  },
  text: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.sizes.md,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 8,
  },
  badgeText: {
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.sm,
    color: "#fff",
  },
  estadoConfirmada: {
    backgroundColor: theme.colors.success,
  },
  estadoPendiente: {
    backgroundColor: theme.colors.warning,
  },
  estadoCancelada: {
    backgroundColor: theme.colors.error,
  },
  joinButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  joinButtonText: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.textLight,
    fontSize: theme.sizes.md,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: theme.colors.error,
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  cancelButtonText: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.error,
  },
});
