import { prisma } from "@/lib/prisma";
import MasterManager from "@/components/MasterManager";

export const dynamic = "force-dynamic";

export default async function MastersPage() {
  const [characters, licensees] = await Promise.all([
    prisma.character.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.licensee.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">マスタ管理</h1>
      <MasterManager
        characters={characters.map((c) => ({
          id: c.id,
          name: c.name,
          requiresAuthorReview: c.requiresAuthorReview,
        }))}
        licensees={licensees.map((l) => ({ id: l.id, name: l.name }))}
      />
    </div>
  );
}
