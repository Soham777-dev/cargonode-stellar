# Technical Design Document: Level 4 Production Upgrade

## Overview

### Purpose

This document specifies the technical design for upgrading CargoNode to meet Stellar Level 4 production requirements. The upgrade transforms CargoNode from a prototype into a production-ready MVP with stable infrastructure, comprehensive monitoring, mobile-responsive UI, and validated real-world usage with 10+ users.

### Scope

The Level 4 Production Upgrade encompasses:

1. **Infrastructure Modernization**: Update Railway project configuration, stabilize deployment architecture
2. **User Experience Enhancement**: Mobile responsive design, loading/error states, performance optimization
3. **Production Operations**: Monitoring, analytics, error tracking, logging infrastructure
4. **User Validation**: Onboard 10+ real users with verified wallet interactions
5. **Documentation & Demo**: Complete setup guides, API reference, demo video, user feedback summary

### Goals

- Achieve production-ready system architecture with 99.5% uptime target
- Deploy frontend (Vercel) and backend (Railway) with proper environment configuration
- Implement comprehensive monitoring and analytics for data-driven decision making
- Validate product-market fit with 10+ real user wallet interactions
- Provide complete documentation enabling new developers to set up in <30 minutes
- Ensure mobile-first responsive design across all viewport sizes (320px-2560px)

### Non-Goals

- Mainnet deployment (remaining on Stellar testnet for Level 4)
- Multi-language internationalization
- Advanced features beyond core escrow workflow
- Custom blockchain explorer integration
- Automated smart contract upgrades

## Architecture

### System Architecture Overview

CargoNode follows a three-tier architecture:


```mermaid
graph TB
    subgraph "Client Layer"
        A[Browser/Mobile]
        B[Freighter Wallet]
    end
    
    subgraph "Frontend Layer - Vercel"
        C[Next.js App Router]
        D[React Components]
        E[Vercel Analytics]
        F[API Client]
    end
    
    subgraph "Backend Layer - Railway"
        G[Express API Server]
        H[Pino Logger]
        I[Rate Limiter]
        J[Stellar SDK Client]
    end
    
    subgraph "Data Layer"
        K[(PostgreSQL DB)]
        L[Stellar Testnet]
        M[Soroban Smart Contract]
    end
    
    A --> C
    B --> D
    C --> F
    D --> E
    F --> G
    G --> H
    G --> I
    G --> J
    G --> K
    J --> L
    J --> M
```

### Deployment Architecture

```mermaid
graph LR
    subgraph "Production Environment"
        A[Vercel CDN] -->|HTTPS| B[Next.js Frontend]
        C[Railway Platform] -->|HTTPS| D[Node.js Backend]
        D -->|PostgreSQL Protocol| E[(Railway PostgreSQL)]
        D -->|HTTPS| F[Stellar Horizon API]
        D -->|HTTPS| G[Soroban RPC]
    end
    
    subgraph "Monitoring"
        B --> H[Vercel Analytics]
        D --> I[Pino Logs]
        I --> J[Railway Logs]
    end
    
    subgraph "External Services"
        F --> K[Stellar Testnet]
        G --> L[Smart Contract<br/>CAI52UIAHEMT3SNQ...]
    end
```

### Technology Stack

**Frontend:**
- Framework: Next.js 15.2.6 (App Router)
- Language: TypeScript 5.7.2
- UI: React 19.0, Tailwind CSS 3.4.17
- Wallet: Freighter API 3.0.0
- Blockchain: Stellar SDK 12.3.0
- Analytics: Vercel Analytics 2.0.1
- Hosting: Vercel (Production)

**Backend:**
- Runtime: Node.js 20+ with Express 4.21.1
- Language: TypeScript 5.7.2
- Database: PostgreSQL 14+ with pg driver 8.13.1
- Blockchain: Stellar SDK 12.3.0
- Logging: Pino 9.14.0 with pino-pretty 13.1.3
- Validation: Zod 3.24.1
- Hosting: Railway (Project ID: 5cc5d4b8-aa32-4e6a-b0c9-d3538b20add0)

**Smart Contracts:**
- Language: Rust (Soroban)
- Network: Stellar Testnet
- Contract Address: `CAI52UIAHEMT3SNQ2EXOJKHHC2PAGLGURZYNL6HFZJ6LL5KDQFURBQUH`
- Token: USDC test token `CAATNNYENLGM6JUS522SLKU2BYHHLN5PYI7XNRJXP7CE2KESE7P52FW5`

### Infrastructure Components

**Railway Backend Infrastructure:**
- **Project ID**: `5cc5d4b8-aa32-4e6a-b0c9-d3538b20add0`
- **Build**: Dockerfile-based containerized deployment
- **Start Command**: `node dist/index.js`
- **Restart Policy**: On failure with max 3 retries
- **Database**: Managed PostgreSQL instance with connection pooling
- **Environment Variables**: Injected via Railway service configuration
- **Health Checks**: `/api/health` and `/api/metrics` endpoints

**Vercel Frontend Infrastructure:**
- **Framework Preset**: Next.js with automatic optimization
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Analytics**: Vercel Analytics integrated via `@vercel/analytics`
- **CDN**: Global edge network with automatic caching
- **Environment Variables**: Injected via Vercel project settings

### Data Flow

**Shipment Creation Flow:**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant W as Freighter Wallet
    participant B as Backend API
    participant DB as PostgreSQL
    participant S as Stellar Network
    
    U->>F: Fill shipment form
    F->>F: Validate input
    F->>B: POST /api/shipments (shipment data)
    B->>B: Validate with Zod
    B->>DB: Insert shipment record
    B->>B: Build Stellar transaction XDR
    B-->>F: Return unsigned XDR
    F->>W: Request signature
    W-->>F: Return signed XDR
    F->>B: POST /api/shipments/:id/submit
    B->>S: Submit signed transaction
    S-->>B: Return transaction hash
    B->>DB: Update shipment with tx_hash
    B-->>F: Success response
    F->>U: Show success message
