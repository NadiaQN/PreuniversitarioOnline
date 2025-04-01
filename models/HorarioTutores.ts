export type Disponibilidad = "Disponible" | "No Disponible";

export interface HorarioTutores {
  id: number;
  id_tutor: number;
  fecha: string; // YYYY-MM-DD
  hora_inicio: string; // HH:mm
  hora_fin: string; // HH:mm
  disponibilidad: Disponibilidad;
}
