import { Cita } from "../models/Cita";

export const mockCitas: Cita[] = [
  {
    id: 1,
    id_estudiante: 3,
    id_tutor: 2,
    fecha: "2025-04-15",
    hora: "10:00",
    estado: "Pendiente",
    meetLink: "https://meet.google.com/falso-codigo",
  },
  {
    id: 2,
    id_estudiante: 3,
    id_tutor: 2,
    fecha: "2025-04-16",
    hora: "15:00",
    estado: "Confirmada",
    meetLink: "https://meet.google.com/falso-codigo",
  },
];
