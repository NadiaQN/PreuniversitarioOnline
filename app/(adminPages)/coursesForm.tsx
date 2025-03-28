import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import MessageModal from "../../components/MessageModal";
import { theme } from "../../theme/theme";
import { addCourse, updateCourse, loadCourses } from "../../services/coursesService";
import { Course } from "../../models/Courses";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default function CourseForm() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [files, setFiles] = useState<{ name: string; uri: string; type: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedCourses = loadCourses();
    setCourses(storedCourses);
  
    if (courseId) {
      const loadedCourse = storedCourses.find((c) => c.id === courseId);
      if (loadedCourse) {
        setCourseName(loadedCourse.name);
        setDescription(loadedCourse.description);
        setObjectives(loadedCourse.objectives);
        setFiles(loadedCourse.materials && loadedCourse.materials.length > 0 ? loadedCourse.materials : []); // 🔹 Aseguramos que los archivos se carguen
      }
    }
  
    setIsLoading(false);
  }, [courseId]);
  
  const handleSubmit = async () => {
    if (!courseName || !description || !objectives) {
      setModalMessage("Todos los campos son obligatorios");
      setModalType("error");
      setModalVisible(true);
      return;
    }

    if (courseId) {
      await updateCourse(courseId, { name: courseName, description, objectives, materials: files });
      setModalMessage("Curso actualizado correctamente");
    } else {
      await addCourse({ name: courseName, description, objectives, materials: files });
      setModalMessage("Curso agregado correctamente");
    }

    setModalType("success");
    setModalVisible(true);

    setTimeout(() => router.push("/admin/courses"), 3000);
  };

  // 🔹 Seleccionar archivo PDF o imagen
  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        multiple: false,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFiles([...files, { name: file.name, uri: file.uri, type: file.mimeType || "application/pdf" }]);
      }
    } catch (error) {
      console.error("Error al seleccionar archivo:", error);
    }
  };

  // 🔹 Eliminar un archivo
  const handleRemoveFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      {/* 🔹 Botón de Volver */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Icon name="arrow-left" size={24} color={theme.colors.textDark} />
      </TouchableOpacity>

      <Text style={styles.title}>{courseId ? "Editar Curso" : "Agregar Curso"}</Text>

      <CustomInput label="Nombre del Curso" placeholder="Ingrese el nombre del curso" value={courseName} onChangeText={setCourseName} />
      <CustomInput label="Descripción del Curso" placeholder="Ingrese la descripción" value={description} onChangeText={setDescription} multiline />
      <CustomInput label="Objetivos del Curso" placeholder="Ingrese los objetivos" value={objectives} onChangeText={setObjectives} multiline />

      {/* 🔹 Botón para Adjuntar Archivo */}
      <CustomButton title="Adjuntar Material" onPress={handleSelectFile} variant="primary" iconName="file-plus-outline" />

      {/* 🔹 Mostrar Archivos Adjuntos */}
      <FlatList
        data={files}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.fileItem}>
            <Text style={styles.fileText}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveFile(item.name)}>
              <Icon name="trash-can-outline" size={24} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 🔹 Botones de Cancelar y Guardar */}
      <View style={styles.buttonContainer}>
        <CustomButton title="Cancelar" onPress={() => router.back()} variant="primary" outline />
        <CustomButton title={courseId ? "Actualizar Curso" : "Agregar Curso"} onPress={handleSubmit} variant="success" />
      </View>

      {/* 🔹 Modal de Confirmación */}
      <MessageModal visible={modalVisible} message={modalMessage} type={modalType} onClose={() => setModalVisible(false)} />
    </KeyboardAvoidingView>
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
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  fileItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: theme.colors.textLight,
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  fileText: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
