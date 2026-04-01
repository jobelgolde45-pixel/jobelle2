export type UserRole = "signatory" | "employee";

export interface AuthCredentials {
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

export const CREDENTIALS: AuthCredentials[] = [
  { username: "cao_signatory", password: "dotr123", role: "signatory", name: "Mary Grace L. Escoto" },
  { username: "user", password: "password123", role: "employee", name: "Juan Dela Cruz" },
  { username: "supervisor", password: "password123", role: "employee", name: "Josefa B. Neri" },
  { username: "admin", password: "password123", role: "signatory", name: "System Admin" },
];

export function authenticate(username: string, password: string): AuthCredentials | null {
  const trimmedUsername = username.trim().toLowerCase();
  const trimmedPassword = password.trim();

  const found = CREDENTIALS.find(
    (cred) =>
      cred.username.toLowerCase() === trimmedUsername &&
      cred.password === trimmedPassword
  );

  return found || null;
}
