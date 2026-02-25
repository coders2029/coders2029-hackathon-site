"use client";

import { useState } from "react";
import Link from "next/link";
import { signup } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [branch, setBranch] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const result = await signup({
      name: form.get("name") as string,
      email: form.get("email") as string,
      rollNumber: form.get("rollNumber") as string,
      githubUrl: form.get("githubUrl") as string,
      branch: branch as any,
      password: form.get("password") as string,
      confirmPassword: form.get("confirmPassword") as string,
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
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-glow/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-glow/5 blur-3xl" />
      </div>

      <Card className="relative z-10 w-full max-w-md border-border/30 bg-c29-surface/80 backdrop-blur-xl box-glow-cyan">
        <CardHeader className="text-center space-y-1">
          <Link
            href="/"
            className="font-mono text-lg font-bold text-foreground transition-opacity hover:opacity-80 mb-2 inline-block"
          >
            C2029
          </Link>
          <CardTitle className="text-2xl font-bold text-foreground">
            Create Account
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Join the Coders2029 community
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your full name"
                required
                className="bg-c29-bg/50 border-border/30 focus:border-cyan-glow/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name.lastname25@spit.ac.in"
                required
                className="bg-c29-bg/50 border-border/30 focus:border-cyan-glow/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rollNumber">Roll Number (UID)</Label>
              <Input
                id="rollNumber"
                name="rollNumber"
                type="text"
                placeholder="2025XXXXXX"
                required
                pattern="2025\d{6}"
                title="Roll number must be 10 digits and start with 2025"
                className="bg-c29-bg/50 border-border/30 focus:border-cyan-glow/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="githubUrl">GitHub Profile URL</Label>
              <Input
                id="githubUrl"
                name="githubUrl"
                type="url"
                placeholder="https://github.com/username"
                required
                className="bg-c29-bg/50 border-border/30 focus:border-cyan-glow/50"
              />
            </div>

            <div className="space-y-2">
              <Label>Branch</Label>
              <Select onValueChange={setBranch} required>
                <SelectTrigger className="bg-c29-bg/50 border-border/30 focus:border-cyan-glow/50">
                  <SelectValue placeholder="Select your branch" />
                </SelectTrigger>
                <SelectContent className="bg-c29-surface border-border/30">
                  <SelectItem value="CE">Computer Engineering</SelectItem>
                  <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                  <SelectItem value="EXTC">Electronics & Telecomm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="At least 6 characters"
                required
                minLength={6}
                className="bg-c29-bg/50 border-border/30 focus:border-cyan-glow/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Repeat your password"
                required
                className="bg-c29-bg/50 border-border/30 focus:border-cyan-glow/50"
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
              {loading ? "Creating account…" : "Sign Up"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-cyan-glow hover:underline font-medium"
            >
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
