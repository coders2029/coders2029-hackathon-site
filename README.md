# Coders 2029

> Registration portal for the **Coders 2029 12-Hour Frontend Hackathon** — built with Next.js, Prisma, and Three.js.

Users can sign up, create or join teams (up to 3 members), and manage their registration. Admins can oversee teams and toggle site-wide settings.

---

## Features

- **Authentication** — email + password signup/login with bcrypt hashing and JWT sessions
- **Team management** — create a team, get a unique join code, share with teammates
- **Admin dashboard** — manage teams, members, and toggle registration open/closed
- **3D hero** — immersive Three.js canvas via React Three Fiber & Drei
- **Dark mode** — full theme support via `next-themes`

---

## Tech Stack

| Layer     | Technology                                       |
| --------- | ------------------------------------------------ |
| Framework | Next.js 16 (App Router, Turbopack, React 19)     |
| 3D        | Three.js, React Three Fiber, Drei                |
| Forms     | React Hook Form, Zod                             |
| Database  | PostgreSQL, Prisma ORM (`@prisma/adapter-pg`)    |
| Auth      | bcryptjs, jose (JWT)                             |
| UI        | Radix UI, shadcn/ui, Lucide icons, Tailwind CSS 4|
| Tooling   | Biome (lint + format), TypeScript                |

---

## Project Structure

```
app/
  layout.tsx                    Root layout
  page.tsx                      Landing page
  globals.css                   Global styles
  signup/page.tsx               User signup
  login/page.tsx                User login
  team/
    page.tsx                    Team creation / join
    [code]/page.tsx             Team details by join code
  admin/
    page.tsx                    Admin login
    dashboard/                  Admin dashboard
  api/
    auth/route.ts               Auth endpoint
    setup/route.ts              DB health-check
    team/route.ts               Team endpoint

components/
  Navbar.tsx                    Site navigation
  hero/
    HeroCanvas.tsx              Three.js 3D canvas
    HeroSection.tsx             Hero section wrapper
  sections/
    AboutSection.tsx            About the hackathon
    HackathonSection.tsx        Event details & registration
    Footer.tsx                  Site footer
  three/                        Additional 3D components
  ui/                           shadcn/ui primitives

lib/
  actions.ts                    Server actions (register, join)
  admin-actions.ts              Admin server actions
  auth-actions.ts               Auth server actions
  auth.ts                       JWT session utilities
  utils.ts                      Utility helpers
  db/prisma.ts                  PrismaClient singleton

prisma/
  schema.prisma                 Database schema
  migrations/                   SQL migrations
```

---

## Database Schema

```mermaid
erDiagram
    Team ||--o{ User : "has members"
    Team {
        uuid id PK
        string teamName
        string joinCode UK
        datetime createdAt
    }
    User {
        uuid id PK
        string name
        string email UK
        string rollNumber UK
        string githubUrl
        Branch branch
        string password
        uuid teamId FK
        boolean isLead
        datetime createdAt
    }
    SiteSettings {
        string id PK
        boolean registrationOpen
    }
```

**Enums:** `Branch` — CE, CSE, EXTC

---

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **PostgreSQL** — [Postgres.app](https://postgresapp.com), Homebrew, Docker, or Neon

### 1. Clone & install

```bash
git clone <repo-url>
cd coders2029-site
npm install
```

### 2. Set up PostgreSQL

<details>
<summary>Postgres.app (macOS)</summary>

1. Download & install [Postgres.app](https://postgresapp.com)
2. Open the app, click **Initialize** / **Start**
3. Create the database:
   ```bash
   /Applications/Postgres.app/Contents/Versions/latest/bin/createdb coders2029
   ```
</details>

<details>
<summary>Homebrew</summary>

```bash
brew install postgresql@16
brew services start postgresql@16
createdb coders2029
```
</details>

<details>
<summary>Docker</summary>

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

| Setup        | Value                                                        |
| ------------ | ------------------------------------------------------------ |
| Postgres.app | `postgresql://<username>@localhost:5432/coders2029`           |
| Homebrew     | `postgresql://<username>@localhost:5432/coders2029`           |
| Docker       | `postgresql://postgres:secret@localhost:5432/coders2029`     |
| Neon         | `postgresql://user:pass@ep-xxx.neon.tech/coders2029?sslmode=require` |

> Run `whoami` to get your Mac username.

### 4. Run migrations & start

```bash
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `npm run dev`        | Start dev server (Turbopack)              |
| `npm run build`      | Generate Prisma client + production build |
| `npm start`          | Start production server                   |
| `npm run lint`       | Lint with Biome                           |
| `npm run format`     | Auto-format with Biome                    |
| `npm run db:migrate` | Create & apply Prisma migrations          |
| `npm run db:push`    | Push schema changes (no migration files)  |
| `npm run db:studio`  | Open Prisma Studio (database GUI)         |
| `npm run db:seed`    | Seed the database                         |

---

## Deployment

Deploy via [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js). Set `POSTGRES_URL` in your environment variables.

See the [Next.js deployment docs](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## License

Private — not open-source.
