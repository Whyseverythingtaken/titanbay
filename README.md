# TitanBay API

A RESTful API for managing private market funds and investor commitments.

## Quick Start

### Option 1 — Docker (recommended, no setup required)

```bash
docker compose up --build
```

The server starts at **http://localhost:3000**. Migrations run automatically on startup.

To seed sample data after startup:

```bash
docker compose exec api pnpm db:seed
```

### Option 2 — Local dev

Requires a running PostgreSQL instance.

```bash
pnpm install
cp .env.example .env        # edit DATABASE_URL to point at your PostgreSQL
pnpm db:migrate             # creates tables
pnpm db:seed                # optional: load sample data
pnpm dev                    # starts on :3000 with hot reload
```

## API Endpoints

Base URL: `http://localhost:3000`

### Funds

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/funds` | List all funds |
| `POST` | `/funds` | Create a fund |
| `PUT` | `/funds` | Update a fund (ID in body) |
| `GET` | `/funds/:id` | Get a fund by ID |

### Investors

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/investors` | List all investors |
| `POST` | `/investors` | Create an investor |

### Investments

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/funds/:fund_id/investments` | List investments for a fund |
| `POST` | `/funds/:fund_id/investments` | Create an investment in a fund |

## Error Responses

| Status | Meaning |
|--------|---------|
| `400` | Validation error or bad request (missing fields, invalid format, FK violation) |
| `404` | Resource not found |
| `409` | Conflict (duplicate email) |
| `500` | Internal server error |

## Running Tests

Unit tests use a mocked Prisma client — no database or server required:

```bash
pnpm test
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | required |
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment | `development` |

## Tech Stack

- **TypeScript** + **Node.js 20**
- **Fastify 5** — HTTP framework with built-in JSON Schema validation (AJV)
- **Prisma 7** — ORM with migrations and type-safe queries
- **PostgreSQL 16** — Database
- **Vitest** — Unit tests

## How I Used AI

I used Claude Code (claude-sonnet-4-6) throughout this project:

- **Planning phase**: I described the requirements and API spec; Claude proposed the tech stack (Fastify + Prisma), project structure, and key architectural decisions (factory pattern, result extensions, enum mapping strategy). We iterated on the plan before writing any code.
- **Implementation**: Claude generated all source files, schema, tests, and Docker configuration. I reviewed each file before accepting it.
- **Problem-solving**: When pnpm's build script approval blocked Prisma's postinstall scripts, Claude identified that `prisma generate` could run independently and adjusted the workflow accordingly.
- **Validation**: Claude ran TypeScript type checking and all unit tests to confirm correctness before completing the implementation.

## Design Decisions

- Fastify, vitest, postgres were used as I am with these libraries.
- This was my first time using Prisma as an ORM. I have experience using Knex.js but Prisma is popular these days and I wanted to try it.

## Additional business logic

- I decided to add additional business logic that a new investment is can only be added when a Fund's status = fundraising.

## Deployment to Railway

- My initial plan was to deploy this service to a live endpoint (Railway). But after 20 minutes I wasn't able to finish this so I have left this for now. This app can be tested locally as per instructions above