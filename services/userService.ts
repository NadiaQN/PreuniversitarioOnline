import { User, UserRole } from "../models/User";
import { mockUsers } from "../mocks/users";

// Variable local para mantener los datos (simulando una API)
let users = [...mockUsers];

/**
 * Obtener todos los usuarios
 */
export function getUsers(): User[] {
  return users;
}

/**
 * Agregar un nuevo usuario
 */
export function addUser(name: string, email: string, password: string, role: UserRole): void {
  const newUser: User = {
    id: users.length + 1,
    name,
    email,
    password,
    role,
    fecha_registro: new Date().toISOString(),
  };

  users.push(newUser);
}

/**
 * Editar un usuario
 */
export function updateUser(userId: number, updatedData: Partial<User>): void {
  users = users.map((user) =>
    user.id === userId ? { ...user, ...updatedData } : user
  );
}

/**
 * Eliminar un usuario
 */
export function deleteUser(userId: number): void {
  users = users.filter((user) => user.id !== userId);
}
