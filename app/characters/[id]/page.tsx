import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductSection from "@/components/ProductSection";
import LicenseSection from "@/components/LicenseSection";

export default async function CharacterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      inhouseProducts: { orderBy: { createdAt: "asc" } },
      regions: {
        include: {
          licensees: {
            include: { _count: { select: { products: true } } },
            orderBy: { createdAt: "asc" },
          },
          _count: { select: { licensees: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!character) notFound();

  const serializedProducts = character.inhouseProducts.map((p) => ({
    ...p,
    imageUrl: p.imageUrl,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  const serializedRegions = character.regions.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
    licensees: r.licensees.map((l) => ({
      ...l,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    })),
  }));

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
        <Link href="/characters" className="hover:text-gray-700">キャラクター</Link>
        <span>/</span>
        <span className="text-gray-900">{character.name}</span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 mb-8">{character.name}</h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">自社製造</span>
          </div>
          <ProductSection
            products={serializedProducts}
            addUrl={`/api/characters/${id}/products`}
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">ライセンス案件</span>
          </div>
          <LicenseSection
            characterId={id}
            regions={serializedRegions}
          />
        </div>
      </div>
    </div>
  );
}
