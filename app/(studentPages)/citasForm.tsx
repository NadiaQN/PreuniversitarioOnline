import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../theme/theme";
import { useDevice } from "../../hooks/useDevice";
import {
  getDisponibilidadPorFecha,
  getFechasDisponibles,
  getHorasPorFecha,
  addCita,
} from "../../services/citaService";
import { getUserFromStorage } from "../../utils/storage";
import { getUsers } from "../../services/userService";
import { User } from "../../models/User";
import MessageModal from "../../components/MessageModal";
import { useRouter } from "expo-router";

export default function CitasForm() {
  const [studentId, setStudentId] = useState<number | null>(null);
  const [tutores, setTutores] = useState<User[]>([]);
  const [selectedTutorId, setSelectedTutorId] = useState<number | null>(null);
  const [fechasDisponibles, setFechasDisponibles] = useState<string[]>([]);
  const [selectedFecha, setSelectedFecha] = useState<string | null>(null);
  const [horasDisponibles, setHorasDisponibles] = useState<
    { hora_inicio: string; hora_fin: string }[]
  >([]);
  const [selectedHora, setSelectedHora] = useState<string | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  const { isMobile } = useDevice();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserFromStorage();
      if (user?.id) setStudentId(user.id);
      const allUsers = getUsers();
      const onlyTutores = allUsers.filter((u) => u.role === "Tutor");
      setTutores(onlyTutores);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedTutorId) {
      const fechas = getFechasDisponibles(selectedTutorId);
      setFechasDisponibles(fechas);
      setSelectedFecha(null);
      setHorasDisponibles([]);
      setSelectedHora(null);
    }
  }, [selectedTutorId]);

  useEffect(() => {
    if (selectedTutorId && selectedFecha) {
      const horas = getHorasPorFecha(selectedTutorId, selectedFecha);
      setHorasDisponibles(horas);
      setSelectedHora(null);
    }
  }, [selectedFecha]);

  const handleAgendar = () => {
    if (!studentId || !selectedTutorId || !selectedFecha || !selectedHora) {
      setModalMessage("Por favor completa todos los campos.");
      setModalType("error");
      setModalVisible(true);
      return;
    }

    addCita({
      id_estudiante: studentId,
      id_tutor: selectedTutorId,
      fecha: selectedFecha,
      hora: selectedHora,
      estado: "Pendiente",
      meetLink: "https://meet.google.com/hjr-foog-zgj",
    });

    setModalMessage("¡Cita agendada con éxito!");
    setModalType("success");
    setModalVisible(true);

    setTimeout(() => router.push("/student/citas"), 1000);
  };

  return (
    <ScrollView style={styles.scroll}>
      <View style={[styles.content, Platform.OS === "ios" && { marginTop: 40 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>

        <Text style={styles.title}>Agendar Cita</Text>

        <Text style={styles.label}>Selecciona un tutor</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
          {tutores.map((tutor) => (
            <TouchableOpacity
              key={tutor.id}
              style={[
                styles.card,
                selectedTutorId === tutor.id && styles.cardSelected,
              ]}
              onPress={() => setSelectedTutorId(tutor.id)}
            >
              <Icon name="account-circle-outline" size={32} color={theme.colors.primary} />
              <Text style={styles.cardText}>{tutor.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {selectedTutorId && (
          <>
            <Text style={styles.label}>Selecciona una fecha</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
              {fechasDisponibles.map((fecha) => {
                const date = new Date(fecha);
                const dayName = date.toLocaleDateString("es-ES", { weekday: "short" });
                const dayNumber = date.getDate();
                const monthName = date.toLocaleDateString("es-ES", { month: "short" });
                const isSelected = selectedFecha === fecha;

                return (
                  <TouchableOpacity
                    key={fecha}
                    style={[
                      styles.dateCard,
                      isSelected && styles.cardSelected,
                    ]}
                    onPress={() => setSelectedFecha(fecha)}
                  >
                    <Text style={styles.dayName}>{dayName}</Text>
                    <Text style={styles.dayNumber}>{dayNumber}</Text>
                    <Text style={styles.monthName}>{monthName}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}

        {selectedFecha && (
          <>
            <Text style={styles.label}>Selecciona una hora</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollRow}>
              {horasDisponibles.map((hora, index) => {
                const horaTexto = `${hora.hora_inicio} - ${hora.hora_fin}`;
                const seleccionada = selectedHora === hora.hora_inicio;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.timeCard, seleccionada && styles.cardSelected]}
                    onPress={() => setSelectedHora(hora.hora_inicio)}
                  >
                    <Text style={styles.cardText}>{horaTexto}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}

        <TouchableOpacity onPress={handleAgendar} style={styles.agendarBtn}>
          <Icon name="calendar-plus" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.agendarBtnText}>Agendar</Text>
        </TouchableOpacity>

        <MessageModal
          visible={modalVisible}
          message={modalMessage}
          type={modalType}
          onClose={() => setModalVisible(false)}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: theme.sizes.lg + 2,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  label: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    marginBottom: 8,
    marginTop: 16,
  },
  scrollRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  card: {
    backgroundColor: theme.colors.textLight,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    width: 120,
    height: 100,
  },
  dateCard: {
    backgroundColor: theme.colors.textLight,
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    width: 100,
    height: 100,
  },
  timeCard: {
    backgroundColor: theme.colors.textLight,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  cardSelected: {
    backgroundColor: theme.colors.textLight,
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  cardText: {
    marginTop: 8,
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    textAlign: "center",
  },
  dayName: {
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    textTransform: "capitalize",
  },
  dayNumber: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  monthName: {
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    textTransform: "capitalize",
  },
  agendarBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
    width: 300
  },
  agendarBtnText: {
    color: "#fff",
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
  },
});
