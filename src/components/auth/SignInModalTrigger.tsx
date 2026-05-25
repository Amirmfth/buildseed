"use client";

import { LogIn } from "lucide-react";

import { SignInButton } from "@/components/auth/SignInButton";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export function SignInModalTrigger({
  callbackUrl = "/",
  compact = false,
}: {
  callbackUrl?: string;
  compact?: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          type="button"
          variant={compact ? "ghost" : "outline"}
          className={cn(
            compact
              ? "h-9 px-2 text-zinc-300 hover:text-zinc-50"
              : "rounded-xl border border-[#3F3F46] bg-[#18181B] px-3 py-2 font-medium text-zinc-100 transition hover:border-green-500/40 hover:bg-[#27272A]"
          )}
        >
          <LogIn className="size-4" />
          {compact ? null : "Sign in"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border border-[#3F3F46] bg-[#09090B] text-zinc-100">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Sign in
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Continue with Google to save blueprints and track projects.
          </DialogDescription>
        </DialogHeader>
        <SignInButton callbackUrl={callbackUrl} />
        <p className="text-xs text-zinc-500">
          Admin access is restricted to approved emails.
        </p>
      </DialogContent>
    </Dialog>
  );
}
