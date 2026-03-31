import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import LicenseeDetail from "@/components/LicenseeDetail";

export const dynamic = "force-dynamic";

export default async function LicenseeDetailPage({
  params,
}: {
  params: Promise<{ id: string; licenseeId: string }>;
}) {
  const { id: characterId, licenseeId } = await params;

  const [licensee, supervisors] = await Promise.all([
    prisma.licensee.findUnique({
      where: { id: licenseeId },
      include: {
        character: true,
        products: {
          include: {
            _count: { select: { comments: true } },
            comments: {
              include: { supervisor: true },
              orderBy: { createdAt: "desc" },
              take: 1,
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    }),
    prisma.supervisor.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!licensee) notFound();

  const serialized = {
    ...licensee,
    createdAt: licensee.createdAt.toISOString(),
    updatedAt: licensee.updatedAt.toISOString(),
    character: {
      ...licensee.character,
      createdAt: licensee.character.createdAt.toISOString(),
      updatedAt: licensee.character.updatedAt.toISOString(),
    },
    products: licensee.products.map((p) => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
      comments: p.comments.map((c) => ({
        ...c,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
        supervisor: c.supervisor
          ? {
              ...c.supervisor,
              createdAt: c.supervisor.createdAt.toISOString(),
              updatedAt: c.supervisor.updatedAt.toISOString(),
            }
          : null,
      })),
    })),
  };

  return <LicenseeDetail licensee={serialized} supervisors={supervisors} characterId={characterId} />;
}
