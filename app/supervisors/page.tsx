import { prisma } from "@/lib/prisma";
import SupervisorManager from "@/components/SupervisorManager";

export default async function SupervisorsPage() {
  const supervisors = await prisma.supervisor.findMany({
    include: { _count: { select: { comments: true } } },
    orderBy: { createdAt: "asc" },
  });

  const serialized = supervisors.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">監修者管理</h1>
      <SupervisorManager supervisors={serialized} />
    </div>
  );
}
