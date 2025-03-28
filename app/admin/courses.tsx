import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { mockCourses, deleteMockCourse } from "../../mocks/courses";
import CustomButton from "../../components/Button";
import MessageModal from "../../components/MessageModal";
import { theme } from "../../theme/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function CoursesScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState(mockCourses);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState(""); // 🔹 Estado para la búsqueda
  const [message, setMessage] = useState(""); // 🔹 Mensaje del modal
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  const [messageModalVisible, setMessageModalVisible] = useState(false);

  // 🔹 Filtrar cursos según el texto de búsqueda
  const filteredCourses = courses.filter((course) =>
    course.name.toLowerCase().includes(searchText.toLowerCase())
  );

  // 🔹 Mostrar el modal de confirmación
  const confirmDelete = (id: string) => {
    setSelectedCourse(id);
    setModalVisible(true);
  };

  // 🔹 Función para eliminar curso
  const handleDelete = () => {
    if (selectedCourse) {
      deleteMockCourse(selectedCourse);
      setCourses([...mockCourses]); // 🔹 Actualizar la lista de cursos
      setMessage("Curso eliminado correctamente");
      setMessageType("success");
      setMessageModalVisible(true);
      setModalVisible(false); // 🔹 Cerrar el modal de confirmación

      // 🔹 Cerrar automáticamente el MessageModal después de 3 segundos
      setTimeout(() => {
        setMessageModalVisible(false);
      }, 3000);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Cursos</Text>

      {/* 🔹 Campo de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar curso..."
        placeholderTextColor={theme.colors.textDark}
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* 🔹 Botón para Agregar Curso */}
      <CustomButton
        title="Agregar Curso"
        onPress={() => router.push("../admin/coursesForm")}
        variant="success"
        iconName="plus-circle-outline"
        style={styles.addButton}
      />

      {/* 🔹 Lista de Cursos */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.courseItem}>
            <View>
              <Text style={styles.courseText}>{item.name}</Text>
              {item.materials.length > 0 && (
                <TouchableOpacity onPress={() => router.push(`../admin/courseMaterials?courseId=${item.id}`)}>
                  <Text style={styles.viewMaterials}>Ver Materiales</Text>
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.buttonsContainer}>
              <TouchableOpacity onPress={() => router.push(`../admin/coursesForm?courseId=${item.id}`)}>
                <Icon name="pencil-outline" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => confirmDelete(item.id)}>
                <Icon name="trash-can-outline" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* 🔹 Modal de Confirmación */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>¿Estás seguro de que deseas eliminar este curso?</Text>
            <View style={styles.modalButtons}>
              <CustomButton title="Cancelar" onPress={() => setModalVisible(false)} variant="primary" outline />
              <CustomButton title="Eliminar" onPress={handleDelete} variant="error" />
            </View>
          </View>
        </View>
      </Modal>

      {/* 🔹 Mensaje de éxito/error con autocierre */}
      <MessageModal visible={messageModalVisible} message={message} type={messageType} onClose={() => setMessageModalVisible(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.backgroundLight,
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  searchInput: {
    height: 48,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    backgroundColor: theme.colors.textLight,
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 16,
    alignSelf: "flex-end",
  },
  courseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.textLight,
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  courseText: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
  },
  viewMaterials: {
    color: theme.colors.primary,
    fontSize: theme.sizes.sm,
    marginTop: 4,
    textDecorationLine: "underline",
  },
  buttonsContainer: {
    flexDirection: "row",
    gap: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: theme.colors.backgroundLight,
    padding: 20,
    borderRadius: 8,
    width: "80%",
  },
  modalText: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    textAlign: "center",
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
});
