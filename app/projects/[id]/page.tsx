import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProjectDetail from "@/components/ProjectDetail";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [project, supervisors] = await Promise.all([
    prisma.project.findUnique({
      where: { id },
      include: {
        supervisor: true,
        contents: { orderBy: { createdAt: "desc" } },
        comments: {
          include: { supervisor: true },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.supervisor.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!project) notFound();

  const serialized = {
    ...project,
    deadline: project.deadline?.toISOString() ?? null,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    supervisor: project.supervisor
      ? { ...project.supervisor, createdAt: project.supervisor.createdAt.toISOString(), updatedAt: project.supervisor.updatedAt.toISOString() }
      : null,
    contents: project.contents.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
    })),
    comments: project.comments.map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      supervisor: c.supervisor
        ? { ...c.supervisor, createdAt: c.supervisor.createdAt.toISOString(), updatedAt: c.supervisor.updatedAt.toISOString() }
        : null,
    })),
  };

  return (
    <ProjectDetail
      project={serialized}
      supervisors={supervisors}
    />
  );
}
