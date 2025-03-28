import { Course } from "@/models/Courses";

export const mockCourses: Course[] = [
    { id: "1", name: "Matemáticas", description: "Curso de álgebra y geometría", objectives: "Aprender a resolver ecuaciones", materials: [] },
    { id: "2", name: "Lenguaje", description: "Curso de comprensión lectora", objectives: "Mejorar habilidades de lectura", materials: [] },
  ];
  
  export const addMockCourse = (course: { name: string; description: string; objectives: string; materials: any[] }) => {
    const newCourse = { id: (mockCourses.length + 1).toString(), ...course };
    mockCourses.push(newCourse);
  };
  
  export const updateMockCourse = (id: string, updatedCourse: { name: string; description: string; objectives: string; materials: any[] }) => {
    const index = mockCourses.findIndex((course) => course.id === id);
    if (index !== -1) {
      mockCourses[index] = { ...mockCourses[index], ...updatedCourse };
    }
  };
  
  export const deleteMockCourse = (id: string) => {
    const index = mockCourses.findIndex((course) => course.id === id);
    if (index !== -1) {
      mockCourses.splice(index, 1);
    }
  };
  