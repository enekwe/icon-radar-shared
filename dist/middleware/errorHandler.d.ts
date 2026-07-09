import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/errors';
export declare function errorHandler(error: Error | ApiError, req: Request, res: Response, next: NextFunction): void;
export declare function notFoundHandler(req: Request, res: Response, next: NextFunction): void;
export declare function asyncHandler<T = any>(fn: (req: Request, res: Response, next: NextFunction) => Promise<T>): (req: Request, res: Response, next: NextFunction) => void;
export declare function setupUnhandledRejectionHandler(): void;
export declare function setupUncaughtExceptionHandler(): void;
export declare function setupErrorHandlers(): void;
//# sourceMappingURL=errorHandler.d.ts.map