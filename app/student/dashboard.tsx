import { useEffect, useState, useCallback } from "react";
import { useFocusEffect, useRouter } from "expo-router";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Calendar } from "react-native-calendars";
import { useDevice } from "../../hooks/useDevice";
import { theme } from "../../theme/theme";
import { getUserFromStorage } from "../../utils/storage";
import { getCitasByUser } from "../../services/citaService";
import {
  getCoursesByStudent,
  getLastCourseByStudent,
  getCheckedMaterials,
} from "../../services/studentCoursesService";
import { getCourseById } from "../../services/coursesService";
import { StudentCourse } from "../../models/StudentCourse";
import { Cita } from "../../models/Cita";
import ProgressBar from "../../components/ProgressBar";
import CustomButton from "@/components/Button";
import { mockMotivationalQuotes } from "../../mocks/mockMotivationalQuotes";

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
  const [proximaCita, setProximaCita] = useState<Cita | null>(null);
  const [cursosAsignados, setCursosAsignados] = useState<StudentCourse[]>([]);
  const [ultimoCurso, setUltimoCurso] = useState<(StudentCourse & { courseName: string }) | null>(null);
  const [selectedDates, setSelectedDates] = useState({});
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        const user = await getUserFromStorage();
        if (!user) return;
  
        setStudentName(user.name);
  
        const cursos = getCoursesByStudent(user.id);
        setCursosAsignados(cursos);
  
        if (cursos.length > 0) {
          const lastCourse = getLastCourseByStudent(user.id, cursos[0].courseId);
          if (lastCourse) {
            const fullCourse = getCourseById(lastCourse.courseId);
            if (fullCourse) {
              setUltimoCurso({
                ...lastCourse,
                courseName: fullCourse.name,
              });
            }
          }
        }
  
        const citas = getCitasByUser(user.id, "estudiante");
        const futuras = citas.filter((c) => new Date(c.fecha) >= new Date());
  
        const citaProxima = futuras.sort(
          (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
        )[0];
        setProximaCita(citaProxima ?? null);
  
        const marcadas: any = {};
        futuras.forEach((cita) => {
          marcadas[cita.fecha] = {
            selected: true,
            marked: true,
            selectedColor: theme.colors.primary,
          };
        });
        setSelectedDates(marcadas);
  
        const random = mockMotivationalQuotes[Math.floor(Math.random() * mockMotivationalQuotes.length)];
        setQuote(random);
      };
  
      loadData();
    }, [])
  );
  ;
  

  const formatProximasCitas = (): string[] => {
    if (!proximaCita) return [];

    const [year, month, day] = proximaCita.fecha.split("-");
    const fecha = new Date(Number(year), Number(month) - 1, Number(day));
    const dia = diasSemana[fecha.getDay()];

    return [
      `Tu cita será el día ${dia} ${fecha.getDate()} a las ${proximaCita.hora} hr.`,
    ];
  };

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.wrapper}>
      <View style={[styles.header, Platform.OS === "ios" && styles.iosMargin]}>
        <Text style={styles.greeting} accessibilityRole="header">
          Hola, {studentName} 👋
        </Text>
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
              accessibilityLabel={`Ir al curso ${ultimoCurso?.courseName}`}
              accessibilityRole="button"
            >
              <Text style={styles.sectionTitle} accessibilityRole="header">
                Último Curso Revisado
              </Text>
              <Text style={styles.textInfo}>{ultimoCurso?.courseName}</Text>
              <ProgressBar progress={(ultimoCurso?.progress / 100) || 0} />
            </TouchableOpacity>
          )}

          <View style={styles.cuadro}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              Cursos Asignados
            </Text>
            {cursosAsignados.map((curso) => (
              <View key={curso.courseId} style={styles.cursoItem}>
                <Text style={styles.textInfo}>{curso.courseName}</Text>
                <TouchableOpacity
                  onPress={() => router.push(`/(studentPages)/courseDetail?courseId=${curso.courseId}`)}
                  accessibilityLabel={`Ver más detalles del curso ${curso.courseName}`}
                  accessibilityRole="button"
                >
                  <Text style={styles.verMasMobile}>Ver más</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.cuadro}>
            <Text style={styles.sectionTitle} accessibilityRole="header">
              Agendar Cita
            </Text>
            <Text style={styles.textInfo}>Selecciona un tutor disponible y elige un horario.</Text>
            <CustomButton
              title="Agendar"
              iconName="calendar-plus"
              onPress={() => router.push("/(studentPages)/citasForm")}
              style={styles.agendarBtnMobile}
              accessibilityLabel="Agendar una nueva cita"
              accessibilityRole="button"
            />
          </View>

          {proximaCita && (
            <>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                Próxima Cita
              </Text>
              <View
                accessible={true}
                accessibilityLabel="Calendario con tus citas agendadas. Los días marcados indican citas futuras."
              >
                <Calendar
                  markedDates={selectedDates}
                  style={styles.calendar}
                  theme={{
                    todayTextColor: theme.colors.primary,
                    arrowColor: theme.colors.primary,
                  }}
                />
              </View>

              {formatProximasCitas().map((texto, index) => (
                <Text
                  key={index}
                  style={styles.textInfo}
                  accessibilityLabel={`Texto informativo: ${texto}`}
                >
                  {texto}
                </Text>
              ))}
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
                accessibilityLabel={`Ir al curso ${ultimoCurso?.courseName}`}
                accessibilityRole="button"
              >
                <Text style={styles.sectionTitle} accessibilityRole="header">
                  Último Curso Revisado
                </Text>
                <Text style={styles.textInfo}>{ultimoCurso?.courseName}</Text>
                <ProgressBar progress={(ultimoCurso?.progress / 100) || 0} />
              </TouchableOpacity>
            )}

            <View style={styles.cuadro}>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                Cursos Asignados
              </Text>
              {cursosAsignados.map((curso) => (
                <View key={curso.courseId} style={styles.cursoItem}>
                  <Text style={styles.textInfo}>{curso.courseName}</Text>
                  <TouchableOpacity
                    onPress={() =>
                      router.push(`/(studentPages)/courseDetail?courseId=${curso.courseId}`)
                    }
                    accessibilityLabel={`Ver más detalles del curso ${curso.courseName}`}
                    accessibilityRole="button"
                  >
                    <Text style={styles.verMas}>Ver más</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            <View style={styles.cuadro}>
              <Text style={styles.sectionTitle} accessibilityRole="header">
                Agendar Cita
              </Text>
              <Text style={styles.textInfo}>
                Selecciona un tutor disponible y elige un horario.
              </Text>
              <View style={styles.agendarBtn}>
                <CustomButton
                  title="Agendar"
                  iconName="calendar-plus"
                  onPress={() => router.push("/(studentPages)/citasForm")}
                  accessibilityLabel="Agendar una nueva cita"
                  accessibilityRole="button"
                />
              </View>
            </View>
          </View>

          {/* Columna derecha */}
          {proximaCita && (
            <View style={[styles.rightColumn, width < 900 && styles.rightColumnStack]}>
              <View style={{ width: width < 900 ? "100%" : "50%", paddingRight: 16 }}>
                <View
                  accessible={true}
                  accessibilityLabel="Calendario con tus citas agendadas. Los días marcados indican citas futuras."
                >
                  <Calendar
                    markedDates={selectedDates}
                    style={styles.calendar}
                    theme={{
                      todayTextColor: theme.colors.primary,
                      arrowColor: theme.colors.primary,
                    }}
                  />
                </View>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle} accessibilityRole="header">
                  Próxima Cita
                </Text>
                {formatProximasCitas().map((texto, index) => (
                  <Text
                    key={index}
                    style={styles.textInfo}
                    accessibilityLabel={`Texto informativo: ${texto}`}
                  >
                    {texto}
                  </Text>
                ))}
                {quote && (
                  <Text
                    style={styles.quote}
                    accessibilityLabel={`Frase motivacional: ${quote.text}, dicha por ${quote.author}`}
                  >
                    “{quote.text}” — <Text style={styles.quoteAuthor}>{quote.author}</Text>
                  </Text>
                )}
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
  mobileBox: {
    backgroundColor: theme.colors.textLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  quote: {
    fontStyle: "italic",
    color: theme.colors.border,
    marginTop: 24,
    textAlign: "left",
    fontSize: theme.sizes.md,
    flexWrap: "wrap",
    fontFamily: theme.fonts.regular,
  },
  quoteAuthor: {
    fontWeight: "bold",
    fontFamily: theme.fonts.regular,
  },
});
