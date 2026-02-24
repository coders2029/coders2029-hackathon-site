export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-c29-surface/40 py-10 px-6 md:px-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        {/* Wordmark */}
        <div>
          <p className="font-mono text-lg font-bold text-cyan-glow text-glow-cyan">
            Coders2029
          </p>
          <p className="text-xs text-muted-foreground">
            SPIT FY Coding Community — made by students, for students.
          </p>
        </div>

        {/* Links */}
        <nav className="flex gap-6 text-sm text-muted-foreground">
          <a
            href="#about"
            className="hover:text-cyan-glow transition-colors"
          >
            Community
          </a>
          <a
            href="#hackathon"
            className="hover:text-cyan-glow transition-colors"
          >
            Hackathon
          </a>
          <a href="#signup" className="hover:text-cyan-glow transition-colors">
            Register
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyan-glow transition-colors"
          >
            GitHub
          </a>
        </nav>

        {/* Copyright */}
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Coders2029 — SPIT FY students.
          Not officially affiliated with the college.
        </p>
      </div>
    </footer>
  );
}
