import { Request, Response, NextFunction } from 'express';
export interface CorsOptions {
    origins?: string[];
    allowCredentials?: boolean;
    allowMethods?: string[];
    allowHeaders?: string[];
    exposeHeaders?: string[];
    maxAge?: number;
}
export declare function cors(options?: CorsOptions): (req: Request, res: Response, next: NextFunction) => void;
export declare function devCors(): (req: Request, res: Response, next: NextFunction) => void;
export declare function prodCors(allowedOrigins: string[]): (req: Request, res: Response, next: NextFunction) => void;
export declare function envCors(productionOrigins?: string[]): (req: Request, res: Response, next: NextFunction) => void;
export declare function getCorsOriginsFromEnv(): string[];
export declare function autoCors(): (req: Request, res: Response, next: NextFunction) => void;
export default cors;
//# sourceMappingURL=cors.d.ts.map