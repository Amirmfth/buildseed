"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { SignInModalTrigger } from "@/components/auth/SignInModalTrigger";

type MobileNavbarMenuProps = {
  isSignedIn: boolean;
  isAdmin: boolean;
};

export function MobileNavbarMenu({ isSignedIn, isAdmin }: MobileNavbarMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-xl border border-[#3F3F46] bg-[#18181B] p-2 text-zinc-100"
        aria-label="Toggle menu"
      >
        {open ? <X className="size-4" /> : <Menu className="size-4" />}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="absolute right-4 top-16 z-50 w-72 overflow-hidden rounded-2xl border border-[#3F3F46] bg-[#18181B] p-2 shadow-2xl shadow-black/30"
          >
            <MenuLabel>Explore</MenuLabel>
            <MenuLink href="/project-match" onClick={() => setOpen(false)}>
              Project Match
            </MenuLink>
            <MenuLink href="/blueprints" onClick={() => setOpen(false)}>
              Browse Blueprints
            </MenuLink>
            <MenuLink href="/community" onClick={() => setOpen(false)}>
              Community
            </MenuLink>
            <div className="my-1 h-px bg-[#3F3F46]/70" />
            <MenuLabel>Workspace</MenuLabel>
            <MenuLink href="/projects" onClick={() => setOpen(false)}>
              My Projects
            </MenuLink>
            <MenuLink href="/saved" onClick={() => setOpen(false)}>
              Saved
            </MenuLink>
            <MenuLink href="/community/submit" onClick={() => setOpen(false)}>
              Submit Blueprint
            </MenuLink>
            <MenuLink href="/community/my-submissions" onClick={() => setOpen(false)}>
              My Submissions
            </MenuLink>
            {isAdmin ? (
              <MenuLink href="/admin" onClick={() => setOpen(false)}>
                Admin
              </MenuLink>
            ) : null}
            <div className="my-1 h-px bg-[#3F3F46]/70" />
            <MenuLabel>Account</MenuLabel>
            {isSignedIn ? (
              <MenuLink href="/api/auth/signout" onClick={() => setOpen(false)}>
                Logout
              </MenuLink>
            ) : (
              <div className="px-2 py-1">
                <SignInModalTrigger callbackUrl="/" compact />
              </div>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function MenuLabel({ children }: { children: string }) {
  return (
    <p className="px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-500">
      {children}
    </p>
  );
}

function MenuLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-2 text-sm text-zinc-300 transition hover:bg-[#27272A] hover:text-zinc-50"
    >
      {children}
    </Link>
  );
}
