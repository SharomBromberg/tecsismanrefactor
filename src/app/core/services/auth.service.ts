import { Injectable } from '@angular/core';

export type UserRole = 'admin' | 'user';

interface AuthUser {
  username: string;
  password: string;
  role: UserRole;
  displayName: string;
}

interface AuthSession {
  username: string;
  role: UserRole;
  displayName: string;
  issuedAt: string;
  expiresAt: string;
}

interface LoginAttemptState {
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'tecsisman_auth_session';
  private readonly usersStorageKey = 'tecsisman_registered_users';
  private readonly passwordOverridesStorageKey =
    'tecsisman_user_password_overrides';
  private readonly loginAttemptsStorageKey = 'tecsisman_login_attempts';
  private readonly sessionDurationMs = 1000 * 60 * 60 * 12;
  private readonly loginAttemptWindowMs = 1000 * 60 * 10;
  private readonly loginLockDurationMs = 1000 * 60 * 5;
  private readonly maxLoginAttempts = 5;
  private lastAuthErrorMessage = '';

  // Los administradores se gestionan manualmente aquí hasta tener backend.
  private readonly adminUsers: AuthUser[] = [
    {
      username: 'admin',
      password: 'password123',
      role: 'admin',
      displayName: 'Administrador',
    },
  ];

  // Usuarios base de demo. Los nuevos registros se guardan en localStorage.
  private readonly baseUsers: AuthUser[] = [
    {
      username: 'usuario',
      password: 'user123',
      role: 'user',
      displayName: 'Usuario',
    },
  ];

  private session: AuthSession | null = this.readSession();

  login(username: string, password: string): boolean {
    const normalizedUser = username.trim().toLowerCase();

    if (!normalizedUser || !password) {
      this.lastAuthErrorMessage = 'Ingresa usuario y contraseña.';
      return false;
    }

    const lockMessage = this.getLoginLockMessage(normalizedUser);
    if (lockMessage) {
      this.lastAuthErrorMessage = lockMessage;
      return false;
    }

    const matched = this.getAllUsers().find(
      (user) =>
        user.username.toLowerCase() === normalizedUser &&
        this.getUserPassword(user) === password,
    );

    if (!matched) {
      this.registerFailedAttempt(normalizedUser);
      const updatedLockMessage = this.getLoginLockMessage(normalizedUser);
      this.lastAuthErrorMessage =
        updatedLockMessage ?? 'Credenciales invalidas.';
      return false;
    }

    this.clearLoginAttempts(normalizedUser);
    this.lastAuthErrorMessage = '';

    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.sessionDurationMs);

    this.session = {
      username: matched.username,
      role: matched.role,
      displayName: matched.displayName,
      issuedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
    this.writeSession(this.session);
    return true;
  }

  registerUser(input: {
    username: string;
    password: string;
    displayName: string;
  }): { ok: boolean; message?: string } {
    const username = input.username.trim().toLowerCase();
    const displayName = input.displayName.trim();
    const password = input.password;

    if (!username || !displayName || !password) {
      return { ok: false, message: 'Completa todos los campos.' };
    }

    if (!this.isValidUsername(username)) {
      return {
        ok: false,
        message:
          'El usuario debe tener entre 3 y 24 caracteres y solo usar letras, numeros, punto, guion o guion bajo.',
      };
    }

    const passwordPolicyError = this.validatePasswordStrength(password);
    if (passwordPolicyError) {
      return { ok: false, message: passwordPolicyError };
    }

    const exists = this.getAllUsers().some(
      (user) => user.username.toLowerCase() === username,
    );
    if (exists) {
      return { ok: false, message: 'Ese usuario ya existe.' };
    }

    const registeredUsers = this.getRegisteredUsers();
    registeredUsers.push({
      username,
      password,
      role: 'user',
      displayName,
    });
    localStorage.setItem(this.usersStorageKey, JSON.stringify(registeredUsers));

    return { ok: true };
  }

  logout(): void {
    this.session = null;
    this.lastAuthErrorMessage = '';
    sessionStorage.removeItem(this.storageKey);
  }

  isLoggedIn(role?: UserRole): boolean {
    if (!this.session) {
      return false;
    }

    return role ? this.session.role === role : true;
  }

  currentSession(): AuthSession | null {
    return this.session;
  }

  getLastAuthError(): string {
    return this.lastAuthErrorMessage;
  }

  updateSessionDisplayName(displayName: string): void {
    if (!this.session) {
      return;
    }

    const sanitized = displayName.trim();
    if (!sanitized) {
      return;
    }

    this.session = {
      ...this.session,
      displayName: sanitized,
    };
    this.writeSession(this.session);
  }

  changeCurrentUserPassword(
    currentPassword: string,
    nextPassword: string,
  ): { ok: boolean; message?: string } {
    if (!this.session) {
      return { ok: false, message: 'No hay una sesion activa.' };
    }

    if (!currentPassword || !nextPassword) {
      return { ok: false, message: 'Completa ambos campos de contraseña.' };
    }

    const passwordPolicyError = this.validatePasswordStrength(nextPassword);
    if (passwordPolicyError) {
      return { ok: false, message: passwordPolicyError };
    }

    const username = this.session.username.trim().toLowerCase();
    const user = this.getAllUsers().find(
      (item) => item.username.toLowerCase() === username,
    );

    if (!user) {
      return { ok: false, message: 'No se encontro el usuario.' };
    }

    const currentResolvedPassword = this.getUserPassword(user);
    if (currentResolvedPassword !== currentPassword) {
      return { ok: false, message: 'La contraseña actual no es correcta.' };
    }

    const overrides = this.getPasswordOverrides();
    overrides[username] = nextPassword;
    this.writePasswordOverrides(overrides);

    this.updateRegisteredUserPassword(username, nextPassword);

    return { ok: true };
  }

