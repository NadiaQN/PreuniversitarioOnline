import { Course } from "../models/Courses";
import { mockCourses } from "../mocks/courses";

export let courses: Course[] = [...mockCourses];

/**
 * Cargar cursos (sin almacenamiento persistente)
 */
export function loadCourses() {
  return courses;
}

/**
 * Agregar un curso
 */
export function addCourse(course: Omit<Course, "id">) {
  const newCourse = { ...course, id: Date.now().toString() };
  courses.push(newCourse);
}

/**
 * Actualizar un curso
 */
export function updateCourse(courseId: string, updatedData: Partial<Course>) {
  courses = courses.map((course) =>
    course.id === courseId ? { ...course, ...updatedData } : course
  );
}

/**
 * Eliminar un curso
 */
export function deleteCourse(courseId: string) {
  courses = courses.filter((course) => course.id !== courseId);
}
