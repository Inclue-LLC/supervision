import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import ProductStages from "@/components/ProductStages";
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

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1 mb-6">
        ← 商品一覧
      </Link>

      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">{product.name}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500 mt-1">
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
              {product.theme && (
                <span>
                  <span className="text-gray-400">テーマ：</span>
                  <span className="font-medium text-gray-700">{product.theme}</span>
                </span>
              )}
            </div>
          </div>
          <ProductDetailActions productId={id} isCompleted={product.isCompleted} />
        </div>
      </div>

      <ProductStages
        productId={id}
        stages={product.stages.map((s) => ({
          stageType: s.stageType as import("@/lib/types").StageType,
          satoStatus: s.satoStatus,
          satoNote: s.satoNote,
          authorStatus: s.authorStatus as "NOT_REQUIRED" | "PENDING" | "IN_REVIEW" | "REVISION_NEEDED" | "APPROVED",
          authorNote: s.authorNote,
          fileUrl: s.fileUrl,
          updatedAt: s.updatedAt.toISOString(),
        }))}
        requiresAuthorReview={product.character.requiresAuthorReview}
      />
    </div>
  );
}
