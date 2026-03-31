import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, supervisors] = await Promise.all([
    prisma.project.findUnique({ where: { id } }),
    prisma.supervisor.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!project) notFound();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">案件編集</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <ProjectForm
          supervisors={supervisors}
          projectId={project.id}
          defaultValues={{
            title: project.title,
            description: project.description ?? "",
            clientName: project.clientName ?? "",
            deadline: project.deadline
              ? new Date(project.deadline).toISOString().split("T")[0]
              : "",
            supervisorId: project.supervisorId ?? "",
          }}
        />
      </div>
    </div>
  );
}
