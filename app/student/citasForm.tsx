import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { mockUsers } from "../../mocks/users";
import { getUserFromStorage } from "../../utils/storage";
import { theme } from "../../theme/theme";
import {
  getFechasDisponibles,
  getHorasPorFecha,
  addCita,
} from "../../services/citaService";
import CustomButton from "../../components/Button";
import MessageModal from "../../components/MessageModal";

export default function CitaForm() {
  const router = useRouter();

  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [tutores, setTutores] = useState<{ id: number; name: string }[]>([]);
  const [tutorSeleccionado, setTutorSeleccionado] = useState("");
  const [fechas, setFechas] = useState<string[]>([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState("");
  const [horas, setHoras] = useState<{ hora_inicio: string; hora_fin: string }[]>([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState<{ hora_inicio: string; hora_fin: string } | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [modalMessage, setModalMessage] = useState("");

  const MEET_LINK = "https://meet.google.com/falso-codigo";

  useEffect(() => {
    const loadUser = async () => {
      const user = await getUserFromStorage();
      if (user?.id) setCurrentUserId(user.id);
    };
    loadUser();

    const tutoresFiltrados = mockUsers
      .filter((u) => u.role === "Tutor")
      .map(({ id, name }) => ({ id, name }));
    setTutores(tutoresFiltrados);
  }, []);

  useEffect(() => {
    if (tutorSeleccionado) {
      const fechas = getFechasDisponibles(Number(tutorSeleccionado));
      setFechas(fechas);
      setFechaSeleccionada("");
      setHoraSeleccionada(null);
      setHoras([]);
    }
  }, [tutorSeleccionado]);

  useEffect(() => {
    if (tutorSeleccionado && fechaSeleccionada) {
      const horas = getHorasPorFecha(Number(tutorSeleccionado), fechaSeleccionada);
      setHoras(horas);
    }
  }, [fechaSeleccionada]);

  const handleSubmit = () => {
    if (!currentUserId || !tutorSeleccionado || !fechaSeleccionada || !horaSeleccionada) {
      setModalMessage("Completa todos los campos");
      setModalType("error");
      setModalVisible(true);
      return;
    }

    addCita({
      id_estudiante: currentUserId,
      id_tutor: Number(tutorSeleccionado),
      fecha: fechaSeleccionada,
      hora: horaSeleccionada.hora_inicio,
      estado: "Pendiente",
      meetLink: MEET_LINK,
    });

    setModalMessage("Cita agendada correctamente");
    setModalType("success");
    setModalVisible(true);

    setTimeout(() => router.replace("/student/citas"), 3000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agendar Nueva Cita</Text>

      <Text style={styles.label}>Tutor</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={tutorSeleccionado}
          onValueChange={(value) => setTutorSeleccionado(value)}
        >
          <Picker.Item label="Selecciona un tutor" value="" />
          {tutores.map((t) => (
            <Picker.Item key={t.id} label={t.name} value={String(t.id)} />
          ))}
        </Picker>
      </View>

      {fechas.length > 0 && (
        <>
          <Text style={styles.label}>Fecha disponible</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fechaSeleccionada}
              onValueChange={(value) => setFechaSeleccionada(value)}
            >
              <Picker.Item label="Selecciona una fecha" value="" />
              {fechas.map((f, index) => (
                <Picker.Item key={index} label={f} value={f} />
              ))}
            </Picker>
          </View>
        </>
      )}

      {horas.length > 0 && (
        <>
          <Text style={styles.label}>Hora disponible</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={horaSeleccionada?.hora_inicio ?? ""}
              onValueChange={(value) => {
                const selected = horas.find((h) => h.hora_inicio === value);
                if (selected) setHoraSeleccionada(selected);
              }}
            >
              <Picker.Item label="Selecciona una hora" value="" />
              {horas.map((h, index) => (
                <Picker.Item
                  key={index}
                  label={`${h.hora_inicio} - ${h.hora_fin}`}
                  value={h.hora_inicio}
                />
              ))}
            </Picker>
          </View>
        </>
      )}

      <CustomButton title="Agendar Cita" onPress={handleSubmit} />

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
    backgroundColor: theme.colors.backgroundLight,
    padding: 20,
    justifyContent: "flex-start",
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    marginBottom: 4,
    color: theme.colors.textDark,
  },
  pickerContainer: {
    backgroundColor: theme.colors.textLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginBottom: 16,
  },
});
