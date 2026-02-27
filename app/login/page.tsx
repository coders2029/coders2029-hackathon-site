"use client";

import { useState } from "react";
import Link from "next/link";
import { login } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export default function LoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await login({
      email: form.get("email") as string,
      password: form.get("password") as string,
    });

    if (!result.success) {
      setError(result.error);
      setLoading(false);
    }
    // On success, the server action redirects to /
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-c29-bg px-4">
      {/* Ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-violet-glow/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-glow/5 blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-border/30 bg-c29-surface/80 backdrop-blur-xl box-glow-violet">
        <CardHeader className="text-center space-y-1">
          <Link
            href="/"
            className="font-mono text-lg font-bold text-foreground transition-opacity hover:opacity-80 mb-2 inline-block"
          >
            C2029
          </Link>
          <CardTitle className="text-2xl font-bold text-foreground">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Log in to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name.lastname25@spit.ac.in"
                required
                className="bg-c29-bg/50 border-border/30 focus:border-violet-glow/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Your password"
                required
                className="bg-c29-bg/50 border-border/30 focus:border-violet-glow/50"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-foreground text-background font-bold hover:bg-foreground/80"
            >
              {loading ? "Logging in…" : "Log In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-violet-glow hover:underline font-medium"
            >
              Sign up
            </Link>
          </p>

          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to main site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
