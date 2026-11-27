import { prisma } from "@/lib/prisma";
import CharacterList from "@/components/CharacterList";
import CharacterTabs from "@/components/CharacterTabs";

const IN_PROGRESS_STATUS = ["PENDING", "IN_REVIEW", "REVISION_NEEDED"] as const;

export default async function CharactersPage() {
  const characters = await prisma.character.findMany({
    include: {
      _count: { select: { inhouseProducts: true, regions: true } },
      inhouseProducts: {
        where: { status: { in: IN_PROGRESS_STATUS } },
        select: {
          id: true,
          name: true,
          type: true,
          status: true,
          satoNote: true,
          authorStatus: true,
          authorNote: true,
        },
      },
      regions: {
        include: {
          licensees: {
            include: {
              products: {
                where: { status: { in: IN_PROGRESS_STATUS } },
                select: {
                  id: true,
                  name: true,
                  type: true,
                  status: true,
                  satoNote: true,
                  authorStatus: true,
                  authorNote: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  const serialized = characters.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    regions: c.regions.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      licensees: r.licensees.map((l) => ({
        ...l,
        createdAt: l.createdAt.toISOString(),
        updatedAt: l.updatedAt.toISOString(),
      })),
    })),
  }));

  const tabCharacters = characters.map((c) => {
    const licensedProducts = c.regions.flatMap((r) =>
      r.licensees.flatMap((l) =>
        l.products.map((p) => ({
          ...p,
          licenseeInfo: `${r.name} / ${l.name}`,
        }))
      )
    );

    const inhouseProducts = c.inhouseProducts.map((p) => ({
      ...p,
      licenseeInfo: null,
    }));

    return {
      id: c.id,
      name: c.name,
      requiresAuthorReview: c.requiresAuthorReview,
      allProducts: [...inhouseProducts, ...licensedProducts],
    };
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">案件別</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
        <CharacterTabs characters={tabCharacters} />
      </div>

      <div className="border-t border-gray-200 pt-8">
        <h2 className="text-base font-semibold text-gray-700 mb-4">キャラクター管理</h2>
        <CharacterList characters={serialized} />
      </div>
    </div>
  );
}