```

## Components and Interfaces


### Frontend Components

**Component Hierarchy:**

```
App Layout (layout.tsx)
├── Navigation Bar
│   ├── Logo
│   ├── Navigation Links (Home, Shipments, Analytics)
│   └── Wallet Connect Button
├── Page Content
│   ├── Home Page (page.tsx)
│   │   ├── Hero Section
│   │   ├── Stats Section
│   │   ├── How It Works Section
│   │   ├── Benefits Section
│   │   └── CTA Section
│   ├── Shipments Page (shipments/page.tsx)
│   │   ├── Filters & Search
│   │   ├── Shipment List Component
│   │   ├── Loading Skeleton
│   │   └── Error Boundary
│   ├── New Shipment Page (shipments/new/page.tsx)
│   │   ├── Shipment Form
│   │   ├── Form Validation
│   │   ├── Loading Overlay
│   │   └── Error Display
│   └── Analytics Page (analytics/page.tsx)
│       ├── Metrics Dashboard
│       └── Charts/Graphs
└── Footer
```

**Core Components:**

1. **WalletConnect Component**
   - Integrates Freighter wallet API
   - Displays connection status
   - Shows connected address (truncated)
   - Handles disconnect action
   - Mobile responsive button

2. **ShipmentCard Component**
   - Displays shipment summary
   - Status badge with color coding
   - Action buttons based on role and status
   - Responsive grid layout

3. **LoadingSpinner Component**
   - Animated SVG spinner
   - Customizable size and color
   - Accessible with aria-label

4. **ErrorAlert Component**
   - Error message display
   - Dismissible with close button
   - Icon + message + optional action button
   - Red color scheme

5. **ShipmentForm Component**
   - Controlled form inputs
   - Real-time validation feedback
   - Loading state during submission
   - Error display on failure

6. **StatusBadge Component**
   - Color-coded status indicators
   - Maps shipment status to badge style
   - Responsive sizing

### Backend Components

**Module Structure:**

```
backend/src/
├── index.ts              # Express server setup, middleware, routes
├── lib/
│   ├── stellar.ts        # Stellar SDK utilities
│   └── logger.ts         # Pino logger configuration
├── db/
│   ├── index.ts          # PostgreSQL connection pool
│   ├── migrate.ts        # Database migration runner
│   └── schema.sql        # SQL schema definitions
└── routes/
    └── shipments.ts      # Shipment REST API endpoints
```

**Core Modules:**

1. **Logger Module (`lib/logger.ts`)**
   - Pino-based structured logging
   - Child loggers with module context
   - JSON output in production, pretty in development
   - Log levels: trace, debug, info, warn, error, fatal

2. **Stellar Client Module (`lib/stellar.ts`)**
   - Stellar SDK initialization
   - Network configuration (testnet)
   - Account loading utilities
   - Transaction building helpers
   - XDR serialization/deserialization

3. **Database Module (`db/index.ts`)**
   - PostgreSQL connection pool with pg
   - Configurable pool size (max 20 connections)
   - Connection retry with exponential backoff
   - Query timeout handling (30 seconds)
   - Graceful shutdown on process termination

4. **Shipments Router (`routes/shipments.ts`)**
   - REST API endpoints for shipments
   - Zod schema validation
   - Transaction building and submission
   - Error handling with appropriate HTTP codes
   - Request/response logging

5. **Metrics Module**
   - In-memory counters for requests, errors, latency
   - System metrics (memory, uptime, platform)
   - Database pool metrics
   - Network configuration display
   - Exposed via `/api/metrics` endpoint

### API Interfaces

**REST API Specification:**

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/health` | Health check | None | `{ status, timestamp, version, network }` |
| GET | `/api/metrics` | System metrics | None | `{ status, timestamp, system, telemetry, database, network }` |
| GET | `/api/shipments` | List shipments | Query: `address`, `role` | `Shipment[]` |
| GET | `/api/shipments/:id` | Get shipment details | None | `Shipment` |
| POST | `/api/shipments` | Create shipment | `CreateShipmentRequest` | `{ shipment, xdr }` |
| POST | `/api/shipments/:id/submit` | Submit signed transaction | `{ signedXdr }` | `{ txHash }` |
| POST | `/api/shipments/:id/accept` | Build accept transaction | None | `{ xdr }` |
| POST | `/api/shipments/:id/confirm` | Build confirm transaction | None | `{ xdr }` |
| POST | `/api/shipments/:id/cancel` | Build cancel transaction | None | `{ xdr }` |
| GET | `/api/shipments/:id/onchain` | Read on-chain data | None | `OnChainShipment` |

**Request/Response Types:**

```typescript
interface CreateShipmentRequest {
  shipper_address: string;       // Stellar address
  driver_address: string;        // Stellar address
  amount: string;                // Decimal string (e.g., "100.00")
  origin: string;                // City/location name
  destination: string;           // City/location name
  cargo_description: string;     // Text description
  cargo_weight_kg: number;       // Weight in kilograms
}

interface Shipment {
  id: string;                    // UUID
  shipment_id: string;           // Short alphanumeric ID
  shipper_id: string;            // User UUID
  driver_id: string;             // User UUID
  origin: string;
  destination: string;
  cargo_description: string;
  cargo_weight_kg: number;
  amount: string;                // Decimal string
  status: ShipmentStatus;
  contract_address: string | null;
  tx_hash: string | null;
  proof_of_delivery_url: string | null;
  pickup_date: string | null;   // ISO 8601
  delivery_date: string | null;  // ISO 8601
  created_at: string;            // ISO 8601
  updated_at: string;            // ISO 8601
}

type ShipmentStatus = 
  | 'created' 
  | 'accepted' 
  | 'in_transit' 
  | 'delivered' 
  | 'confirmed' 
  | 'completed' 
  | 'cancelled';

interface HealthResponse {
  status: 'ok' | 'error';
  timestamp: string;             // ISO 8601
  version: string;               // Semantic version
  network: 'testnet' | 'mainnet';
}

interface MetricsResponse {
  status: 'healthy' | 'degraded';
  timestamp: string;
  system: {
    uptime_seconds: number;
    memory_heap_used_mb: string;
    memory_rss_mb: string;
    node_version: string;
    platform: string;
  };
  telemetry: {
    total_requests: number;
    total_errors: number;
    error_rate_pct: number;
    avg_latency_ms: number;
  };
  database: {
    pool_total_connections: number;
    pool_idle_connections: number;
    pool_waiting_clients: number;
    total_shipments_stored: number;
  };
  network: {
    stellar_network: string;
    soroban_rpc_url: string;
    escrow_contract: string;
  };
}
```


### Smart Contract Interface

**Soroban Contract Functions:**

```rust
// Create new shipment with escrow
pub fn create_shipment(
    env: Env,
    shipment_id: String,
    shipper: Address,
    driver: Address,
    amount: i128
) -> Result<(), Error>

// Driver accepts shipment
pub fn accept_shipment(
    env: Env,
    shipment_id: String,
    driver: Address
) -> Result<(), Error>

// Shipper confirms delivery, releases payment
pub fn confirm_delivery(
    env: Env,
    shipment_id: String,
    shipper: Address
) -> Result<(), Error>

// Cancel shipment, refund shipper
pub fn cancel_shipment(
    env: Env,
    shipment_id: String,
    shipper: Address
) -> Result<(), Error>

// Read shipment data from contract
pub fn get_shipment(
    env: Env,
    shipment_id: String
) -> Result<ShipmentData, Error>
```

