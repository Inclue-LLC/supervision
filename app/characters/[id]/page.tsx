import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import CharacterDetail from "@/components/CharacterDetail";

export const dynamic = "force-dynamic";

export default async function CharacterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const character = await prisma.character.findUnique({
    where: { id },
    include: {
      licensees: {
        include: {
          _count: { select: { products: true } },
          products: { select: { status: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!character) notFound();

  return <CharacterDetail character={character} />;
}
