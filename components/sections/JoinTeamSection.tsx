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

/* ─── Schema ─── */
const joinSchema = z.object({
  joinCode: z
    .string()
    .min(6, "Join code must be 6 characters")
    .max(6, "Join code must be 6 characters"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  rollNumber: z
    .string()
    .min(3, "Enter a valid SPIT roll number")
    .max(20, "Roll number too long"),
  email: z.string().email("Enter a valid email"),
  github: z
    .string()
    .url("Enter a valid URL")
    .refine((u) => u.includes("github.com"), "Must be a GitHub URL"),
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
      className={`relative py-24 px-6 md:px-12 lg:px-24 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 font-mono text-sm uppercase tracking-widest text-violet-glow">
          // join_team
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">
          Join Your{" "}
          <span className="text-cyan-glow text-glow-cyan">Team</span>
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
                    <Input placeholder="Ada Lovelace" {...field} />
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
                    <Input placeholder="2029XXX" {...field} />
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
                      placeholder="you@spit.ac.in"
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
                      placeholder="https://github.com/yourname"
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
              className="w-full rounded-full bg-violet-glow text-white font-bold hover:bg-violet-glow/80 box-glow-violet disabled:opacity-50"
            >
              {isPending ? "Joining…" : "Join Team"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Success Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-violet-glow/20 bg-c29-surface">
          <DialogHeader>
            <DialogTitle className="text-violet-glow text-glow-violet text-xl">
              Welcome Aboard! 🚀
            </DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-2 text-muted-foreground">
                <p>
                  You&apos;ve joined{" "}
                  {teamInfo?.teamName ? (
                    <strong className="text-foreground">
                      {teamInfo.teamName}
                    </strong>
                  ) : (
                    "the team"
                  )}
                  !
                </p>
                <p className="text-xs">
                  Team now has{" "}
                  <span className="font-mono text-cyan-glow">
                    {teamInfo?.memberCount}/3
                  </span>{" "}
                  members. See you at the hackathon!
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
}
