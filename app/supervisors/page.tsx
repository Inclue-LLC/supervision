import { prisma } from "@/lib/prisma";
import SupervisorManager from "@/components/SupervisorManager";

export const dynamic = "force-dynamic";

export default async function SupervisorsPage() {
  const supervisors = await prisma.supervisor.findMany({
    include: { _count: { select: { comments: true } } },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">監修者管理</h2>
      <SupervisorManager supervisors={supervisors} />
    </div>
  );
}
