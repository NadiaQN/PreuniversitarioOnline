import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
  Platform,
  Linking,
} from "react-native";
import { useFocusEffect } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { Calendar } from "react-native-calendars";
import { theme } from "../../theme/theme";
import { useCallback, useState } from "react";
import { getUserFromStorage } from "../../utils/storage";
import { getCitasByUser } from "../../services/citaService";
import { Cita } from "../../models/Cita";
import { LINK_MEET } from "../../utils/constants";
import { mockUsers } from "../../mocks/users";

export default function TutorDashboard() {
  const [tutorName, setTutorName] = useState("");
  const [citas, setCitas] = useState<(Cita & { nombre_estudiante: string })[]>([]);
  const [markedDates, setMarkedDates] = useState({});
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const user = await getUserFromStorage();
        if (!user) return;

        setTutorName(user.name);

        const citasTutor = getCitasByUser(user.id, "tutor")
          .map((cita) => {
            const estudiante = mockUsers.find(
              (u) => u.id === cita.id_estudiante && u.role === "Estudiante"
            );
            return {
              ...cita,
              nombre_estudiante: estudiante?.name || "Estudiante desconocido",
            };
          })
          .sort(
            (a, b) =>
              new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
          );

        setCitas(citasTutor.slice(0, 3));

        const marked = citasTutor.reduce((acc, cita) => {
          acc[cita.fecha] = {
            selected: true,
            marked: true,
            selectedColor: theme.colors.primary,
          };
          return acc;
        }, {} as any);

        setMarkedDates(marked);
      };

      loadData();
    }, [])
  );

  const formatDate = (fecha: string) => {
    const date = new Date(fecha);
    return `${date.getDate().toString().padStart(2, "0")}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getFullYear()}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Bienvenido, {tutorName}</Text>

      <View style={styles.wrapper}>
        {/* Citas próximas */}
        <View style={styles.leftColumn}>
          {citas.map((cita, index) => {
            const fecha = new Date(cita.fecha);
            const dia = fecha.getDate().toString().padStart(2, "0");
            const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
            const año = fecha.getFullYear();
            return (
              <View key={index} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>
                    Cita con {cita.nombre_estudiante}
                  </Text>
                </View>
                <Text style={styles.text}>Fecha: {`${dia}-${mes}-${año}`}</Text>
                <Text style={styles.text}>Hora: {cita.hora} hrs.</Text>
                <TouchableOpacity
                  style={styles.joinButton}
                  onPress={() => Linking.openURL(LINK_MEET)}
                >
                  <Text style={styles.joinButtonText}>Unirse a la cita</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Calendario */}
        {!isMobile && (
          <View style={styles.rightColumn}>
            <View style={{ width: "50%", paddingRight: 16 }}>
              <Calendar
                markedDates={markedDates}
                style={styles.calendar}
                theme={{
                  todayTextColor: theme.colors.primary,
                  arrowColor: theme.colors.primary,
                }}
              />
            </View>
            <View style={{ flex: 1 }} />
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.backgroundLight,
    paddingTop: Platform.OS === "ios" ? 60 : 16,
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  wrapper: {
    flexDirection: Platform.OS === "web" ? "row" : "column",
    justifyContent: "space-between",
    gap: 32,
  },
  leftColumn: {
    width: Platform.OS === "web" ? "50%" : "100%",
    gap: 16,
  },
  rightColumn: {
    width: Platform.OS === "web" ? "50%" : "100%",
    alignItems: "center",
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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
  },
  text: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  joinButton: {
    backgroundColor: theme.colors.primary,
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  joinButtonText: {
    color: theme.colors.textLight,
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.md,
  },
  calendar: {
    width: "100%",
    borderRadius: 12,
    backgroundColor: theme.colors.textLight,
  },
});
