# @icon-radar/shared

Shared library for Icon Radar microservices providing common types, utilities, middleware, and clients.

## Installation

```bash
npm install @icon-radar/shared
```

## Features

- **Type Definitions**: Comprehensive TypeScript types for all domain entities
- **Logger**: Winston-based structured logging with correlation IDs
- **Error Handling**: Standardized error classes and handlers
- **Validation**: Zod schemas for request validation
- **Authentication**: JWT middleware and token management
- **Service Communication**: HTTP client with circuit breaker and retry logic
- **Database**: Shared Prisma client with connection pooling
- **Middleware**: CORS, validation, error handling, and more
- **Utilities**: Common helper functions

## Usage

### Logger

```typescript
import { logger, createServiceLogger } from '@icon-radar/shared';

// Use default logger
logger.info('Application started', { port: 3000 });
logger.error('Database connection failed', { error: err.message });

// Create service-specific logger
const serviceLogger = createServiceLogger('athlete-service');
serviceLogger.info('Athlete created', { athleteId: '123' });

// Create child logger with context
const userLogger = logger.withUser('user-123', 'user@example.com');
userLogger.info('User action', { action: 'login' });

// Log with correlation ID
const correlationLogger = logger.withCorrelation('corr-456');
correlationLogger.info('Request processed');

// Specialized logging methods
logger.logRequest('GET', '/api/athletes', { correlationId: 'corr-123' });
logger.logResponse('GET', '/api/athletes', 200, 150, { correlationId: 'corr-123' });
logger.logExternalCall('crunchbase', 'POST /search', 350, true);
logger.logJob('brand-discovery', 'job-789', 'completed');
logger.logAuth('login', 'user-123');
logger.logSecurity('failed_login_attempt', 'high', { ip: '1.2.3.4' });
```

### Error Handling

```typescript
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ErrorFactory,
  errorHandler,
  asyncHandler,
} from '@icon-radar/shared';

// Throw errors
throw new NotFoundError('Athlete not found', correlationId);
throw new ValidationError('Invalid input', [
  { field: 'email', message: 'Invalid email format' },
]);

// Use error factory
throw ErrorFactory.notFound('Brand not found');
throw ErrorFactory.unauthorized('Invalid token');
throw ErrorFactory.externalApi('crunchbase', 'API call failed');

// Async handler wrapper
app.get('/athletes/:id', asyncHandler(async (req, res) => {
  const athlete = await athleteService.getById(req.params.id);
  if (!athlete) {
    throw new NotFoundError('Athlete not found');
  }
  res.json({ success: true, data: athlete });
}));

// Error handler middleware (add last)
app.use(errorHandler);
app.use(notFoundHandler);
```

### Validation

```typescript
import {
  validateBody,
  validateQuery,
  validateParams,
  AthleteSchemas,
  UserSchemas,
} from '@icon-radar/shared';

// Validate request body
app.post('/athletes', validateBody(AthleteSchemas.createAthlete), createAthlete);

// Validate query parameters
app.get('/athletes', validateQuery(AthleteSchemas.athleteSearch), getAthletes);

// Validate URL parameters
app.get('/athletes/:id', validateParams(z.object({ id: Validators.uuid })), getAthlete);

// Validate multiple targets
app.patch(
  '/athletes/:id',
  validateMultiple({
    params: z.object({ id: Validators.uuid }),
    body: AthleteSchemas.updateAthlete,
  }),
  updateAthlete
);

// Custom validation
const schema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email(),
  age: z.number().min(18),
});

app.post('/users', validateBody(schema), createUser);
```

### Authentication

```typescript
import {
  requireAuth,
  requireRole,
  optionalAuth,
  requireServiceAuth,
  generateToken,
  generateRefreshToken,
} from '@icon-radar/shared';

// Require authentication
app.get('/profile', requireAuth, getProfile);

// Require specific role
app.post('/athletes', requireAuth, requireRole('admin'), createAthlete);

// Multiple roles
app.delete('/athletes/:id', requireAuth, requireRole('admin', 'user'), deleteAthlete);

// Optional authentication
app.get('/public', optionalAuth, getPublicData);

// Service-to-service auth
app.post('/internal/sync', requireServiceAuth, syncData);

// Generate tokens
const accessToken = generateToken({
  userId: user.id,
  email: user.email,
  role: user.role,
});

const refreshToken = generateRefreshToken(user.id);
```

