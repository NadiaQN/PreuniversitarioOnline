import { Course } from "@/models/Courses";

export const mockCourses: Course[] = [
  {
    id: "1",
    name: "Matemáticas",
    description: "Curso completo de matemáticas para la PAES, abarcando álgebra, geometría y cálculo diferencial.",
    objectives: "Desarrollar habilidades en resolución de problemas, pensamiento lógico y preparación para pruebas estandarizadas.",
    materials: [
      {
        name: "Guía de estudio de álgebra",
        uri: "https://drive.google.com/file/d/1rr-0YT6rZZUb2r5bBsxTuieH-D5CV-w6/view?usp=drive_link",
        type: "pdf",
      },
      {
        name: "Video explicativo: Funciones lineales",
        uri: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        type: "video",
      },
      {
        name: "Resumen de geometría",
        uri: "https://drive.google.com/file/d/1abcd1234/view",
        type: "pdf",
      },
      {
        name: "Infografía: Derivadas",
        uri: "https://drive.google.com/file/d/1defg5678/view",
        type: "image",
      },
    ],
  },
  {
    id: "2",
    name: "Lenguaje",
    description: "Curso enfocado en comprensión lectora, análisis crítico y técnicas de escritura.",
    objectives: "Mejorar la interpretación de textos, desarrollar vocabulario y redactar de forma clara y coherente.",
    materials: [
      {
        name: "Lectura de comprensión: El Quijote",
        uri: "https://drive.google.com/file/d/13ofooU9WerF-bm1i-Zj0T_mpf0N4oNoJ/view?usp=drive_link",
        type: "pdf",
      },
      {
        name: "Técnicas de escritura académica",
        uri: "https://www.youtube.com/watch?v=aBcd5678xyz",
        type: "video",
      },
      {
        name: "Guía de conectores lógicos",
        uri: "https://drive.google.com/file/d/1xyz9102ghj/view",
        type: "pdf",
      },
    ],
  },
  {
    id: "3",
    name: "Ciencias",
    description: "Curso de ciencias naturales que incluye biología, física y química.",
    objectives: "Comprender los fundamentos científicos del entorno y aplicar el método científico en la resolución de problemas.",
    materials: [
      {
        name: "Infografía de biología celular",
        uri: "https://drive.google.com/file/d/1xiIhse2wuWjpIYJkkdEYS50XPSl1I8Cv/view?usp=drive_link",
        type: "image",
      },
      {
        name: "Guía de química orgánica",
        uri: "https://drive.google.com/file/d/1chem5678pdf/view",
        type: "pdf",
      },
      {
        name: "Video: Leyes de Newton",
        uri: "https://www.youtube.com/watch?v=eFv0GDbZ3Us",
        type: "video",
      },
    ],
  },
];
