import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const connectionString = process.env.DATABASE_URL;
const adapter = connectionString
  ? new PrismaNeonHttp(connectionString, {})
  : undefined;

export const prisma =
  isWorkspaceAwareClient(globalForPrisma.prisma)
    ? globalForPrisma.prisma
    : new PrismaClient(adapter ? { adapter } : undefined);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export function hasCommunityBlueprintModel(client: PrismaClient = prisma) {
  const candidate = client as PrismaClient & {
    communityBlueprint?: unknown;
  };
  return Boolean(candidate.communityBlueprint);
}

function isWorkspaceAwareClient(
  client: PrismaClient | undefined
): client is PrismaClient {
  if (!client) return false;
  const candidate = client as PrismaClient & {
    userProject?: unknown;
    savedBlueprint?: unknown;
    communityBlueprint?: unknown;
  };
  return Boolean(
    candidate.userProject &&
      candidate.savedBlueprint &&
      candidate.communityBlueprint
  );
}
