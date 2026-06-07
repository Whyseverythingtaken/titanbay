# TitanBay API

RESTful API for private market fund and investor management. TypeScript + Fastify + Prisma + PostgreSQL.

## Dev Setup

```bash
pnpm install
cp .env.example .env          # set DATABASE_URL to your local PostgreSQL
pnpm db:migrate               # create tables (requires PostgreSQL)
pnpm dev                      # hot-reload dev server on :3000
```

Or start everything with Docker (no local PostgreSQL needed):

```bash
docker-compose up --build
```

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Dev server with hot reload |
| `pnpm build` | Compile TypeScript to dist/ |
| `pnpm start` | Run compiled output |
| `pnpm test` | Unit tests (no DB required) |
| `pnpm db:migrate` | Create + apply a new migration |
| `pnpm db:seed` | Seed sample data |
| `pnpm db:reset` | Drop DB and re-run all migrations |

## Architecture

**`buildApp(prisma)` factory** — `src/app.ts` exports a factory that accepts a Prisma client instance. Unit tests inject a mock; `src/index.ts` passes the real client. This is the key pattern enabling no-DB unit tests.

**Result extensions** (`src/db.ts`) — Prisma returns `Decimal` objects for financial fields and enum names (e.g. `FamilyOffice`) for enum fields. Result extensions normalize these before they reach route handlers:
- `target_size_usd`, `amount_usd`: `Decimal` → `number`
- `investment_date`: `Date` → `"YYYY-MM-DD"` string
- `investor_type`: `FamilyOffice` → `"Family Office"`

**`"Family Office"` enum** — Prisma maps DB value `"Family Office"` to TypeScript enum `InvestorType.FamilyOffice` via `@map`. Route handler maps incoming JSON string to the enum; result extension maps it back for responses.

**`PUT /funds` with ID in body** — Per spec, the fund ID is in the request body, not the URL. Faithfully implemented as `PUT /funds` (not `PUT /funds/:id`).

**Error handler** (`src/plugins/error-handler.ts`) — Single `setErrorHandler` maps Prisma error codes to HTTP status codes. No try/catch in route handlers except where a 404 check is needed before a Prisma call.

**AJV formats** — `ajv-formats` is enabled in the Fastify instance for `format: 'email'`, `format: 'uuid'`, and `format: 'date'` validation.

## Adding a New Route

1. Define JSON Schema in `src/schemas/`
2. Add handler to the relevant `src/routes/` file
3. If new resource, register the plugin in `src/app.ts`

## Tests

Unit tests use `buildApp(mockPrisma as any)` + Fastify's `app.inject()`. No real network or DB required. Run with `pnpm test`.
