import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
export type ValidationTarget = 'body' | 'query' | 'params';
export declare function validateRequest<T extends z.ZodType>(schema: T, target?: ValidationTarget): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateBody<T extends z.ZodType>(schema: T): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateQuery<T extends z.ZodType>(schema: T): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateParams<T extends z.ZodType>(schema: T): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateMultiple(schemas: {
    body?: z.ZodType;
    query?: z.ZodType;
    params?: z.ZodType;
}): (req: Request, res: Response, next: NextFunction) => void;
export declare function sanitizeBody<T extends z.ZodType>(schema: T): (req: Request, _res: Response, next: NextFunction) => void;
export declare function validatePagination(req: Request, res: Response, next: NextFunction): void;
export declare function validateUUID(paramName: string): (req: Request, res: Response, next: NextFunction) => void;
export declare function validateId(paramName?: string): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=validation.d.ts.map