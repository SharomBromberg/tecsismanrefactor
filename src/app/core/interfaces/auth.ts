export type UserRole = 'admin' | 'user';

export interface AuthUser {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
}

export interface AuthSession {
  username: string;
  role: UserRole;
  displayName: string;
  issuedAt: string;
  expiresAt: string;
}

export interface LoginAttemptState {
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}