### Service Client

```typescript
import { createServiceClient } from '@icon-radar/shared';

// Create service client
const athleteService = createServiceClient({
  baseURL: process.env.ATHLETE_SERVICE_URL || 'http://localhost:3002',
  serviceName: 'athlete-service',
  timeout: 10000,
  retryAttempts: 3,
  circuitBreaker: {
    failureThreshold: 5,
    successThreshold: 2,
    timeout: 60000,
  },
});

// Make requests
const athlete = await athleteService.get('/athletes/123', {
  correlationId: req.correlationId,
  token: req.headers.authorization,
  cache: true,
  cacheTTL: 300000, // 5 minutes
});

const newAthlete = await athleteService.post(
  '/athletes',
  { name: 'LeBron James', sport: 'Basketball' },
  { correlationId: req.correlationId }
);

// Update and delete
await athleteService.patch('/athletes/123', { status: 'retired' });
await athleteService.delete('/athletes/123');

// Check circuit breaker state
const state = athleteService.getCircuitBreakerState(); // CLOSED, OPEN, HALF_OPEN

// Reset circuit breaker
athleteService.resetCircuitBreaker();

// Clear cache
athleteService.clearCache();
```

### Prisma Client

```typescript
import { prisma, transaction, query } from '@icon-radar/shared';

// Use Prisma client directly
const athletes = await prisma.athlete.findMany({
  where: { sport: 'Basketball' },
  include: { brandRelationships: true },
});

// Execute transaction
const result = await transaction(async (tx) => {
  const athlete = await tx.athlete.create({
    data: { name: 'LeBron James', sport: 'Basketball' },
  });

  await tx.athleteBrandRelationship.create({
    data: {
      athleteId: athlete.id,
      brandId: 'brand-123',
      relationshipType: 'OWNER',
    },
  });

  return athlete;
}, correlationId);

// Execute query with error handling
const athlete = await query(
  async (prisma) => {
    return await prisma.athlete.findUnique({
      where: { id: athleteId },
    });
  },
  'getAthlete',
  correlationId
);
```

### CORS Middleware

```typescript
import { cors, devCors, prodCors, envCors, autoCors } from '@icon-radar/shared';

// Development (allow all)
app.use(devCors());

// Production (specific origins)
app.use(prodCors(['https://iconradar.com', 'https://app.iconradar.com']));

// Environment-based
app.use(envCors(['https://iconradar.com']));

// Auto (reads from CORS_ORIGINS env)
app.use(autoCors());

// Custom configuration
app.use(
  cors({
    origins: ['https://iconradar.com', '*.iconradar.com'],
    allowCredentials: true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  })
);
```

### Request Logging

```typescript
import { correlationId, requestLogger } from '@icon-radar/shared';

// Add correlation ID to all requests
app.use(correlationId);

// Log all requests and responses
app.use(requestLogger);

// Access correlation ID in handlers
app.get('/athletes', (req: AuthenticatedRequest, res) => {
  const correlationId = req.correlationId;
  logger.info('Getting athletes', { correlationId });
});
```

### Helper Functions

```typescript
import {
  generateUUID,
  retry,
  calculatePagination,
  slugify,
  pick,
  omit,
  formatNumber,
  formatCurrency,
  formatPercentage,
  maskEmail,
  sleep,
} from '@icon-radar/shared';

// Generate UUID
const id = generateUUID();

// Retry with exponential backoff
const result = await retry(
  async () => await fetchExternalAPI(),
  {
    maxAttempts: 3,
    initialDelay: 1000,
    maxDelay: 10000,
    factor: 2,
    onRetry: (attempt, error) => {
      logger.warn(`Retry attempt ${attempt}`, { error: error.message });
    },
  }
);

// Calculate pagination
const pagination = calculatePagination(150, 2, 20);
// { page: 2, limit: 20, total: 150, totalPages: 8, hasMore: true }

// String utilities
const slug = slugify('Hello World!'); // 'hello-world'

// Object utilities
const picked = pick(user, ['id', 'email', 'role']);
const omitted = omit(user, ['password', 'refreshToken']);

// Number formatting
formatNumber(1000000); // '1,000,000'
formatCurrency(1500.50); // '$1,500.50'
formatPercentage(0.75); // '75.00%'

// Masking
maskEmail('john@example.com'); // 'jo***@example.com'

// Sleep
await sleep(1000); // Wait 1 second
```

