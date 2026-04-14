import type { AuthUser, UserRole } from "@/types/auth";

export interface AuthCredentials {
  username: string;
  password: string;
  role: UserRole;
  name: string;
}

export const DEMO_CREDENTIALS: AuthCredentials[] = [
  { username: "employee", password: "password123", role: "employee", name: "Juan Dela Cruz" },
  { username: "supervisor", password: "password123", role: "supervisor", name: "Josefa B. Neri" },
  { username: "hrdd_admin", password: "password123", role: "hrdd_admin", name: "HRDD Administrator" },
  { username: "signatory", password: "password123", role: "signatory", name: "Mary Grace L. Escoto" },
  { username: "cao_signatory", password: "dotr123", role: "signatory", name: "Mary Grace L. Escoto" },
];

const AUTH_STORAGE_KEY = "dotr_auth_session";

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((chunk) => chunk[0]?.toUpperCase() ?? "")
    .join("");
}

export function authenticate(username: string, password: string): AuthUser | null {
  const trimmedUsername = username.trim().toLowerCase();
  const trimmedPassword = password.trim();

  const found = DEMO_CREDENTIALS.find(
    (cred) =>
      cred.username.toLowerCase() === trimmedUsername &&
      cred.password === trimmedPassword
  );

  if (!found) return null;

  return {
    id: `user_${found.username}`,
    email: `${found.username}@dotr.gov.ph`,
    name: found.name,
    role: found.role,
    initials: getInitials(found.name),
  };
}

export function saveAuthSession(user: AuthUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function getAuthSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export const ROLE_LABELS: Record<string, string> = {
  employee: "Employee",
  supervisor: "Supervisor",
  hrdd_admin: "HRDD Admin",
  signatory: "Authorized Signatory",
  admin: "System Administrator",
};

export const ROLE_PORTALS: Record<string, string> = {
  employee: "Employee Portal",
  supervisor: "Supervisor Console",
  hrdd_admin: "HRDD Admin Console",
  signatory: "Signatory Portal",
  admin: "Admin Portal",
};
