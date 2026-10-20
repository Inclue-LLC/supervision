import { prisma } from "@/lib/prisma";
import CharacterList from "@/components/CharacterList";

export default async function CharactersPage() {
  const characters = await prisma.character.findMany({
    include: {
      _count: { select: { inhouseProducts: true, regions: true } },
    },
    orderBy: { createdAt: "asc" },
  });

  const serialized = characters.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">キャラクター</h1>
      <CharacterList characters={serialized} />
    </div>
  );
}
