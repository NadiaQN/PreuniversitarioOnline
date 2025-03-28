import { User } from "../models/User";

export const mockUsers: User[] = [
  { id: 1, name: "Lucía Fernández", email: "lucia.fernandez@example.com", password: "admin123", role: "Administrador", fecha_registro: new Date().toISOString() },
  { id: 2, name: "Rodrigo Martínez", email: "rodrigo.martinez@example.com", password: "tutor123", role: "Tutor", fecha_registro: new Date().toISOString() },
  { id: 3, name: "Sofía Ramírez", email: "sofia.ramirez@example.com", password: "student123", role: "Estudiante", fecha_registro: new Date().toISOString() },
  { id: 4, name: "Carlos López", email: "carlos.lopez@example.com", password: "student123", role: "Estudiante", fecha_registro: new Date().toISOString() },
  { id: 5, name: "Ana González", email: "ana.gonzalez@example.com", password: "tutor123", role: "Tutor", fecha_registro: new Date().toISOString() },
  { id: 6, name: "Fernando Díaz", email: "fernando.diaz@example.com", password: "admin123", role: "Administrador", fecha_registro: new Date().toISOString() },
];
