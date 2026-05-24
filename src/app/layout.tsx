import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "BuildSeed | Developer Project Discovery",
  description:
    "BuildSeed helps developers discover, shape, and scope project ideas based on stack, skill level, goals, and available time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark scroll-smooth antialiased", inter.variable, jetbrainsMono.variable)}
    >
      <body className="min-h-screen bg-zinc-950 font-sans text-zinc-50">
        {children}
      </body>
    </html>
  );
}
