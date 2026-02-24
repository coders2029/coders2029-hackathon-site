export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-zinc-50 dark:from-black dark:to-zinc-900 flex items-center">
      <main className="mx-auto w-full max-w-4xl px-8 py-24">
        <header className="mb-8">
          <h1 className="text-5xl font-extrabold text-zinc-900 dark:text-zinc-50">
            manan is a cutie
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl">
            A community for future-focused developers — resources, projects, and
            events to help you build toward 2029 and beyond.
          </p>
        </header>

        <section className="rounded-2xl bg-white/70 p-8 shadow-sm dark:bg-white/5">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            Build together. Learn faster.
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-xl">
            Join projects, find mentors, and showcase your work. Start small,
            ship often, and grow with a supportive community.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="#get-started"
              className="inline-flex items-center rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-95"
            >
              Get Started
            </a>
            <a
              href="#learn"
              className="inline-flex items-center rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200"
            >
              Learn More
            </a>
          </div>
        </section>
      </main>
    </div>
  );
}
