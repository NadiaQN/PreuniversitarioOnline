export type UserRole = "Estudiante" | "Tutor" | "Administrador";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  fecha_registro: string;
}

