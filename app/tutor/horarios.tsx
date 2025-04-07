import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { getUserFromStorage } from "../../utils/storage";
import { HorarioTutores } from "../../models/HorarioTutores";
import { theme } from "../../theme/theme";
import { mockHorarioTutores } from "../../mocks/horarioTutores";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import ConfirmModal from "../../components/ConfirmModal";

export default function Horarios() {
  const [tutorId, setTutorId] = useState<number | null>(null);
  const [horarios, setHorarios] = useState<HorarioTutores[]>([]);
  const [fecha, setFecha] = useState<Date>(new Date());
  const [horaInicio, setHoraInicio] = useState<Date>(new Date());
  const [horaFin, setHoraFin] = useState<Date>(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [horarioAEliminar, setHorarioAEliminar] = useState<number | null>(null);

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        const user = await getUserFromStorage();
        if (user) {
          setTutorId(user.id);
          const disponibles = mockHorarioTutores.filter((h) => h.id_tutor === user.id);
          setHorarios(disponibles);
        }
      };
      loadUser();
    }, [])
  );

  const handleAdd = () => {
    if (horaInicio >= horaFin) {
      Alert.alert("Error", "La hora de inicio debe ser menor que la hora de fin.");
      return;
    }

    const nuevaFecha = fecha.toISOString().split("T")[0];

    const nuevoHorario: HorarioTutores = {
      id: mockHorarioTutores.length + 1,
      id_tutor: tutorId!,
      fecha: nuevaFecha,
      hora_inicio: horaInicio.toTimeString().slice(0, 5),
      hora_fin: horaFin.toTimeString().slice(0, 5),
      disponibilidad: "Disponible",
    };

    mockHorarioTutores.push(nuevoHorario);
    setHorarios([...horarios, nuevoHorario]);

    Alert.alert("Éxito", "Horario agregado correctamente.");
  };

  const confirmDelete = (id: number) => {
    setHorarioAEliminar(id);
    setConfirmVisible(true);
  };

  const handleConfirmDelete = () => {
    if (horarioAEliminar !== null) {
      const index = mockHorarioTutores.findIndex((h) => h.id === horarioAEliminar);
      if (index !== -1) {
        mockHorarioTutores.splice(index, 1);
        setHorarios((prev) => prev.filter((h) => h.id !== horarioAEliminar));
      }
      setHorarioAEliminar(null);
    }
    setConfirmVisible(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Disponibilidad</Text>

      <View style={[styles.cardContainer, isDesktop && styles.desktopCard]}>
        <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
          <Text style={styles.inputText}>
            Fecha: {fecha.getDate().toString().padStart(2, "0")}-{(fecha.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-{fecha.getFullYear()}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.input} onPress={() => setShowStartTimePicker(true)}>
          <Text style={styles.inputText}>
            Hora inicio: {horaInicio.toTimeString().slice(0, 5)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.input} onPress={() => setShowEndTimePicker(true)}>
          <Text style={styles.inputText}>
            Hora fin: {horaFin.toTimeString().slice(0, 5)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Agregar Horario</Text>
        </TouchableOpacity>
      </View>

      <DatePickerModal
        locale="es"
        mode="single"
        visible={showDatePicker}
        date={fecha}
        onDismiss={() => setShowDatePicker(false)}
        onConfirm={({ date }) => {
          setShowDatePicker(false);
          if (date) setFecha(date);
        }}
      />

      <TimePickerModal
        locale="es"
        visible={showStartTimePicker}
        onDismiss={() => setShowStartTimePicker(false)}
        onConfirm={({ hours, minutes }) => {
          const newTime = new Date(fecha);
          newTime.setHours(hours);
          newTime.setMinutes(minutes);
          setHoraInicio(newTime);
          setShowStartTimePicker(false);
        }}
        hours={horaInicio.getHours()}
        minutes={horaInicio.getMinutes()}
      />

      <TimePickerModal
        locale="es"
        visible={showEndTimePicker}
        onDismiss={() => setShowEndTimePicker(false)}
        onConfirm={({ hours, minutes }) => {
          const newTime = new Date(fecha);
          newTime.setHours(hours);
          newTime.setMinutes(minutes);
          setHoraFin(newTime);
          setShowEndTimePicker(false);
        }}
        hours={horaFin.getHours()}
        minutes={horaFin.getMinutes()}
      />

      <Text style={[styles.title, { marginTop: 24 }]}>Horarios Registrados</Text>

      <View style={[styles.cardContainer, isDesktop && styles.desktopCard]}>
        {horarios.length === 0 ? (
          <Text style={styles.text}>Aún no has registrado horarios.</Text>
        ) : (
          horarios.map((h) => (
            <View key={h.id} style={styles.subCard}>
              <Text style={styles.text}>
                Fecha: {h.fecha.split("-").reverse().join("-")}
              </Text>
              <Text style={styles.text}>
                Horario: {h.hora_inicio} - {h.hora_fin}
              </Text>
              <TouchableOpacity
                style={styles.deleteButtonOutline}
                onPress={() => confirmDelete(h.id)}
              >
                <Text style={styles.deleteButtonOutlineText}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <ConfirmModal
        visible={confirmVisible}
        message="¿Estás seguro que deseas eliminar este horario?"
        onCancel={() => {
          setConfirmVisible(false);
          setHorarioAEliminar(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 16,
    backgroundColor: theme.colors.backgroundLight,
    alignItems: "center",
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 12,
    textAlign: "center",
  },
  cardContainer: {
    backgroundColor: theme.colors.textLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: "100%",
    marginBottom: 24,
  },
  desktopCard: {
    maxWidth: "50%",
  },
  input: {
    backgroundColor: theme.colors.textLight,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  inputText: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
    width: "100%",
  },
  buttonText: {
    fontFamily: theme.fonts.bold,
    color: theme.colors.textLight,
  },
  subCard: {
    backgroundColor: theme.colors.textLight,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  text: {
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
  },
  deleteButtonOutline: {
    borderWidth: 1,
    borderColor: theme.colors.error,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: "flex-start",
    marginTop: 8,
  },
  deleteButtonOutlineText: {
    color: theme.colors.error,
    fontFamily: theme.fonts.bold,
  },
});
