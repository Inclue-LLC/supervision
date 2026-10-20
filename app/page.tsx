import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPage() {
  const [characterCount, supervisorCount, productCount] = await Promise.all([
    prisma.character.count(),
    prisma.supervisor.count(),
    prisma.product.count(),
  ]);

  const recentProducts = await prisma.product.findMany({
    take: 5,
    orderBy: { updatedAt: "desc" },
    include: {
      character: true,
      licensee: { include: { region: { include: { character: true } } } },
    },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">ダッシュボード</h1>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">キャラクター</p>
          <p className="text-3xl font-bold text-gray-900">{characterCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">商品</p>
          <p className="text-3xl font-bold text-gray-900">{productCount}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">監修者</p>
          <p className="text-3xl font-bold text-gray-900">{supervisorCount}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">最近の商品</h2>
        </div>
        {recentProducts.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-10">商品がまだありません</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {recentProducts.map((p) => {
              const characterName = p.character?.name ?? p.licensee?.region?.character?.name ?? "—";
              return (
                <li key={p.id} className="px-6 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.name}</p>
                    <p className="text-xs text-gray-500">{characterName}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="mt-8 flex gap-4">
        <Link
          href="/characters"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          キャラクターを管理
        </Link>
      </div>
    </div>
  );
}
