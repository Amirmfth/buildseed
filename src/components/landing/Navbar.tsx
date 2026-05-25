import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { ChevronDown } from "lucide-react";
import type { ReactNode } from "react";

import { MobileNavbarMenu } from "@/components/landing/MobileNavbarMenu";
import { SignInModalTrigger } from "@/components/auth/SignInModalTrigger";
import { authOptions } from "@/lib/auth";

export async function Navbar() {
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user.role === "ADMIN";
  const isSignedIn = Boolean(session?.user);

  return (
    <header className="sticky top-0 z-40 border-b border-[#3F3F46]/60 bg-[#09090B]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-2.5"
          aria-label="BuildSeed home"
        >
          <Image
            src="/buildseed_logo.png"
            alt=""
            width={36}
            height={36}
            className="size-9 rounded-xl"
            priority
          />
          <span className="hidden text-base font-semibold tracking-tight text-zinc-50 sm:inline">
            BuildSeed
          </span>
          <span className="text-base font-semibold tracking-tight text-zinc-50 sm:hidden">
            BuildSeed
          </span>
        </Link>

        <div className="hidden items-center gap-5 text-sm text-zinc-400 md:flex">
          <div className="flex items-center gap-6">
            <Link className="transition hover:text-green-400" href="/#project-match">
              Project Match
            </Link>
            <Link className="transition hover:text-zinc-100" href="/blueprints">
              Browse Blueprints
            </Link>
            <Link className="transition hover:text-zinc-100" href="/community">
              Community
            </Link>
            <Link className="transition hover:text-zinc-100" href="/#how-it-works">
              How it works
            </Link>
          </div>
          <span className="h-5 w-px bg-[#3F3F46]/70" />
          {isSignedIn ? (
            <details className="group relative">
              <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-[#3F3F46] bg-[#18181B] px-3 py-2 font-medium text-zinc-100 transition hover:border-green-500/40 hover:bg-[#27272A] [&::-webkit-details-marker]:hidden">
                Account
                <ChevronDown className="size-4 transition group-open:rotate-180" />
              </summary>
              <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-[#3F3F46] bg-[#18181B] p-2 shadow-2xl shadow-black/30">
                <div className="border-b border-[#3F3F46]/60 px-3 py-2">
                  <p className="truncate text-sm font-medium text-zinc-100">
                    {session?.user.name ?? "BuildSeed user"}
                  </p>
                  <p className="truncate text-xs text-zinc-500">
                    {session?.user.email}
                  </p>
                </div>
                <AccountLink href="/projects">My Projects</AccountLink>
                <AccountLink href="/saved">Saved</AccountLink>
                <AccountLink href="/community/submit">Submit Blueprint</AccountLink>
                <AccountLink href="/community/my-submissions">
                  My Submissions
                </AccountLink>
                {isAdmin ? <AccountLink href="/admin">Admin</AccountLink> : null}
                <AccountLink href="/api/auth/signout">Logout</AccountLink>
              </div>
            </details>
          ) : (
            <SignInModalTrigger callbackUrl="/" />
          )}
        </div>

        <MobileNavbarMenu isSignedIn={isSignedIn} isAdmin={isAdmin} />
      </nav>
    </header>
  );
}

function AccountLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#27272A] hover:text-zinc-50"
    >
      {children}
    </Link>
  );
}
