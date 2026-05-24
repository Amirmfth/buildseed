import Link from "next/link";

import { SignOutButton } from "@/components/auth/SignOutButton";
import { requireAdmin } from "@/lib/admin";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/blueprints", label: "Blueprints" },
  { href: "/admin/blueprints/new", label: "New Blueprint" },
  { href: "/admin/community", label: "Community Reviews" },
  { href: "/", label: "Public Site" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-50">
      <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
        <aside className="border-b border-[#3F3F46]/70 bg-[#18181B] p-4 lg:border-b-0 lg:border-r">
          <Link href="/admin" className="block">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-green-300">
              BuildSeed
            </p>
            <h1 className="mt-1 text-xl font-semibold">Admin</h1>
          </Link>
          <nav className="mt-6 grid gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-xl border border-[#3F3F46]/50 bg-[#09090B]/40 px-3 py-2 text-sm text-zinc-300 transition hover:border-green-500/40 hover:text-zinc-50"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <section className="min-w-0">
          <header className="flex flex-col justify-between gap-3 border-b border-[#3F3F46]/70 bg-[#18181B]/80 px-4 py-4 sm:flex-row sm:items-center lg:px-6">
            <div>
              <p className="text-sm font-medium text-zinc-100">
                {session.user.email}
              </p>
              <span className="mt-1 inline-flex rounded-full border border-green-500/30 bg-green-500/10 px-2.5 py-1 font-mono text-[10px] uppercase text-green-300">
                {session.user.role}
              </span>
            </div>
            <SignOutButton />
          </header>
          <div className="p-4 lg:p-6">{children}</div>
        </section>
      </div>
    </main>
  );
}
