"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { joinTeam } from "@/lib/actions";
import { MouseGlow } from "@/components/ui/mouse-glow";

/* ─── Schema ─── */
const joinSchema = z.object({
  joinCode: z
    .string()
    .min(6, "Join code must be 6 characters")
    .max(6, "Join code must be 6 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  rollNumber: z
    .string()
    .regex(/^2025\d{6}$/, "Roll number must be 10 digits and start with 2025"),
  email: z.string().email("Enter a valid email").refine(
    (e) => /^[a-z]+\.[a-z]+25@spit\.ac\.in$/.test(e.toLowerCase()),
    "Email must be in the format name.lastname25@spit.ac.in"
  ),
  github: z
    .string()
    .url("Enter a valid URL")
    .refine(
      (u) => /^https?:\/\/(www\.)?github\.com\/[A-Za-z0-9_.-]+\/?$/.test(u),
      "Must be a valid GitHub profile URL (github.com/<username>)"
    ),
});

type JoinValues = z.infer<typeof joinSchema>;

export default function JoinTeamSection({ className }: { className?: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [teamInfo, setTeamInfo] = useState<{
    teamName: string | null;
    memberCount: number;
  } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<JoinValues>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      joinCode: "",
      fullName: "",
      rollNumber: "",
      email: "",
      github: "",
    },
  });

  function onSubmit(data: JoinValues) {
    setErrorMsg(null);
    startTransition(async () => {
      const result = await joinTeam({
        joinCode: data.joinCode.toUpperCase(),
        member: {
          fullName: data.fullName,
          rollNumber: data.rollNumber,
          email: data.email,
          github: data.github,
        },
      });

      if (result.success) {
        setTeamInfo({
          teamName: result.teamName,
          memberCount: result.memberCount,
        });
        setDialogOpen(true);
        form.reset();
      } else {
        setErrorMsg(result.error);
      }
    });
  }

  return (
    <section
      id="join"
      className={`relative overflow-hidden py-24 px-6 md:px-12 lg:px-24 ${className ?? ""}`}
    >
      <MouseGlow color="violet" />
      <div className="relative z-10 mx-auto max-w-2xl">
        <p className="mb-2 font-mono text-sm uppercase tracking-widest text-muted-foreground">
          // join_team
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">
          Join Your <span className="text-foreground">Team</span>
        </h2>
        <p className="mt-2 text-muted-foreground">
          Got a 6-character join code from your team lead? Enter it here to hop
          on their team.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6 rounded-2xl border border-border/50 bg-c29-surface/40 p-6 backdrop-blur sm:p-8"
          >
            {/* Join Code */}
            <FormField
              control={form.control}
              name="joinCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Team Join Code</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ABC123"
                      maxLength={6}
                      className="font-mono text-lg uppercase tracking-[0.3em] text-center"
                      {...field}
                      onChange={(e) =>
                        field.onChange(e.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Full Name */}
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Manan Bhanushali" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Roll Number */}
            <FormField
              control={form.control}
              name="rollNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SPIT Roll Number</FormLabel>
                  <FormControl>
                    <Input placeholder="2025XXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="name.lastname25@spit.ac.in"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* GitHub */}
            <FormField
              control={form.control}
              name="github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Profile URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/username"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {errorMsg && (
              <p className="text-sm text-destructive font-medium">{errorMsg}</p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="w-full rounded-full bg-foreground text-background font-bold hover:bg-foreground/80 disabled:opacity-50"
            >
              {isPending ? "Joining…" : "Join Team"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Success Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-border/30 bg-c29-surface sm:max-w-md">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-foreground text-xl text-center">
              Welcome Aboard! 🚀
            </DialogTitle>
            <DialogDescription className="sr-only">
              Team join confirmation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-center">
            <p className="text-muted-foreground">
              You&apos;ve joined{" "}
              {teamInfo?.teamName ? (
                <strong className="text-foreground">{teamInfo.teamName}</strong>
              ) : (
                "the team"
              )}
              !
            </p>
            <div className="rounded-lg border border-border/30 bg-c29-bg p-4">
              <p className="text-sm text-muted-foreground">
                Team now has{" "}
                <span className="font-mono text-lg font-bold text-foreground">
                  {teamInfo?.memberCount}/3
                </span>{" "}
                members
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              See you at the hackathon!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
