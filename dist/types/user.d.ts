import { Role, Timestamps } from './common';
export interface User extends Timestamps {
    id: string;
    email: string;
    password: string;
    role: Role;
    emailVerified: boolean;
    emailVerifiedAt?: Date | null;
    lastLoginAt?: Date | null;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
}
export interface UserPublic {
    id: string;
    email: string;
    role: Role;
    emailVerified: boolean;
    firstName?: string | null;
    lastName?: string | null;
    avatarUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateUserInput {
    email: string;
    password: string;
    role?: Role;
    firstName?: string;
    lastName?: string;
}
export interface UpdateUserInput {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
}
export interface Session {
    id: string;
    userId: string;
    accessToken: string;
    refreshToken: string;
    expiresAt: Date;
    createdAt: Date;
    ipAddress?: string;
    userAgent?: string;
}
export interface UserPreferences {
    userId: string;
    theme: 'light' | 'dark' | 'auto';
    language: string;
    notifications: {
        email: boolean;
        push: boolean;
        jobComplete: boolean;
        brandDiscovery: boolean;
    };
    dashboardSettings?: Record<string, any>;
}
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface RegisterInput extends LoginCredentials {
    firstName?: string;
    lastName?: string;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export interface AuthResponse {
    user: UserPublic;
    tokens: AuthTokens;
}
export interface JWTPayload {
    userId: string;
    email: string;
    role: Role;
    iat: number;
    exp: number;
}
export interface UserContext {
    userId: string;
    email: string;
    role: Role;
}
export interface PasswordResetRequest {
    email: string;
}
export interface PasswordReset {
    token: string;
    newPassword: string;
}
export interface ChangePassword {
    currentPassword: string;
    newPassword: string;
}
//# sourceMappingURL=user.d.ts.map