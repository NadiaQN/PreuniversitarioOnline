import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getUserFromStorage } from "../../utils/storage";
import {
  getCheckedMaterials,
  updateStudentProgress,
} from "../../services/studentCoursesService";
import { getCourseById } from "../../services/coursesService";
import { Course } from "../../models/Courses";
import { useDevice } from "../../hooks/useDevice";
import ProgressBar from "../../components/ProgressBar";
import { theme } from "../../theme/theme";

export default function CourseDetail() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [checkedMaterials, setCheckedMaterials] = useState<string[]>([]);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [notFound, setNotFound] = useState(false);
  const { isTabletOrDesktop } = useDevice();

  useEffect(() => {
    const fetchData = async () => {
      const user = await getUserFromStorage();
      if (!user?.id || !courseId) return;

      setStudentId(user.id);
      const courseData = getCourseById(courseId);

      if (!courseData) {
        setNotFound(true);
        return;
      }

      setCourse(courseData);
      const checked = getCheckedMaterials(user.id, courseId);
      setCheckedMaterials(checked);
    };

    fetchData();
  }, [courseId]);

  const handleToggle = (materialName: string) => {
    if (!studentId || !courseId || !course) return;

    const alreadyChecked = checkedMaterials.includes(materialName);
    const updatedChecked = alreadyChecked
      ? checkedMaterials.filter((m) => m !== materialName)
      : [...checkedMaterials, materialName];

    setCheckedMaterials(updatedChecked);

    const newProgress = Number(
      ((updatedChecked.length / course.materials.length) * 100).toFixed(0)
    );

    updateStudentProgress(studentId, courseId, updatedChecked, newProgress);
  };

  if (notFound || !course) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Curso no encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={[styles.container, isTabletOrDesktop && styles.desktopContainer]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-left" size={20} color={theme.colors.primary} />
          <Text style={styles.backText}>Volver</Text>
        </TouchableOpacity>

        <Text style={styles.title}>{course.name}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.sectionText}>{course.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Objetivos</Text>
          <Text style={styles.sectionText}>{course.objectives}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Progreso</Text>
          <ProgressBar progress={checkedMaterials.length / course.materials.length} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Materiales del curso</Text>
          {course.materials.map((material, index) => (
            <View key={index} style={styles.materialRow}>
              <Checkbox
                value={checkedMaterials.includes(material.name)}
                onValueChange={() => handleToggle(material.name)}
                color={theme.colors.primary}
              />
              <Text style={styles.materialText}>{material.name}</Text>
              <TouchableOpacity
                onPress={() => Linking.openURL(material.uri)}
                style={styles.downloadBtn}
              >
                <Text style={styles.downloadText}>Descargar</Text>
                <Icon name="download" size={16} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: theme.colors.backgroundLight,
  },
  container: {
    backgroundColor: theme.colors.textLight,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignSelf: "center",
    width: "100%",
  },
  desktopContainer: {
    width: "60%",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  backText: {
    marginLeft: 6,
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
    fontSize: theme.sizes.sm,
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 16,
    textAlign: "center",
    marginTop: 12,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    marginBottom: 12,
    color: theme.colors.textDark,
  },
  sectionText: {
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    lineHeight: 20,
    marginBottom: 16,
  },
  materialRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
    flexWrap: "wrap",
  },
  materialText: {
    flex: 1,
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
  },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
  },
  downloadText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
    fontSize: theme.sizes.sm,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: theme.sizes.md,
    color: theme.colors.error,
  },
});
