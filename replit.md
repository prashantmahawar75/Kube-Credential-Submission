# Kube Credential - Microservice Credential Management System

## Overview

Kube Credential is a microservice-based credential issuance and verification system built with Node.js/TypeScript and React. The system manages JSON-based credentials with worker tracking, duplicate detection, and real-time verification capabilities. It's designed for deployment in containerized environments (Docker/Kubernetes) with independent scalability for issuance and verification services.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **UI Framework**: Shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system based on Material Design principles
- **Build Tool**: Vite

**Design Decisions:**
- **Component-based architecture**: Reusable UI components following atomic design patterns
- **Two main pages**: IssuancePage and VerificationPage for credential operations
- **JSON-first interface**: Credential input via JsonEditor component with syntax validation
- **Real-time feedback**: Toast notifications and ResponseDisplay component for operation results
- **Dark/Light mode support**: Built-in theme system with developer-focused aesthetics

**Key Components:**
- `JsonEditor`: Handles credential JSON input with validation
- `ResponseDisplay`: Shows operation results with worker ID and timestamp
- `Navigation`: Top navigation bar with route highlighting

### Backend Architecture

**Technology Stack:**
- **Runtime**: Node.js with TypeScript (ESM modules)
- **Framework**: Express.js
- **Database**: SQLite (via better-sqlite3) for credential storage
- **Development**: Vite middleware for hot module replacement
- **Testing**: Vitest with supertest for API testing

**API Endpoints:**
1. **POST /api/issuance/issue**: Issues new credentials or returns existing ones
2. **POST /api/verification/verify**: Verifies if credentials have been issued

**Design Decisions:**
- **Worker identification**: Each instance generates a unique worker ID (format: `worker-{nanoid}`)
- **Duplicate detection**: SHA-256 hashing of normalized JSON credentials to detect duplicates
- **Race condition handling**: SQLite UNIQUE constraint on credential hash prevents duplicates at database level
- **Normalized hashing**: Object keys are sorted before hashing to ensure consistent duplicate detection
- **Stateless design**: Worker ID persists per process instance, suitable for microservice architecture

**Storage Layer:**
- Interface-based storage abstraction (`IStorage`)
- SQLite implementation with indexed credential hash lookups
- Credential table schema: id, credentialHash (unique), credentialData (JSON string), workerId, issuedAt
- Race condition protection via database constraints and try-catch handling

### Credential Processing Flow

**Issuance Flow:**
1. Validate incoming JSON against credential schema (Zod validation)
2. Normalize and hash credential data
3. Check for existing credential by hash
4. If exists: return existing credential with original worker ID
5. If new: store credential with current worker ID and timestamp
6. Handle race conditions gracefully (return first stored credential)

**Verification Flow:**
1. Validate incoming JSON
2. Hash credential using same normalization
3. Lookup credential by hash
4. Return validation result with original issuance worker ID and timestamp

### Error Handling & Validation

**Schema Validation:**
- Zod schemas for all API request/response types
- Generic credential schema accepts any valid JSON object with at least one field
- Type-safe validation with detailed error messages

**Error Handling:**
- JSON parsing errors caught and returned with 400 status
- Invalid credential format returns structured error response
- Database errors handled with appropriate HTTP status codes
- Global Express error handler for unhandled errors

## External Dependencies

### Core Dependencies

**Backend:**
- `express`: Web framework for API routing
- `better-sqlite3`: Embedded SQLite database (synchronous, fast for single-instance use)
- `nanoid`: Unique worker ID generation
- `zod`: Runtime type validation and schema definition

**Frontend:**
- `@tanstack/react-query`: Server state management and API caching
- `wouter`: Lightweight routing (chosen over react-router for minimal bundle size)
- `@radix-ui/*`: Headless UI component primitives (22+ packages for complete UI system)
- `tailwindcss`: Utility-first CSS framework
- `class-variance-authority`: Type-safe variant styling
- `react-hook-form` + `@hookform/resolvers`: Form management (though not heavily used in current implementation)

**Development Tools:**
- `vite`: Build tool and dev server with HMR
- `vitest`: Unit testing framework
- `tsx`: TypeScript execution for development
- `esbuild`: Production bundling for server code

**UI/UX:**
- `lucide-react`: Icon library
- `cmdk`: Command palette component
- Fonts: Inter (UI text), JetBrains Mono (code/JSON display)

### Database Strategy

**Current Implementation:**
- SQLite for development and single-instance deployment
- Choice rationale: Embedded, zero-configuration, sufficient for assignment requirements

**Production Considerations:**
- PostgreSQL option available (Drizzle config present with Neon serverless driver)
- Migration path: Drizzle ORM schema defined but not actively used
- Trade-off: SQLite chosen for simplicity; PostgreSQL would be required for multi-instance deployments

### Cloud Deployment Considerations

**Free Tier Compatibility:**
- Designed for AWS free tier deployment
- Stateless backend design (except worker ID per process)
- SQLite works for single-container deployment
- Would need PostgreSQL/RDS for multi-container orchestration

**Containerization:**
- Docker-ready structure (build scripts separate client/server)
- Kubernetes manifests expected (not included in repository)
- Environment variable configuration for DATABASE_URL

### Testing Strategy

**Test Coverage:**
- API endpoint tests (issuance and verification)
- Race condition handling tests (concurrent duplicate requests)
- Duplicate detection validation
- JSON schema validation tests

**Test Infrastructure:**
- Vitest with node environment
- Supertest for HTTP request testing
- Isolated test database per test run
- Test data cleanup between tests