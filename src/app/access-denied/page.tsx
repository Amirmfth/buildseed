import Link from "next/link";

import { Navbar } from "@/components/landing/Navbar";
import { Button } from "@/components/ui/button";
import { buttonClasses } from "@/lib/uiClasses";
import { cn } from "@/lib/utils";

export default function AccessDeniedPage() {
  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-50">
      <Navbar />
      <div className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-4 text-center">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-red-300">
            Access denied
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            This account is not an admin.
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Add the email to ADMIN_EMAILS and sign in again.
          </p>
          <Button asChild className={cn("mt-6 h-11", buttonClasses.primary)}>
            <Link href="/">Return to public site</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
