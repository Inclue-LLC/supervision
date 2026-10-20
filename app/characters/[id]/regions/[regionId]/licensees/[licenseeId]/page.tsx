import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductSection from "@/components/ProductSection";

export default async function LicenseeDetailPage({
  params,
}: {
  params: Promise<{ id: string; regionId: string; licenseeId: string }>;
}) {
  const { id, regionId, licenseeId } = await params;

  const licensee = await prisma.licensee.findUnique({
    where: { id: licenseeId },
    include: {
      region: { include: { character: true } },
      products: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!licensee || licensee.regionId !== regionId || licensee.region.characterId !== id) notFound();

  const serializedProducts = licensee.products.map((p) => ({
    ...p,
    imageUrl: p.imageUrl,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1">
        <Link href="/characters" className="hover:text-gray-700">キャラクター</Link>
        <span>/</span>
        <Link href={`/characters/${id}`} className="hover:text-gray-700">{licensee.region.character.name}</Link>
        <span>/</span>
        <Link href={`/characters/${id}/regions/${regionId}`} className="hover:text-gray-700">{licensee.region.name}</Link>
        <span>/</span>
        <span className="text-gray-900">{licensee.name}</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-3 py-1 rounded-full">ライセンシー</span>
        <h1 className="text-2xl font-bold text-gray-900">{licensee.name}</h1>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductSection
          products={serializedProducts}
          addUrl={`/api/characters/${id}/regions/${regionId}/licensees/${licenseeId}/products`}
        />
      </div>
    </div>
  );
}
