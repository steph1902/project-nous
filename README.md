# Nous (νοῦς)

**The Mind Behind the Workflow**

*"Reason in Motion"*

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![NestJS](https://img.shields.io/badge/NestJS-10-red)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

> In Anaxagoras and Aristotle, νοῦς is the cosmic mind that orders the universe. In Plotinus, it's the divine intellect from which all rational structure emanates. Nous is literally a "mind" that reasons over knowledge, orchestrates action, and brings order to chaos.

**Nous** is an enterprise-grade AI Agent Workflow Orchestrator with Multi-Agent collaboration, RAG knowledge bases, and intelligent HR scoring.

## 🚀 Features

- **🔄 Workflow Orchestration**: DAG-based workflow builder with automatic retries, idempotency, and parallel execution
- **🧠 RAG Knowledge Base**: Document ingestion, embeddings with pgvector, and Q&A with citations
- **👥 HR Scoring**: Automated candidate scoring with customizable rubrics and explainable AI
- **🔌 Tool Integrations**: Slack, Gmail, Sheets, HTTP with scoped permissions
- **📊 Observability**: Structured logging, audit trails, and run monitoring
- **🔐 Enterprise Security**: RBAC, API keys, encrypted secrets, and multi-tenancy

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, CSS Variables |
| Backend | NestJS 10, TypeScript 5.3 |
| Database | PostgreSQL 16 + pgvector |
| Queue | BullMQ + Redis |
| Storage | S3 / MinIO |
| LLM | OpenAI / Gemini (adapter pattern) |

## 🏗️ Project Structure

```
nous/
├── apps/
│   ├── api/          # NestJS backend API
│   ├── web/          # Next.js frontend
│   └── workers/      # BullMQ job processors
├── packages/
│   ├── shared/       # Shared types, schemas, utilities
│   └── ui/           # Design system components
├── docker-compose.yml
└── turbo.json
```

## 🛠️ Quick Start

### Prerequisites

- Node.js 20+
- pnpm 8+
- Docker & Docker Compose

### Setup

1. **Clone and install dependencies**
   ```bash
   git clone https://github.com/steph1902/project-nous.git
   cd project-nous
   pnpm install
   ```

2. **Start infrastructure**
   ```bash
   pnpm dev:infra
   ```
   This starts PostgreSQL (with pgvector), Redis, and MinIO.

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Run database migrations**
   ```bash
   pnpm db:migrate:dev
   pnpm db:seed
   ```

5. **Start development servers**
   ```bash
   pnpm dev
   ```

   - Web: http://localhost:3000
   - API: http://localhost:3001
   - API Docs: http://localhost:3001/docs

## 📚 Documentation

- [Architecture](./docs/ARCHITECTURE.md)
- [API Reference](http://localhost:3001/docs)
- [Contributing](./docs/CONTRIBUTING.md)

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run integration tests
pnpm test:integration

# Run with coverage
pnpm test -- --coverage
```

## 🔑 Environment Variables

See [.env.example](./.env.example) for all configuration options.

Key variables:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `OPENAI_API_KEY` - OpenAI API key for LLM
- `JWT_SECRET` - Secret for JWT signing
- `ENCRYPTION_KEY` - Key for encrypting secrets

## 📝 License

MIT

---

**νοῦς** — *Reason in Motion*

Built with ❤️ for enterprise AI orchestration
