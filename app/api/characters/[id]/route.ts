import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { name, requiresAuthorReview } = await req.json();
  const character = await prisma.character.update({
    where: { id },
    data: {
      ...(name !== undefined && { name: name.trim() }),
      ...(requiresAuthorReview !== undefined && { requiresAuthorReview }),
    },
  });
  revalidatePath("/");
  revalidatePath("/masters");
  return NextResponse.json(character);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.character.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/masters");
  return NextResponse.json({ ok: true });
}
