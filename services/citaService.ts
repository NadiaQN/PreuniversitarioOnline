import { Cita, CitaEstado } from "../models/Cita";
import { HorarioTutores } from "../models/HorarioTutores";
import { mockCitas } from "../mocks/citas";
import { mockHorarioTutores } from "../mocks/horarioTutores";

// 🔹 Copias internas
let citasData: Cita[] = [...mockCitas];
let horariosData: HorarioTutores[] = [...mockHorarioTutores];

//
// 🔸 Funciones de gestión de citas
//

export function getCitas(): Cita[] {
  return [...citasData];
}

export function getCitasByUser(userId: number, tipo: "estudiante" | "tutor"): Cita[] {
  return citasData.filter((cita) =>
    tipo === "estudiante" ? cita.id_estudiante === userId : cita.id_tutor === userId
  );
}

export function addCita(cita: Omit<Cita, "id">): void {
  const nuevaCita: Cita = {
    ...cita,
    id: citasData.length + 1,
  };
  citasData = [...citasData, nuevaCita];
}

export function updateCita(id: number, updates: Partial<Cita>): void {
  citasData = citasData.map((cita) =>
    cita.id === id ? { ...cita, ...updates } : cita
  );
}

export function deleteCita(id: number): void {
  citasData = citasData.filter((cita) => cita.id !== id);
}

export function getCitasByEstado(estado: CitaEstado): Cita[] {
  return citasData.filter((cita) => cita.estado === estado);
}

//
// 🔸 Disponibilidad de tutores
//

// 🔹 Obtener disponibilidad por fecha
export function getDisponibilidadPorFecha(id_tutor: number, fecha: string): HorarioTutores[] {
  return horariosData.filter(
    (h) => h.id_tutor === id_tutor && h.fecha === fecha && h.disponibilidad === "Disponible"
  );
}

// 🔹 Obtener fechas únicas con disponibilidad
export function getFechasDisponibles(id_tutor: number): string[] {
  const fechas = horariosData
    .filter((h) => h.id_tutor === id_tutor && h.disponibilidad === "Disponible")
    .map((h) => h.fecha);

  return Array.from(new Set(fechas));
}

// 🔹 Obtener tramos de 30 min a partir del rango disponible
export function getHorasPorFecha(id_tutor: number, fecha: string): { hora_inicio: string; hora_fin: string }[] {
  const bloques: { hora_inicio: string; hora_fin: string }[] = [];

  const rangos = horariosData.filter(
    (h) => h.id_tutor === id_tutor && h.fecha === fecha && h.disponibilidad === "Disponible"
  );

  for (const rango of rangos) {
    let horaActual = parseHora(rango.hora_inicio);
    const horaFin = parseHora(rango.hora_fin);

    while (horaActual < horaFin) {
      const siguiente = sumarMinutos(horaActual, 30);
      if (siguiente > horaFin) break;

      bloques.push({
        hora_inicio: formatearHora(horaActual),
        hora_fin: formatearHora(siguiente),
      });

      horaActual = siguiente;
    }
  }

  return bloques;
}

//
// 🔸 Utilidades internas
//

function parseHora(hora: string): number {
  const [h, m] = hora.split(":").map(Number);
  return h * 60 + m;
}

function formatearHora(minutosTotales: number): string {
  const h = Math.floor(minutosTotales / 60);
  const m = minutosTotales % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

function sumarMinutos(actual: number, cantidad: number): number {
  return actual + cantidad;
}
