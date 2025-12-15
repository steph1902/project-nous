# Nous (νοῦς)

> *"In Anaxagoras and Aristotle, νοῦς is the cosmic mind that orders the universe."*

**The Mind Behind the Workflow** — Enterprise-grade AI Agent Workflow Orchestrator with Multi-Agent collaboration, RAG knowledge bases, and intelligent HR scoring.

## 🎯 Project Status

| Component | Status | Notes |
|-----------|--------|-------|
| **Backend API** | ✅ Complete | 8 modules, 25+ endpoints |
| **Frontend UI** | ✅ Complete | 7 pages, responsive design |
| **Database Schema** | ✅ Complete | 20+ Prisma models |
| **Unit Tests** | ✅ Passing | 92 tests across all modules |
| **CI/CD Pipeline** | ✅ Complete | GitHub Actions |
| **Docker Setup** | ✅ Complete | PostgreSQL + Redis + MinIO |

### What's Working ✅

- **Backend Modules** — All 8 modules implemented with DDD architecture
- **API Endpoints** — All routes defined with Swagger documentation
- **Domain Logic** — Entities, use cases, and repositories complete
- **Database Schema** — Full Prisma schema with seed data
- **Frontend Pages** — All dashboard pages with mock data
- **Unit Tests** — 92 tests covering domain entities

### What Needs Integration 🔧

| Feature | Status | What's Needed |
|---------|--------|---------------|
| **Database Connection** | 🔧 Needs Docker | Run `docker-compose up -d` then migrate |
| **OpenAI Integration** | 🔧 Needs API Key | Add `OPENAI_API_KEY` to `.env.local` |
| **Redis/BullMQ** | 🔧 Needs Docker | Queue workers need Redis running |
| **MinIO/S3** | 🔧 Needs Docker | Document storage needs MinIO running |
| **Frontend ↔ API** | 🔧 Needs Auth | Connect React pages to real API endpoints |
| **E2E Tests** | ❌ Not Started | Integration and end-to-end tests |

---

## 🏗️ Architecture

```
nous/
├── apps/
│   ├── api/                    # NestJS Backend
│   │   └── src/modules/
│   │       ├── identity-access/    # Auth, RBAC, API Keys
│   │       ├── workflow-catalog/   # DAG definitions
│   │       ├── run-orchestration/  # Execution engine
│   │       ├── knowledge-base/     # RAG system
│   │       ├── hr-scoring/         # AI candidate eval
│   │       ├── tool-integrations/  # External services
│   │       ├── observability/      # Audit, monitoring
│   │       └── health/             # Health checks
│   ├── web/                    # Next.js Frontend
│   └── workers/                # BullMQ Processors
├── packages/
│   ├── shared/                 # Types, Schemas, Utils
│   └── ui/                     # Design System
└── docker-compose.yml
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

### 1. Clone & Install

```bash
git clone https://github.com/steph1902/project-nous.git
cd project-nous
pnpm install
```

### 2. Start Infrastructure

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL 16** with pgvector extension (port 5432)
- **Redis 7** for job queues (port 6379)
- **MinIO** for document storage (port 9000)

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
DATABASE_URL=postgresql://nous:nous@localhost:5432/nous
REDIS_URL=redis://localhost:6379
OPENAI_API_KEY=sk-your-key-here
JWT_SECRET=your-secret-key-32-chars
ENCRYPTION_KEY=your-encryption-key-32-chars
```

### 4. Setup Database

```bash
cd apps/api
npx prisma migrate dev
npx prisma db seed
```

### 5. Start Development

```bash
cd ../..
pnpm dev
```

**URLs:**
- Web: http://localhost:3000
- API: http://localhost:3001/api
- Swagger: http://localhost:3001/docs

**Demo Login:**
- Email: `demo@nous.ai`
- Password: `demo1234`

---

## 🧩 Backend Modules

### 1. Identity & Access Management
- User registration and JWT authentication
- Organization management with multi-tenancy
- RBAC with role hierarchy (Owner > Admin > Operator > Viewer)
- API key generation with scoped permissions

### 2. Workflow Catalog
- DAG-based workflow definitions
- Version management (Draft → Published → Archived)
- Cycle detection and validation
- Trigger types: Manual, Webhook, Schedule

### 3. Run Orchestration
- State machine execution (Queued → Running → Succeeded/Failed)
- Idempotency key support
- BullMQ job queue integration
- Retry with exponential backoff

### 4. Knowledge Base (RAG)
- Document ingestion (PDF, Markdown, HTML)
- Text chunking with configurable overlap
- OpenAI embeddings (text-embedding-3-small)
- Vector search with pgvector

### 5. HR Scoring
- Candidate management with email privacy (hashing)
- AI scoring with GPT-4o
- Category scores: Experience, Skills, Communication, Culture Fit
- Red flag detection and rankings

### 6. Tool Integrations
- HTTP adapter for external APIs
- Slack adapter for messaging
- AES-256-GCM encrypted secrets
- Scoped permission checking

### 7. Observability
- Audit event logging
- SSE for real-time run monitoring
- Query API with filtering

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:cov

# Shared package tests
cd packages/shared && pnpm test

# API tests
cd apps/api && pnpm test
```

**Current Coverage:** 92 tests passing

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `apps/api/prisma/schema.prisma` | Database schema |
| `apps/api/prisma/seed.ts` | Demo data |
| `packages/shared/src/schemas/` | Zod validation schemas |
| `packages/shared/src/ids.ts` | ID generation utilities |
| `.github/workflows/ci.yml` | CI/CD pipeline |

---

## 🔐 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection |
| `REDIS_URL` | ✅ | Redis connection |
| `OPENAI_API_KEY` | ✅ | OpenAI for embeddings/scoring |
| `JWT_SECRET` | ✅ | JWT signing (32+ chars) |
| `ENCRYPTION_KEY` | ✅ | AES encryption (32+ chars) |
| `MINIO_ENDPOINT` | ⚪ | MinIO/S3 endpoint |
| `MINIO_ACCESS_KEY` | ⚪ | MinIO access key |
| `MINIO_SECRET_KEY` | ⚪ | MinIO secret key |

---

## 📝 License

MIT

---

**νοῦς** — *Reason in Motion*

Built with ❤️ for enterprise AI orchestration
