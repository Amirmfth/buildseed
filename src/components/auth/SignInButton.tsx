"use client";

import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { buttonClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";

export function SignInButton({ callbackUrl = "/admin" }: { callbackUrl?: string }) {
  return (
    <Button
      type="button"
      onClick={() => signIn("google", { callbackUrl })}
      className={cn("h-11 w-full", buttonClasses.primary)}
    >
      Continue with Google
    </Button>
  );
}