**Contract Data Structure:**

```rust
pub struct ShipmentData {
    pub shipment_id: String,
    pub shipper: Address,
    pub driver: Address,
    pub amount: i128,
    pub status: ShipmentStatus,
    pub created_at: u64,
}


pub enum ShipmentStatus {
    Created = 0,
    Accepted = 1,
    Delivered = 2,
    Completed = 3,
    Cancelled = 4,
}
```

## Data Models

### Database Schema

**Users Table:**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stellar_address VARCHAR(56) UNIQUE NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('shipper', 'driver')),
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_stellar ON users(stellar_address);
```

**Shipments Table:**

```sql
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id VARCHAR(32) UNIQUE NOT NULL,
  shipper_id UUID NOT NULL REFERENCES users(id),
  driver_id UUID NOT NULL REFERENCES users(id),
  origin VARCHAR(255) NOT NULL,
  destination VARCHAR(255) NOT NULL,
  cargo_description TEXT,
  cargo_weight_kg DECIMAL(10,2),
  amount DECIMAL(20,7) NOT NULL CHECK (amount > 0),
  status VARCHAR(20) NOT NULL DEFAULT 'created' 
    CHECK (status IN ('created', 'accepted', 'in_transit', 'delivered', 
                      'confirmed', 'completed', 'cancelled')),
  contract_address VARCHAR(56),
  tx_hash VARCHAR(64),
  proof_of_delivery_url TEXT,
  pickup_date TIMESTAMP WITH TIME ZONE,
  delivery_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_shipments_shipper ON shipments(shipper_id);
CREATE INDEX idx_shipments_driver ON shipments(driver_id);
CREATE INDEX idx_shipments_status ON shipments(status);
CREATE INDEX idx_shipments_created_at ON shipments(created_at DESC);
CREATE INDEX idx_shipments_shipper_status ON shipments(shipper_id, status);
CREATE INDEX idx_shipments_driver_status ON shipments(driver_id, status);
```

**Shipments History Table:**

```sql
CREATE TABLE shipments_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id UUID NOT NULL REFERENCES shipments(id),
  status VARCHAR(20) NOT NULL,
  tx_hash VARCHAR(64),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_shipments_history_shipment ON shipments_history(shipment_id);
