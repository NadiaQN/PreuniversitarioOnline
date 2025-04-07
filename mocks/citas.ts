import { LINK_MEET } from "@/utils/constants";
import { Cita } from "../models/Cita";

export const mockCitas: Cita[] = [
  {
    id: 1,
    id_estudiante: 3,
    id_tutor: 2,
    fecha: "2025-04-15",
    hora: "10:00",
    estado: "Pendiente",
    meetLink: LINK_MEET,
  },
  {
    id: 2,
    id_estudiante: 3,
    id_tutor: 2,
    fecha: "2025-04-16",
    hora: "15:00",
    estado: "Confirmada",
    meetLink: LINK_MEET,
  },
];
