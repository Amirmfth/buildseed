# BuildSeed

BuildSeed is a dark-first developer project discovery platform. It helps developers across web, mobile, AI/ML, data, cloud, game development, security, Web3, desktop, browser extensions, automation, embedded/IoT, and creative coding find realistic project blueprints.

Curated local matching works without AI. Optional AI generation can create one custom blueprint after the survey, and existing curated blueprints can be customized with one freeform message.

## Run Locally

```bash
npm.cmd install
npm.cmd run dev
```

Open:

```text
http://localhost:3000
```

Browse all blueprints:

```text
http://localhost:3000/blueprints
```

Admin:

```text
http://localhost:3000/admin
```

Saved blueprints, project workspace, and community:

```text
http://localhost:3000/saved
http://localhost:3000/projects
http://localhost:3000/community
```

## Database And Auth Setup

BuildSeed uses Prisma with Neon PostgreSQL and Auth.js for admin-only access.

Create `.env.local` from `.env.example`:

```bash
DATABASE_URL=postgresql://...

AUTH_SECRET=your_auth_secret
AUTH_URL=http://localhost:3000

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

ADMIN_EMAILS=you@example.com,teammate@example.com
```

`ADMIN_EMAILS` is comma-separated, trimmed, and matched case-insensitively. Users whose email matches are promoted to `ADMIN` on sign-in; everyone else is `USER`.

Run the database setup:

```bash
npm.cmd run prisma:generate
npx.cmd prisma migrate dev --name init
npx.cmd prisma migrate dev --name user-workspace
npx.cmd prisma migrate dev --name community-blueprints
npm.cmd run db:seed
```

Open Prisma Studio:

```bash
npm.cmd run prisma:studio
```

The seed script imports the existing local enriched blueprints, upserts them into the `Blueprint` table, marks them `PUBLISHED`, and stores rich planning fields in `richContent`.

Public pages load `PUBLISHED` database blueprints first. In development, if the database is unavailable or empty, BuildSeed falls back to the local TypeScript blueprints so the public experience does not crash.

## User Workspace

Public browsing, matching, copy/export, and AI generation still work without login. Saving blueprints and tracking projects require a signed-in user.

Workspace features:

- Save and unsave curated database blueprints.
- Save AI-generated or AI-customized blueprints as snapshots.
- Start a tracked project from any blueprint and choose a scope tier.
- Track project status, repository URL, live demo URL, tasks, notes, and resources.
- Check off build-plan tasks and add custom tasks.
- Progress is calculated from completed tasks divided by total tasks; it is not stored manually.

Project data is owner-scoped server-side. Server actions use the current Auth.js session and never accept a client-provided `userId`.

## Community Blueprints

Logged-in users can submit blueprints at `/community/submit`. Submissions are stored as `CommunityBlueprint` rows with a moderation status:

- `PENDING`
- `APPROVED`
- `REJECTED`
- `NEEDS_CHANGES`

Approved community blueprints appear publicly on `/community` and support view, save, start project, and AI customization. Community saves/projects store `communityBlueprintId` plus a source snapshot; AI/customized blueprints still save as snapshots only.

Users can track their own submissions at `/community/my-submissions`. Rejected or needs-changes submissions can be edited and resubmitted.

Admins moderate submissions at `/admin/community` and `/admin/community/[id]`. Admins can approve, reject, request changes with a note, delete, or promote a community blueprint into the official `Blueprint` table as a draft or published blueprint.

## AI Configuration

Create `.env.local` from `.env.example`:

OpenAI:

```bash
AI_PROVIDER=openai
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4o-mini
```

Groq:

```bash
AI_PROVIDER=groq
GROQ_API_KEY=your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
```

The website API key is only read by server routes:

```text
src/app/api/generate-blueprint/route.ts
src/app/api/customize-blueprint/route.ts
```

Users can also paste their own API key in the AI generation or customization panel. That key is stored only in localStorage in the browser and sent to the server route for that request. API keys are not logged.

AI customization returns a new AI-sourced blueprint and never mutates the curated source blueprint. Customization now supports preset chips such as make easier, portfolio-worthy, mobile-first, backend-heavy, add testing plan, and deployment plan. Preset instructions are mapped server-side in `src/lib/ai/customizationPresets.ts`.

Admin blueprint editor AI tools call `/api/admin/ai-blueprint-tools`. Single-blueprint actions apply returned rich sections into the editor for manual review and save. Similar-blueprint generation returns JSON output for manual use.

## Blueprint Plans

Blueprint detail views include rich planning tabs:

- Overview
- Build Plan
- Architecture
- Portfolio
- Expansion
- Challenges

The copy/export action generates Markdown from the rich blueprint schema, including build phases, architecture, scope tiers, portfolio talking points, risks, suggested structure, resume impact, and team expansion.

## Current Limitations

- Admin auth is Google OAuth only.
- AI generated/customized blueprints still live client-side for now.
- Community submissions use a practical JSON rich-content editor in v1.
- Curated local blueprints remain the seed source.
- The free AI generation limit uses localStorage and is not production-secure.
- AI generation is optional; curated matching and browsing work without any API key.

## Quality Checks

```bash
npm.cmd run lint
npm.cmd run build
```
