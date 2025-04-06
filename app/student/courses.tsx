import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../theme/theme";

// 🔹 Este mock puede ser reemplazado luego
const mockStudentCourses = [
  {
    id: "1",
    name: "Matemáticas",
    hasMaterials: true,
  },
  {
    id: "2",
    name: "Lenguaje",
    hasMaterials: false,
  },
  {
    id: "3",
    name: "Ciencias",
    hasMaterials: true,
  },
];

export default function StudentCourses() {
  const router = useRouter();

  const renderItem = ({ item }: { item: typeof mockStudentCourses[0] }) => (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <Text style={styles.courseName}>{item.name}</Text>
        <Text style={styles.materialText}>
          {item.hasMaterials
            ? "Incluye materiales disponibles"
            : "Sin materiales cargados"}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => router.push(`/student/courseDetail?id=${item.id}`)}
      >
        <Text style={styles.viewMore}>
          Ver más <Icon name="chevron-right" size={18} />
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cursos Disponibles</Text>
      <FlatList
        data={mockStudentCourses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ gap: 12 }}
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
  },
  courseName: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textDark,
    marginBottom: 4,
  },
  materialText: {
    fontSize: theme.sizes.sm,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textLight,
  },
  viewMore: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
});
