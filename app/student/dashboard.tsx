import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { theme } from "../../theme/theme";
import { getUserFromStorage } from "../../utils/storage";
import { getCitasByUser } from "../../services/citaService";
import { Cita } from "../../models/Cita";
import { useDevice } from "../../hooks/useDevice";
import AsyncStorage from "@react-native-async-storage/async-storage";

const frasesMotivacionales = [
  "¡Cada paso cuenta, sigue avanzando!",
  "Tú puedes lograrlo, confía en ti.",
  "El esfuerzo de hoy es el éxito de mañana.",
  "Nunca pares de aprender.",
  "Estás más cerca de lo que crees.",
];

export default function StudentDashboard() {
  const router = useRouter();
  const { isMobile, isTabletOrDesktop } = useDevice();

  const [studentName, setStudentName] = useState("Estudiante");
  const [proximaCita, setProximaCita] = useState<Cita | null>(null);
  const [frase, setFrase] = useState("");
  const [progreso, setProgreso] = useState(65); // simulado

  useEffect(() => {
    const loadUserData = async () => {
      const user = await getUserFromStorage();
      if (user?.name) setStudentName(user.name);

      if (user?.id) {
        const citas = getCitasByUser(user.id, "estudiante");
        const futura = citas.find((c) => new Date(c.fecha) >= new Date());
        setProximaCita(futura ?? null);
      }

      setFrase(
        frasesMotivacionales[
          Math.floor(Math.random() * frasesMotivacionales.length)
        ]
      );
    };

    loadUserData();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("user");
    router.replace("/login");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hola, {studentName} 👋</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logout}>
          <Icon name="logout" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>¿Qué te gustaría hacer hoy?</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/student/courses")}
        >
          <Icon
            name="book-outline"
            size={32}
            color={theme.colors.primary}
          />
          <Text style={styles.cardTitle}>Mis Cursos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/student/citas")}
        >
          <Icon
            name="calendar-month-outline"
            size={32}
            color={theme.colors.primary}
          />
          <Text style={styles.cardTitle}>Citas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/student/progress")}
        >
          <Icon
            name="chart-line-variant"
            size={32}
            color={theme.colors.primary}
          />
          <Text style={styles.cardTitle}>Progreso</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => router.push("/profile")}
        >
          <Icon
            name="account-circle-outline"
            size={32}
            color={theme.colors.primary}
          />
          <Text style={styles.cardTitle}>Perfil</Text>
        </TouchableOpacity>
      </View>

      {/* 📅 Próxima cita */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próxima Cita</Text>
        {proximaCita ? (
          <Text style={styles.textInfo}>
            {proximaCita.fecha} a las {proximaCita.hora}
          </Text>
        ) : (
          <Text style={styles.textMuted}>No tienes citas agendadas.</Text>
        )}
      </View>

      {/* 📊 Progreso */}
      {isTabletOrDesktop && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tu Progreso</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progreso}%` },
              ]}
            />
          </View>
          <Text style={styles.textInfo}>{progreso}% completado</Text>
        </View>
      )}

      {/* 💬 Frase motivacional */}
      {isTabletOrDesktop && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Motivación del Día</Text>
          <Text style={styles.textInfo}>{frase}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.backgroundLight,
    padding: 20,
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  logout: {
    padding: 8,
  },
  subtitle: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    marginTop: 8,
    marginBottom: 24,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  card: {
    backgroundColor: theme.colors.textLight,
    width: "47%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    textAlign: "center",
  },
  section: {
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  textInfo: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
  },
  textMuted: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textMuted ?? "#999",
  },
  progressBar: {
    height: 12,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.success,
  },
});
