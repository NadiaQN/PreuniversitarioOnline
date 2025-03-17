import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity, TextInput 
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { theme } from "../../theme/theme";
import { mockCourses } from "../../mocks/courses";
import { Course } from "@/models/Courses";

export default function CourseForm() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();

  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [files, setFiles] = useState<{ name: string; uri: string }[]>([]);

  useEffect(() => {
    if (courseId) {
      const course = mockCourses.find((c) => c.id === courseId);
      if (course) {
        setCourseName(course.name);
        setDescription(course.description);
        setObjectives(course.objectives);
        setFiles(course.materials || []);
      } else {
        Alert.alert("Error", "Curso no encontrado");
      }
    }
  }, [courseId]);

  const handleSubmit = () => {
    if (!courseName || !description || !objectives) {
      Alert.alert("Error", "Por favor completa todos los campos");
      return;
    }

    let courses: Course[] = [...mockCourses];

    if (courseId) {
      courses = courses.map(course =>
        course.id === courseId
          ? { ...course, name: courseName, description, objectives, materials: files }
          : course
      );
      Alert.alert("Éxito", "Curso actualizado correctamente");
    } else {
      courses.push({
        id: String(courses.length + 1),
        name: courseName,
        description,
        objectives,
        materials: files,
      });
      Alert.alert("Éxito", "Curso agregado correctamente");
    }

    router.push("/admin/courses");
  };

  // 🔹 Seleccionar archivo PDF, Video o Imagen
  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "video/*", "image/*"], 
        multiple: false,
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0]; 
        setFiles([...files, { name: file.name, uri: file.uri }]);
      }
    } catch (error) {
      console.error("Error al seleccionar archivo:", error);
    }
  };

  // 🔹 Eliminar un archivo
  const handleRemoveFile = (fileName: string) => {
    setFiles(files.filter((file) => file.name !== fileName));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      {/* 🔹 Icono de Volver Atrás */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Icon name="arrow-left" size={28} color={theme.colors.textDark} />
      </TouchableOpacity>

      <Text style={styles.title}>{courseId ? "Editar Curso" : "Agregar Curso"}</Text>

      <CustomInput label="Nombre del Curso" placeholder="Ingrese el nombre del curso" value={courseName} onChangeText={setCourseName} />

      {/* 🔹 Input más alto para Descripción */}
      <Text style={styles.label}>Descripción del Curso</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ingrese una breve descripción"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      {/* 🔹 Input más alto para Objetivos */}
      <Text style={styles.label}>Objetivos del Curso</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Ingrese los objetivos del curso"
        value={objectives}
        onChangeText={setObjectives}
        multiline
      />

      {/* 🔹 Botón para Adjuntar Materiales */}
      <CustomButton title="Adjuntar Material" onPress={handleSelectFile} variant="primary" iconName="file-plus-outline" />

      {/* 🔹 Mostrar Archivos Adjuntos */}
      <FlatList
        data={files}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.fileItem}>
            <Text style={styles.fileText}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveFile(item.name)}>
              <Icon name="close-circle" size={20} color={theme.colors.error} />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 🔹 Botones de Guardar y Cancelar (Alineados en fila) */}
      <View style={styles.buttonContainer}>
        <CustomButton title="Cancelar" onPress={() => router.back()} variant="error" outline />
        <CustomButton title="Guardar Curso" onPress={handleSubmit} variant="success" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10, 
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 16,
    textAlign: "center",
    marginTop: 50, 
  },
  label: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  input: {
    height: 48,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    backgroundColor: theme.colors.textLight,
    marginBottom: 16,
  },
  textArea: {
    height: 120, // ✅ Hace los inputs de descripción y objetivos más altos
    textAlignVertical: "top",
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
    flexDirection: "row", // ✅ Alinea los botones en fila
    justifyContent: "space-between",
    marginTop: 16,
    gap: 16,
  },
});
