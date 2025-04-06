import { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Platform,
    Linking,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getUserFromStorage } from "../../utils/storage";
import { getCheckedMaterials, toggleMaterialAsChecked } from "../../services/studentCoursesService";
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
    const { isMobile } = useDevice();

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
        if (studentId && courseId) {
            toggleMaterialAsChecked(studentId, courseId, materialName);
            const alreadyChecked = checkedMaterials.includes(materialName);
            const updated = alreadyChecked
                ? checkedMaterials.filter((item) => item !== materialName)
                : [...checkedMaterials, materialName];

            setCheckedMaterials(updated);
        }
    };

    if (notFound) {
        return (
            <View style={styles.container}>
                <Text style={styles.notFound}>Curso no encontrado.</Text>
            </View>
        );
    }

    const progress =
        course && course.materials.length > 0
            ? checkedMaterials.length / course.materials.length
            : 0;

    return (
        <ScrollView style={styles.scroll}>
            <View style={styles.pageContainer}>
                {/* Botón volver fuera del cuadro */}
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color={theme.colors.primary} />
                </TouchableOpacity>

                <View style={styles.card}>
                    <Text style={styles.title}>{course?.name}</Text>

                    <Text style={styles.label}>Progreso:</Text>
                    <ProgressBar progress={progress} />

                    <Text style={styles.label}>Descripción:</Text>
                    <Text style={styles.text}>{course?.description}</Text>

                    <Text style={styles.label}>Objetivos:</Text>
                    <Text style={styles.text}>{course?.objectives}</Text>

                    <Text style={styles.label}>Materiales:</Text>
                    {course?.materials && course.materials.length > 0 ? (
                        <View style={styles.materialContainer}>
                            {course.materials.map((material, index) => (
                                <View key={index} style={styles.materialItem}>
                                    <View style={styles.materialRow}>
                                        <Checkbox
                                            value={checkedMaterials.includes(material.name)}
                                            onValueChange={() => handleToggle(material.name)}
                                            color={theme.colors.primary}
                                        />
                                        <Text style={styles.materialName}>{material.name}</Text>

                                        {material.uri && (
                                            <TouchableOpacity
                                                onPress={() => Linking.openURL(material.uri)}
                                                style={[
                                                    styles.downloadButton,
                                                    isMobile && styles.downloadMobile,
                                                ]}
                                            >
                                                <Icon
                                                    name="download"
                                                    size={16}
                                                    color="white"
                                                    style={{ marginRight: 6 }}
                                                />
                                                <Text style={styles.downloadText}>Descargar</Text>
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    {index < course.materials.length - 1 && (
                                        <View style={styles.separator} />
                                    )}
                                </View>
                            ))}
                        </View>
                    ) : (
                        <Text style={styles.text}>No hay materiales disponibles.</Text>
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: theme.colors.backgroundLight,
        padding: 16,
    },
    scroll: {
        backgroundColor: theme.colors.backgroundLight,
    },
    pageContainer: {
        padding: 16,
    },
    card: {
        backgroundColor: theme.colors.textLight,
        borderRadius: 12,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
    },
    backButton: {
        marginBottom: 12,
        alignSelf: "flex-start",
    },
    title: {
        fontSize: theme.sizes.lg + 2,
        fontFamily: theme.fonts.bold,
        color: theme.colors.primary,
        marginBottom: 16,
    },
    label: {
        fontSize: theme.sizes.md,
        fontFamily: theme.fonts.bold,
        color: theme.colors.textDark,
        marginTop: 12,
        marginBottom: 4,
    },
    text: {
        fontSize: theme.sizes.md,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textDark,
    },
    notFound: {
        fontSize: theme.sizes.lg,
        color: theme.colors.error,
        fontFamily: theme.fonts.bold,
        textAlign: "center",
        marginTop: 40,
    },
    materialContainer: {
        marginTop: 8,
    },
    materialItem: {
        marginBottom: 12,
    },
    materialRow: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap",
    },
    materialName: {
        fontSize: theme.sizes.md,
        fontFamily: theme.fonts.regular,
        color: theme.colors.textDark,
        marginLeft: 8,
        flex: 1,
    },
    downloadButton: {
        backgroundColor: theme.colors.primary,
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    downloadText: {
        color: "white",
        fontFamily: theme.fonts.bold,
        fontSize: theme.sizes.sm,
    },
    downloadMobile: {
        alignSelf: "center",
        marginTop: 8,
    },
    separator: {
        height: 1,
        backgroundColor: theme.colors.border,
        marginTop: 8,
    },
});
