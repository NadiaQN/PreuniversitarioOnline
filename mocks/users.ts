import { User } from "../models/User";

export const mockUsers: Record<string, User> = {
  admin: { username: "admin", password: "1234", role: "admin" },
  tutor: { username: "tutor", password: "1234", role: "tutor" },
  student: { username: "student", password: "1234", role: "student" },
};
