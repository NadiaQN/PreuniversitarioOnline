import { StudentCourse } from "../models/StudentCourse";

export const mockStudentCourses: StudentCourse[] = [
  {
    studentId: 3,
    courseId: "1",
    courseName: "Matemáticas",
    progress: 75,
    checkedMaterials: [
      "Guía de estudio de álgebra",
      "Video explicativo: Funciones lineales",
      "Resumen de geometría",
    ],
  },
  {
    studentId: 3,
    courseId: "2",
    courseName: "Lenguaje",
    progress: 66,
    checkedMaterials: [
      "Lectura de comprensión: El Quijote",
      "Guía de conectores lógicos",
    ],
  },
  {
    studentId: 3,
    courseId: "3",
    courseName: "Ciencias",
    progress: 33,
    checkedMaterials: [
      "Infografía de biología celular",
    ],
  },
];
