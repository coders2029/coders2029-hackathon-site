# Coders 2029 — Hackathon Registration Site

A registration portal for the **Coders 2029 12-Hour Frontend Hackathon**, built with Next.js, Three.js, and Prisma.

FY students can register solo or as a team (up to 3 members), receive a join code, and share it with teammates.

---

## Tech Stack

| Layer     | Tech                                                       |
| --------- | ---------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack, React 19)               |
| 3D        | Three.js · React Three Fiber · Drei                        |
| Forms     | React Hook Form · Zod                                      |
| Database  | PostgreSQL · Prisma ORM (`@prisma/adapter-pg`)             |
| UI        | Radix UI · shadcn/ui · Lucide icons · Tailwind CSS 4       |
| Styling   | class-variance-authority · clsx · tailwind-merge           |
| Misc      | Sonner (toasts) · next-themes (dark mode) · tw-animate-css |
| Tooling   | Biome (lint + format) · TypeScript                         |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **PostgreSQL** — [Postgres.app](https://postgresapp.com) (recommended), Homebrew, Docker, or Neon

### 1. Clone & install

```bash
git clone <repo-url>
cd coders2029-site
npm install        # also runs `prisma generate` via postinstall
```

### 2. Set up PostgreSQL

<details>
<summary><strong>Option A — Postgres.app (macOS)</strong></summary>

1. Download & install [Postgres.app](https://postgresapp.com)
2. Open the app → click **Initialize** / **Start**
3. Create the database:
   ```bash
   /Applications/Postgres.app/Contents/Versions/latest/bin/createdb coders2029
   ```
   </details>

<details>
<summary><strong>Option B — Homebrew</strong></summary>

```bash
brew install postgresql@16
brew services start postgresql@16
createdb coders2029
```

</details>

<details>
<summary><strong>Option C — Docker</strong></summary>

```bash
docker run --name coders2029-db \
  -e POSTGRES_PASSWORD=secret \
  -e POSTGRES_DB=coders2029 \
  -p 5432:5432 -d postgres:16
```

</details>

### 3. Configure environment

```bash
cp .env.example .env
```

Set `POSTGRES_URL` in `.env`:

| Setup        | Value                                                                |
| ------------ | -------------------------------------------------------------------- |
| Postgres.app | `postgresql://<your-mac-username>@localhost:5432/coders2029`         |
| Homebrew     | `postgresql://<your-mac-username>@localhost:5432/coders2029`         |
| Docker       | `postgresql://postgres:secret@localhost:5432/coders2029`             |
| Neon         | `postgresql://user:pass@ep-xxx.neon.tech/coders2029?sslmode=require` |

> Run `whoami` to get your Mac username.

### 4. Run migrations

```bash
npm run db:migrate
```

### 5. Start developing

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Start dev server                          |
| `npm run build`      | Generate Prisma client + production build |
| `npm start`          | Start production server                   |
| `npm run lint`       | Lint with Biome                           |
| `npm run format`     | Auto-format with Biome                    |
| `npm run db:migrate` | Create & apply Prisma migrations          |
| `npm run db:push`    | Push schema changes (no migration files)  |
| `npm run db:studio`  | Open Prisma Studio (database GUI)         |

---

## Project Structure

```
app/
  layout.tsx               # Root layout
  page.tsx                 # Home page
  globals.css              # Global styles
  api/setup/route.ts       # DB health-check endpoint
components/
  hero/
    HeroCanvas.tsx         # Three.js 3D canvas
    HeroSection.tsx        # Hero section wrapper
  sections/
    AboutSection.tsx       # About the hackathon
    HackathonSection.tsx   # Event details
    SignupSection.tsx       # Registration form (creates team)
    JoinTeamSection.tsx    # Join team form (enter code)
    Footer.tsx             # Site footer
  ui/                      # shadcn/ui primitives
lib/
  actions.ts               # Server actions: registerTeam(), joinTeam()
  utils.ts                 # Utility functions
  db/
    prisma.ts              # PrismaClient singleton
prisma/
  schema.prisma            # DB schema (Team, Member, Branch, Participation)
  migrations/              # SQL migrations managed by Prisma
```

### Database Schema

**Enums:** `Participation` (solo, team) · `Branch` (CE, CSE, EXTC)

**Team** — `id` · `teamName` · `joinCode` · `participation` · `branch` · `maxMembers` · `createdAt`

**Member** — `id` · `teamId` → Team · `fullName` · `rollNumber` · `email` · `githubUrl` · `isLead` · `joinedAt`

---

## Deploy on Vercel

The easiest way to deploy is via the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for details.
