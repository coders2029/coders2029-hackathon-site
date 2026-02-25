"use client";

import { useEffect, useRef } from "react";

/**
 * Renders a subtle radial gradient that follows the mouse cursor.
 * Place as an absolute-positioned child inside a `relative` container.
 */
export function MouseGlow({
  color = "cyan",
  size = 400,
  opacity = 0.07,
  className = "",
}: {
  color?: "cyan" | "violet";
  size?: number;
  opacity?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const parent = el.parentElement;
    if (!parent) return;

    const handleMove = (e: MouseEvent) => {
      const rect = parent.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.transform = `translate(${x - size / 2}px, ${y - size / 2}px)`;
      el.style.opacity = String(opacity);
    };

    const handleLeave = () => {
      el.style.opacity = "0";
    };

    parent.addEventListener("mousemove", handleMove);
    parent.addEventListener("mouseleave", handleLeave);
    return () => {
      parent.removeEventListener("mousemove", handleMove);
      parent.removeEventListener("mouseleave", handleLeave);
    };
  }, [size, opacity]);

  const bg =
    color === "violet"
      ? "radial-gradient(circle, rgba(168,85,247,0.35) 0%, transparent 70%)"
      : "radial-gradient(circle, rgba(0,240,255,0.3) 0%, transparent 70%)";

  return (
    <div
      ref={ref}
      className={`pointer-events-none absolute z-0 rounded-full opacity-0 transition-opacity duration-300 ${className}`}
      style={{
        width: size,
        height: size,
        background: bg,
      }}
    />
  );
}
