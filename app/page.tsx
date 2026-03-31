import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { ReviewStatus, ReviewType } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [characters, supervisors, statusCounts, recentProducts] = await Promise.all([
    prisma.character.count(),
    prisma.supervisor.count(),
    prisma.product.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.product.findMany({
      take: 8,
      orderBy: { updatedAt: "desc" },
      include: {
        licensee: { include: { character: true } },
      },
    }),
  ]);

  const count = (status: string) =>
    statusCounts.find((s) => s.status === status)?._count.status ?? 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="キャラクター数" value={characters} color="blue" />
        <StatCard label="監修中" value={count("IN_REVIEW")} color="yellow" />
        <StatCard label="差し戻し" value={count("REVISION_NEEDED")} color="red" />
        <StatCard label="承認済み" value={count("APPROVED")} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">最近の商品</h3>
            <Link href="/characters" className="text-sm text-blue-600 hover:underline">
              キャラクター一覧
            </Link>
          </div>
          {recentProducts.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">商品がまだ登録されていません</p>
          ) : (
            <div className="space-y-2">
              {recentProducts.map((p) => (
                <Link
                  key={p.id}
                  href={`/characters/${p.licensee.character.id}/licensees/${p.licensee.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {p.licensee.character.name} › {p.licensee.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge kind="type" value={p.type as ReviewType} />
                    <StatusBadge kind="status" value={p.status as ReviewStatus} />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">ステータス内訳</h3>
            <div className="space-y-2">
              {(["PENDING", "IN_REVIEW", "REVISION_NEEDED", "APPROVED", "COMPLETED"] as ReviewStatus[]).map(
                (s) => (
                  <div key={s} className="flex items-center justify-between">
                    <StatusBadge kind="status" value={s} />
                    <span className="text-sm font-medium text-gray-700">{count(s)}</span>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">監修者</h3>
            <p className="text-3xl font-bold text-gray-900">{supervisors}</p>
            <p className="text-xs text-gray-400 mt-0.5">登録済み</p>
            <Link href="/supervisors" className="mt-3 block text-sm text-blue-600 hover:underline">
              管理する
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "blue" | "yellow" | "red" | "green";
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    yellow: "bg-yellow-50 text-yellow-700",
    red: "bg-red-50 text-red-700",
    green: "bg-green-50 text-green-700",
  };
  return (
    <div className={`rounded-xl p-4 ${colors[color].split(" ")[0]}`}>
      <div className={`text-3xl font-bold ${colors[color].split(" ")[1]}`}>{value}</div>
      <div className="text-sm font-medium text-gray-600 mt-1">{label}</div>
    </div>
  );
}
