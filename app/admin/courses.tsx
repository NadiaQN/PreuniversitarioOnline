import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import { useRouter } from "expo-router";
import { loadCourses, deleteCourse } from "../../services/coursesService";
import { Course } from "../../models/Courses";
import { theme } from "../../theme/theme";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomButton from "../../components/Button";
import MessageModal from "../../components/MessageModal";

export default function CoursesScreen() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  useEffect(() => {
    const fetchCourses = async () => {
      const storedCourses = loadCourses();
      setCourses(storedCourses);
      setFilteredCourses(storedCourses);
    };

    fetchCourses();
  }, []);

  // 🔹 Filtrar cursos mientras el usuario escribe
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  const handleDeleteCourse = (courseId: string) => {
    Alert.alert("Confirmar eliminación", "¿Estás seguro de que deseas eliminar este curso?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Eliminar",
        style: "destructive",
        onPress: () => {
          deleteCourse(courseId);
          setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
          setFilteredCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
          setModalMessage("Curso eliminado correctamente");
          setModalType("success");
          setModalVisible(true);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Cursos</Text>

      {/* 🔹 Campo de búsqueda */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar curso por nombre..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 🔹 Botón para agregar curso */}
      <View style={styles.addButtonContainer}>
        <CustomButton title="Agregar Curso" onPress={() => router.push("../(adminPages)/coursesForm")} variant="success" />
      </View>

      {/* 🔹 Listado de cursos */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.courseCard}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseName}>{item.name}</Text>
              <Text style={styles.materialsText}>
                {item.materials && item.materials.length > 0
                  ? `${item.materials.length} archivo(s) adjunto(s)`
                  : "Sin archivos adjuntos"}
              </Text>
            </View>

            {/* 🔹 Botones de acción */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => router.push(`../(adminPages)/coursesForm?courseId=${item.id}`)} style={styles.iconButton}>
                <Icon name="pencil-outline" size={24} color={theme.colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteCourse(item.id)} style={styles.iconButton}>
                <Icon name="trash-can-outline" size={24} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* 🔹 Modal de confirmación */}
      <MessageModal visible={modalVisible} message={modalMessage} type={modalType} onClose={() => setModalVisible(false)} />
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
    fontSize: theme.sizes.md,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: theme.colors.textLight,
  },
  addButtonContainer: {
    alignItems: "flex-end",
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: theme.colors.textLight,
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  courseInfo: {
    flex: 1,
  },
  courseName: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  materialsText: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    textAlign: "left",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
});
