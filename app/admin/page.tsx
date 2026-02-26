"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { verifyAdminPassword } from "@/lib/admin-actions";
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

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;

    const result = await verifyAdminPassword(password);

    if (!result.success) {
      setError(result.error ?? "Unknown error.");
      setLoading(false);
    } else {
      router.push("/admin/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-c29-bg px-4">
      <Card className="relative z-10 w-full max-w-md border-border/30 bg-c29-surface/80">
        <CardHeader className="text-center space-y-1">
          <Link
            href="/"
            className="font-mono text-lg font-bold text-foreground transition-opacity hover:opacity-80 mb-2 inline-block"
          >
            C2029
          </Link>
          <CardTitle className="text-2xl font-bold text-foreground">
            Admin Access
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter the admin password to continue
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Admin password"
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
              {loading ? "Verifying…" : "Enter Dashboard"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
