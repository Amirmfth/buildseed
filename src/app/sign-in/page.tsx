import { SignInButton } from "@/components/auth/SignInButton";
import { Navbar } from "@/components/landing/Navbar";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const params = await searchParams;
  const errorMessage = getAuthErrorMessage(params.error);

  return (
    <main className="min-h-screen bg-[#09090B] text-zinc-50">
      <Navbar />
      <section className="mx-auto grid min-h-[calc(100vh-96px)] w-full max-w-md place-items-center px-4 py-16">
        <div className="w-full rounded-2xl border border-[#3F3F46]/70 bg-[#18181B] p-6 shadow-[0_24px_90px_rgba(0,0,0,0.34)]">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan-300">
            BuildSeed Admin
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Sign in to manage blueprints.
          </h1>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Admin access is restricted to approved emails.
          </p>
          {errorMessage ? (
            <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-red-200">
              <p className="font-medium">{errorMessage.title}</p>
              <p className="mt-1 text-red-200/80">{errorMessage.description}</p>
            </div>
          ) : null}
          <div className="mt-6">
            <SignInButton callbackUrl={params.callbackUrl ?? "/admin"} />
          </div>
        </div>
      </section>
    </main>
  );
}

function getAuthErrorMessage(error?: string) {
  if (!error) return null;

  const messages: Record<string, { title: string; description: string }> = {
    OAuthCallback: {
      title: "Google sign-in callback failed.",
      description:
        "The OAuth response reached BuildSeed, but the session could not be completed. Check the dev server console for the detailed NextAuth error.",
    },
    OAuthAccountNotLinked: {
      title: "This email is already linked differently.",
      description:
        "Use the same Google account you used before, or ask an admin to clean up the existing user/account row.",
    },
    AccessDenied: {
      title: "Access denied.",
      description: "This Google account is not approved for BuildSeed admin access.",
    },
    Configuration: {
      title: "Authentication is not configured correctly.",
      description:
        "Check AUTH_SECRET, AUTH_URL, GOOGLE_CLIENT_ID, and GOOGLE_CLIENT_SECRET.",
    },
  };

  return (
    messages[error] ?? {
      title: `Authentication error: ${error}`,
      description:
        "Try again. If it keeps failing, check the dev server console for the exact NextAuth error.",
    }
  );
}
