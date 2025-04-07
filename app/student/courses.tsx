import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../theme/theme";
import { getUserFromStorage } from "../../utils/storage";
import { getCoursesByStudent } from "../../services/studentCoursesService";
import { StudentCourse } from "../../models/StudentCourse";
import { Course } from "../../models/Courses";
import { getCourseById } from "../../services/coursesService";
import { useDevice } from "../../hooks/useDevice";

export default function StudentCourses() {
  const router = useRouter();
  const [courseDetails, setCourseDetails] = useState<(Course & { progress: number })[]>([]);
  const { isTabletOrDesktop } = useDevice();

  useFocusEffect(
    useCallback(() => {
      const fetchCourses = async () => {
        const user = await getUserFromStorage();
        if (!user) return;

        const cursosEstudiante: StudentCourse[] = getCoursesByStudent(user.id);

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
    }, [])
  );

  const renderItem = ({ item }: { item: Course & { progress: number } }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.courseName}>{item.name}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress * 100}%` }]} />
        </View>
        <TouchableOpacity
          onPress={() => router.push(`/(studentPages)/courseDetail?courseId=${item.id}`)}
          style={styles.viewMoreBtn}
          accessibilityRole="button"
          accessibilityLabel={`Ver más detalles del curso ${item.name}`}
        >
          <Text style={styles.viewMoreText}>
            Ver más <Icon name="chevron-right" size={16} color={theme.colors.primary} />
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.page}>
      <View style={[styles.container, isTabletOrDesktop && styles.desktopContainer]}>
        <Text style={styles.title}>Mis Cursos</Text>

        {courseDetails.length === 0 ? (
          <Text style={styles.noCourses}>Aún no tienes cursos asignados.</Text>
        ) : (
          <FlatList
            data={courseDetails}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ gap: 16, paddingBottom: 24 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: theme.colors.backgroundLight,
    padding: 16,
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
  title: {
    fontSize: theme.sizes.lg,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 24,
    textAlign: "center",
  },
  noCourses: {
    fontSize: theme.sizes.md,
    color: theme.colors.textDark,
    textAlign: "center",
    marginTop: 24,
  },
  card: {
    backgroundColor: theme.colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  courseName: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
  },
  viewMoreBtn: {
    alignSelf: "flex-start",
  },
  viewMoreText: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.regular,
    fontSize: theme.sizes.sm,
  },
});
