import { User, UserRole } from "../models/User";
import { mockUsers } from "../mocks/users";

// Creamos una copia interna que el servicio puede manipular
let usersData: User[] = [...mockUsers];

// 🔹 Obtener usuarios
export function getUsers(): User[] {
  return [...usersData]; // se devuelve una copia
}

// 🔹 Agregar usuario
export function addUser(
  name: string,
  email: string,
  password: string,
  role: UserRole
): void {
  const newUser: User = {
    id: usersData.length + 1,
    name,
    email,
    password,
    role,
    fecha_registro: new Date().toISOString(),
  };

  usersData = [...usersData, newUser];
}

// 🔹 Actualizar usuario
export function updateUser(
  id: number,
  updatedData: Partial<Omit<User, "id" | "fecha_registro" | "password">>
): void {
  usersData = usersData.map((user) =>
    user.id === id ? { ...user, ...updatedData } : user
  );
}

// 🔹 Eliminar usuario
export function deleteUser(userId: number): void {
  usersData = usersData.filter((user) => user.id !== userId);
}
