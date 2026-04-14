export type UserRole = "employee" | "supervisor" | "hrdd_admin" | "signatory" | "admin";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  office?: string;
  position?: string;
  initials: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