```

### Entity Relationships

```mermaid
erDiagram
    USERS ||--o{ SHIPMENTS : "ships as shipper"
    USERS ||--o{ SHIPMENTS : "delivers as driver"
    SHIPMENTS ||--o{ SHIPMENTS_HISTORY : "has history"
    
    USERS {
        uuid id PK
        varchar stellar_address UK
        varchar role
        varchar name
        varchar email
        varchar phone
        timestamp created_at
        timestamp updated_at
    }
    
    SHIPMENTS {
        uuid id PK
        varchar shipment_id UK
        uuid shipper_id FK
        uuid driver_id FK
        varchar origin
        varchar destination
        text cargo_description
        decimal cargo_weight_kg
        decimal amount
        varchar status
        varchar contract_address
        varchar tx_hash
        text proof_of_delivery_url
        timestamp pickup_date
        timestamp delivery_date
        timestamp created_at
        timestamp updated_at
    }
    
    SHIPMENTS_HISTORY {
        uuid id PK
        uuid shipment_id FK
        varchar status
        varchar tx_hash
        text notes
        timestamp created_at
    }
```

### Data Validation Rules

**Shipment Creation Validation:**

```typescript
const CreateShipmentSchema = z.object({
  shipper_address: z.string().regex(/^G[A-Z0-9]{55}$/),
  driver_address: z.string().regex(/^G[A-Z0-9]{55}$/),
  amount: z.string().regex(/^\d+(\.\d{1,7})?$/),
  origin: z.string().min(2).max(255),
  destination: z.string().min(2).max(255),
  cargo_description: z.string().min(3).max(1000),
  cargo_weight_kg: z.number().positive().max(100000),
});
```

**Address Validation:**
- Must start with 'G' (public key format)
- Must be exactly 56 characters
- Must contain only uppercase letters and digits

**Amount Validation:**
- Must be positive decimal number
- Maximum 7 decimal places (Stellar stroops precision)
- Minimum: 0.0000001 (1 stroop)

**Status Transition Rules:**
- `created` → `accepted` (driver accepts)
- `accepted` → `in_transit` (driver picks up)
- `in_transit` → `delivered` (driver delivers)
- `delivered` → `confirmed` (shipper confirms)
- `confirmed` → `completed` (payment released)
- Any non-completed status → `cancelled` (shipper cancels)

## Error Handling

### Error Classification

**Client Errors (4xx):**

1. **400 Bad Request**
   - Invalid input data (failed Zod validation)
   - Malformed request body
   - Missing required fields
   - Example: `{ error: "Invalid shipper address format" }`

2. **401 Unauthorized**
   - Missing wallet signature
   - Invalid transaction signature
   - Example: `{ error: "Transaction signature verification failed" }`

3. **403 Forbidden**
   - User not authorized for action
   - Wrong role for operation
   - Example: `{ error: "Only shipper can confirm delivery" }`

4. **404 Not Found**
   - Shipment not found
   - User not found
   - Example: `{ error: "Shipment not found" }`

5. **409 Conflict**
   - Invalid status transition
   - Duplicate shipment ID
   - Example: `{ error: "Cannot cancel completed shipment" }`

6. **429 Too Many Requests**
   - Rate limit exceeded
   - Example: `{ error: "Rate limit exceeded, retry after 60s" }`

**Server Errors (5xx):**

1. **500 Internal Server Error**
   - Unhandled exceptions
   - Database query failures
   - Example: `{ error: "Internal server error" }`

2. **502 Bad Gateway**
   - Stellar network unavailable
   - Soroban RPC failure
   - Example: `{ error: "Blockchain network unavailable" }`

3. **503 Service Unavailable**
   - Database connection pool exhausted
   - Service overloaded
   - Example: `{ error: "Service temporarily unavailable" }`

### Error Response Format

**Standard Error Response:**

```typescript
interface ErrorResponse {
  error: string;                 // Human-readable message
  code?: string;                 // Machine-readable error code
  details?: Record<string, any>; // Additional context
  timestamp: string;             // ISO 8601
}
```

**Validation Error Response:**

```typescript
interface ValidationErrorResponse {
  error: "Validation failed";
  details: {
    field: string;
    message: string;
  }[];
  timestamp: string;
}
```

### Frontend Error Handling Strategy

**Error Display Patterns:**

1. **Toast Notifications**: Transient errors (network issues, rate limits)
2. **Inline Alerts**: Form validation errors, field-level feedback
3. **Error Pages**: 404, 500 error pages with navigation options
4. **Error Boundaries**: Catch React component errors, show fallback UI

**Error Recovery Actions:**

- **Retry Button**: For transient network errors
- **Refresh Button**: For stale data issues
- **Go Back Button**: For navigation errors
- **Contact Support Link**: For persistent errors

**Loading States:**

```typescript
type LoadingState = {
  isLoading: boolean;
  error: string | null;
  data: T | null;
};
```

### Backend Error Handling Strategy

**Database Error Handling:**

```typescript
try {
  const result = await pool.query(sql, params);
  return result.rows;
} catch (err) {
  if (err.code === '23505') {  // Unique violation
    throw new ConflictError('Shipment ID already exists');
  }
  if (err.code === '23503') {  // Foreign key violation
    throw new NotFoundError('Referenced user not found');
  }
  logger.error({ err }, 'Database query failed');
  throw new InternalError('Database operation failed');
}
```

**Stellar Network Error Handling:**

```typescript
try {
  const tx = await server.submitTransaction(transaction);
  return tx.hash;
} catch (err) {
  if (err.response?.status === 504) {
    // Network timeout - retry with exponential backoff
    return retryWithBackoff(() => server.submitTransaction(transaction));
  }
  if (err.response?.data?.extras?.result_codes) {
    // Transaction failed on-chain
    const codes = err.response.data.extras.result_codes;
    throw new BlockchainError('Transaction failed', codes);
  }
  logger.error({ err }, 'Stellar transaction failed');
  throw new InternalError('Blockchain submission failed');
}
```

**Retry Strategy:**

- **Max Retries**: 3 attempts
- **Backoff**: Exponential (1s, 2s, 4s)
- **Jitter**: Random ±20% to prevent thundering herd
- **Retryable Errors**: 502, 503, 504, network timeouts
- **Non-Retryable**: 400, 401, 403, 404, 409

## Correctness Properties

This upgrade maintains critical system correctness properties while enhancing production readiness. These properties ensure the system remains reliable, consistent, and observable across infrastructure changes.

### Property 1: Configuration Consistency

**Statement**: All environment variables are consistently defined across deployment platforms (Railway backend, Vercel frontend) and match documented values.

**Validates: Requirements 1, 6**

**Rationale**: Inconsistent configuration leads to runtime failures, incorrect blockchain interactions, or broken API communication between frontend and backend.

**Validation**:
- Railway project ID matches `5cc5d4b8-aa32-4e6a-b0c9-d3538b20add0`
- Contract addresses match between frontend (`NEXT_PUBLIC_ESCROW_CONTRACT_ID`) and backend (`ESCROW_CONTRACT_ID`)
- Network settings (testnet vs mainnet) are identical across all configuration files
- Health check endpoint returns expected network configuration

### Property 2: Data Integrity Across Deployments

**Statement**: Database state remains consistent and accessible across infrastructure changes, with no data loss or corruption during deployment.

**Validates: Requirements 2, 6**

**Rationale**: Production deployments must not affect existing shipment data or introduce orphaned records that break referential integrity.

**Validation**:
- All existing shipments remain queryable via API after deployment
- Status transitions follow valid state machine rules (created → accepted → in_transit → delivered → confirmed → completed)
- Foreign key constraints prevent orphaned shipment records referencing non-existent users
- Database migration scripts are idempotent and tested on staging data

### Property 3: API Contract Backward Compatibility

**Statement**: Backend API maintains backward compatibility for existing endpoints, ensuring frontend clients continue working without modification.

**Validates: Requirements 2, 14**

**Rationale**: Breaking API changes during production upgrade would cause frontend failures and poor user experience.

**Validation**:
- Existing endpoints (`GET /api/shipments`, `POST /api/shipments`, etc.) preserve request/response schemas
- New monitoring endpoints (`/api/metrics`) are additive and do not modify existing behavior
- Error response format remains consistent with established `{ error, details, timestamp }` structure
- API integration tests verify all endpoints return expected schema

### Property 4: Responsive Layout Correctness

**Statement**: UI components function correctly and remain accessible across all viewport sizes from 320px (mobile) to 2560px (large desktop).

**Validates: Requirements 3, 15**

**Rationale**: Mobile-first design is essential for production readiness, and layout breakage on small screens renders the application unusable for mobile users.

**Validation**:
- All interactive elements (buttons, forms, cards) remain accessible on 320px viewport
- No horizontal scrolling required on any viewport size
- Touch targets meet minimum 44x44px size for mobile usability
- Screenshots captured and reviewed for mobile (320px), tablet (768px), desktop (1920px) viewports
- Manual testing on physical iOS and Android devices

### Property 5: Loading State Transparency

**Statement**: Users always receive visual feedback during asynchronous operations, with no silent failures or indefinite loading states.

**Validates: Requirements 4, 15**

**Rationale**: Transparent loading states build user trust and prevent confusion during blockchain transaction processing (which can take 5-10 seconds).

**Validation**:
- All API calls wrapped with loading state management (`isLoading` flag)
- Loading spinners displayed during transaction creation, submission, and confirmation
- Loading states automatically clear on success, error, or timeout
- No operations silently fail without displaying error feedback

### Property 6: Error State Actionability

**Statement**: Error messages provide clear context and actionable recovery paths, enabling users to resolve issues independently.

**Validates: Requirements 4, 9, 15**

**Rationale**: Cryptic blockchain errors confuse non-technical users. Actionable error messages reduce support burden and improve user experience.

**Validation**:
- Transient errors (network timeouts, rate limits) display retry buttons
- Validation errors specify field-level issues (e.g., "Invalid Stellar address format")
- Critical errors provide support contact information or documentation links
- Error tracking logs all errors with sufficient context for debugging

### Property 7: Monitoring Completeness

**Statement**: All critical operations are observable through structured logging and metrics collection, enabling proactive issue detection.

**Validates: Requirements 7, 9**

**Rationale**: Production systems require comprehensive observability to detect and diagnose issues before they impact users.

**Validation**:
- Every API request increments telemetry counters (total_requests, total_errors)
- All errors generate structured Pino log entries with stack traces
- Metrics endpoint (`/api/metrics`) reflects current system state (uptime, memory, database pool, error rate)
- Vercel Analytics tracks page views and user interactions

### Property 8: Smart Contract State Consistency

**Statement**: Blockchain interactions preserve escrow semantics, with on-chain state eventually consistent with off-chain database records.

**Validates: Requirements 2, 6, 13, 14**

**Rationale**: Escrow logic depends on correct contract invocations. Inconsistent state between database and blockchain undermines trust and payment security.

**Validation**:
- Contract address remains constant across deployments (`CAI52UIAHEMT3SNQ2EXOJKHHC2PAGLGURZYNL6HFZJ6LL5KDQFURBQUH`)
- Transaction XDR generation follows Stellar SDK best practices
- On-chain state verification via `/api/shipments/:id/onchain` endpoint matches database records
- Transaction hashes stored in database correspond to confirmed Stellar transactions

### Non-Functional Requirements

**Performance Requirements:**
- Frontend initial load < 3 seconds (95th percentile)
- API response time < 2 seconds (95th percentile)
- Database query time < 500ms (95th percentile)
- Zero layout shifts during page load (CLS < 0.1)

**Reliability Requirements:**
- System uptime > 99.5% (excluding planned maintenance)
- Error rate < 1% of total requests
- Successful transaction submission rate > 95%
- Automatic recovery from transient failures

**Security Requirements:**
- All API endpoints validate input with Zod schemas
- Rate limiting prevents abuse (100 requests/minute per IP)
- SQL queries use parameterized statements (no SQL injection)
- Environment secrets never logged or exposed in responses

## Testing Strategy

### Testing Approach

This feature focuses on production infrastructure, deployment, and operational concerns rather than algorithmic correctness. Property-based testing is **NOT applicable** because:


1. **Infrastructure Configuration**: Railway project ID updates, deployment configs are one-time setup validations, not algorithmic transformations
2. **UI/UX Enhancements**: Mobile responsiveness, loading states, and visual feedback are best validated through visual regression testing and manual testing
3. **Integration Testing**: User onboarding, analytics, monitoring are integration concerns requiring real external services
4. **Documentation**: README updates, screenshots, demo videos are non-code artifacts

### Testing Pyramid

**Unit Tests (Example-Based):**

- API endpoint validation logic
- Zod schema validation
- Database query builders
- Stellar transaction builders
- Error message formatting
- Status transition validation

**Integration Tests:**

- Full API endpoint flows (create → submit → accept → confirm)
- Database connection and query execution
- Stellar network transaction submission (testnet)
- Freighter wallet integration
- CORS and authentication middleware

**End-to-End Tests:**

- Complete user flows (shipper creates, driver accepts, shipper confirms)
- Mobile responsive layout validation (320px, 768px, 1920px viewports)
- Error state rendering (network failures, validation errors)
- Loading state transitions

**Manual Testing:**

- User onboarding with real wallets
- Analytics tracking verification
- Monitoring dashboard validation
- Demo video recording
- Documentation accuracy review

### Test Coverage Goals


**Backend:**
- Unit tests: 80%+ code coverage
- Integration tests: All API endpoints
- Error paths: All 4xx and 5xx scenarios

**Frontend:**
- Component tests: All interactive components
- Integration tests: Key user flows
- Responsive tests: Mobile, tablet, desktop viewports

**Smart Contracts:**
- Existing test suite coverage maintained
- All contract functions tested
- Authorization checks verified

### Monitoring and Observability Testing

**Metrics Validation:**

- Verify `/api/metrics` returns all required fields
- Validate telemetry counters increment correctly
- Check database pool metrics accuracy
- Confirm structured logging output format

**Analytics Validation:**

- Verify Vercel Analytics tracking events
- Check page view tracking
- Validate user interaction events
- Confirm error tracking captures exceptions

**Performance Testing:**

- Frontend initial load < 3 seconds
- API response time < 2 seconds (p95)
- Database query time < 500ms (p95)
- Stellar transaction submission < 5 seconds

### User Acceptance Testing

**User Onboarding Validation:**

- Recruit 10+ test users
- Guide users through wallet setup
- Validate wallet interactions (transactions)
- Collect user feedback via survey
- Document transaction hashes as proof


**Acceptance Criteria Validation:**

- Mobile responsive: Test on 3+ real devices
- Loading states: Verify all async operations show feedback
- Error states: Trigger all error scenarios and validate displays
- Documentation: New developer completes setup in <30 minutes
- Performance: Measure load times and API latencies
- Uptime: Monitor for 99.5% availability over 7 days

## Implementation Plan

### Phase 1: Infrastructure Updates (Requirements 1, 2, 6)

**Tasks:**

1. Update Railway project configuration
   - Modify `railway.toml` with project ID `5cc5d4b8-aa32-4e6a-b0c9-d3538b20add0`
   - Configure environment variables in Railway dashboard
   - Set up PostgreSQL database connection
   - Configure restart policy and health checks

2. Verify Vercel deployment
   - Confirm frontend builds successfully
   - Set environment variables in Vercel project
   - Configure custom domain (if applicable)
   - Enable Vercel Analytics

3. Verify smart contract deployment
   - Confirm contract address in documentation
   - Validate contract functions on testnet
   - Update environment variables with contract address

**Deliverables:**
- Updated `railway.toml` configuration file
- Deployed backend on Railway with correct project ID
- Deployed frontend on Vercel
- Documented contract address in README

### Phase 2: Mobile Responsive UI (Requirement 3)

**Tasks:**

1. Implement responsive breakpoints
   - Mobile: 320px - 640px
   - Tablet: 641px - 1024px
   - Desktop: 1025px+

2. Update component styles
   - Navigation bar: Hamburger menu on mobile
   - Cards: Stack vertically on mobile, grid on desktop
   - Forms: Full-width inputs on mobile
   - Buttons: Larger tap targets (44x44px minimum)
   - Typography: Responsive font sizes

3. Test responsive layouts
   - Chrome DevTools device emulation
   - Real device testing (iOS, Android)
   - Screenshot capture for documentation

**Deliverables:**
- Mobile-responsive UI components
- Updated Tailwind CSS classes with responsive modifiers
- Screenshots showing mobile, tablet, desktop views

### Phase 3: Loading and Error States (Requirement 4)

**Tasks:**

1. Implement loading components
   - Create `LoadingSpinner` component
   - Add loading overlays to forms
   - Show skeleton loaders for lists
   - Display progress indicators for transactions

2. Implement error handling
   - Create `ErrorAlert` component
   - Add error boundaries to pages
   - Display validation errors inline
   - Show toast notifications for transient errors

3. Update API client
   - Wrap all API calls with loading/error states
   - Implement retry logic for failed requests
   - Add timeout handling
   - Log errors to analytics

**Deliverables:**
- `LoadingSpinner` component with tests
- `ErrorAlert` component with tests
- Error boundaries on all pages
- Updated API client with error handling


### Phase 4: Monitoring and Analytics (Requirements 7, 9)

**Tasks:**

1. Backend monitoring setup
   - Implement Pino structured logging
   - Add request/response logging middleware
   - Create `/api/metrics` endpoint
   - Track request counts, errors, latency
   - Log database pool metrics

2. Frontend analytics integration
   - Install `@vercel/analytics`
   - Track page views automatically
   - Add custom event tracking for key actions
   - Implement error tracking with context

3. Error tracking setup
   - Log unhandled errors with stack traces
   - Include user context in error logs
   - Track error frequency and patterns
   - Set up alerts for error spikes

**Deliverables:**
- Pino logger configured in backend
- `/api/metrics` endpoint returning telemetry
- Vercel Analytics integrated in frontend
- Error tracking capturing all exceptions
- Screenshots of analytics dashboard

### Phase 5: Performance Optimization (Requirement 8)

**Tasks:**

1. Frontend optimization
   - Enable Next.js code splitting
   - Optimize images with Next.js Image component
   - Implement lazy loading for heavy components
   - Minimize bundle size with tree shaking
   - Add compression for static assets

2. Backend optimization
   - Add database query indexes
   - Implement connection pooling (max 20)
   - Cache frequently accessed data
   - Optimize SQL queries with EXPLAIN
   - Add rate limiting middleware

3. Measure performance
   - Lighthouse audit for frontend
   - API response time benchmarks
   - Database query profiling
   - Load testing with Artillery

**Deliverables:**
- Optimized frontend bundle size
- Database indexes on all foreign keys
- Performance benchmarks documented
- Lighthouse score > 90

### Phase 6: User Onboarding (Requirement 5)

**Tasks:**

1. Recruit test users
   - Reach out to network for 10+ testers
   - Create onboarding guide document
   - Set up communication channel (Discord/Telegram)

2. Guide users through setup
   - Help install Freighter wallet
   - Provide testnet XLM for fees
   - Provide test USDC tokens
   - Walk through creating first shipment

3. Document user interactions
   - Record wallet addresses
   - Capture transaction hashes
   - Collect timestamps
   - Create proof document (PROOF_OF_USERS.md)

4. Collect feedback
   - Send post-interaction survey
   - Conduct user interviews
   - Document feedback themes
   - Create summary document (FEEDBACK_SUMMARY.md)

**Deliverables:**
- PROOF_OF_USERS.md with 10+ verified interactions
- FEEDBACK_SUMMARY.md with user insights
- User onboarding guide


### Phase 7: Documentation and Demo (Requirement 11)

**Tasks:**

1. Update README
   - Add live demo links
   - Document contract address
   - Include environment variable reference
   - Add API endpoint documentation
   - Include setup instructions
   - Add troubleshooting section

2. Create screenshots
   - Product UI main dashboard
   - Mobile responsive views
   - Analytics dashboard setup
   - Error state examples
   - Loading state examples

3. Record demo video
   - Script walkthrough of key features
   - Screen capture with narration
   - Show complete shipment flow
   - Demonstrate mobile responsive design
   - Show analytics dashboard
   - Upload to YouTube/Loom

4. Add supporting documentation
   - API endpoint reference with examples
   - Deployment guide for Railway and Vercel
   - Smart contract interaction guide
   - Troubleshooting common issues

**Deliverables:**
- Updated README.md with all required sections
- Screenshots in docs/screenshots/
- Demo video (5-10 minutes)
- API reference documentation
- Deployment guides

### Phase 8: Security and Testing (Requirements 10, 12, 13, 14, 15)

**Tasks:**

1. Security hardening
   - Add input validation with Zod schemas
   - Implement rate limiting on all endpoints
   - Use parameterized SQL queries
   - Verify transaction XDR before submission
   - Add CORS configuration
   - Sanitize log output (no sensitive data)

2. Testing
   - Write unit tests for API endpoints
   - Write integration tests for full flows
   - Test smart contract functions
   - Test mobile responsive layouts
   - Test error handling paths

3. Code quality
   - Run TypeScript compiler with strict mode
   - Add ESLint and fix warnings
   - Review commit history (15+ commits)
   - Add commit message standards

4. UX polish
   - Add smooth transitions and animations
   - Implement empty states with guidance
   - Add confirmation dialogs for critical actions
   - Ensure consistent color scheme
   - Validate form inputs in real-time

**Deliverables:**
- All API endpoints validated with Zod
- Rate limiting implemented (100 req/min per IP)
- Test suite with 80%+ coverage
- 15+ meaningful commits
- Polished UI with animations

## Deployment Strategy

### Environment Configuration

**Frontend Environment Variables (Vercel):**

```bash
NEXT_PUBLIC_API_URL=https://cargonode-backend.railway.app
NEXT_PUBLIC_STELLAR_NETWORK=testnet
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_ESCROW_CONTRACT_ID=CAI52UIAHEMT3SNQ2EXOJKHHC2PAGLGURZYNL6HFZJ6LL5KDQFURBQUH
NEXT_PUBLIC_USDC_CONTRACT_ID=CAATNNYENLGM6JUS522SLKU2BYHHLN5PYI7XNRJXP7CE2KESE7P52FW5
```

**Backend Environment Variables (Railway):**

```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/cargonode

# Stellar Configuration
STELLAR_NETWORK=testnet
HORIZON_URL=https://horizon-testnet.stellar.org
SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
ESCROW_CONTRACT_ID=CAI52UIAHEMT3SNQ2EXOJKHHC2PAGLGURZYNL6HFZJ6LL5KDQFURBQUH
USDC_CONTRACT_ID=CAATNNYENLGM6JUS522SLKU2BYHHLN5PYI7XNRJXP7CE2KESE7P52FW5

# Server Configuration
PORT=3001
NODE_ENV=production
FRONTEND_URL=https://cargonode.vercel.app

# Logging
LOG_LEVEL=info
```

### Deployment Process

**Backend Deployment (Railway):**

1. Connect GitHub repository to Railway
2. Select backend directory as root path
3. Set project ID: `5cc5d4b8-aa32-4e6a-b0c9-d3538b20add0`
4. Configure environment variables
5. Add PostgreSQL database service
6. Deploy with Dockerfile builder
7. Verify health check at `/api/health`

**Frontend Deployment (Vercel):**

1. Connect GitHub repository to Vercel
2. Select frontend directory as root path
3. Configure environment variables
4. Set framework preset to Next.js
5. Deploy automatically on push to main
6. Verify deployment at custom domain

### Rollback Strategy


**Railway Rollback:**
- Use Railway dashboard to revert to previous deployment
- Previous container image retained for 30 days
- Database migrations require manual rollback

**Vercel Rollback:**
- Use Vercel dashboard to promote previous deployment
- All deployments retained indefinitely
- One-click rollback to any previous version

### Health Checks and Monitoring

**Health Check Endpoint:**

```typescript
GET /api/health

Response 200:
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "1.0.0",
  "network": "testnet"
}

Response 500:
{
  "status": "error",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "error": "Database connection failed"
}
```

**Metrics Endpoint:**

```typescript
GET /api/metrics

Response 200:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "system": {
    "uptime_seconds": 86400,
    "memory_heap_used_mb": "45.67",
    "memory_rss_mb": "120.34",
    "node_version": "v20.10.0",
    "platform": "linux"
  },
  "telemetry": {
    "total_requests": 15420,
    "total_errors": 23,
    "error_rate_pct": 0.15,
    "avg_latency_ms": 145.32
  },
  "database": {
    "pool_total_connections": 20,
    "pool_idle_connections": 15,
    "pool_waiting_clients": 0,
    "total_shipments_stored": 347
  },
  "network": {
    "stellar_network": "testnet",
    "soroban_rpc_url": "https://soroban-testnet.stellar.org",
    "escrow_contract": "CAI52UIAHEMT3SNQ2EXOJKHHC2PAGLGURZYNL6HFZJ6LL5KDQFURBQUH"
  }
}
```

**Railway Monitoring:**
- Built-in metrics dashboard (CPU, memory, network)
- Log streaming in real-time
- Automatic restarts on failure (max 3 retries)

**Vercel Monitoring:**
- Vercel Analytics for frontend performance
- Edge function logs
- Build and deployment logs

## Risk Assessment

### Technical Risks

**Risk 1: Railway Service Outage**
- **Probability**: Low (99.9% uptime SLA)
- **Impact**: High (backend unavailable)
- **Mitigation**: Implement health checks, automatic restarts, monitoring alerts

**Risk 2: Stellar Testnet Instability**
- **Probability**: Medium (testnet resets occasionally)
- **Impact**: Medium (transactions fail temporarily)
- **Mitigation**: Retry logic, fallback to cached data, user messaging

**Risk 3: Database Connection Pool Exhaustion**
- **Probability**: Low (with proper pool sizing)
- **Impact**: High (API requests fail)
- **Mitigation**: Connection pool monitoring, automatic scaling, connection limits

**Risk 4: Mobile Browser Compatibility**
- **Probability**: Medium (varied browser support)
- **Impact**: Medium (degraded UX on some devices)
- **Mitigation**: Test on major browsers (Chrome, Safari, Firefox), use polyfills

**Risk 5: User Onboarding Friction**
- **Probability**: High (wallet setup is technical)
- **Impact**: Medium (fewer user validations)
- **Mitigation**: Detailed onboarding guide, provide testnet tokens, offer support

### Operational Risks

**Risk 6: Insufficient User Adoption for 10+ Users**
- **Probability**: Medium (depends on outreach)
- **Impact**: High (Level 4 requirement not met)
- **Mitigation**: Early outreach, incentivize testing, simplify onboarding

**Risk 7: Documentation Incompleteness**
- **Probability**: Low (clear checklist provided)
- **Impact**: Medium (developer onboarding friction)
- **Mitigation**: Follow documentation template, peer review, test with new developer

**Risk 8: Performance Degradation Under Load**
- **Probability**: Low (expected load is minimal)
- **Impact**: Medium (poor user experience)
- **Mitigation**: Load testing, performance monitoring, database optimization

## Success Metrics

### Deployment Metrics

- ✅ Backend deployed on Railway with project ID `5cc5d4b8-aa32-4e6a-b0c9-d3538b20add0`
- ✅ Frontend deployed on Vercel with public URL
- ✅ Smart contract verified on Stellar testnet
- ✅ Health endpoint returns 200 OK
- ✅ Metrics endpoint returns telemetry data

### Performance Metrics

- ✅ Frontend initial load < 3 seconds (Lighthouse)
- ✅ API p95 response time < 2 seconds
- ✅ Database query p95 < 500ms
- ✅ System uptime > 99.5% over 7 days
- ✅ Error rate < 1% of total requests

### User Validation Metrics

- ✅ 10+ unique users onboarded
- ✅ 10+ verified wallet interactions (transaction hashes)
- ✅ User feedback collected from 80%+ of testers
- ✅ Average user satisfaction score > 3.5/5

### Quality Metrics

- ✅ Mobile responsive on 320px - 2560px viewports
- ✅ Loading states implemented on all async operations
- ✅ Error states implemented with actionable messaging
- ✅ Lighthouse accessibility score > 90
- ✅ Backend test coverage > 80%
- ✅ 15+ meaningful commits in version control

### Documentation Metrics

- ✅ README includes setup instructions
- ✅ README includes live demo links
- ✅ README includes API endpoint reference
- ✅ 3+ screenshots captured (product UI, mobile, analytics)
- ✅ Demo video recorded (5-10 minutes)
- ✅ PROOF_OF_USERS.md with 10+ verified interactions
- ✅ FEEDBACK_SUMMARY.md with user insights
- ✅ New developer completes setup in < 30 minutes

## Future Enhancements

### Post-Level 4 Improvements

1. **Mainnet Deployment**
   - Deploy contracts to Stellar mainnet
   - Switch to production USDC token
   - Implement real payment flows

2. **Advanced Features**
   - Real-time shipment tracking with GPS
   - Multi-party escrow (shipper, driver, insurance)
   - Dispute resolution mechanism
   - Document uploads (proof of delivery)
   - Rating and review system

3. **Scalability**
   - Horizontal scaling with load balancers
   - Redis caching layer
   - Read replicas for database
   - CDN for static assets

4. **Enterprise Features**
   - Multi-tenant architecture
   - Role-based access control (admin, operator, viewer)
   - Audit logs for compliance
   - Custom branding

5. **Developer Experience**
   - GraphQL API alongside REST
   - Webhook notifications for status changes
   - SDK for third-party integrations
   - API rate limiting tiers

6. **Internationalization**
   - Multi-language support (Spanish, French, Chinese)
   - Currency conversion for different regions
   - Localized date/time formatting

7. **Advanced Monitoring**
   - APM (Application Performance Monitoring) with Datadog/New Relic
   - Distributed tracing for request flows
   - Custom dashboards for business metrics
   - Alerting for SLA violations

## Appendix

### Glossary of Terms

- **Railway**: Cloud platform for deploying backend applications with managed PostgreSQL
- **Vercel**: Cloud platform for deploying Next.js frontend applications with edge CDN
- **Soroban**: Stellar's smart contract platform (Rust-based)
- **Freighter**: Stellar wallet browser extension for signing transactions
- **Horizon**: Stellar's REST API for submitting transactions and querying blockchain
- **XDR**: External Data Representation format used by Stellar for encoding transactions
- **Stroops**: Smallest unit of Stellar lumens (1 XLM = 10^7 stroops)
- **SEP-41**: Stellar Enhancement Proposal for token contract standard
- **Pino**: High-performance Node.js logging library with structured JSON output

### Reference Architecture Diagrams

**Network Architecture:**

```mermaid
graph TB
    subgraph "Internet"
        U[Users]
    end
    
    subgraph "Vercel Edge Network"
        CDN[CDN / Edge Functions]
        FE[Next.js Frontend]
    end
    
    subgraph "Railway Platform"
        LB[Load Balancer]
        API[Express API]
        DB[(PostgreSQL)]
    end
    
    subgraph "Stellar Network"
        H[Horizon API]
        S[Soroban RPC]
        SC[Smart Contract]
    end
    
    U -->|HTTPS| CDN
    CDN --> FE
    FE -->|API Calls| LB
    LB --> API
    API --> DB
    API -->|Submit Tx| H
    API -->|Invoke Contract| S
    S --> SC
```

### Environment Variable Reference

**Complete Environment Variables List:**

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `DATABASE_URL` | Yes | - | PostgreSQL connection string |
| `STELLAR_NETWORK` | Yes | `testnet` | Stellar network (testnet/mainnet) |
| `HORIZON_URL` | Yes | - | Stellar Horizon API URL |
| `SOROBAN_RPC_URL` | Yes | - | Soroban RPC endpoint URL |
| `ESCROW_CONTRACT_ID` | Yes | - | Deployed escrow contract address |
| `USDC_CONTRACT_ID` | Yes | - | USDC token contract address |
| `PORT` | No | `3001` | Backend server port |
| `NODE_ENV` | No | `development` | Node environment (development/production) |
| `FRONTEND_URL` | Yes | - | Frontend URL for CORS configuration |
| `LOG_LEVEL` | No | `info` | Pino log level (trace/debug/info/warn/error) |
| `NEXT_PUBLIC_API_URL` | Yes | - | Backend API URL (frontend) |
| `NEXT_PUBLIC_STELLAR_NETWORK` | Yes | `testnet` | Stellar network (frontend) |
| `NEXT_PUBLIC_HORIZON_URL` | Yes | - | Horizon API URL (frontend) |
| `NEXT_PUBLIC_SOROBAN_RPC_URL` | Yes | - | Soroban RPC URL (frontend) |
| `NEXT_PUBLIC_ESCROW_CONTRACT_ID` | Yes | - | Escrow contract address (frontend) |
| `NEXT_PUBLIC_USDC_CONTRACT_ID` | Yes | - | USDC contract address (frontend) |

### API Request/Response Examples

**Example: Create Shipment**

```bash
POST /api/shipments
Content-Type: application/json

{
  "shipper_address": "GABC...XYZ",
  "driver_address": "GDEF...UVW",
  "amount": "100.50",
  "origin": "Mumbai",
  "destination": "Delhi",
  "cargo_description": "Electronics and computer parts",
  "cargo_weight_kg": 450.5
}

Response 201:
{
  "shipment": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "shipment_id": "SHP001",
    "status": "created",
    "amount": "100.50",
    ...
  },
  "xdr": "AAAAAgAAAAC..."
}
```

**Example: Submit Signed Transaction**

```bash
POST /api/shipments/550e8400-e29b-41d4-a716-446655440000/submit
Content-Type: application/json

