# Banha Real Estate

A real estate platform for the Banha (Qalyubia, Egypt) region. Users can browse, search, and list properties (apartments, villas, shops, land) for sale or rent.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 3001)
- `pnpm --filter @workspace/banha-realestate run dev` — run the frontend (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string (auto-provisioned by Replit)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 19 + Vite + Tailwind CSS 4 + Shadcn UI + Wouter + Framer Motion + React Leaflet
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (zod/v4), drizzle-zod
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild

## Where things live

- `artifacts/banha-realestate/` — React frontend app
- `artifacts/api-server/` — Express backend server
- `lib/db/` — Drizzle ORM schema and database client
- `lib/api-spec/` — OpenAPI specification (source of truth for API contract)
- `lib/api-zod/` — Zod schemas generated from OpenAPI spec
- `lib/api-client-react/` — React Query hooks generated from OpenAPI spec

## Architecture decisions

- Monorepo via pnpm workspaces with shared libs under `lib/`
- API contract driven via OpenAPI spec → Orval codegen keeps frontend/backend in sync
- Frontend proxies `/api` requests to the backend (port 3001) in dev
- Backend serves frontend static files in production builds
- Property data currently uses mock data in `artifacts/banha-realestate/src/data/properties.ts`

## Product

- Browse and search properties by type (apartment, villa, shop, land), location, price, and listing type (sale/rent)
- Map-based property search using OpenStreetMap/Leaflet
- Property listing creation with image upload support
- Dashboard for managing listings
- Arabic/English bilingual UI

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Run `pnpm install` from root before starting workflows if node_modules is missing
- API server runs on port 3001; frontend on port 5000 (proxies /api to 3001)
- DB schema is currently empty — define tables in `lib/db/src/schema/` then run `pnpm --filter @workspace/db run push`

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
