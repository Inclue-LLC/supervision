import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/ProjectForm";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const supervisors = await prisma.supervisor.findMany({ orderBy: { name: "asc" } });

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">新規案件登録</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <ProjectForm supervisors={supervisors} />
      </div>
    </div>
  );
}
