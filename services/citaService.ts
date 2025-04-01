import { Cita, CitaEstado } from "../models/Cita";
import { mockCitas } from "../mocks/citas";

// Copia interna de los datos simulados
let citasData: Cita[] = [...mockCitas];

// 🔹 Obtener todas las citas
export function getCitas(): Cita[] {
  return [...citasData];
}

// 🔹 Obtener citas por usuario (estudiante o tutor)
export function getCitasByUser(userId: number, tipo: "estudiante" | "tutor"): Cita[] {
  return citasData.filter((cita) =>
    tipo === "estudiante" ? cita.id_estudiante === userId : cita.id_tutor === userId
  );
}

// 🔹 Agregar una nueva cita
export function addCita(cita: Omit<Cita, "id">): void {
  const nuevaCita: Cita = {
    ...cita,
    id: citasData.length + 1,
  };

  citasData = [...citasData, nuevaCita];
}

// 🔹 Actualizar estado o información de la cita
export function updateCita(id: number, updates: Partial<Cita>): void {
  citasData = citasData.map((cita) =>
    cita.id === id ? { ...cita, ...updates } : cita
  );
}

// 🔹 Eliminar una cita
export function deleteCita(id: number): void {
  citasData = citasData.filter((cita) => cita.id !== id);
}

// 🔹 Obtener citas por estado (útil para filtros)
export function getCitasByEstado(estado: CitaEstado): Cita[] {
  return citasData.filter((cita) => cita.estado === estado);
}
