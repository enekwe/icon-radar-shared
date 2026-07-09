import { Request, Response, NextFunction } from 'express';
import { JWTPayload, UserContext, Role } from '../types';
export declare function requireAuth(req: Request, res: Response, next: NextFunction): void;
export declare function requireRole(...roles: Role[]): (req: Request, res: Response, next: NextFunction) => void;
export declare function optionalAuth(req: Request, _res: Response, next: NextFunction): void;
export declare function requireServiceAuth(req: Request, res: Response, next: NextFunction): void;
export declare function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>, expiresIn?: string | number): string;
export declare function generateRefreshToken(userId: string): string;
export declare function verifyRefreshToken(token: string): {
    userId: string;
};
export declare function getUserContext(req: Request): UserContext | null;
export declare function hasRole(req: Request, ...roles: Role[]): boolean;
export declare function isAdmin(req: Request): boolean;
//# sourceMappingURL=auth.d.ts.map