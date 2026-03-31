import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";
import { ProjectStatus } from "@/lib/types";
import SupervisorActions from "@/components/SupervisorActions";

export const dynamic = "force-dynamic";

export default async function SupervisorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supervisor = await prisma.supervisor.findUnique({
    where: { id },
    include: {
      projects: {
        orderBy: { createdAt: "desc" },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
    },
  });

  if (!supervisor) notFound();

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <Link href="/supervisors" className="hover:text-gray-900">監修者管理</Link>
        <span>/</span>
        <span className="text-gray-900">{supervisor.name}</span>
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">
            {supervisor.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{supervisor.name}</h2>
            <p className="text-gray-500 text-sm">{supervisor.email}</p>
          </div>
        </div>
        <SupervisorActions supervisorId={id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">担当案件</h3>
            {supervisor.projects.length === 0 ? (
              <p className="text-sm text-gray-500">担当案件はありません</p>
            ) : (
              <div className="space-y-3">
                {supervisor.projects.map((p) => (
                  <Link
                    key={p.id}
                    href={`/projects/${p.id}`}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{p.title}</p>
                      {p.clientName && (
                        <p className="text-xs text-gray-500 mt-0.5">{p.clientName}</p>
                      )}
                    </div>
                    <StatusBadge type="project" status={p.status as ProjectStatus} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-base font-semibold text-gray-900 mb-4">最近のコメント</h3>
            {supervisor.comments.length === 0 ? (
              <p className="text-sm text-gray-500">コメントはありません</p>
            ) : (
              <div className="space-y-3">
                {supervisor.comments.map((c) => (
                  <div key={c.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{c.body}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(c.createdAt).toLocaleDateString("ja-JP")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 h-fit">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">プロフィール</h3>
          <dl className="space-y-3">
            {supervisor.affiliation && (
              <div>
                <dt className="text-xs text-gray-400">所属</dt>
                <dd className="text-sm text-gray-700">{supervisor.affiliation}</dd>
              </div>
            )}
            {supervisor.specialty && (
              <div>
                <dt className="text-xs text-gray-400">専門分野</dt>
                <dd className="text-sm text-gray-700">{supervisor.specialty}</dd>
              </div>
            )}
            {supervisor.bio && (
              <div>
                <dt className="text-xs text-gray-400">自己紹介</dt>
                <dd className="text-sm text-gray-700">{supervisor.bio}</dd>
              </div>
            )}
            <div>
              <dt className="text-xs text-gray-400">登録日</dt>
              <dd className="text-sm text-gray-700">
                {new Date(supervisor.createdAt).toLocaleDateString("ja-JP")}
              </dd>
            </div>
          </dl>
          <Link
            href={`/supervisors/${id}/edit`}
            className="mt-4 block w-full text-center border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            編集
          </Link>
        </div>
      </div>
    </div>
  );
}
