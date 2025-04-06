import { StudentCourse } from "../models/StudentCourse";

export const mockStudentCourses: StudentCourse[] = [
  {
    studentId: 3,
    courseId: "1",
    courseName: "Matemáticas",
    progress: 75,
    checkedMaterials: ["material1.pdf", "material2.pdf"],
  },
  {
    studentId: 3,
    courseId: "2",
    courseName: "Lenguaje",
    progress: 40,
    checkedMaterials: ["lectura1.pdf"],
  },
  {
    studentId: 3,
    courseId: "3",
    courseName: "Ciencias",
    progress: 0,
    checkedMaterials: [],
  },
];

