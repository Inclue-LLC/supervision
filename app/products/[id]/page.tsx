import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import StageSection from "@/components/StageSection";
import { STAGE_TYPES, StageType } from "@/lib/types";
import ProductDetailActions from "@/components/ProductDetailActions";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      character: { select: { id: true, name: true, requiresAuthorReview: true } },
      licensee: { select: { id: true, name: true } },
      stages: { orderBy: { stageType: "asc" } },
    },
  });

  if (!product) notFound();

  const stageMap = Object.fromEntries(product.stages.map((s) => [s.stageType, s]));

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-6">
        ← 商品一覧
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h1>
            <div className="flex gap-4 text-sm text-gray-500">
              <span>
                <span className="text-gray-400">キャラクター：</span>
                <span className="font-medium text-gray-700">{product.character.name}</span>
                {product.character.requiresAuthorReview && (
                  <span className="ml-1.5 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">作家監修あり</span>
                )}
              </span>
              <span>
                <span className="text-gray-400">ライセンシー：</span>
                <span className="font-medium text-gray-700">{product.licensee?.name ?? "自社製造"}</span>
              </span>
            </div>
          </div>
          <ProductDetailActions productId={id} isCompleted={product.isCompleted} />
        </div>
      </div>

      <div className="space-y-3">
        {STAGE_TYPES.map((stageType) => (
          <StageSection
            key={stageType}
            productId={id}
            stageType={stageType}
            stage={stageMap[stageType] ?? null}
            requiresAuthorReview={product.character.requiresAuthorReview}
          />
        ))}
      </div>
    </div>
  );
}
