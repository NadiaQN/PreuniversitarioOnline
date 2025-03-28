import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, FlatList, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import CustomInput from "../../components/Input";
import CustomButton from "../../components/Button";
import { theme } from "../../theme/theme";
import { mockCourses, updateMockCourse, addMockCourse } from "../../mocks/courses";

export default function CoursesForm() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();

  const [courseName, setCourseName] = useState("");
  const [description, setDescription] = useState("");
  const [objectives, setObjectives] = useState("");
  const [files, setFiles] = useState<{ name: string; uri: string; type: string }[]>([]);

  // Estado de errores
  const [errors, setErrors] = useState<{ courseName?: string; description?: string; objectives?: string }>({});

  // 🔹 Cargar datos si estamos editando un curso
  useEffect(() => {
    if (courseId) {
      const course = mockCourses.find((c) => c.id === courseId);
      if (course) {
        setCourseName(course.name);
        setDescription(course.description);
        setObjectives(course.objectives);
        setFiles(course.materials || []);
      }
    }
  }, [courseId]);

  // 🔹 Seleccionar archivo (PDF, imagen, video)
  const handleSelectFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
      });

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        // 🔹 Usar setFiles con el estado previo para evitar que se pierdan archivos
        setFiles((prevFiles) => [...prevFiles, { name: file.name, uri: file.uri, type: file.mimeType || "application/octet-stream" }]);
      }
    } catch (error) {
      console.error("Error al seleccionar archivo:", error);
    }
  };

  // 🔹 Eliminar un archivo adjunto
  const handleRemoveFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      {/* 🔹 Botón Volver */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{courseId ? "Editar Curso" : "Agregar Curso"}</Text>

      <View style={styles.inputContainer}>
        <CustomInput
          label="Nombre del Curso"
          placeholder="Ingrese el nombre"
          value={courseName}
          onChangeText={(text) => setCourseName(text)}
          style={errors.courseName ? styles.errorInput : undefined}
        />
        {errors.courseName && <Text style={styles.errorText}>{errors.courseName}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <CustomInput
          label="Descripción del Curso"
          placeholder="Ingrese una descripción"
          value={description}
          onChangeText={(text) => setDescription(text)}
          multiline
          style={errors.description ? styles.errorInput : undefined}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>

      <View style={styles.inputContainer}>
        <CustomInput
          label="Objetivos del Curso"
          placeholder="Ingrese los objetivos"
          value={objectives}
          onChangeText={(text) => setObjectives(text)}
          multiline
          style={errors.objectives ? styles.errorInput : undefined}
        />
        {errors.objectives && <Text style={styles.errorText}>{errors.objectives}</Text>}
      </View>

      {/* 🔹 Botón para Adjuntar Archivos */}
      <CustomButton title="Adjuntar Archivo" onPress={handleSelectFile} variant="primary" iconName="file-plus-outline" />

      {/* 🔹 Mostrar Archivos Adjuntos */}
      <FlatList
        data={files}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.fileItem}>
            <Text style={styles.fileText}>{item.name}</Text>
            <TouchableOpacity onPress={() => handleRemoveFile(item.name)}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* 🔹 Botones de Guardar y Cancelar */}
      <View style={styles.buttonContainer}>
        <CustomButton title="Cancelar" onPress={() => router.push("/admin/courses")} variant="primary" outline />
        <CustomButton
          title={courseId ? "Actualizar Curso" : "Agregar Curso"}
          onPress={() => {
            if (!courseName.trim() || !description.trim() || !objectives.trim()) {
              setErrors({
                courseName: !courseName.trim() ? "El nombre del curso es obligatorio." : undefined,
                description: !description.trim() ? "La descripción es obligatoria." : undefined,
                objectives: !objectives.trim() ? "Los objetivos son obligatorios." : undefined,
              });
              return;
            }

            if (courseId) {
              updateMockCourse(courseId, { name: courseName, description, objectives, materials: files });
            } else {
              addMockCourse({ name: courseName, description, objectives, materials: files });
            }

            router.replace("/admin/courses");
          }}
          variant="success"
          disabled={!courseName.trim() || !description.trim() || !objectives.trim()}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: theme.colors.backgroundLight,
    justifyContent: "flex-start",
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  backText: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 16,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  errorText: {
    color: theme.colors.error,
    fontSize: theme.sizes.sm,
    marginTop: 4,
    fontFamily: theme.fonts.regular,
  },
  errorInput: {
    borderColor: theme.colors.error,
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
  deleteText: {
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.bold,
    color: theme.colors.error,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
