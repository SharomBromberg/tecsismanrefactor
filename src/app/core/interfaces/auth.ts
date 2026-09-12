export type UserRole = 'admin' | 'product-manager' | 'blog-editor' | 'user';

export type StaffRole = Exclude<UserRole, 'user'>;

export type UserAccountStatus = 'active' | 'suspended';

export interface AuthUser {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
  status?: UserAccountStatus;
  email?: string;
  emailVerified?: boolean;
}

export interface AuthSession {
  username: string;
  role: UserRole;
  displayName: string;
  issuedAt: string;
  expiresAt: string;
}

export interface AuthUserSummary {
  username: string;
  displayName: string;
  role: UserRole;
  status: UserAccountStatus;
}

export interface LoginAttemptState {
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

export interface TwoFactorChallengeInfo {
  username: string;
  displayName: string;
  demoCode: string;
}

export type LoginResult =
  | { status: 'success' }
  | { status: 'two-factor-required'; challenge: TwoFactorChallengeInfo }
  | { status: 'unverified'; username: string }
  | { status: 'error'; message: string };

export interface AccountVerificationChallenge {
  username: string;
  email: string;
  demoCode: string;
}

export type RegisterResult =
  | { ok: true; verification: AccountVerificationChallenge }
  | { ok: false; message: string };
