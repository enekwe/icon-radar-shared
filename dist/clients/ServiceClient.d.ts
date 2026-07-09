import { ServiceRequestOptions } from '../types';
declare enum CircuitState {
    CLOSED = "CLOSED",
    OPEN = "OPEN",
    HALF_OPEN = "HALF_OPEN"
}
interface CircuitBreakerConfig {
    failureThreshold: number;
    successThreshold: number;
    timeout: number;
}
export interface ServiceClientConfig {
    baseURL: string;
    serviceName: string;
    timeout?: number;
    retryAttempts?: number;
    retryDelay?: number;
    circuitBreaker?: Partial<CircuitBreakerConfig>;
    headers?: Record<string, string>;
}
export declare class ServiceClient {
    private axiosInstance;
    private circuitBreaker;
    private cache;
    private serviceName;
    constructor(config: ServiceClientConfig);
    get<T = any>(path: string, options?: ServiceRequestOptions): Promise<T>;
    post<T = any>(path: string, data?: any, options?: ServiceRequestOptions): Promise<T>;
    put<T = any>(path: string, data?: any, options?: ServiceRequestOptions): Promise<T>;
    patch<T = any>(path: string, data?: any, options?: ServiceRequestOptions): Promise<T>;
    delete<T = any>(path: string, options?: ServiceRequestOptions): Promise<T>;
    private executeRequest;
    private buildConfig;
    getCircuitBreakerState(): CircuitState;
    resetCircuitBreaker(): void;
    clearCache(): void;
    getServiceName(): string;
}
export declare function createServiceClient(config: ServiceClientConfig): ServiceClient;
export default ServiceClient;
//# sourceMappingURL=ServiceClient.d.ts.map