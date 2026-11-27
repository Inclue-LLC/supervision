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
      products: { orderBy: { createdAt: "asc" } },
      region: {
        include: { character: true },
      },
    },
  });

  if (!licensee || licensee.regionId !== regionId) notFound();

  const character = licensee.region.character;
  const requiresAuthorReview = character?.requiresAuthorReview ?? false;

  const serializedProducts = licensee.products.map((p) => ({
    ...p,
    satoNote: p.satoNote,
    authorNote: p.authorNote,
    imageUrl: p.imageUrl,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <nav className="text-xs text-gray-500 mb-6 flex items-center gap-1 flex-wrap">
        <Link href="/characters" className="hover:text-gray-700">案件別</Link>
        <span>/</span>
        <Link href={`/characters/${id}`} className="hover:text-gray-700">{character?.name ?? "—"}</Link>
        <span>/</span>
        <span className="text-gray-500">{licensee.region.name}</span>
        <span>/</span>
        <span className="text-gray-900">{licensee.name}</span>
      </nav>

      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{licensee.name}</h1>
        <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">{licensee.region.name}</span>
        {requiresAuthorReview && (
          <span className="text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">作家監修あり</span>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <ProductSection
          products={serializedProducts}
          addUrl={`/api/characters/${id}/regions/${regionId}/licensees/${licenseeId}/products`}
          requiresAuthorReview={requiresAuthorReview}
        />
      </div>
    </div>
  );
}
