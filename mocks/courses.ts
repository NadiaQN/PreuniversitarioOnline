import { Course } from "@/models/Courses";

export const mockCourses: Course[] = [
  {
    id: "1",
    name: "Matemáticas",
    description: "Curso de matemáticas avanzadas",
    objectives: "Aprender cálculo y álgebra",
    materials: [
      {
        name: "Guía de estudio de matemáticas",
        uri: "https://drive.google.com/file/d/1rr-0YT6rZZUb2r5bBsxTuieH-D5CV-w6/view?usp=drive_link",
        type: "pdf",
      },
    ],
  },
  {
    id: "2",
    name: "Lenguaje",
    description: "Curso de comprensión lectora",
    objectives: "Mejorar habilidades de escritura",
    materials: [
      {
        name: "Lectura de comprensión",
        uri: "https://drive.google.com/file/d/13ofooU9WerF-bm1i-Zj0T_mpf0N4oNoJ/view?usp=drive_link",
        type: "pdf",
      },
    ],
  },
  {
    id: "3",
    name: "Ciencias",
    description: "Curso de biología y química",
    objectives: "Entender los fundamentos de la ciencia",
    materials: [
      {
        name: "Infografía de biología",
        uri: "https://drive.google.com/file/d/1xiIhse2wuWjpIYJkkdEYS50XPSl1I8Cv/view?usp=drive_link",
        type: "image",
      },
    ],
  },
];
