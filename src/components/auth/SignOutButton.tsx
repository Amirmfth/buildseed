"use client";

import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { buttonClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";

export function SignOutButton() {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={cn("h-10", buttonClasses.outline)}
    >
      Sign out
    </Button>
  );
}
