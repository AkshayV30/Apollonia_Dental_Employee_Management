export type UserRole = "ADMIN" | "STAFF" | "VIEWER";

export interface AuthUser {
  id: string;
  tenantId: string;
  tenantSlug: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequestUser {
  user?: AuthUser;
}
