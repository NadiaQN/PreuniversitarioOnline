import { View, Text, StyleSheet, FlatList } from "react-native";
import { theme } from "../../theme/theme";
import CustomButton from "../../components/Button";
import { useDevice } from "../../hooks/useDevice";
import { useRouter } from "expo-router";

const courses = [
    { id: "1", name: "Matemáticas", students: 30 },
    { id: "2", name: "Lenguaje", students: 25 },
    { id: "3", name: "Ciencias", students: 20 },
];

export default function ManageCourses() {
    const router = useRouter();
    const { isMobile } = useDevice();

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Gestión de Cursos</Text>

            <View style={styles.buttonWrapper}>
                <CustomButton
                    title="Agregar Curso"
                    onPress={() => router.push("/coursesForm")}
                    variant="success"
                    iconName="plus-circle-outline"
                />

            </View>

            <FlatList
                data={courses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.courseCard}>
                        <View style={styles.courseInfo}>
                            <Text style={styles.courseName}>{item.name}</Text>
                            <Text style={styles.courseStudents}>{item.students} estudiantes</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <CustomButton
                                title="Eliminar"
                                onPress={() => { }}
                                variant="error"
                                outline
                                iconName="trash-can-outline"
                                iconOnly={isMobile}
                            />
                            <CustomButton
                                title="Editar"
                                onPress={() => { }}
                                variant="primary"
                                iconName="pencil-outline"
                                iconOnly={isMobile}
                            />
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: theme.colors.backgroundLight,
        gap: 16,
    },
    title: {
        fontSize: theme.sizes.lg,
        fontFamily: theme.fonts.bold,
        color: theme.colors.primary,
    },
    buttonWrapper: {
        alignItems: "flex-end",
        marginBottom: 16,
    },
    addButton: {
        alignSelf: "flex-end",
    },
    courseCard: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: theme.colors.textLight,
        borderRadius: 8,
        marginBottom: 8,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
    },
    courseInfo: {
        width: "auto",
        maxWidth: "70%",
        alignSelf: "flex-start",
    },
    courseName: {
        fontSize: theme.sizes.md,
        fontFamily: theme.fonts.bold,
        color: theme.colors.textDark,
    },
    courseStudents: {
        fontSize: theme.sizes.sm,
        fontFamily: theme.fonts.regular,
        color: theme.colors.primary,
        marginBottom: 4,
    },
    buttonContainer: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
    },
});
