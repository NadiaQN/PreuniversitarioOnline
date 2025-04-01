export type CitaEstado = "Pendiente" | "Confirmada" | "Cancelada";

export interface Cita {
  id: number;
  id_estudiante: number;
  id_tutor: number;
  fecha: string; // formato ISO: YYYY-MM-DD
  hora: string;  // formato HH:mm
  estado: CitaEstado;
  meetLink: string; // enlace a Google Meet simulado
}
