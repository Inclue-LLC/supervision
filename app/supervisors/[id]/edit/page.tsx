import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import SupervisorForm from "@/components/SupervisorForm";

export const dynamic = "force-dynamic";

export default async function EditSupervisorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supervisor = await prisma.supervisor.findUnique({ where: { id } });

  if (!supervisor) notFound();

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">監修者編集</h2>
      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <SupervisorForm
          supervisorId={supervisor.id}
          defaultValues={{
            name: supervisor.name,
            email: supervisor.email,
            affiliation: supervisor.affiliation ?? "",
            specialty: supervisor.specialty ?? "",
            bio: supervisor.bio ?? "",
          }}
        />
      </div>
    </div>
  );
}
