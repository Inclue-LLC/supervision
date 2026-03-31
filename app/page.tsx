import { prisma } from "@/lib/prisma";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { ProjectStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

async function getDashboardData() {
  const [projects, supervisors] = await Promise.all([
    prisma.project.findMany({
      include: { supervisor: true, _count: { select: { contents: true, comments: true } } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    prisma.supervisor.count(),
  ]);

  const statusCounts = await prisma.project.groupBy({
    by: ["status"],
    _count: { status: true },
  });

  return { projects, supervisors, statusCounts };
}

export default async function DashboardPage() {
  const { projects, supervisors, statusCounts } = await getDashboardData();

  const totalProjects = statusCounts.reduce((sum, s) => sum + s._count.status, 0);
  const inReview = statusCounts.find((s) => s.status === "IN_REVIEW")?._count.status ?? 0;
  const revisionNeeded = statusCounts.find((s) => s.status === "REVISION_NEEDED")?._count.status ?? 0;
  const approved = statusCounts.find((s) => s.status === "APPROVED")?._count.status ?? 0;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="総案件数" value={totalProjects} color="bg-blue-50 text-blue-700" />
        <StatCard label="監修中" value={inReview} color="bg-yellow-50 text-yellow-700" />
        <StatCard label="差し戻し" value={revisionNeeded} color="bg-red-50 text-red-700" />
        <StatCard label="承認済み" value={approved} color="bg-green-50 text-green-700" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">最近の案件</h3>
            <Link href="/projects" className="text-sm text-blue-600 hover:underline">
              すべて見る
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500 py-4">案件がまだありません</p>
          ) : (
            <div className="space-y-3">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  href={`/projects/${p.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {p.supervisor?.name ?? "監修者未割当"} ·{" "}
                      {p._count.contents}件のコンテンツ
                    </p>
                  </div>
                  <StatusBadge type="project" status={p.status as ProjectStatus} />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">監修者</h3>
            <Link href="/supervisors" className="text-sm text-blue-600 hover:underline">
              管理
            </Link>
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-1">{supervisors}</div>
          <p className="text-sm text-gray-500">登録済み監修者</p>
          <Link
            href="/supervisors/new"
            className="mt-4 inline-block text-sm text-blue-600 hover:underline"
          >
            + 新規登録
          </Link>
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
  color: string;
}) {
  return (
    <div className={`rounded-xl p-4 ${color.split(" ")[0]}`}>
      <div className={`text-3xl font-bold ${color.split(" ")[1]}`}>{value}</div>
      <div className="text-sm font-medium text-gray-600 mt-1">{label}</div>
    </div>
  );
}
