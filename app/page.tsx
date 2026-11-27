import { prisma } from "@/lib/prisma";
import ProductListTabs from "@/components/ProductListTabs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [inProgress, completed, characters, licensees] = await Promise.all([
    prisma.product.findMany({
      where: { isCompleted: false },
      orderBy: { updatedAt: "desc" },
      include: {
        character: { select: { id: true, name: true, requiresAuthorReview: true } },
        licensee: { select: { id: true, name: true } },
        stages: { select: { stageType: true, satoStatus: true, authorStatus: true, fileUrl: true } },
      },
    }),
    prisma.product.findMany({
      where: { isCompleted: true },
      orderBy: { updatedAt: "desc" },
      include: {
        character: { select: { id: true, name: true, requiresAuthorReview: true } },
        licensee: { select: { id: true, name: true } },
        stages: { select: { stageType: true, satoStatus: true, authorStatus: true, fileUrl: true } },
      },
    }),
    prisma.character.findMany({ orderBy: { createdAt: "asc" } }),
    prisma.licensee.findMany({ orderBy: { createdAt: "asc" } }),
  ]);

  const toSerial = (p: typeof inProgress[0]) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  });

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">商品一覧</h1>
      <ProductListTabs
        inProgress={inProgress.map(toSerial)}
        completed={completed.map(toSerial)}
        characters={characters.map((c) => ({
          ...c,
          createdAt: c.createdAt.toISOString(),
          updatedAt: c.updatedAt.toISOString(),
        }))}
        licensees={licensees.map((l) => ({
          ...l,
          createdAt: l.createdAt.toISOString(),
          updatedAt: l.updatedAt.toISOString(),
        }))}
      />
    </div>
  );
}
