import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { ProjectStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: {
      supervisor: true,
      _count: { select: { contents: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">案件管理</h2>
        <Link
          href="/projects/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + 新規案件
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">案件がまだ登録されていません</p>
          <Link href="/projects/new" className="text-blue-600 hover:underline text-sm">
            最初の案件を作成する
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">案件名</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">依頼元</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">監修者</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期限</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">コンテンツ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link href={`/projects/${p.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                      {p.title}
                    </Link>
                    {p.description && (
                      <p className="text-xs text-gray-500 mt-0.5 truncate max-w-xs">{p.description}</p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.clientName ?? "-"}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p.supervisor?.name ?? "未割当"}</td>
                  <td className="px-6 py-4">
                    <StatusBadge type="project" status={p.status as ProjectStatus} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {p.deadline ? new Date(p.deadline).toLocaleDateString("ja-JP") : "-"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{p._count.contents}件</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
