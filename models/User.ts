export type UserRole = "admin" | "tutor" | "student";

export interface User {
  username: string;
  password: string;
  role: UserRole;
}
