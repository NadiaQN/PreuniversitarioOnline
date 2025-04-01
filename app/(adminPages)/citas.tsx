import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  getCitas,
  deleteCita,
  getCitasByEstado,
} from "../../services/citaService";
import { Cita, CitaEstado } from "../../models/Cita";
import { theme } from "../../theme/theme";
import MessageModal from "../../components/MessageModal";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../../components/Button";

const estados: CitaEstado[] = ["Pendiente", "Confirmada", "Cancelada"];

export default function AdminCitas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [estadoFiltro, setEstadoFiltro] = useState<CitaEstado | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  useEffect(() => {
    setCitas(getCitas());
  }, []);

  const handleFiltro = (estado: CitaEstado | null) => {
    if (estado === null) {
      setCitas(getCitas());
      setEstadoFiltro(null);
    } else {
      setCitas(getCitasByEstado(estado));
      setEstadoFiltro(estado);
    }
  };

  const handleDelete = (id: number) => {
    deleteCita(id);
    const actualizadas = estadoFiltro
      ? getCitasByEstado(estadoFiltro)
      : getCitas();
    setCitas(actualizadas);
    setModalMessage("Cita eliminada correctamente");
    setModalType("success");
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Citas</Text>

      {/* 🔹 Filtros por estado */}
      <View style={styles.filterContainer}>
        <CustomButton
          title="Todas"
          onPress={() => handleFiltro(null)}
          variant="primary"
          outline={!estadoFiltro}
        />
        {estados.map((estado) => (
          <CustomButton
            key={estado}
            title={estado}
            onPress={() => handleFiltro(estado)}
            variant="primary"
            outline={estadoFiltro !== estado}
          />
        ))}
      </View>

      {/* 🔹 Lista de citas */}
      <FlatList
        data={citas}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoText}>
                📅 {item.fecha} - {item.hora}
              </Text>
              <Text style={styles.infoText}>
                🎓 Estudiante: {item.id_estudiante}
              </Text>
              <Text style={styles.infoText}>
                👨‍🏫 Tutor: {item.id_tutor}
              </Text>
              <Text style={styles.infoText}>🔗 Meet: {item.meetLink}</Text>
              <Text
                style={[
                  styles.estado,
                  {
                    color:
                      theme.colors[
                        item.estado.toLowerCase() as keyof typeof theme.colors
                      ],
                  },
                ]}
              >
                Estado: {item.estado}
              </Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Icon
                  name="trash-can-outline"
                  size={24}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* 🔹 Modal de éxito */}
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
    padding: 16,
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  card: {
    backgroundColor: theme.colors.textLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    marginBottom: 4,
    color: theme.colors.textDark,
  },
  estado: {
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.bold,
    marginTop: 4,
  },
  actions: {
    gap: 8,
  },
});