{
  "signedXdr": "AAAAAgAAAAD..."
}

Response 200:
{
  "txHash": "a1b2c3d4e5f6...",
  "status": "success"
}
```

**Example: List Shipments**

```bash
GET /api/shipments?address=GABC...XYZ&role=shipper

Response 200:
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "shipment_id": "SHP001",
    "status": "accepted",
    "origin": "Mumbai",
    "destination": "Delhi",
    "amount": "100.50",
    "created_at": "2024-01-15T10:30:00.000Z",
    ...
  },
  ...
]
```

### Deployment Checklist

**Pre-Deployment:**
- [ ] All environment variables configured
- [ ] Database migrations tested
- [ ] Smart contract deployed and verified
- [ ] API endpoints tested on staging
- [ ] Frontend tested on preview deployment
- [ ] Performance benchmarks meet targets
- [ ] Security audit completed

**Deployment:**
- [ ] Backend deployed to Railway with correct project ID
- [ ] Frontend deployed to Vercel
- [ ] Database connected and migrated
- [ ] Health checks passing
- [ ] Metrics endpoint returning data
- [ ] CORS configured correctly

**Post-Deployment:**
- [ ] Verify frontend loads successfully
- [ ] Test API endpoints from frontend
- [ ] Verify wallet connection works
- [ ] Test complete shipment flow end-to-end
- [ ] Check analytics tracking
- [ ] Monitor error rates
- [ ] Document live URLs in README


**User Onboarding:**
- [ ] User onboarding guide created
- [ ] 10+ users recruited
- [ ] Users set up Freighter wallets
- [ ] Testnet XLM provided for fees
- [ ] Test USDC tokens provided
- [ ] Users complete at least one transaction
- [ ] Transaction hashes recorded
- [ ] User feedback collected
- [ ] PROOF_OF_USERS.md created
- [ ] FEEDBACK_SUMMARY.md created

**Documentation:**
- [ ] README updated with all sections
- [ ] Live demo links added
- [ ] Contract address documented
- [ ] API endpoint reference complete
- [ ] Screenshots captured (3+)
- [ ] Demo video recorded (5-10 min)
- [ ] Environment variables documented
- [ ] Setup instructions validated by new developer

### Maintenance and Operations

**Daily Monitoring:**
- Check `/api/health` endpoint status
- Review error logs for anomalies
- Monitor database connection pool
- Check API response times

**Weekly Monitoring:**
- Review Vercel Analytics dashboard
- Check Railway resource usage
- Analyze user feedback
- Review commit activity

**Monthly Monitoring:**
- Performance benchmarking
- Security dependency updates
- Database backup verification
- Documentation updates

**Incident Response:**
1. Check health and metrics endpoints
2. Review recent logs in Railway
3. Check Stellar testnet status
4. Verify database connectivity
5. Rollback if necessary
6. Document incident and resolution

---


**Document Version:** 1.0  
**Last Updated:** 2024-01-15  
**Author:** CargoNode Development Team  
**Status:** Ready for Implementation
