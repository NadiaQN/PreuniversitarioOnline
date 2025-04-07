import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../theme/theme";
import { getUserFromStorage } from "../../utils/storage";
import { getCoursesByStudent } from "../../services/studentCoursesService";
import { StudentCourse } from "../../models/StudentCourse";
import { Course } from "../../models/Courses";
import { getCourseById } from "../../services/coursesService";

export default function StudentCourses() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [courseDetails, setCourseDetails] = useState<(Course & { progress: number })[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      const user = await getUserFromStorage();
      if (!user) return;

      const cursosEstudiante: StudentCourse[] = getCoursesByStudent(user.id);
      setCourses(cursosEstudiante);

      const detalles = cursosEstudiante.map((sc) => {
        const full = getCourseById(sc.courseId);
        if (!full) return null;
        return {
          ...full,
          progress: sc.progress / 100,
        };
      }).filter(Boolean) as (Course & { progress: number })[];

      setCourseDetails(detalles);
    };

    fetchCourses();
  }, []);

  const renderItem = ({ item }: { item: Course & { progress: number } }) => (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.courseName}>{item.name}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => router.push(`/(studentPages)/courseDetail?courseId=${item.id}`)}
      >
        <Text style={styles.viewMore}>
          Ver más <Icon name="chevron-right" size={18} />
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Progreso de mis cursos</Text>
      <FlatList
        data={courseDetails}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: theme.colors.backgroundLight,
    flex: 1,
  },
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: theme.colors.textLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  courseName: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    marginBottom: 8,
  },
  progressBar: {
    height: 10,
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  viewMore: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
});
