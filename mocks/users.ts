import { User, UserRole } from "../models/User";

export const mockUsers: User[] = [
  { id: 1, name: "Admin", email: "admin@example.com", password: "admin123", role: "Administrador", fecha_registro: new Date().toISOString() },
  { id: 2, name: "Tutor", email: "tutor@example.com", password: "tutor123", role: "Tutor", fecha_registro: new Date().toISOString() },
  { id: 3, name: "Estudiante", email: "student@example.com", password: "student123", role: "Estudiante", fecha_registro: new Date().toISOString() },
];

// 🔹 Función para agregar un nuevo usuario al mock
export const addMockUser = (name: string, email: string, password: string, role: UserRole) => {
  const newUser: User = {
    id: mockUsers.length + 1,
    name,
    email,
    password,
    role,
    fecha_registro: new Date().toISOString(),
  };

  mockUsers.push(newUser);
};

