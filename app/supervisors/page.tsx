import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SupervisorsPage() {
  const supervisors = await prisma.supervisor.findMany({
    include: { _count: { select: { projects: true, comments: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">監修者管理</h2>
        <Link
          href="/supervisors/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          + 新規登録
        </Link>
      </div>

      {supervisors.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">監修者がまだ登録されていません</p>
          <Link href="/supervisors/new" className="text-blue-600 hover:underline text-sm">
            最初の監修者を登録する
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {supervisors.map((s) => (
            <Link
              key={s.id}
              href={`/supervisors/${s.id}`}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{s.name}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{s.email}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-semibold text-sm flex-shrink-0">
                  {s.name.charAt(0)}
                </div>
              </div>
              {s.affiliation && (
                <p className="text-sm text-gray-600 mt-2">{s.affiliation}</p>
              )}
              {s.specialty && (
                <p className="text-xs text-gray-400 mt-1">専門: {s.specialty}</p>
              )}
              <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <span>担当案件: {s._count.projects}件</span>
                <span>コメント: {s._count.comments}件</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
