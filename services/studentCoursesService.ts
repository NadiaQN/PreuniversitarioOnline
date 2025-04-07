import { StudentCourse } from "../models/StudentCourse";
import { mockStudentCourses } from "../mocks/mockStudentCourses";
import { mockCourses } from "@/mocks/courses";

/**
 * Obtener todos los cursos de un estudiante.
 */
export function getCoursesByStudent(studentId: number): StudentCourse[] {
  return mockStudentCourses.filter((course) => course.studentId === studentId);
}

/**
 * Obtener un curso específico del estudiante.
 */
export function getStudentCourse(studentId: number, courseId: string): StudentCourse | undefined {
  return mockStudentCourses.find(
    (course) => course.studentId === studentId && course.courseId === courseId
  );
}

/**
 * Obtener el último curso revisado (simulado como el primero de la lista).
 */
export function getLastCourseByStudent(studentId: number, courseId: string): StudentCourse | undefined {
  return mockStudentCourses.find(
    (course) => course.studentId === studentId && course.courseId === courseId
  );
}

/**
 * Actualizar el progreso del estudiante en un curso.
 */
export function updateStudentProgress(
  studentId: number,
  courseId: string,
  checkedMaterials: string[],
  progress: number
): void {
  const index = mockStudentCourses.findIndex(
    (course) => course.studentId === studentId && course.courseId === courseId
  );

  if (index !== -1) {
    mockStudentCourses[index].checkedMaterials = checkedMaterials;
    mockStudentCourses[index].progress = progress;
  }
}

export function toggleMaterialAsChecked(studentId: number, courseId: string, materialName: string): void {
  const studentCourse = mockStudentCourses.find(
    (sc) => sc.studentId === studentId && sc.courseId === courseId
  );

  if (!studentCourse) return;

  if (!studentCourse.checkedMaterials) {
    studentCourse.checkedMaterials = [];
  }

  const index = studentCourse.checkedMaterials.indexOf(materialName);
  if (index === -1) {
    studentCourse.checkedMaterials.push(materialName);
  } else {
    studentCourse.checkedMaterials.splice(index, 1);
  }

  // Recalcular progreso
  const course = mockCourses.find((c) => c.id === courseId);
  if (course) {
    const total = course.materials.length;
    const revisados = studentCourse.checkedMaterials.length;
    studentCourse.progress = Number(((revisados / total)).toFixed(0));
  }
}

/**
 * Obtener los materiales marcados como revisados por el estudiante.
 * @param studentId ID del estudiante
 * @param courseId ID del curso
 * @returns Lista de nombres de materiales revisados
 */
export function getCheckedMaterials(studentId: number, courseId: string): string[] {
  const studentCourse = mockStudentCourses.find(
    (sc) => sc.studentId === studentId && sc.courseId === courseId
  );

  return studentCourse?.checkedMaterials ?? [];
}
