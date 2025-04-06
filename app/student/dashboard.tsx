import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar } from "react-native-calendars";
import { useDevice } from "../../hooks/useDevice";
import { theme } from "../../theme/theme";
import { getUserFromStorage } from "../../utils/storage";
import { getCitasByUser } from "../../services/citaService";
import { getCoursesByStudent, getLastCourseByStudent } from "../../services/studentCoursesService";
import { loadCourses } from "../../services/coursesService";
import { StudentCourse } from "../../models/StudentCourse";
import { Cita } from "../../models/Cita";
import ProgressBar from "../../components/ProgressBar";
import CustomButton from "@/components/Button";
import { getCourseById } from "../../services/coursesService";

const frasesMotivacionales = [
  "Nunca dejes de aprender.",
  "¡Cada paso cuenta!",
  "Tú puedes lograrlo.",
  "El esfuerzo de hoy es el éxito de mañana.",
  "Estás más cerca de lo que crees.",
];

const diasSemana = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
];

export default function StudentDashboard() {
  const router = useRouter();
  const { isTabletOrDesktop, isMobile } = useDevice();
  const { width } = useWindowDimensions();

  const [studentName, setStudentName] = useState("Estudiante");
  const [studentId, setStudentId] = useState<number | null>(null);
  const [proximaCita, setProximaCita] = useState<Cita | null>(null);
  const [frase, setFrase] = useState("");
  const [cursosAsignados, setCursosAsignados] = useState<StudentCourse[]>([]);
  const [ultimoCurso, setUltimoCurso] = useState<(StudentCourse & { courseName: string }) | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const user = await getUserFromStorage();
        if (!user) return;

        setStudentName(user.name);

        const cursos = getCoursesByStudent(user.id);
        setCursosAsignados(cursos);

        // Obtener último curso revisado (en este caso usamos el primero como ejemplo)
        if (cursos.length > 0) {
          const lastCourse = getLastCourseByStudent(user.id, cursos[0].courseId);
          if (lastCourse) {
            const fullCourse = getCourseById(lastCourse.courseId);
            if (fullCourse) {
              setUltimoCurso({
                studentId: lastCourse.studentId,
                courseId: lastCourse.courseId,
                courseName: lastCourse.courseName,
                checkedMaterials: lastCourse.checkedMaterials,
                progress: lastCourse.progress / 100,
                ...fullCourse,
              });
            }
          }
        }

        const citas = getCitasByUser(user.id, "estudiante");
        const futura = citas.find((c) => new Date(c.fecha) >= new Date());
        setProximaCita(futura ?? null);

        setFrase(
          frasesMotivacionales[Math.floor(Math.random() * frasesMotivacionales.length)]
        );
      };

      loadData();
    }, [])
  );



  const selectedDate = proximaCita
    ? {
      [proximaCita.fecha]: {
        selected: true,
        marked: true,
        selectedColor: theme.colors.primary,
      },
    }
    : {};

  const formatDateInfo = () => {
    if (!proximaCita) return null;
    const [year, month, day] = proximaCita.fecha.split("-");
    const fecha = new Date(Number(year), Number(month) - 1, Number(day));
    const dia = diasSemana[fecha.getDay()];
    return `Tu próxima cita será el día ${dia} ${fecha.getDate()} a las ${proximaCita.hora} hrs.`;
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.wrapper}>
      <View style={[styles.header, Platform.OS === "ios" && styles.iosMargin]}>
        <Text style={styles.greeting}>Hola, {studentName} 👋</Text>
        <TouchableOpacity onPress={async () => {
          await AsyncStorage.removeItem("user");
          router.replace("/login");
        }}>
          <Icon name="logout" size={24} color={theme.colors.error} />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>¿Qué te gustaría hacer hoy?</Text>

      {isMobile ? (
        <>
          {ultimoCurso && (
            <TouchableOpacity
              onPress={() =>
                router.push(`/(studentPages)/courseDetail?courseId=${ultimoCurso?.courseId}`)
              }
              style={styles.cuadro}
            >
              <Text style={styles.sectionTitle}>Último Curso Revisado</Text>
              <Text style={styles.textInfo}>{ultimoCurso?.courseName}</Text>
              <ProgressBar progress={ultimoCurso?.progress || 0} />
            </TouchableOpacity>

          )}

          <View style={styles.cuadro}>
            <Text style={styles.sectionTitle}>Cursos Asignados</Text>
            {cursosAsignados.map((curso) => (
              <View key={curso.courseId} style={styles.cursoItem}>
                <Text style={styles.textInfo}>{curso.courseName}</Text>
                <TouchableOpacity onPress={() => router.push(`/(studentPages)/courseDetail?courseId=${curso.courseId}`)}>
                  <Text style={styles.verMasMobile}>Ver más</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.cuadro}>
            <Text style={styles.sectionTitle}>Agendar Cita</Text>
            <Text style={styles.textInfo}>Selecciona un tutor disponible y elige un horario.</Text>
            <CustomButton
              title="Agendar"
              iconName="calendar-plus"
              onPress={() => router.push("/(studentPages)/citasForm")}
              style={styles.agendarBtnMobile}
            />
          </View>

          {proximaCita && (
            <>
              <Text style={styles.sectionTitle}>Próxima Cita</Text>
              <Calendar
                markedDates={selectedDate}
                style={styles.calendar}
                theme={{
                  todayTextColor: theme.colors.primary,
                  arrowColor: theme.colors.primary,
                }}
              />
              <Text style={styles.textInfo}>{formatDateInfo()}</Text>
            </>
          )}
        </>
      ) : (
        <View style={styles.grid}>
          {/* Columna izquierda */}
          <View style={styles.leftColumn}>
            {ultimoCurso && (
              <TouchableOpacity
                onPress={() =>
                  router.push(`/(studentPages)/courseDetail?courseId=${ultimoCurso?.courseId}`)
                }
                style={styles.cuadro}
              >
                <Text style={styles.sectionTitle}>Último Curso Revisado</Text>
                <Text style={styles.textInfo}>{ultimoCurso?.courseName}</Text>
                <ProgressBar progress={ultimoCurso?.progress || 0} />
              </TouchableOpacity>

            )}

            <View style={styles.cuadro}>
              <Text style={styles.sectionTitle}>Cursos Asignados</Text>
              {cursosAsignados.map((curso) => (
                <View key={curso.courseId} style={styles.cursoItem}>
                  <Text style={styles.textInfo}>{curso.courseName}</Text>
                  <TouchableOpacity onPress={() => router.push(`/(studentPages)/courseDetail?courseId=${curso.courseId}`)}>
                    <Text style={styles.verMas}>Ver más</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.cuadro}>
              <Text style={styles.sectionTitle}>Agendar Cita</Text>
              <Text style={styles.textInfo}>
                Selecciona un tutor disponible y elige un horario.
              </Text>
              <View style={styles.agendarBtn}>
                <CustomButton
                  title="Agendar"
                  iconName="calendar-plus"
                  onPress={() => router.push("/(studentPages)/citasForm")}
                />
              </View>
            </View>
          </View>

          {/* Columna derecha */}
          {proximaCita && (
            <View
              style={[
                styles.rightColumn,
                width < 900 && styles.rightColumnStack,
              ]}
            >
              <View style={{ width: width < 900 ? "100%" : "50%", paddingRight: 16 }}>
                <Calendar
                  markedDates={selectedDate}
                  style={styles.calendar}
                  theme={{
                    todayTextColor: theme.colors.primary,
                    arrowColor: theme.colors.primary,
                  }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>Próxima Cita</Text>
                <Text style={styles.textInfo}>{formatDateInfo()}</Text>
                <Text style={styles.frase}>"{frase}"</Text>
              </View>
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: theme.colors.backgroundLight,
  },
  wrapper: {
    padding: 20,
    paddingBottom: 40,
  },
  iosMargin: {
    marginTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    fontSize: theme.sizes.lg + 2,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    marginVertical: 16,
  },
  grid: {
    flexDirection: "row",
    gap: 32,
  },
  leftColumn: {
    width: "50%",
    gap: 8,
  },
  rightColumn: {
    width: "50%",
    flexDirection: "row",
  },
  rightColumnStack: {
    flexDirection: "column",
    gap: 16,
    marginTop: 24,
  },
  cuadro: {
    backgroundColor: theme.colors.textLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: theme.sizes.md + 1,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 8,
  },
  textInfo: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textDark,
    marginBottom: 8,
  },
  cursoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  verMas: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.sm,
  },
  verMasMobile: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
    fontSize: theme.sizes.sm,
    textAlign: "right",
    marginTop: 4,
  },
  agendarBtn: {
    alignItems: "flex-end",
    marginTop: 12,
  },
  agendarBtnMobile: {
    marginTop: 12,
    alignSelf: "center",
  },
  agendarBtnText: {
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textLight,
  },
  calendar: {
    width: "100%",
    borderRadius: 12,
    marginBottom: 16,
  },
  frase: {
    fontStyle: "italic",
    fontSize: theme.sizes.md,
    fontFamily: theme.fonts.regular,
    color: "#999",
    marginTop: 16,
  },
  mobileBox: {
    backgroundColor: theme.colors.textLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
});

