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
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'tecsisman_auth_session';
  private readonly usersStorageKey = 'tecsisman_registered_users';
  private readonly passwordOverridesStorageKey =
    'tecsisman_user_password_overrides';

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

    const matched = this.getAllUsers().find(
      (user) =>
        user.username.toLowerCase() === normalizedUser &&
        this.getUserPassword(user) === password,
    );

    if (!matched) {
      return false;
    }

    this.session = {
      username: matched.username,
      role: matched.role,
      displayName: matched.displayName,
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

    if (nextPassword.length < 6) {
      return {
        ok: false,
        message: 'La nueva contraseña debe tener minimo 6 caracteres.',
      };
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
      if (!parsed.username || !parsed.role) {
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
}
