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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState, useTransition } from "react";
import { registerTeam } from "@/lib/actions";

/* ─── Schema ─── */
const signupSchema = z.object({
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
  teamName: z.string().optional(),
  participation: z.enum(["solo", "team"], {
    error: "Select how you're participating",
  }),
  branch: z.enum(["CE", "CSE", "EXTC"], {
    error: "Select your branch",
  }),
});

type SignupValues = z.infer<typeof signupSchema>;

export default function SignupSection({ className }: { className?: string }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [joinCode, setJoinCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignupValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      rollNumber: "",
      email: "",
      github: "",
      teamName: "",
      participation: undefined,
      branch: undefined,
    },
  });

  function onSubmit(data: SignupValues) {
    setError(null);
    startTransition(async () => {
      const result = await registerTeam({
        participation: data.participation,
        teamName: data.teamName,
        branch: data.branch,
        member: {
          fullName: data.fullName,
          rollNumber: data.rollNumber,
          email: data.email,
          github: data.github,
        },
      });

      if (result.success) {
        setJoinCode(result.joinCode);
        setDialogOpen(true);
        form.reset();
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <section
      id="signup"
      className={`relative py-24 px-6 md:px-12 lg:px-24 ${className ?? ""}`}
    >
      <div className="mx-auto max-w-2xl">
        <p className="mb-2 font-mono text-sm uppercase tracking-widest text-cyan-glow">
          // register
        </p>
        <h2 className="text-3xl font-bold sm:text-4xl">
          Sign <span className="text-violet-glow text-glow-violet">Up</span>
        </h2>
        <p className="mt-2 text-muted-foreground">
          Grab your spot for the 12-Hour Frontend Hackathon — FY students only.
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-6 rounded-2xl border border-border/50 bg-c29-surface/40 p-6 backdrop-blur sm:p-8"
          >
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

            {/* Team Name */}
            <FormField
              control={form.control}
              name="teamName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Team Name{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Team Cyberpunk" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Solo or Team */}
            <FormField
              control={form.control}
              name="participation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Participating as</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex gap-6 pt-1"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="solo" id="solo" />
                        <label
                          htmlFor="solo"
                          className="cursor-pointer text-sm"
                        >
                          Solo
                        </label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="team" id="team" />
                        <label
                          htmlFor="team"
                          className="cursor-pointer text-sm"
                        >
                          With a Team
                        </label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Branch */}
            <FormField
              control={form.control}
              name="branch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your branch" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CE">Computer Engineering</SelectItem>
                      <SelectItem value="CSE">
                        Computer Science & Engineering
                      </SelectItem>
                      <SelectItem value="EXTC">
                        Electronics & Telecomm
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="w-full rounded-full bg-cyan-glow text-c29-bg font-bold hover:bg-cyan-glow/80 box-glow-cyan disabled:opacity-50"
            >
              {isPending ? "Registering..." : "Submit Registration"}
            </Button>
          </form>
        </Form>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="border-cyan-glow/20 bg-c29-surface sm:max-w-md">
          <DialogHeader className="space-y-4">
            <DialogTitle className="text-cyan-glow text-glow-cyan text-xl text-center">
              You&apos;re In! 🎉
            </DialogTitle>
            <DialogDescription className="sr-only">
              Registration confirmation with your team join code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <p className="text-center text-muted-foreground">
              Registration received. See you at the hackathon!
            </p>
            {joinCode && (
              <div className="rounded-lg border border-cyan-glow/30 bg-c29-bg p-5 text-center">
                <p className="mb-2 text-xs uppercase tracking-widest text-cyan-glow">
                  Your Join Code
                </p>
                <p className="font-mono text-3xl font-bold tracking-[0.3em] text-cyan-glow text-glow-cyan">
                  {joinCode}
                </p>
                <p className="mt-3 text-xs text-muted-foreground">
                  Share this code with your teammates so they can join at{" "}
                  <a
                    href="#join"
                    className="text-violet-glow underline"
                    onClick={() => setDialogOpen(false)}
                  >
                    the join section
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
