# Kube Credential - Microservice-Based Credential Management System

A robust credential issuance and verification system built with Node.js/TypeScript microservices and React/TypeScript frontend, featuring SQLite persistence, worker tracking, and comprehensive duplicate detection.

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Design Decisions](#design-decisions)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Technology Stack](#technology-stack)

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────────┐    ┌──────────────────────┐      │
│  │ Issuance Page    │    │ Verification Page    │      │
│  └──────────────────┘    └──────────────────────┘      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       │ HTTP/JSON
                       │
┌──────────────────────┴──────────────────────────────────┐
│              Backend Microservices (Express)             │
│  ┌──────────────────┐    ┌──────────────────────┐      │
│  │ Issuance API     │    │ Verification API     │      │
│  │  POST /issue     │    │  POST /verify        │      │
│  └────────┬─────────┘    └──────────┬───────────┘      │
│           │                          │                   │
│           └──────────┬───────────────┘                   │
└──────────────────────┴──────────────────────────────────┘
                       │
                       │
┌──────────────────────┴──────────────────────────────────┐
│             Persistence Layer (SQLite)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │ credentials table                                 │  │
│  │  - id (PRIMARY KEY)                              │  │
│  │  - credentialHash (UNIQUE)                       │  │
│  │  - credentialData (JSON)                         │  │
│  │  - workerId                                      │  │
│  │  - issuedAt (ISO timestamp)                      │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Worker Identification System

Each backend instance is assigned a unique worker ID (format: `worker-{nanoid}`) that:
- Identifies which pod/instance handled each credential issuance
- Persists across requests for the same instance
- Enables tracking in distributed/scalable deployments

## 🎯 Design Decisions

### 1. **SQLite for Persistence**
- **Decision**: Use SQLite instead of external database
- **Rationale**: 
  - Lightweight, zero-configuration setup
  - Perfect for free-tier deployments
  - Excellent for MVP and prototyping
  - Easy to migrate to PostgreSQL/MySQL later if needed
  - Built-in ACID compliance for credential integrity

### 2. **SHA-256 Credential Hashing**
- **Decision**: Hash credentials using SHA-256 for duplicate detection
- **Rationale**:
  - Deterministic hashing ensures identical credentials always produce the same hash
  - Key order normalization (credentials sorted before hashing) prevents duplicates with different key ordering
  - Cryptographic hash prevents reverse engineering of stored credentials
  - Efficient index-based lookups in database

### 3. **Race Condition Handling**
- **Decision**: Implement check-before-insert with unique constraint fallback
- **Rationale**:
  - Prevents 500 errors during concurrent duplicate submissions
  - Gracefully handles race conditions at database level
  - Returns existing credential if concurrent insert fails
  - Comprehensive test coverage for concurrency scenarios

### 4. **Monorepo Structure with Shared Types**
- **Decision**: Single repository with shared TypeScript schemas
- **Rationale**:
  - Type safety across frontend and backend
  - Single source of truth for data models
  - Simplified development and deployment
  - Easier to maintain consistency

### 5. **Material Design + Developer-Focused UI**
- **Decision**: Clean, technical interface with minimal decoration
- **Rationale**:
  - Target audience: developers and technical users
  - Clarity over aesthetics for credential management
  - Professional appearance builds trust
  - Monospace fonts for JSON data enhance readability

### 6. **Stateless Backend Design**
- **Decision**: No session management, worker ID assigned per instance
- **Rationale**:
  - Horizontally scalable architecture
  - Each pod/worker is independent
  - Simplified Kubernetes deployment
  - No shared state except database

## 📁 Project Structure

```
kube-credential/
├── client/                      # Frontend React application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Navigation.tsx  # Top navigation with tabs
│   │   │   ├── JsonEditor.tsx  # JSON input editor
│   │   │   └── ResponseDisplay.tsx  # API response display
│   │   ├── pages/              # Page components
│   │   │   ├── IssuancePage.tsx
│   │   │   └── VerificationPage.tsx
│   │   ├── lib/                # Utilities
│   │   │   └── queryClient.ts  # API request handling
│   │   ├── App.tsx             # Main app component
│   │   └── index.css           # Global styles
│   └── index.html              # HTML entry point
│
├── server/                      # Backend Express application
│   ├── __tests__/              # Unit tests
│   │   ├── api.test.ts         # API endpoint tests
│   │   └── race-condition.test.ts  # Concurrency tests
│   ├── utils/                  # Utility functions
│   │   ├── workerId.ts         # Worker ID generation
│   │   └── credentialHash.ts   # Credential hashing logic
│   ├── routes.ts               # API route handlers
│   ├── storage.ts              # Database abstraction layer
│   └── index.ts                # Server entry point
│
├── shared/                      # Shared TypeScript definitions
│   └── schema.ts               # Zod schemas and types
│
├── design_guidelines.md        # UI/UX design specifications
├── vitest.config.ts            # Test configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── package.json                # Dependencies
└── README.md                   # This file
```

## ✨ Features

### Core Functionality

1. **Credential Issuance**
   - Accept JSON credentials via REST API
   - Automatic duplicate detection via SHA-256 hashing
   - Worker ID tracking for distributed systems
   - Timestamp recording for audit trails
   - Graceful handling of duplicate submissions

2. **Credential Verification**
   - Verify previously issued credentials
   - Return issuance details (worker ID, timestamp)
   - Handle non-existent credentials gracefully
   - Support for credentials with different key ordering

3. **Worker Identification**
   - Unique worker ID per backend instance
   - Format: `worker-{4-char-nanoid}`
   - Displayed in all API responses
   - Enables pod/instance tracking in Kubernetes

### Technical Features

- **Type Safety**: Full TypeScript coverage with Zod validation
- **Race Condition Safe**: Concurrent duplicate requests handled gracefully
- **Comprehensive Testing**: 11 unit tests covering all scenarios
- **Error Handling**: Detailed error messages with appropriate HTTP codes
- **Responsive UI**: Works on mobile, tablet, and desktop
- **Dark Mode Support**: Optimized for dark theme (default)
- **Accessibility**: Proper ARIA labels and keyboard navigation

## 🚀 Installation & Setup

### Prerequisites

- Node.js 18+ or 20+
- npm or yarn

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kube-credential
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5000
   - Backend API: http://localhost:5000/api

### Running Tests

```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npx vitest run server/__tests__/api.test.ts
```

### Building for Production

```bash
# Build frontend and backend
npm run build

# Start production server
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### 1. Issue Credential

**POST** `/api/issuance/issue`

Issue a new credential or return existing if already issued.

**Request Body:**
```json
{
  "credential": {
    "name": "John Doe",
    "role": "Developer",
    "department": "Engineering"
  }
}
```

**Success Response (201 - New Issuance):**
```json
{
  "success": true,
  "message": "Credential issued by worker-a1b2",
  "workerId": "worker-a1b2",
  "credential": {
    "name": "John Doe",
    "role": "Developer",
    "department": "Engineering"
  },
  "timestamp": "2025-10-08T12:00:00.000Z",
  "alreadyIssued": false
}
```

**Success Response (200 - Duplicate):**
```json
{
  "success": true,
  "message": "Credential already issued by worker-a1b2",
  "workerId": "worker-c3d4",
  "credential": { ... },
  "timestamp": "2025-10-08T12:00:00.000Z",
  "alreadyIssued": true
}
```

**Error Response (400 - Invalid Format):**
```json
{
  "success": false,
  "message": "Invalid credential format",
  "workerId": "worker-a1b2",
  "isValid": false
}
```

#### 2. Verify Credential

**POST** `/api/verification/verify`

Verify if a credential has been issued.

**Request Body:**
```json
{
  "credential": {
    "name": "John Doe",
    "role": "Developer",
    "department": "Engineering"
  }
}
```

**Success Response (Valid Credential):**
```json
{
  "success": true,
  "message": "Valid credential issued by worker-a1b2",
  "workerId": "worker-c3d4",
  "timestamp": "2025-10-08T12:00:00.000Z",
  "isValid": true
}
```

**Success Response (Invalid Credential):**
```json
{
  "success": true,
  "message": "Credential not found - never issued",
  "workerId": "worker-c3d4",
  "isValid": false
}
```

#### 3. Health Check

**GET** `/api/health`

Check service health and worker information.

**Response:**
```json
{
  "status": "healthy",
  "workerId": "worker-a1b2",
  "timestamp": "2025-10-08T12:00:00.000Z"
}
```

## 🧪 Testing

### Test Coverage

The project includes comprehensive test suites:

1. **API Tests** (`server/__tests__/api.test.ts`)
   - Issuance endpoint functionality
   - Duplicate detection
   - Verification endpoint
   - Invalid input handling
   - Key order normalization
   - Health check endpoint

2. **Race Condition Tests** (`server/__tests__/race-condition.test.ts`)
   - Concurrent duplicate issuance requests
   - Rapid sequential duplicates
   - Database constraint handling

### Test Results

```
✓ server/__tests__/race-condition.test.ts (2 tests)
✓ server/__tests__/api.test.ts (9 tests)

Test Files  2 passed (2)
Tests       11 passed (11)
Duration    2.03s
```

## 🚢 Deployment

### Docker Deployment (Recommended)

**Dockerfile** (create this file):

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --production

EXPOSE 5000
ENV NODE_ENV=production
CMD ["npm", "start"]
```

**Build and Run:**

```bash
# Build Docker image
docker build -t kube-credential:latest .

# Run container
docker run -p 5000:5000 kube-credential:latest
```

### Kubernetes Deployment

#### Deployment Manifests

**1. Issuance Service Deployment** (`k8s/issuance-deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kube-credential-issuance
  labels:
    app: kube-credential
    service: issuance
spec:
  replicas: 3
  selector:
    matchLabels:
      app: kube-credential
      service: issuance
  template:
    metadata:
      labels:
        app: kube-credential
        service: issuance
    spec:
      containers:
      - name: kube-credential
        image: kube-credential:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 5
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: kube-credential-issuance
spec:
  selector:
    app: kube-credential
    service: issuance
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: ClusterIP
```

**2. Verification Service Deployment** (`k8s/verification-deployment.yaml`):

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: kube-credential-verification
  labels:
    app: kube-credential
    service: verification
spec:
  replicas: 2
  selector:
    matchLabels:
      app: kube-credential
      service: verification
  template:
    metadata:
      labels:
        app: kube-credential
        service: verification
    spec:
      containers:
      - name: kube-credential
        image: kube-credential:latest
        ports:
        - containerPort: 5000
        env:
        - name: NODE_ENV
          value: "production"
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 5000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: kube-credential-verification
spec:
  selector:
    app: kube-credential
    service: verification
  ports:
  - protocol: TCP
    port: 80
    targetPort: 5000
  type: ClusterIP
```

**3. Ingress Configuration** (`k8s/ingress.yaml`):

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: kube-credential-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  rules:
  - host: kube-credential.example.com
    http:
      paths:
      - path: /api/issuance
        pathType: Prefix
        backend:
          service:
            name: kube-credential-issuance
            port:
              number: 80
      - path: /api/verification
        pathType: Prefix
        backend:
          service:
            name: kube-credential-verification
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: kube-credential-issuance
            port:
              number: 80
```

**4. Horizontal Pod Autoscaler** (`k8s/hpa.yaml`):

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: kube-credential-issuance-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: kube-credential-issuance
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: kube-credential-verification-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: kube-credential-verification
  minReplicas: 2
  maxReplicas: 8
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

**Deploy to Kubernetes:**

```bash
# Apply all manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get deployments
kubectl get pods
kubectl get services
kubectl get ingress

# View logs
kubectl logs -l app=kube-credential --tail=50

# Scale manually
kubectl scale deployment kube-credential-issuance --replicas=5
```

### AWS Free Tier Deployment

**Option 1: AWS ECS Fargate**

1. Create ECR repository
2. Push Docker image to ECR
3. Create ECS cluster
4. Define task definitions for issuance and verification
5. Create services with load balancer

**Option 2: AWS Elastic Beanstalk**

```bash
# Initialize EB application
eb init -p docker kube-credential

# Create environment
eb create kube-credential-env

# Deploy
eb deploy
```

**Option 3: AWS EC2 + Docker**

1. Launch t2.micro EC2 instance (free tier)
2. Install Docker
3. Deploy using docker-compose

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Wouter** - Lightweight routing
- **TanStack Query** - Data fetching and state management
- **Tailwind CSS** - Styling
- **Shadcn UI** - Component library
- **Lucide React** - Icons
- **Zod** - Schema validation

### Backend
- **Node.js 20** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **SQLite** (better-sqlite3) - Database
- **Nanoid** - Unique ID generation
- **Crypto** - SHA-256 hashing

### Testing
- **Vitest** - Unit testing framework
- **Supertest** - HTTP assertions

### DevOps
- **Docker** - Containerization
- **Kubernetes** - Orchestration
- **Vite** - Build tool
- **ESBuild** - Bundling

## 📝 Assumptions & Limitations

### Assumptions Made

1. **Database Choice**: SQLite is suitable for MVP and free-tier deployments. For production scale, migrate to PostgreSQL/MySQL.

2. **Credential Format**: Credentials can be any valid JSON object with at least one field. No specific schema is enforced.

3. **Worker Persistence**: Worker IDs persist per instance but not across restarts. Each restart generates a new worker ID.

4. **Key Ordering**: Credentials with different key orders are treated as identical ({"a":1,"b":2} == {"b":2,"a":1}).

5. **No Authentication**: The API is open. In production, add authentication/authorization middleware.

6. **Single Database**: All workers share one SQLite database. For distributed deployments, use a centralized database.

### Known Limitations

1. **SQLite Concurrency**: SQLite has limited concurrent write support. Under heavy load, consider PostgreSQL.

2. **Database Location**: Database file stored locally. Not suitable for ephemeral containers without persistent volumes.

3. **No Credential Revocation**: Once issued, credentials cannot be revoked or deleted via API.

4. **Limited Query Options**: No search, filter, or pagination endpoints for credentials.

5. **Worker ID Rotation**: Worker IDs change on restart, making long-term tracking challenging.

## 🔐 Security Considerations

1. **Credential Hashing**: Credentials are hashed before storage, preventing reverse lookup
2. **Input Validation**: Zod schemas validate all API inputs
3. **SQL Injection**: Parameterized queries prevent SQL injection
4. **CORS**: Configure CORS policies for production deployments
5. **Rate Limiting**: Add rate limiting middleware for production
6. **HTTPS**: Always use HTTPS in production environments

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributors

- Development Team - Initial implementation
- Architecture decisions documented in this README

## 📞 Contact Information

**Candidate Details:**
- **Name**: Prashant Mahawar
- **Email**: prashantmahawar75@gmail.com

**Deployment URL:**
- **Live Application**:https://kube-credential-submission.onrender.com

---


**Test Results:**
```
Test Files  2 passed (2)
Tests       11 passed (11)
Duration    ~3s
```

**Deployment Platform**: [AWS/Render/Railway - SPECIFY HERE]

**Repository Structure**: See [Project Structure](#-project-structure) section above