  private readSession(): AuthSession | null {
    const raw = sessionStorage.getItem(this.storageKey);
    if (!raw) {
      return null;
    }

    try {
      const parsed = JSON.parse(raw) as AuthSession;
      if (!parsed.username || !parsed.role || !parsed.expiresAt) {
        return null;
      }

      const expiresAt = new Date(parsed.expiresAt).getTime();
      if (!Number.isFinite(expiresAt) || expiresAt <= Date.now()) {
        sessionStorage.removeItem(this.storageKey);
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  private writeSession(session: AuthSession): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(session));
  }

  private getRegisteredUsers(): AuthUser[] {
    const raw = localStorage.getItem(this.usersStorageKey);
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as AuthUser[];
      return parsed.filter(
        (item) =>
          !!item.username &&
          !!item.password &&
          item.role === 'user' &&
          !!item.displayName,
      );
    } catch {
      return [];
    }
  }

  private getUserPassword(user: AuthUser): string {
    const normalized = user.username.trim().toLowerCase();
    const overrides = this.getPasswordOverrides();
    return overrides[normalized] ?? user.password;
  }

  private getPasswordOverrides(): Record<string, string> {
    const raw = localStorage.getItem(this.passwordOverridesStorageKey);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as Record<string, string>;
      return parsed ?? {};
    } catch {
      return {};
    }
  }

  private writePasswordOverrides(mapValue: Record<string, string>): void {
    localStorage.setItem(
      this.passwordOverridesStorageKey,
      JSON.stringify(mapValue),
    );
  }

  private updateRegisteredUserPassword(
    username: string,
    nextPassword: string,
  ): void {
    const registeredUsers = this.getRegisteredUsers();
    const updated = registeredUsers.map((user) =>
      user.username.toLowerCase() === username
        ? { ...user, password: nextPassword }
        : user,
    );
    localStorage.setItem(this.usersStorageKey, JSON.stringify(updated));
  }

  private getAllUsers(): AuthUser[] {
    return [
      ...this.adminUsers,
      ...this.baseUsers,
      ...this.getRegisteredUsers(),
    ];
  }

  private isValidUsername(username: string): boolean {
    return /^[a-z0-9._-]{3,24}$/.test(username);
  }

  private validatePasswordStrength(password: string): string | null {
    if (password.length < 8) {
      return 'La contraseña debe tener minimo 8 caracteres.';
    }

    if (!/[A-Z]/.test(password)) {
      return 'La contraseña debe incluir al menos una mayuscula.';
    }

    if (!/[a-z]/.test(password)) {
      return 'La contraseña debe incluir al menos una minuscula.';
    }

    if (!/[0-9]/.test(password)) {
      return 'La contraseña debe incluir al menos un numero.';
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'La contraseña debe incluir al menos un caracter especial.';
    }

    return null;
  }

  private getLoginAttempts(): Record<string, LoginAttemptState> {
    const raw = localStorage.getItem(this.loginAttemptsStorageKey);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as Record<string, LoginAttemptState>;
      return parsed ?? {};
    } catch {
      return {};
    }
  }

  private writeLoginAttempts(value: Record<string, LoginAttemptState>): void {
    localStorage.setItem(this.loginAttemptsStorageKey, JSON.stringify(value));
  }

  private clearLoginAttempts(username: string): void {
    const attempts = this.getLoginAttempts();
    if (!attempts[username]) {
      return;
    }

    delete attempts[username];
    this.writeLoginAttempts(attempts);
  }

  private registerFailedAttempt(username: string): void {
    const now = Date.now();
    const attempts = this.getLoginAttempts();
    const current = attempts[username];

    if (!current || now - current.firstAttemptAt > this.loginAttemptWindowMs) {
      attempts[username] = {
        count: 1,
        firstAttemptAt: now,
      };
      this.writeLoginAttempts(attempts);
      return;
    }

    const nextCount = current.count + 1;
    attempts[username] = {
      count: nextCount,
      firstAttemptAt: current.firstAttemptAt,
      lockedUntil:
        nextCount >= this.maxLoginAttempts
          ? now + this.loginLockDurationMs
          : current.lockedUntil,
    };
    this.writeLoginAttempts(attempts);
  }

  private getLoginLockMessage(username: string): string | null {
    const attempts = this.getLoginAttempts()[username];
    if (!attempts?.lockedUntil) {
      return null;
    }

    if (attempts.lockedUntil <= Date.now()) {
      this.clearLoginAttempts(username);
      return null;
    }

    const remainingMinutes = Math.max(
      1,
      Math.ceil((attempts.lockedUntil - Date.now()) / 60000),
    );
    return `Demasiados intentos. Intenta nuevamente en ${remainingMinutes} min.`;
  }
}
