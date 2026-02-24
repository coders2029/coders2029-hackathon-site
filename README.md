This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Requirements

- **Node.js** ≥ 18
- **PostgreSQL** (local via [Postgres.app](https://postgresapp.com) or remote via Neon)

## Dependencies

| Package | Purpose |
|---|---|
| `next` / `react` / `react-dom` | Framework & UI |
| `three` / `@react-three/fiber` / `@react-three/drei` | 3D hero scene |
| `react-hook-form` / `@hookform/resolvers` / `zod` | Form validation |
| `pg` | PostgreSQL client (local & Neon) |
| `radix-ui` / `shadcn` / `lucide-react` | UI component primitives & icons |
| `class-variance-authority` / `clsx` / `tailwind-merge` | Styling utilities |
| `sonner` | Toast notifications |
| `next-themes` | Dark mode support |
| `tw-animate-css` | Tailwind animations |

### Dev Dependencies

`@biomejs/biome` · `@tailwindcss/postcss` · `tailwindcss` · `typescript` · `@types/*`

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up your environment:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your POSTGRES_URL
   ```

3. Start Postgres and create the database:
   ```bash
   createdb coders2029
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

5. Create DB tables (one-time):
   Visit [http://localhost:3000/api/setup](http://localhost:3000/api/setup)

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
#coders-2029 site
