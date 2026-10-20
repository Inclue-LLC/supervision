import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import RegionDetail from "@/components/RegionDetail";

export default async function RegionDetailPage({
  params,
}: {
  params: Promise<{ id: string; regionId: string }>;
}) {
  const { id, regionId } = await params;

  const region = await prisma.region.findUnique({
    where: { id: regionId },
    include: {
      character: true,
      licensees: {
        include: { _count: { select: { products: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!region || region.characterId !== id) notFound();

  const serialized = {
    ...region,
    createdAt: region.createdAt.toISOString(),
    updatedAt: region.updatedAt.toISOString(),
    character: {
      ...region.character,
      createdAt: region.character.createdAt.toISOString(),
      updatedAt: region.character.updatedAt.toISOString(),
    },
    licensees: region.licensees.map((l) => ({
      ...l,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    })),
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
        <Link href="/characters" className="hover:text-gray-700">キャラクター</Link>
        <span>/</span>
        <Link href={`/characters/${id}`} className="hover:text-gray-700">{region.character.name}</Link>
        <span>/</span>
        <span className="text-gray-900">{region.name}</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">ライセンス案件</span>
        <h1 className="text-2xl font-bold text-gray-900">{region.name}</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <RegionDetail
          characterId={id}
          region={serialized}
        />
      </div>
    </div>
  );
}