### Constants

```typescript
import {
  HTTP_STATUS,
  SERVICE_NAMES,
  ROLES,
  JOB_TYPES,
  CACHE_TTL,
  PAGINATION,
  getEnv,
  requireEnv,
  isProduction,
} from '@icon-radar/shared';

// HTTP status codes
res.status(HTTP_STATUS.NOT_FOUND).json({ error: 'Not found' });

// Service names
const serviceName = SERVICE_NAMES.ATHLETE_SERVICE;

// Roles
if (user.role === ROLES.ADMIN) {
  // Admin actions
}

// Job types
await queue.add(JOB_TYPES.BRAND_DISCOVERY, { athleteId: '123' });

// Cache TTL
cache.set(key, value, CACHE_TTL.LONG); // 1 hour

// Pagination defaults
const page = Number(req.query.page) || PAGINATION.DEFAULT_PAGE;
const limit = Number(req.query.limit) || PAGINATION.DEFAULT_LIMIT;

// Environment utilities
const apiKey = requireEnv('API_KEY'); // Throws if not set
const debug = getEnv('DEBUG', 'false'); // Returns 'false' if not set

if (isProduction()) {
  // Production-only logic
}
```

## Complete Example

```typescript
import express from 'express';
import {
  logger,
  createServiceLogger,
  cors,
  correlationId,
  requestLogger,
  requireAuth,
  requireRole,
  validateBody,
  validateParams,
  errorHandler,
  notFoundHandler,
  setupErrorHandlers,
  asyncHandler,
  NotFoundError,
  AthleteSchemas,
  Validators,
  prisma,
  HTTP_STATUS,
} from '@icon-radar/shared';
import { z } from 'zod';

const app = express();
const serviceLogger = createServiceLogger('athlete-service');

// Setup global error handlers
setupErrorHandlers();

// Middleware
app.use(express.json());
app.use(cors());
app.use(correlationId);
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'athlete-service' });
});

// Get all athletes
app.get(
  '/athletes',
  requireAuth,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20 } = req.query;

    const athletes = await prisma.athlete.findMany({
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit),
    });

    const total = await prisma.athlete.count();

    res.json({
      success: true,
      data: athletes,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  })
);

// Get athlete by ID
app.get(
  '/athletes/:id',
  requireAuth,
  validateParams(z.object({ id: Validators.uuid })),
  asyncHandler(async (req, res) => {
    const athlete = await prisma.athlete.findUnique({
      where: { id: req.params.id },
    });

    if (!athlete) {
      throw new NotFoundError('Athlete not found');
    }

    res.json({ success: true, data: athlete });
  })
);

// Create athlete
app.post(
  '/athletes',
  requireAuth,
  requireRole('admin'),
  validateBody(AthleteSchemas.createAthlete),
  asyncHandler(async (req, res) => {
    const athlete = await prisma.athlete.create({
      data: req.body,
    });

    serviceLogger.info('Athlete created', { athleteId: athlete.id });

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      data: athlete,
    });
  })
);

// Error handlers (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  serviceLogger.info(`Service listening on port ${PORT}`);
});
```

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/iconradar

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# Service
SERVICE_NAME=athlete-service
PORT=3002
NODE_ENV=development
LOG_LEVEL=info

# Service-to-service auth
SERVICE_API_KEY=your-service-api-key

# CORS
CORS_ORIGINS=https://iconradar.com,https://app.iconradar.com

# Service URLs (for inter-service communication)
ATHLETE_SERVICE_URL=http://localhost:3002
BRAND_SERVICE_URL=http://localhost:3003
ANALYTICS_SERVICE_URL=http://localhost:3004
```

## TypeScript

All exports are fully typed. Import types as needed:

```typescript
import type {
  Athlete,
  Brand,
  User,
  CreateAthleteInput,
  UpdateBrandInput,
  AuthenticatedRequest,
  JWTPayload,
  UserContext,
  ServiceResponse,
  Pagination,
} from '@icon-radar/shared';
```

## Testing

```bash
npm test              # Run all tests
npm test -- --watch   # Watch mode
npm test -- --coverage # Coverage report
```

## License

MIT

## Support

For issues and questions, contact the Icon Radar development team.
