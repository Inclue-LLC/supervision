import { prisma } from "@/lib/prisma";
import StatusBadge from "@/components/StatusBadge";
import { ReviewStatus, ReviewType, AuthorReviewStatus } from "@/lib/types";

export default async function DashboardPage() {
  const activeProducts = await prisma.product.findMany({
    where: {
      OR: [
        { status: { notIn: ["APPROVED", "COMPLETED"] } },
        { authorStatus: { notIn: ["NOT_REQUIRED", "APPROVED"] } },
      ],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      character: true,
      licensee: {
        include: {
          region: { include: { character: true } },
        },
      },
    },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">監修進行中の案件</h1>
        <span className="text-sm text-gray-500">
          監修中: <span className="font-semibold text-gray-900">{activeProducts.length}件</span>
        </span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">監修進行中の商品</h2>
        </div>

        {activeProducts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-16">
            進行中の監修はありません
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">キャラクター / ライセンシー</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">監修区分</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">佐藤監修</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作家監修</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeProducts.map((p) => {
                const characterName =
                  p.character?.name ??
                  p.licensee?.region?.character?.name ??
                  "—";
                const licenseeInfo = p.licensee
                  ? ` / ${p.licensee.region.name} / ${p.licensee.name}`
                  : " / 自社製造";
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{p.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className="font-medium">{characterName}</span>
                      <span className="text-gray-400">{licenseeInfo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge kind="type" value={p.type as ReviewType} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge kind="status" value={p.status as ReviewStatus} />
                      {p.satoNote && (
                        <p className="text-xs text-gray-400 mt-1 max-w-[160px] truncate">{p.satoNote}</p>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {p.authorStatus === "NOT_REQUIRED" ? (
                        <span className="text-xs text-gray-300">—</span>
                      ) : (
                        <>
                          <StatusBadge kind="authorStatus" value={p.authorStatus as AuthorReviewStatus} />
                          {p.authorNote && (
                            <p className="text-xs text-gray-400 mt-1 max-w-[160px] truncate">{p.authorNote}</p>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
