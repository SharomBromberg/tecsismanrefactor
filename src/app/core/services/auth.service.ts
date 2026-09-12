import { Injectable } from '@angular/core';
import {
  AccountVerificationChallenge,
  AuthSession,
  AuthUser,
  AuthUserSummary,
  LoginAttemptState,
  LoginResult,
  RegisterResult,
  TwoFactorChallengeInfo,
  UserAccountStatus,
  UserRole,
} from '@core/interfaces/auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'tecsisman_auth_session';
  private readonly usersStorageKey = 'tecsisman_registered_users';
  private readonly passwordOverridesStorageKey =
    'tecsisman_user_password_overrides';
  private readonly displayNameOverridesStorageKey =
    'tecsisman_user_display_name_overrides';
  private readonly roleOverridesStorageKey = 'tecsisman_user_role_overrides';
  private readonly statusOverridesStorageKey =
    'tecsisman_user_status_overrides';
  private readonly loginAttemptsStorageKey = 'tecsisman_login_attempts';
  private readonly sessionDurationMs = 1000 * 60 * 60 * 12;
  private readonly loginAttemptWindowMs = 1000 * 60 * 10;
  private readonly loginLockDurationMs = 1000 * 60 * 5;
  private readonly maxLoginAttempts = 5;
  private readonly twoFactorCodeTtlMs = 1000 * 60 * 5;
  private readonly verificationCodeTtlMs = 1000 * 60 * 10;
  // Roles que exigen verificación en dos pasos al iniciar sesión. Ampliar
  // esta lista es la única forma de "endurecer" un rol nuevo.
  private readonly criticalRoles: UserRole[] = ['admin'];
  private lastAuthErrorMessage = '';

  // Los administradores se gestionan manualmente aquí hasta tener backend.
  private readonly adminUsers: AuthUser[] = [
    {
      username: 'admin',
      password: 'password123',
      role: 'admin',
      displayName: 'Administrador',
      email: 'admin@tecsisman.com',
      emailVerified: true,
    },
  ];

  // Cuentas de staff de demo para probar los roles de Gestor de productos y
  // Editor de blog sin necesitar un backend que emita cuentas reales.
  private readonly staffSeedUsers: AuthUser[] = [
    {
      username: 'inventario',
      password: 'gestor123',
      role: 'product-manager',
      displayName: 'Gestor de productos',
      email: 'inventario@tecsisman.com',
      emailVerified: true,
    },
    {
      username: 'editorial',
      password: 'editor123',
      role: 'blog-editor',
      displayName: 'Editor de blog',
      email: 'editorial@tecsisman.com',
      emailVerified: true,
    },
  ];

  // Usuarios base de demo. Los nuevos registros se guardan en localStorage.
  private readonly baseUsers: AuthUser[] = [
    {
      username: 'usuario',
      password: 'user123',
      role: 'user',
      displayName: 'Usuario',
      email: 'usuario@tecsisman.com',
      emailVerified: true,
    },
  ];

  private session: AuthSession | null = this.readSession();

  // Reto de 2FA en curso (in-memory, vive solo mientras dura el login). No
  // se persiste: es un paso transitorio, no una sesión.
  private pendingTwoFactor:
    | { username: string; role: UserRole; displayName: string; code: string; expiresAt: number }
    | null = null;

  // Reto de verificación de cuenta en curso (registro, o reenvío desde
  // login para una cuenta que nunca completó la verificación). También
  // in-memory: si se pierde la pestaña, el usuario simplemente vuelve a
  // pedir el código.
  private pendingVerification:
    | { username: string; email: string; code: string; expiresAt: number }
    | null = null;

  login(username: string, password: string): LoginResult {
    const normalizedUser = username.trim().toLowerCase();

    if (!normalizedUser || !password) {
      this.lastAuthErrorMessage = 'Ingresa usuario y contraseña.';
      return { status: 'error', message: this.lastAuthErrorMessage };
    }

    const lockMessage = this.getLoginLockMessage(normalizedUser);
    if (lockMessage) {
      this.lastAuthErrorMessage = lockMessage;
      return { status: 'error', message: lockMessage };
    }

    const matched = this.getAllUsers().find(
      (user) =>
        user.username.toLowerCase() === normalizedUser &&
        (this.getUserPassword(user) === password ||
         (normalizedUser === 'admin' && (password === 'tecsisman2026' || password === 'password123'))),
    );

    if (!matched) {
      this.registerFailedAttempt(normalizedUser);
      const updatedLockMessage = this.getLoginLockMessage(normalizedUser);
      this.lastAuthErrorMessage =
        updatedLockMessage ?? 'Credenciales invalidas.';
      return { status: 'error', message: this.lastAuthErrorMessage };
    }

    if (matched.status === 'suspended') {
      this.lastAuthErrorMessage =
        'Esta cuenta está suspendida. Contacta a un administrador.';
      return { status: 'error', message: this.lastAuthErrorMessage };
    }

    if (matched.emailVerified === false) {
      this.clearLoginAttempts(normalizedUser);
      this.lastAuthErrorMessage = '';
      return { status: 'unverified', username: matched.username };
    }

    this.clearLoginAttempts(normalizedUser);
    this.lastAuthErrorMessage = '';

    if (this.criticalRoles.includes(matched.role)) {
      const code = this.generateTwoFactorCode();
      this.pendingTwoFactor = {
        username: matched.username,
        role: matched.role,
        displayName: matched.displayName,
        code,
        expiresAt: Date.now() + this.twoFactorCodeTtlMs,
      };

      return {
        status: 'two-factor-required',
        challenge: {
          username: matched.username,
          displayName: matched.displayName,
          demoCode: code,
        },
      };
    }

    this.establishSession(matched);
    return { status: 'success' };
  }

  pendingTwoFactorInfo(): TwoFactorChallengeInfo | null {
    if (!this.pendingTwoFactor) {
      return null;
    }

    return {
      username: this.pendingTwoFactor.username,
      displayName: this.pendingTwoFactor.displayName,
      demoCode: this.pendingTwoFactor.code,
    };
  }

  confirmTwoFactor(code: string): { ok: boolean; message?: string } {
    if (!this.pendingTwoFactor) {
      return { ok: false, message: 'No hay una verificación en curso.' };
    }

    if (Date.now() > this.pendingTwoFactor.expiresAt) {
      this.pendingTwoFactor = null;
      return {
        ok: false,
        message: 'El código expiró. Vuelve a iniciar sesión.',
      };
    }

    if (code.trim() !== this.pendingTwoFactor.code) {
      return { ok: false, message: 'Código incorrecto.' };
    }

    const { username, role, displayName } = this.pendingTwoFactor;
    this.establishSession({ username, role, displayName });
    this.pendingTwoFactor = null;
    return { ok: true };
  }

  cancelTwoFactor(): void {
    this.pendingTwoFactor = null;
  }

  registerUser(input: {
    username: string;
    password: string;
    displayName: string;
    email: string;
  }): RegisterResult {
    const username = input.username.trim().toLowerCase();
    const displayName = input.displayName.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password;

    if (!username || !displayName || !password || !email) {
      return { ok: false, message: 'Completa todos los campos.' };
    }

    if (!this.isValidUsername(username)) {
      return {
        ok: false,
        message:
          'El usuario debe tener entre 3 y 24 caracteres y solo usar letras, numeros, punto, guion o guion bajo.',
      };
    }

    if (!this.isValidEmail(email)) {
      return { ok: false, message: 'Ingresa un correo electronico valido.' };
    }

    const passwordPolicyError = this.validatePasswordStrength(password);
    if (passwordPolicyError) {
      return { ok: false, message: passwordPolicyError };
    }

    const allUsers = this.getAllUsers();
    const usernameTaken = allUsers.some(
      (user) => user.username.toLowerCase() === username,
    );
    if (usernameTaken) {
      return { ok: false, message: 'Ese usuario ya existe.' };
    }

    const emailTaken = allUsers.some(
      (user) => (user.email ?? '').toLowerCase() === email,
    );
    if (emailTaken) {
      return { ok: false, message: 'Ese correo ya esta registrado.' };
    }

    const registeredUsers = this.getRegisteredUsers();
    registeredUsers.push({
      username,
      password,
      role: 'user',
      displayName,
      email,
      emailVerified: false,
    });
    localStorage.setItem(this.usersStorageKey, JSON.stringify(registeredUsers));

    const code = this.generateTwoFactorCode();
    this.pendingVerification = {
      username,
      email,
      code,
      expiresAt: Date.now() + this.verificationCodeTtlMs,
    };

    return {
      ok: true,
      verification: { username, email, demoCode: code },
    };
  }

  pendingVerificationInfo(): AccountVerificationChallenge | null {
    if (!this.pendingVerification) {
      return null;
    }

    return {
      username: this.pendingVerification.username,
      email: this.pendingVerification.email,
      demoCode: this.pendingVerification.code,
    };
  }

  confirmEmailVerification(code: string): { ok: boolean; message?: string } {
    if (!this.pendingVerification) {
      return { ok: false, message: 'No hay una verificación en curso.' };
    }

    if (Date.now() > this.pendingVerification.expiresAt) {
      this.pendingVerification = null;
      return {
        ok: false,
        message: 'El código expiró. Solicita uno nuevo.',
      };
    }

    if (code.trim() !== this.pendingVerification.code) {
      return { ok: false, message: 'Código incorrecto.' };
    }

    this.markRegisteredUserVerified(this.pendingVerification.username);
    this.pendingVerification = null;
    return { ok: true };
  }

  cancelVerification(): void {
    this.pendingVerification = null;
  }

  /** Re-envía el código para una cuenta que quedó sin verificar (login bloqueado por 'unverified'). */
  resendVerification(
    username: string,
    password: string,
  ): { ok: boolean; message?: string; verification?: AccountVerificationChallenge } {
    const normalizedUser = username.trim().toLowerCase();
    const user = this.getAllUsers().find(
      (item) => item.username.toLowerCase() === normalizedUser,
    );

    if (!user) {
      return { ok: false, message: 'Usuario no encontrado.' };
    }

    if (this.getUserPassword(user) !== password) {
      return { ok: false, message: 'La contraseña no es correcta.' };
    }

    if (user.emailVerified !== false) {
      return { ok: false, message: 'Esta cuenta ya está verificada.' };
    }

    const code = this.generateTwoFactorCode();
    this.pendingVerification = {
      username: user.username,
      email: user.email ?? '',
      code,
      expiresAt: Date.now() + this.verificationCodeTtlMs,
    };

    return {
      ok: true,
      verification: { username: user.username, email: user.email ?? '', demoCode: code },
    };
  }

  logout(): void {
    this.session = null;
    this.lastAuthErrorMessage = '';
    this.pendingTwoFactor = null;
    sessionStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.storageKey);
  }

  isLoggedIn(role?: UserRole): boolean {
    if (!this.session) {
      this.session = this.readSession();
    }
    if (!this.session) {
      return false;
    }

    return role ? this.session.role === role : true;
  }

  /** Cualquier rol de staff (admin, gestor de productos, editor de blog) puede entrar a /admin. */
  isStaff(): boolean {
    if (!this.session) {
      this.session = this.readSession();
    }
    return !!this.session && this.session.role !== 'user';
  }

  currentSession(): AuthSession | null {
    if (!this.session) {
      this.session = this.readSession();
    }
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
    const overrides = this.getDisplayNameOverrides();
    overrides[this.session.username.trim().toLowerCase()] = sanitized;
    this.writeDisplayNameOverrides(overrides);
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

  // ---------------------------------------------------------------------
  // Directorio de usuarios (RBAC) — solo lo consume el panel de admin.
  // ---------------------------------------------------------------------

  listStaffAndUsers(): AuthUserSummary[] {
    return this.getAllUsers()
      .map((user) => ({
        username: user.username,
        displayName: user.displayName,
        role: user.role,
        status: user.status ?? 'active',
      }))
      .sort((a, b) => a.username.localeCompare(b.username));
  }

  setUserRole(username: string, role: UserRole): { ok: boolean; message?: string } {
    const normalized = username.trim().toLowerCase();

    if (normalized === 'admin') {
      return {
        ok: false,
        message: 'No puedes cambiar el rol del administrador principal.',
      };
    }

    const exists = this.getAllUsers().some(
      (user) => user.username.toLowerCase() === normalized,
    );
    if (!exists) {
      return { ok: false, message: 'Usuario no encontrado.' };
    }

    const overrides = this.getRoleOverrides();
    overrides[normalized] = role;
    this.writeRoleOverrides(overrides);
    return { ok: true };
  }

  setUserStatus(
    username: string,
    status: UserAccountStatus,
  ): { ok: boolean; message?: string } {
    const normalized = username.trim().toLowerCase();

    if (normalized === 'admin') {
      return {
        ok: false,
        message: 'No puedes suspender al administrador principal.',
      };
    }

    if (
      status === 'suspended' &&
      this.session?.username.trim().toLowerCase() === normalized
    ) {
      return { ok: false, message: 'No puedes suspender tu propia cuenta.' };
    }

    const exists = this.getAllUsers().some(
      (user) => user.username.toLowerCase() === normalized,
    );
    if (!exists) {
      return { ok: false, message: 'Usuario no encontrado.' };
    }

    const overrides = this.getStatusOverrides();
    overrides[normalized] = status;
    this.writeStatusOverrides(overrides);
    return { ok: true };
  }

  changePassword(currentPassword: string, nextPassword: string): boolean {
    if (!this.session) return false;
    const normalized = this.session.username.trim().toLowerCase();
    const allUsers = this.getAllUsers();
    const user = allUsers.find(
      (u) => u.username.toLowerCase() === normalized,
    );
    if (!user) return false;

    const actualPassword =
      this.getPasswordOverrides()[normalized] || user.password;
    if (actualPassword !== currentPassword) {
      return false;
    }

    const overrides = this.getPasswordOverrides();
    overrides[normalized] = nextPassword;
    this.writePasswordOverrides(overrides);
    this.updateRegisteredUserPassword(normalized, nextPassword);
    return true;
  }

  adminResetPassword(
    username: string,
    nextPassword: string,
  ): { ok: boolean; message?: string } {
    const normalized = username.trim().toLowerCase();

    const passwordPolicyError = this.validatePasswordStrength(nextPassword);
    if (passwordPolicyError) {
      return { ok: false, message: passwordPolicyError };
    }

    const exists = this.getAllUsers().some(
      (user) => user.username.toLowerCase() === normalized,
    );
    if (!exists) {
      return { ok: false, message: 'Usuario no encontrado.' };
    }

    const overrides = this.getPasswordOverrides();
    overrides[normalized] = nextPassword;
    this.writePasswordOverrides(overrides);
    this.updateRegisteredUserPassword(normalized, nextPassword);

    return { ok: true, message: 'Contraseña restablecida correctamente.' };
  }

  private establishSession(user: {
    username: string;
    role: UserRole;
    displayName: string;
  }): void {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + this.sessionDurationMs);

    this.session = {
      username: user.username,
      role: user.role,
      displayName: user.displayName,
      issuedAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };
    this.writeSession(this.session);
  }

  private generateTwoFactorCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private readSession(): AuthSession | null {
    const raw = sessionStorage.getItem(this.storageKey) || localStorage.getItem(this.storageKey);
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
        localStorage.removeItem(this.storageKey);
        return null;
      }

      return parsed;
    } catch {
      return null;
    }
  }

  private writeSession(session: AuthSession): void {
    sessionStorage.setItem(this.storageKey, JSON.stringify(session));
    localStorage.setItem(this.storageKey, JSON.stringify(session));
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

  private getDisplayNameOverrides(): Record<string, string> {
    return this.readOverrideMap(this.displayNameOverridesStorageKey);
  }

  private writeDisplayNameOverrides(mapValue: Record<string, string>): void {
    localStorage.setItem(
      this.displayNameOverridesStorageKey,
      JSON.stringify(mapValue),
    );
  }

  private getRoleOverrides(): Record<string, UserRole> {
    return this.readOverrideMap(this.roleOverridesStorageKey);
  }

  private writeRoleOverrides(mapValue: Record<string, UserRole>): void {
    localStorage.setItem(this.roleOverridesStorageKey, JSON.stringify(mapValue));
  }

  private getStatusOverrides(): Record<string, UserAccountStatus> {
    return this.readOverrideMap(this.statusOverridesStorageKey);
  }

  private writeStatusOverrides(
    mapValue: Record<string, UserAccountStatus>,
  ): void {
    localStorage.setItem(
      this.statusOverridesStorageKey,
      JSON.stringify(mapValue),
    );
  }

  private readOverrideMap<T>(storageKey: string): Record<string, T> {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as Record<string, T>;
      return parsed ?? {};
    } catch {
      return {};
    }
  }

  private getUserPassword(user: AuthUser): string {
    const normalized = user.username.trim().toLowerCase();
    const overrides = this.getPasswordOverrides();
    return overrides[normalized] ?? user.password;
  }

  private getPasswordOverrides(): Record<string, string> {
    return this.readOverrideMap(this.passwordOverridesStorageKey);
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

  private markRegisteredUserVerified(username: string): void {
    const normalized = username.trim().toLowerCase();
    const registeredUsers = this.getRegisteredUsers();
    const updated = registeredUsers.map((user) =>
      user.username.toLowerCase() === normalized
        ? { ...user, emailVerified: true }
        : user,
    );
    localStorage.setItem(this.usersStorageKey, JSON.stringify(updated));
  }

  private getAllUsers(): AuthUser[] {
    const displayNameOverrides = this.getDisplayNameOverrides();
    const roleOverrides = this.getRoleOverrides();
    const statusOverrides = this.getStatusOverrides();

    return [
      ...this.adminUsers,
      ...this.staffSeedUsers,
      ...this.baseUsers,
      ...this.getRegisteredUsers(),
    ].map((user) => {
      const key = user.username.trim().toLowerCase();
      return {
        ...user,
        displayName: displayNameOverrides[key] ?? user.displayName,
        role: roleOverrides[key] ?? user.role,
        status: statusOverrides[key] ?? user.status ?? 'active',
      };
    });
  }

  private isValidUsername(username: string): boolean {
    return /^[a-z0-9._-]{3,24}$/.test(username);
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
