"use client";

export function GlowDivider({
  variant = "cyan",
}: {
  variant?: "cyan" | "violet" | "dual";
}) {
  const gradients = {
    cyan: "from-transparent via-cyan-glow/40 to-transparent",
    violet: "from-transparent via-violet-glow/40 to-transparent",
    dual: "from-cyan-glow/30 via-violet-glow/40 to-cyan-glow/30",
  };

  return (
    <div className="relative flex items-center justify-center py-2">
      {/* Main line */}
      <div
        className={`h-px w-full max-w-4xl bg-gradient-to-r ${gradients[variant]}`}
      />
      {/* Center diamond */}
      <div className="absolute">
        <div
          className={`h-1.5 w-1.5 rotate-45 ${
            variant === "violet"
              ? "bg-violet-glow shadow-[0_0_8px_rgba(168,85,247,0.6)]"
              : "bg-cyan-glow shadow-[0_0_8px_rgba(0,240,255,0.6)]"
          }`}
        />
      </div>
    </div>
  );
}
